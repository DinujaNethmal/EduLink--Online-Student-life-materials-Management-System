const mongoose = require('mongoose');

const resultSchema = new mongoose.Schema({
  quiz: {
    type: mongoose.Schema.ObjectId,
    ref: 'Quiz',
    required: true
  },
  studentName: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  score: {
    type: Number,
    required: true
  },
  total: {
    type: Number,
    required: true
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  answers: [{
    questionId: {
      type: mongoose.Schema.ObjectId,
      required: true
    },
    selectedOption: String,
    isCorrect: Boolean
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Result', resultSchema);
