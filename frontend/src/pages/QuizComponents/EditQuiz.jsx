import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./EditQuiz.css";

const EditQuiz = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quizInfo, setQuizInfo] = useState(null);
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/quiz/${id}`);
        setQuizInfo(res.data);
        setQuestions(res.data.questions);
      } catch (err) {
        console.error("Error fetching quiz:", err);
      }
    };
    fetchQuiz();
  }, [id]);

  if (!quizInfo) return <p>Loading...</p>;

  const handleUpdate = async () => {
    try {
      await axios.put(`http://localhost:5000/api/quiz/${id}`, {
        ...quizInfo,
        questions,
      });
      alert("Quiz updated!");
      navigate("/question-bank");
    } catch (err) {
      console.error(err);
      alert("Failed to update quiz");
    }
  };

  return (
    <div className="container">
      <h2 className="title">Edit Quiz: {quizInfo.title}</h2>

      {/* Quiz Info */}
      <div className="section">
        <h3>Quiz Information</h3>

        <div className="grid">

          <div className="form-group">
            <label>Academic Year</label>
            <select
              value={quizInfo.year}
              onChange={(e) =>
                setQuizInfo({ ...quizInfo, year: e.target.value })
              }
            >
              <option value="">Select year</option>
              <option>2022</option>
              <option>2023</option>
              <option>2024</option>
              <option>2025</option>
              <option>2026</option>
            </select>
          </div>

          <div className="form-group">
            <label>Semester</label>
            <select
              value={quizInfo.semester}
              onChange={(e) =>
                setQuizInfo({ ...quizInfo, semester: e.target.value })
              }
            >
              <option value="">Select semester</option>
              <option>Semester 1</option>
              <option>Semester 2</option>
            </select>
          </div>

          <div className="form-group">
            <label>Subject</label>
            <select
              value={quizInfo.subject}
              onChange={(e) =>
                setQuizInfo({ ...quizInfo, subject: e.target.value }) // ✅ FIXED BUG
              }
            >
              <option>Select Subject</option>
              <option>Web Development</option>
              <option>Computer Science</option>
              <option>Frontend Development</option>
              <option>Full Stack Development</option>
              <option>Database Systems</option>
              <option>Programming</option>
            </select>
          </div>

          <div className="form-group">
            <label>Quiz Title</label>
            <input
              value={quizInfo.title}
              onChange={(e) =>
                setQuizInfo({ ...quizInfo, title: e.target.value })
              }
            />
          </div>

          <div className="form-group">
            <label>Difficulty</label>
            <select
              value={quizInfo.difficulty}
              onChange={(e) =>
                setQuizInfo({ ...quizInfo, difficulty: e.target.value })
              }
            >
              <option>Easy</option>
              <option>Medium</option>
              <option>Hard</option>
            </select>
          </div>

          <div className="form-group">
            <label>Duration (minutes)</label>
            <input
              type="number"
              value={quizInfo.duration}
              onChange={(e) =>
                setQuizInfo({ ...quizInfo, duration: Number(e.target.value) })
              }
            />
          </div>

          <div className="form-group">
            <label>Total Marks</label>
            <input
              type="number"
              value={quizInfo.totalMarks}
              onChange={(e) =>
                setQuizInfo({ ...quizInfo, totalMarks: Number(e.target.value) })
              }
            />
          </div>

        </div>
      </div>

      {/* Questions */}
      {questions.map((q, idx) => (
        <div key={idx} className="question-card">
          <h3>Question {idx + 1}</h3>

          <div className="form-group">
            <label>Question Type</label>
            <select
              value={q.type}
              onChange={(e) => {
                const updated = [...questions];
                updated[idx].type = e.target.value;
                updated[idx].answer = "";
                setQuestions(updated);
              }}
            >
              <option value="MCQ">Multiple Choice</option>
              <option value="TrueFalse">True / False</option>
              <option value="ShortAnswer">Short Answer</option>
            </select>
          </div>

          <div className="form-group">
            <label>Question</label>
            <input
              value={q.text}
              onChange={(e) => {
                const updated = [...questions];
                updated[idx].text = e.target.value;
                setQuestions(updated);
              }}
            />
          </div>

          {/* MCQ */}
          {q.type === "MCQ" && (
            <div className="form-group">
              <label>Options</label>
              {q.options.map((opt, i) => (
                <div key={i} className="option-row">
                  <input
                    type="radio"
                    name={`q${idx}`}
                    checked={q.answer === q.options[i]}
                    onChange={() => {
                      const updated = [...questions];
                      updated[idx].answer = updated[idx].options[i];
                      setQuestions(updated);
                    }}
                  />
                  <input
                    value={opt}
                    onChange={(e) => {
                      const updated = [...questions];
                      updated[idx].options[i] = e.target.value;
                      setQuestions(updated);
                    }}
                  />
                </div>
              ))}
            </div>
          )}

          {/* True/False */}
          {q.type === "TrueFalse" && (
            <div className="form-group">
              <label>Options</label>
              <div className="option-row">
                <label>
                  <input
                    type="radio"
                    checked={q.answer === "True"}
                    onChange={() => {
                      const updated = [...questions];
                      updated[idx].answer = "True";
                      setQuestions(updated);
                    }}
                  />
                  True
                </label>

                <label>
                  <input
                    type="radio"
                    checked={q.answer === "False"}
                    onChange={() => {
                      const updated = [...questions];
                      updated[idx].answer = "False";
                      setQuestions(updated);
                    }}
                  />
                  False
                </label>
              </div>
            </div>
          )}

          <div className="form-group">
            <label>Explanation</label>
            <textarea
              value={q.explanation}
              onChange={(e) => {
                const updated = [...questions];
                updated[idx].explanation = e.target.value;
                setQuestions(updated);
              }}
            />
          </div>

          <div className="form-group">
            <label>Difficulty</label>
            <select
              value={q.difficulty}
              onChange={(e) => {
                const updated = [...questions];
                updated[idx].difficulty = e.target.value;
                setQuestions(updated);
              }}
            >
              <option>Easy</option>
              <option>Medium</option>
              <option>Hard</option>
            </select>
          </div>

          <div className="form-group">
            <label>Marks</label>
            <input
              type="number"
              value={q.marks}
              onChange={(e) => {
                const updated = [...questions];
                updated[idx].marks = Number(e.target.value);
                setQuestions(updated);
              }}
            />
          </div>
        </div>
      ))}

      <button onClick={handleUpdate} className="btn btn-update">
        Update Quiz
      </button>
    </div>
  );
};

export default EditQuiz;