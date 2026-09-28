const mongoose = require('mongoose');

const microJobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  poster: { type: mongoose.Schema.Types.ObjectId, required: true, refPath: 'posterModel' },
  posterModel: { type: String, enum: ['User', 'Organization'], required: true },
  reward: { type: String, required: true }, // e.g. "LKR 2000" or "Free event ticket"
  rewardType: { type: String, enum: ['cash', 'gift', 'credit', 'other'], default: 'cash' },
  deadline: { type: Date, required: true },
  deliverableType: { type: String, enum: ['design', 'video', 'writing', 'code', 'photography', 'other'], default: 'other' },
  status: { type: String, enum: ['open', 'in-review', 'completed', 'closed'], default: 'open' },
  winner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  attachments: [{ type: String }],
}, { timestamps: true });

module.exports = mongoose.model('MicroJob', microJobSchema);
