import { useEffect, useState } from "react";
import axios from "axios";
import "./QuizDashboard.css";
import { useNavigate } from "react-router-dom";

import { FaUsers, FaBox, FaClipboardList, FaCheckCircle } from "react-icons/fa";

const QuizDashboard = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [results, setResults] = useState([]);
  const [students, setStudents] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [quizRes, resultRes, studentRes] = await Promise.all([
          axios.get("http://localhost:5000/api/quiz"),
          axios.get("http://localhost:5000/api/result"),
          axios.get("http://localhost:5000/api/students"), // adjust if needed
        ]);

        setQuizzes(quizRes.data);
        setResults(resultRes.data);
        setStudents(studentRes.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  const avgScore =
    results.length > 0
      ? (
          results.reduce((acc, r) => acc + r.score, 0) / results.length
        ).toFixed(2)
      : 0;

  return (
    <div className="dashboard">
      <h2 className="title">Dashboard Overview</h2>

      {/* Top Stats */}
      <div className="stats-grid">
      <div className="stat-card blue" onClick={() => handleCardClick("/quiz-form")}>
        <FaUsers />
        <div>
          <p>Create Questions</p>
          <h3>{students.length}</h3>
        </div>
      </div>

      <div className="stat-card purple" onClick={() => handleCardClick("/quiz-bank")}>
        <FaBox />
        <div>
          <p>Quizzes</p>
          <h3>1</h3>
        </div>
      </div>

      <div className="stat-card pink" onClick={() => handleCardClick("/student-results")}>
        <FaClipboardList />
        <div>
          <p>Student Performance</p>
          <h3>{quizzes.length}</h3>
        </div>
      </div>

      <div className="stat-card cyan" onClick={() => handleCardClick("attempts")}>
        <FaCheckCircle />
        <div>
          <p>Quiz Attempts</p>
          <h3>{results.length}</h3>
        </div>
      </div>
    </div>

      {/* Middle Section */}
      <div className="middle-grid">
        <div className="performance-card">
          <h3>Average Student Performance</h3>
          <h1>{avgScore}%</h1>
          <p>Average quiz score across all students</p>
        </div>

        <div className="activity-card">
          <h3>Recent Activity</h3>
          {quizzes.slice(0, 3).map((quiz, i) => (
            <div key={i} className="activity-item">
              📦 {quiz.title}
              <span>{new Date(quiz.createdAt).toLocaleDateString()}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <button
          className="btn gradient1"
          onClick={() => navigate("/marketplace")}
        >
          Manage Marketplace
        </button>

        <button
          className="btn gradient2"
          onClick={() => navigate("/quizzes")}
        >
          View Quizzes
        </button>

        <button
          className="btn gradient3"
          onClick={() => navigate("/students")}
        >
          Review Student Progress
        </button>
      </div>
    </div>
  );
};

export default QuizDashboard;