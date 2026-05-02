const mongoose = require('mongoose');

const memberPostSchema = new mongoose.Schema({
  name: { type: String, required: true },
  personalEmail: { type: String, required: true },
  contactNumber: { type: String, required: true },
  campus: { type: String, required: true },
  subject: { type: String, required: true },
  lookingGroupType: { type: String, required: true },
  gender: { type: String, required: true },
  gpa: { type: String },
  showGpa: { type: Boolean, default: false },
  details: { type: String },
  miniPoster: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('MemberPost', memberPostSchema);
