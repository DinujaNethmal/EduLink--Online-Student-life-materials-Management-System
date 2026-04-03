const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  type: { type: String, required: true }, // mcq / truefalse / shortanswer
  text: { type: String, required: true },
  options: { type: [String], default: [] }, // only for MCQ
  correctAnswer: { type: String, required: true },
  explanation: String,
  topic: String,
  difficulty: String,
  subject:String,
  marks: { type: Number, default: 1 },
});

const quizSchema = new mongoose.Schema({
  title: String,
  year: String,
  semester: String,
  subject: String,
  difficulty: String,
  duration: Number,
  totalMarks: Number,
  questions: [questionSchema],
});


module.exports = mongoose.model("Quiz", quizSchema);