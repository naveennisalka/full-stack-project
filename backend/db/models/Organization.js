const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const orgSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  avatar: { type: String, default: '' },
  coverImage: { type: String, default: '' },
  description: { type: String, default: '' },
  category: { type: String, enum: ['club', 'society', 'department', 'other'], default: 'club' },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  verifiedBadge: { type: Boolean, default: false },
  role: { type: String, default: 'organization' },
  website: { type: String, default: '' },
  contactEmail: { type: String, default: '' },
}, { timestamps: true });

orgSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

orgSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('Organization', orgSchema);
