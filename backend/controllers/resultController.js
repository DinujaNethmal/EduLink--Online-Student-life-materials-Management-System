const Result = require("../models/Result.js");

// ➕ Add a new result
const createResult = async (req, res) => {
  try {
    const result = new Result(req.body);
    const savedResult = await result.save();
    res.status(201).json(savedResult);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// 📋 Get all results (UPDATED ✅)
const getResults = async (req, res) => {
  try {
    const results = await Result.find()
      .populate("quiz") // existing
      .populate("student", "name email"); // 🔥 ADD THIS

    res.json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🔍 Get single result (UPDATED ✅)
const getResultById = async (req, res) => {
  try {
    const result = await Result.findById(req.params.id)
      .populate("quiz")
      .populate("student", "name email"); // 🔥 ADD THIS

    if (!result) {
      return res.status(404).json({ message: "Result not found" });
    }

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✏️ Update
const updateResult = async (req, res) => {
  try {
    const updatedResult = await Result.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updatedResult);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// 🗑️ Delete
const deleteResult = async (req, res) => {
  try {
    await Result.findByIdAndDelete(req.params.id);
    res.json({ message: "Result deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createResult,
  getResults,
  getResultById,
  updateResult,
  deleteResult,
};