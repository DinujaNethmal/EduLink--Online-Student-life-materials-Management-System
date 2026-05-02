const mongoose = require('mongoose');

const groupBannerSchema = new mongoose.Schema({
  groupName: { type: String, required: true },
  leaderName: { type: String, required: true },
  personalEmail: { type: String, required: true },
  contactNumber: { type: String, required: true },
  campus: { type: String, required: true },
  subject: { type: String, required: true },
  subgroup: { type: String, required: true },
  wantedGender: { type: String, required: true },
  minGpa: { type: String },
  details: { type: String },
  banner: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('GroupBanner', groupBannerSchema);
