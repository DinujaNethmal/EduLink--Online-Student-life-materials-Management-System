const express = require('express');
const {
  createQuestion,
  getQuestions,
  getQuestionById,
  updateQuestion,
  deleteQuestion,
  generateQuestionsFromDB
} = require("../controllers/questionController.js");

const router = express.Router();

// Auto-generate
router.post("/generate", generateQuestionsFromDB);

router.post("/", createQuestion);
router.get("/", getQuestions);
router.get("/:id", getQuestionById);
router.put("/:id", updateQuestion);
router.delete("/:id", deleteQuestion);
router

module.exports = router;
