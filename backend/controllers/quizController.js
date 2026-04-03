const Quiz = require("../models/Quiz.js");
const Question = require("../models/Question");

const createQuiz = async (req, res) => {
  try {
    console.log("Incoming Data:", req.body); // 🔍 DEBUG

    const quiz = new Quiz(req.body);
    const savedQuiz = await quiz.save();

    res.status(201).json(savedQuiz);
  } catch (error) {
    console.error("Error saving quiz:", error); // 🔥 IMPORTANT
    res.status(500).json({ message: error.message });
  }
};

const getQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.find(); // Make sure collection is correct
    res.status(200).json(quizzes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateQuiz = async (req, res) => {
  const updatedQuiz = await Quiz.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updatedQuiz);
};

const deleteQuiz = async (req, res) => {
  await Quiz.findByIdAndDelete(req.params.id);
  res.json({ message: "Quiz deleted" });
};

const getAllQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.find(); // <-- could fail if DB connection is bad
    res.status(200).json(quizzes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getQuizById = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) return res.status(404).json({ message: "Quiz not found" });
    res.status(200).json(quiz);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error fetching quiz" });
  }
};




module.exports = {
  createQuiz,
  getQuizzes, 
  updateQuiz,
  deleteQuiz,
  getAllQuizzes,
  getQuizById
};