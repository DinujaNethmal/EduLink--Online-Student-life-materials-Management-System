import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";
import { Pie, Bar } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const QuizAnalytics = () => {
  const navigate = useNavigate();

  const [quizzes, setQuizzes] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch dashboard data
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
        setLoading(false);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Prepare chart data
  const quizStatusData = {
    labels: ["Published", "Draft"], // Pie chart slices
    datasets: [
      {
        
        data: [1, 0], 
        backgroundColor: ["#3b82f6", "#f97316"],
        borderColor: ["#1e40af", "#c2410c"], 
        borderWidth: 1,
      },
    ],
  };

  const difficultyData = {
    labels: ["Easy", "Medium", "Hard"],
    datasets: [
      {
        label: "Quizzes",
        data: [
          quizzes.filter((q) => q.difficulty === "Easy").length,
          quizzes.filter((q) => q.difficulty === "Medium").length,
          quizzes.filter((q) => q.difficulty === "Hard").length,
        ],
        backgroundColor: ["#22c55e", "#facc15", "#ef4444"],
      },
    ],
  };

  if (loading) return <div className="p-6 text-center">Loading dashboard...</div>;

  return (
    <div>
        <h2 style={{ fontSize: "2rem", marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>Quiz Analytics</h2>
            <div className="chart-grid">
                <div className="chart-card">
                    <h3>Quiz Status Distribution</h3>
                        <div className="chart-box">
                    <Pie data={quizStatusData} />
                    </div>
                </div>
        
                <div className="chart-card">
                    <h3>Quiz Difficulty Distribution</h3>
                    <div className="chart-box">
                    <Bar data={difficultyData} />
                    </div>
                </div>
            </div>
            {/* Recent Quizzes */}
      <div className="quiz-list">
        <h2>Recent Quizzes</h2>

        {quizzes.slice(-5).reverse().map((quiz, idx) => (
          <div key={idx} className="quiz-item">
            <div>
              <div className="quiz-title">
                {quiz.title} ({quiz.status})
              </div>
              <div className="quiz-sub">
                {quiz.subject} • {quiz.questions.length} Questions • {quiz.duration} mins •{" "}
                {quiz.totalMarks} Marks • Difficulty: {quiz.difficulty}
              </div>
            </div>

            <div className="actions">
              <button className="preview" onClick={() => navigate(`/quiz-attempt/${quiz._id}`)}>
                Preview
              </button>
              <button className="edit" onClick={() => navigate(`/edit-quiz/${quiz._id}`)}>
                Edit
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
        
    );
};

export default QuizAnalytics;
