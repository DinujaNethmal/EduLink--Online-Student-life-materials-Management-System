const express = require('express');
const {
  getMemberPosts,
  createMemberPost,
  getGroupBanners,
  createGroupBanner
} = require('../controllers/findingGroupsController');

const router = express.Router();

router.route('/members')
  .get(getMemberPosts)
  .post(createMemberPost);

router.route('/banners')
  .get(getGroupBanners)
  .post(createGroupBanner);

module.exports = router;
