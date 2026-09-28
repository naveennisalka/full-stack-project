const Conversation = require('../db/models/Conversation');
const Message = require('../db/models/Message');
const { getIO, sendNotification } = require('../utils/socketManager');

exports.getConversations = async (req, res) => {
  try {
    const conversations = await Conversation.find({ participants: req.user._id })
      .populate('participants', 'name avatar')
      .populate('lastMessage')
      .sort({ updatedAt: -1 });
    res.json(conversations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createOrGetConversation = async (req, res) => {
  try {
    const { userId } = req.body;
    let conversation = await Conversation.findOne({
      isGroup: false,
      participants: { $all: [req.user._id, userId] }
    }).populate('participants', 'name avatar');

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [req.user._id, userId]
      });
      conversation = await conversation.populate('participants', 'name avatar');
    }
    res.json(conversation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getMessages = async (req, res) => {
  try {
    const conversation = await Conversation.findById(req.params.id);
    if (!conversation || !conversation.participants.includes(req.user._id)) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const messages = await Message.find({ conversation: req.params.id })
      .populate('sender', 'name avatar')
      .sort({ createdAt: 1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.sendMessage = async (req, res) => {
  try {
    const { content, messageType, fileUrl } = req.body;
    const conversation = await Conversation.findById(req.params.id);
    if (!conversation || !conversation.participants.includes(req.user._id)) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const message = await Message.create({
      conversation: conversation._id,
      sender: req.user._id,
      content,
      messageType,
      fileUrl
    });

    conversation.lastMessage = message._id;
    await conversation.save();

    await message.populate('sender', 'name avatar');

    // Notify other participants
    const io = getIO();
    io.to(conversation._id.toString()).emit('message:receive', message);

    conversation.participants.forEach(participantId => {
      if (participantId.toString() !== req.user._id.toString()) {
        sendNotification(participantId, {
          type: 'message',
          message: `New message from ${req.user.name}`,
          referenceId: conversation._id
        });
      }
    });

    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createGroupConversation = async (req, res) => {
  try {
    const { participants, groupName } = req.body;
    const allParticipants = [...new Set([...participants, req.user._id.toString()])];
    
    const conversation = await Conversation.create({
      participants: allParticipants,
      isGroup: true,
      groupName
    });
    
    res.status(201).json(conversation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
