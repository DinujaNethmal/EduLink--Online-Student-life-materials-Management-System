const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  quiz: { type: mongoose.Schema.Types.ObjectId, ref: "Quiz", required: true },
  questionText: { type: String, required: true },
  options: [{ type: String, required: true }],
  correctAnswer: { type: String, required: true },
  explanation: { type: String },
  academicYear: { type: Number },
  semester: { type: Number },
  subject: { type: String },
  difficulty: { type: String, enum: ["Easy", "Medium", "Hard"], default: "Medium" }
}, { timestamps: true });

const Question = mongoose.model("Question", questionSchema);


module.exports = Question;
