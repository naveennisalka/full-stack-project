const mongoose = require('mongoose');

const donorSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  amount: { type: Number, required: true },
  anonymous: { type: Boolean, default: false },
  message: { type: String, default: '' },
  donatedAt: { type: Date, default: Date.now },
});

const donationSchema = new mongoose.Schema({
  creator: { type: mongoose.Schema.Types.ObjectId, required: true, refPath: 'creatorModel' },
  creatorModel: { type: String, enum: ['User', 'Organization'], required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  photo: { type: String, default: '' },
  goalAmount: { type: Number, required: true },
  currentAmount: { type: Number, default: 0 },
  donors: [donorSchema],
  deadline: { type: Date },
  status: { type: String, enum: ['active', 'completed', 'closed'], default: 'active' },
}, { timestamps: true });

module.exports = mongoose.model('Donation', donationSchema);
