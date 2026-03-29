const express = require('express');
const {
  adminLogin,
  getMarketplaceAnalytics,
  getQuizAnalytics,
  getStudentProgress,
  getPendingProducts,
  approveProduct,
  getDashboardSummary
} = require('../controllers/adminController');

const router = express.Router();

// Public route
router.post('/login', adminLogin);

// Admin analytics routes
router.get('/dashboard-summary', getDashboardSummary);
router.get('/analytics/marketplace', getMarketplaceAnalytics);
router.get('/analytics/quizzes', getQuizAnalytics);
router.get('/student-progress', getStudentProgress);

// Product management
router.get('/products/pending', getPendingProducts);
router.put('/products/:id/approve', approveProduct);

module.exports = router;
