// src/api/quizApi.js
import axios from "axios";

const API_BASE = "http://localhost:5000/api"; // adjust if backend runs elsewhere

// Fetch all quizzes
export const getQuizzes = async () => {
  const res = await axios.get(`${API_BASE}/quizzes`);
  return res.data;
};

// Fetch single quiz by ID
export const getQuizById = async (quizId) => {
  const res = await axios.get(`${API_BASE}/quizzes/${quizId}`);
  return res.data;
};

// Submit quiz result
export const submitQuizResult = async (resultData) => {
  const res = await axios.post(`${API_BASE}/results`, resultData);
  return res.data;
};

// Get results for a quiz
export const getResultsByQuiz = async (quizId) => {
  const res = await axios.get(`${API_BASE}/results/${quizId}`);
  return res.data;
};


