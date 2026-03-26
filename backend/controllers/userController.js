const User = require('../models/User');

// @desc    Get mock student profile
// @route   GET /api/users/student
// @access  Public (Normally this would require JWT authentication)
exports.getStudentProfile = async (req, res) => {
  try {
    // For demonstration purposes, we will fetch "Nethmi Perera" who we seeded earlier
    const student = await User.findOne({ email: 'it22000000@my.sliit.lk' });

    if (!student) {
      return res.status(404).json({ success: false, error: 'Student Profile Not Found' });
    }

    res.status(200).json({
      success: true,
      data: student
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server Error Fetching Profile' });
  }
};
