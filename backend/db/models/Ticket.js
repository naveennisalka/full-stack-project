const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const ticketSchema = new mongoose.Schema({
  event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
  holder: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  ticketCode: { type: String, default: uuidv4, unique: true },
  qrCode: { type: String, default: '' }, // base64 QR image
  status: { type: String, enum: ['confirmed', 'cancelled', 'used'], default: 'confirmed' },
  amountPaid: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Ticket', ticketSchema);
