const express = require('express');
const { getStudentProfile } = require('../controllers/userController');

const router = express.Router();

// Route to fetch a dummy specific student profile (just for demonstration)
router.route('/student').get(getStudentProfile);

module.exports = router;
