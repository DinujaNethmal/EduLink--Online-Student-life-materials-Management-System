const express = require("express");
const router = express.Router();
const {
  createQuiz,
  getQuizzes,
  getQuizById,
  updateQuiz,
  deleteQuiz,
  generateQuestionsFromDB,
} = require("../controllers/quizController.js");

// Auto-generate
router.post("/generate", generateQuestionsFromDB);

// CRUD
router.post("/", createQuiz);
router.get("/", getQuizzes);
router.get("/:id", getQuizById);
router.put("/:id", updateQuiz);
router.delete("/:id", deleteQuiz);



module.exports = router;