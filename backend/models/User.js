const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name']
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email'
    ]
  },
  password: {
    type: String,
    required: [true, 'Please add a password'],
    minlength: 6,
    select: false // Avoid returning password by default
  },
  role: {
    type: String,
    enum: ['student', 'admin'],
    default: 'student'
  },
  campus: {
    type: String,
    default: 'Malabe'
  },
  degreeProgram: String,
  skills: [String], // Array of specific skills (e.g., 'React', 'MongoDB')
  year: String,
  semester: String,
  hasGroup: String,
  groupName: String,
  bio: String,
  profilePhoto: String // Typically base64 encoded string or URL
}, {
  timestamps: true
});

// Encrypt password using bcrypt before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
