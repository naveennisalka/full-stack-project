const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  author: { type: mongoose.Schema.Types.ObjectId, required: true, refPath: 'authorModel' },
  authorModel: { type: String, enum: ['User', 'Organization'] },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const postSchema = new mongoose.Schema({
  author: { type: mongoose.Schema.Types.ObjectId, required: true, refPath: 'authorModel' },
  authorModel: { type: String, enum: ['User', 'Organization'], required: true },
  content: { type: String, required: true },
  images: [{ type: String }],
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  comments: [commentSchema],
  tags: [{ type: String }],
}, { timestamps: true });

module.exports = mongoose.model('Post', postSchema);
