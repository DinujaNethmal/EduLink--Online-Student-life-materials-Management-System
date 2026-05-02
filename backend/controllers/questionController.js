const Question = require("../models/Question.js");
const Quiz = require("../models/Quiz.js");

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
// 🧠 Generate questions based on criteria
const generateQuestionsFromDB = async (req, res) => {
  try {
    const { subject, difficulty, year, semester, count = 5 } = req.body;
    const targetCount = Number(count) > 0 ? Number(count) : 5;
    const normalize = (value = "") => String(value).trim().toLowerCase();
    const normalizeSemester = (value = "") =>
      normalize(value).replace(/^semester\s*/i, "");

    // Build pool from both collections
    const questionDocs = await Question.find().lean();
    const quizDocs = await Quiz.find().select("questions subject difficulty year semester").lean();

    let pool = [
      ...questionDocs.map((q) => ({
        type: q.type || "MCQ",
        questionText: q.questionText || q.text || "",
        options: q.options || [],
        correctAnswer: q.correctAnswer || q.answer || "",
        explanation: q.explanation || "",
        subject: q.subject || "",
        difficulty: q.difficulty || "",
        year: q.year || "",
        semester: q.semester || "",
        marks: q.marks || 1,
      })),
      ...quizDocs.flatMap((quiz) =>
        (quiz.questions || []).map((q) => ({
          type: q.type || "MCQ",
          questionText: q.text || q.questionText || "",
          options: q.options || [],
          correctAnswer: q.correctAnswer || q.answer || "",
          explanation: q.explanation || "",
          subject: q.subject || quiz.subject || "",
          difficulty: q.difficulty || quiz.difficulty || "",
          year: quiz.year || "",
          semester: quiz.semester || "",
          marks: q.marks || 1,
        }))
      ),
    ];

    // Progressive filtering (strict -> medium -> loose)
    const strictPool = pool.filter(
      (q) =>
        normalize(q.subject) === normalize(subject) &&
        normalize(q.difficulty) === normalize(difficulty) &&
        normalize(q.year) === normalize(year) &&
        normalizeSemester(q.semester) === normalizeSemester(semester)
    );

    if (strictPool.length) {
      pool = strictPool;
    } else {
      const mediumPool = pool.filter(
        (q) =>
          normalize(q.subject) === normalize(subject) &&
          normalize(q.difficulty) === normalize(difficulty)
      );
      if (mediumPool.length) {
        pool = mediumPool;
      } else {
        const loosePool = pool.filter((q) => normalize(q.subject) === normalize(subject));
        if (loosePool.length) pool = loosePool;
      }
    }

    if (!pool.length) {
      return res.status(404).json({
        success: false,
      message: "No questions found. Please add questions first in Question Bank.",
      });
    }

    // Shuffle and take requested count
    const shuffled = [...pool].sort(() => Math.random() - 0.5).slice(0, targetCount);
    const questions = shuffled.map((q) => ({
      type: q.type || "MCQ",
      questionText: q.questionText || q.text || "",
      options: q.options || [],
      correctAnswer: q.correctAnswer || q.answer || "",
      explanation: q.explanation || "",
      subject: q.subject || subject,
      difficulty: q.difficulty || difficulty,
      year: q.year || year,
      semester: q.semester || semester,
      marks: q.marks || 1,
    }));

    res.status(200).json({
      success: true,
      questions,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
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


