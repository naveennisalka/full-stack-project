const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: {
    type: String,
    enum: ['like', 'comment', 'follow', 'event_reminder', 'job_application', 'job_accepted', 'message', 'donation', 'general'],
    required: true,
  },
  message: { type: String, required: true },
  referenceId: { type: mongoose.Schema.Types.ObjectId },
  referenceModel: { type: String },
  read: { type: Boolean, default: false },
  sender: { type: mongoose.Schema.Types.ObjectId, refPath: 'senderModel' },
  senderModel: { type: String, enum: ['User', 'Organization'] },
}, { timestamps: true });

module.exports = mongoose.model('Notification', notificationSchema);
