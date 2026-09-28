const mongoose = require('mongoose');

const lostItemSchema = new mongoose.Schema({
  reporter: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['lost', 'found'], required: true },
  itemName: { type: String, required: true },
  description: { type: String, required: true },
  photo: { type: String, default: '' },
  location: { type: String, default: '' },
  contact: { type: String, default: '' },
  resolved: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('LostItem', lostItemSchema);
