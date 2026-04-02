const MemberPost = require('../models/MemberPost');
const GroupBanner = require('../models/GroupBanner');

// @desc    Get all member posts
// @route   GET /api/finding-groups/members
// @access  Public
exports.getMemberPosts = async (req, res) => {
  try {
    const posts = await MemberPost.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: posts.length, data: posts });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

// @desc    Create new member post
// @route   POST /api/finding-groups/members
// @access  Public
exports.createMemberPost = async (req, res) => {
  try {
    const post = await MemberPost.create(req.body);
    res.status(201).json({ success: true, data: post });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc    Get all group banners
// @route   GET /api/finding-groups/banners
// @access  Public
exports.getGroupBanners = async (req, res) => {
  try {
    const banners = await GroupBanner.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: banners.length, data: banners });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

// @desc    Create new group banner
// @route   POST /api/finding-groups/banners
// @access  Public
exports.createGroupBanner = async (req, res) => {
  try {
    const banner = await GroupBanner.create(req.body);
    res.status(201).json({ success: true, data: banner });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc    Update member post
// @route   PUT /api/finding-groups/members/:id
// @access  Public
exports.updateMemberPost = async (req, res) => {
  try {
    const post = await MemberPost.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!post) {
      return res.status(404).json({ success: false, error: 'Post not found' });
    }
    res.status(200).json({ success: true, data: post });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc    Delete member post
// @route   DELETE /api/finding-groups/members/:id
// @access  Public
exports.deleteMemberPost = async (req, res) => {
  try {
    const post = await MemberPost.findByIdAndDelete(req.params.id);
    if (!post) {
      return res.status(404).json({ success: false, error: 'Post not found' });
    }
    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc    Update group banner
// @route   PUT /api/finding-groups/banners/:id
// @access  Public
exports.updateGroupBanner = async (req, res) => {
  try {
    const banner = await GroupBanner.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!banner) {
      return res.status(404).json({ success: false, error: 'Banner not found' });
    }
    res.status(200).json({ success: true, data: banner });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc    Delete group banner
// @route   DELETE /api/finding-groups/banners/:id
// @access  Public
exports.deleteGroupBanner = async (req, res) => {
  try {
    const banner = await GroupBanner.findByIdAndDelete(req.params.id);
    if (!banner) {
      return res.status(404).json({ success: false, error: 'Banner not found' });
    }
    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};
