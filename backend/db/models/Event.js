const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  organizer: { type: mongoose.Schema.Types.ObjectId, required: true, refPath: 'organizerModel' },
  organizerModel: { type: String, enum: ['User', 'Organization'], required: true },
  banner: { type: String, default: '' },
  date: { type: Date, required: true },
  endDate: { type: Date },
  venue: { type: String, required: true },
  ticketPrice: { type: Number, default: 0 },
  totalSeats: { type: Number, default: 0 },
  registeredCount: { type: Number, default: 0 },
  tags: [{ type: String }],
  category: { type: String, default: 'general' },
  status: { type: String, enum: ['upcoming', 'ongoing', 'completed', 'cancelled'], default: 'upcoming' },
  isFree: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Event', eventSchema);
