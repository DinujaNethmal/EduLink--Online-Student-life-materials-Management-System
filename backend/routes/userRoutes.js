const express = require('express');
const { getStudentProfile, updateStudentProfile, registerStudent, loginStudent } = require('../controllers/userController');

const router = express.Router();

router.route('/student').get(getStudentProfile).put(updateStudentProfile);
router.route('/register').post(registerStudent);
router.route('/login').post(loginStudent);

module.exports = router;
