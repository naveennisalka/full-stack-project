const express = require('express');
const { getConversations, createOrGetConversation, createGroupConversation, getMessages, sendMessage } = require('../controllers/chatController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/conversations')
  .get(protect, getConversations)
  .post(protect, createOrGetConversation);

router.post('/conversations/group', protect, createGroupConversation);

router.route('/conversations/:id/messages')
  .get(protect, getMessages)
  .post(protect, sendMessage);

module.exports = router;
