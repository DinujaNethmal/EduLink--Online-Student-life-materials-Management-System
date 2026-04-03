const express = require('express');
const {
  createResult,
  getResults,
  getResultById,
  updateResult,
  deleteResult
} = require("../controllers/resultController.js");

const router = express.Router();

router.post("/", createResult);
router.get("/", getResults);
router.get("/:id", getResultById);
router.put("/:id", updateResult);
router.delete("/:id", deleteResult);

module.exports = router;
