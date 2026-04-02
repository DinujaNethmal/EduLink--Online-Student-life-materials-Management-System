import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./QuizAnalytics.css";
import Charts from "../QuizComponents/Charts";
import QuizForm from "../QuizComponents/QuizForm";
import QuestionBank from "../QuizComponents/QuestionBank";
import StudentPerformance from "../QuizComponents/StudentResults";

const QuizAnalytics = () => {
  const navigate = useNavigate();

  // Dashboard states
  const [quizzes, setQuizzes] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Tab state
  const [activeQuizTab, setActiveQuizTab] = useState("quizzes");

  // Chart data
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [quizRes, questionRes, resultRes] = await Promise.all([
          axios.get("http://localhost:5000/api/quiz"),
          axios.get("http://localhost:5000/api/questions"),
          axios.get("http://localhost:5000/api/result"),
        ]);

        setQuizzes(quizRes.data);
        setQuestions(questionRes.data);
        setResults(resultRes.data);

        setChartData({
          labels: quizRes.data.map((q) => q.title),
          scores: resultRes.data.map((r) => r.score),
        });

        setLoading(false);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError("Failed to load dashboard data");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div className="p-6 text-center">Loading dashboard...</div>;

  return (
    <div>
      {/* Navigation Tabs */}
      <div className="navbar">
        <div
          className={`nav-item ${activeQuizTab === "charts" ? "active" : ""}`}
          onClick={() => setActiveQuizTab("charts")}
        >
          📊 Charts
        </div>
        <div
          className={`nav-item ${activeQuizTab === "create-questions" ? "active" : ""}`}
          onClick={() => setActiveQuizTab("create-questions")}
        >
          📝 Create Questions
        </div>
        <div
          className={`nav-item ${activeQuizTab === "quiz-bank" ? "active" : ""}`}
          onClick={() => setActiveQuizTab("quiz-bank")}
        >
          📚 Questions
        </div>
        <div
          className={`nav-item ${activeQuizTab === "results" ? "active" : ""}`}
          onClick={() => setActiveQuizTab("results")}
        >
          🏆Student Progress
        </div>
      </div>

      <br />

      {/* Header */}
      <div className="header">
        <h1>Quiz Dashboard</h1>
        <p>Manage quizzes, questions, and track student performance</p>
      </div>

      {/* Cards */}
      <div className="card-grid">
        <div className="card blue">📚 Total Quizzes: {quizzes.length}</div>
        <div className="card green">📖 Questions: {questions.length}</div>
        <div className="card purple">📝 Quiz Attempts: {results.length}</div>
        <div className="card orange">
          📊 Avg Score:{" "}
          {results.length > 0
            ? Math.round(results.reduce((acc, r) => acc + r.score, 0) / results.length)
            : 0}
          %
        </div>
      </div>

      {/* Main content / Tabs */}
      <main className="quiz-main">
        {error && <div className="error-alert">{error}</div>}

        {activeQuizTab === "charts" && <div><Charts /></div>}
        {activeQuizTab === "create-questions" && <div><QuizForm /></div>}
        {activeQuizTab === "quiz-bank" && <QuestionBank />}
        {activeQuizTab === "results" && <StudentPerformance />}
      </main>
      <br />
      <br />

    </div>
  );
};

export default QuizAnalytics;
