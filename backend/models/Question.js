const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  questionText: { type: String, required: true },
  options: [{ type: String, required: true }],
  correctAnswer: { type: String, required: true },
  explanation: { type: String },
  year: { type: String },
  semester: { type: String },
  subject: { type: String },
  difficulty: { type: String, enum: ["Easy", "Medium", "Hard"], default: "Medium" }
}, { timestamps: true });

const Question = mongoose.model("Question", questionSchema);


module.exports = Question;