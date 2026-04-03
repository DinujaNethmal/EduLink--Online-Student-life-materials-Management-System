const Question = require("../models/Question.js");

// ➕ Add a new question
const createQuestion = async (req, res) => {
  try {
    const question = new Question(req.body);
    const savedQuestion = await question.save();
    res.status(201).json(savedQuestion);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// 📋 Get all questions
const getQuestions = async (req, res) => {
  try {
    const questions = await Question.find().populate("quiz");
    res.json(questions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🔍 Get a single question by ID
const getQuestionById = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id).populate("quiz");
    if (!question) return res.status(404).json({ message: "Question not found" });
    res.json(question);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✏️ Update a question
const updateQuestion = async (req, res) => {
  try {
    const updatedQuestion = await Question.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updatedQuestion);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// 🗑️ Delete a question
const deleteQuestion = async (req, res) => {
  try {
    await Question.findByIdAndDelete(req.params.id);
    res.json({ message: "Question deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const generateQuestionsFromDB = async (req, res) => {
  try {
    const { year, semester, subject, difficulty, count } = req.body;

    console.log("Incoming:", req.body);

    const questions = await Question.find().limit(count);

    if (!questions.length) {
      return res.status(404).json({
        message: "No questions found for this academic year/semester/subject/difficulty",
      });
    }
    res.status(200).json(questions);
    //res.json({ questions });
  } catch (err) {
    console.error("🔥 ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};


module.exports = {
  createQuestion,
  getQuestions,
  getQuestionById,
  updateQuestion,
  deleteQuestion,
  generateQuestionsFromDB
};

