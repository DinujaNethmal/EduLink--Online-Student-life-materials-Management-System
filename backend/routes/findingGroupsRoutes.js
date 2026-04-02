const express = require('express');
const {
  getMemberPosts,
  createMemberPost,
  getGroupBanners,
  createGroupBanner,
  updateMemberPost,
  deleteMemberPost,
  updateGroupBanner,
  deleteGroupBanner
} = require('../controllers/findingGroupsController');

const router = express.Router();

router.route('/members')
  .get(getMemberPosts)
  .post(createMemberPost);

router.route('/members/:id')
  .put(updateMemberPost)
  .delete(deleteMemberPost);

router.route('/banners')
  .get(getGroupBanners)
  .post(createGroupBanner);

router.route('/banners/:id')
  .put(updateGroupBanner)
  .delete(deleteGroupBanner);

module.exports = router;
