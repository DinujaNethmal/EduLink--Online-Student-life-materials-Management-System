const User = require('../models/User');

// @desc    Get mock student profile
// @route   GET /api/users/student
// @access  Public (Normally this would require JWT authentication)
exports.getStudentProfile = async (req, res) => {
  try {
    const email = req.query.email || 'it22000000@my.sliit.lk';
    const student = await User.findOne({ email });

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
// @desc    Update student profile
// @route   PUT /api/users/student
// @access  Public
exports.updateStudentProfile = async (req, res) => {
  try {
    const { email, fullName, campus, year, semester, hasGroup, groupName, degreeProgram, bio, profilePhoto } = req.body;

    const queryEmail = email || 'it22000000@my.sliit.lk'; // Default fallback
    let student = await User.findOne({ email: queryEmail });

    if (!student) {
      // If doesn't exist, create it (mocking behavior for this demo project)
      student = new User({ email: queryEmail, name: fullName, password: 'password123' });
    }

    student.name = fullName || student.name;
    student.campus = campus || student.campus;
    student.year = year || student.year;
    student.semester = semester || student.semester;
    student.hasGroup = hasGroup || student.hasGroup;
    student.groupName = groupName || student.groupName;
    student.degreeProgram = degreeProgram || student.degreeProgram;
    student.bio = bio || student.bio;
    student.profilePhoto = profilePhoto || student.profilePhoto;

    await student.save();

    res.status(200).json({
      success: true,
      data: student
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Server Error Updating Profile' });
  }
};

// @desc    Register Student
// @route   POST /api/users/register
// @access  Public
exports.registerStudent = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, error: 'User already exists' });
    }

    const user = await User.create({ name, email, password, role: role || 'student' });
    
    res.status(201).json({ success: true, data: { _id: user._id, name: user.name, email: user.email } });
  } catch (error) {
    console.error("Register Error:", error);
    res.status(500).json({ success: false, error: 'Server error (Database offline or disconnected)' });
  }
};
