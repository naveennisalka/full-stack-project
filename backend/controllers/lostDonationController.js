const LostItem = require('../db/models/LostItem');
const Donation = require('../db/models/Donation');

// Lost Items
exports.createLostItem = async (req, res) => {
  try {
    const { type, itemName, description, location, contact } = req.body;
    let photo = '';
    if (req.file) photo = `/uploads/${req.file.filename}`;

    const item = await LostItem.create({
      reporter: req.user._id,
      type,
      itemName,
      description,
      location,
      contact,
      photo
    });
    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getLostItems = async (req, res) => {
  try {
    const filter = {};
    if (req.query.type) filter.type = req.query.type;
    
    const items = await LostItem.find(filter)
      .sort({ createdAt: -1 })
      .populate('reporter', 'name avatar');
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getLostItem = async (req, res) => {
  try {
    const item = await LostItem.findById(req.params.id).populate('reporter', 'name avatar');
    if (!item) return res.status(404).json({ message: 'Item not found' });
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.resolveLostItem = async (req, res) => {
  try {
    const item = await LostItem.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });
    
    if (item.reporter.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    item.resolved = true;
    await item.save();
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteLostItem = async (req, res) => {
  try {
    const item = await LostItem.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });
    
    if (item.reporter.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await item.deleteOne();
    res.json({ message: 'Item deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Donations
exports.createDonation = async (req, res) => {
  try {
    const { title, description, goalAmount, deadline } = req.body;
    let photo = '';
    if (req.file) photo = `/uploads/${req.file.filename}`;

    const donation = await Donation.create({
      creator: req.user._id,
      creatorModel: req.userModel,
      title,
      description,
      goalAmount,
      deadline,
      photo
    });
    res.status(201).json(donation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getDonations = async (req, res) => {
  try {
    const donations = await Donation.find({ status: 'active' })
      .sort({ createdAt: -1 })
      .populate('creator', 'name avatar');
    res.json(donations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getDonation = async (req, res) => {
  try {
    const donation = await Donation.findById(req.params.id)
      .populate('creator', 'name avatar')
      .populate('donors.user', 'name avatar');
    if (!donation) return res.status(404).json({ message: 'Donation not found' });
    res.json(donation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.donate = async (req, res) => {
  try {
    const { amount, anonymous, message } = req.body;
    const donation = await Donation.findById(req.params.id);
    if (!donation) return res.status(404).json({ message: 'Donation not found' });

    donation.donors.push({
      user: anonymous ? null : req.user._id,
      amount: Number(amount),
      anonymous: anonymous || false,
      message
    });

    donation.currentAmount += Number(amount);
    if (donation.currentAmount >= donation.goalAmount) {
      donation.status = 'completed';
    }

    await donation.save();
    res.json(donation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
