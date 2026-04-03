import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const QuizAttempt = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [questions, setQuestions] = useState([]);
  const [quizTitle, setQuizTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState(1800);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

  // Fetch quiz data
  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/quiz/${id}`);
        const data = await res.json();
        console.log("API DATA 👉", data);

        setQuestions(data.questions || []);
        setQuizTitle(data.title || "Quiz");
        setTimeLeft(data.duration || 1800);
        setLoading(false);
      } catch (err) {
        alert("❌ Could not load quiz");
        navigate("/");
      }
    };
    fetchQuiz();
  }, [id, navigate]);

  // Timer
  useEffect(() => {
    if (loading || submitted) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [loading, submitted]);

  useEffect(() => {
    if (timeLeft === 0 && !submitted) {
      alert("⏰ Time is up!");
      handleSubmit(true);
    }
  }, [timeLeft]);

  const formatTime = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const handleAnswer = (index, value) => {
    setAnswers({ ...answers, [index]: value });
  };

  const handleSubmit = (auto = false) => {
    if (!auto && Object.keys(answers).length !== questions.length) {
      alert("⚠️ Answer all questions!");
      return;
    }

    setSubmitted(true);

    const score = questions.reduce((total, q, idx) => {
      const correct = q.correctAnswer || q.answer;
      if (
        answers[idx]?.toString().toLowerCase().trim() ===
        correct?.toString().toLowerCase().trim()
      ) {
        total += q.marks || 1;
      }
      return total;
    }, 0);

    navigate("/quiz-results", { state: { answers, questions, score } });
  };

  if (loading) return <div className="p-6 text-center">Loading...</div>;
  if (!questions.length) return <div className="p-6 text-center">No questions</div>;

  const q = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  console.log("Question object 👉", q);
  console.log("Options 👉", q.options);

  return (
    <div style={{ background: "rgba(255,255,255,0.05)" }}>
      {/* HEADER */}
      <div className="bg-white rounded-xl shadow p-5 mb-6">
        <h2 className="text-xl font-bold">{quizTitle}</h2>
        <div className="flex justify-between text-sm text-gray-600 mt-2">
          <span>Progress: {currentQuestion + 1} of {questions.length}</span>
          <span>Total Marks: {questions.reduce((a, b) => a + (b.marks || 1), 0)}</span>
        </div>
        <div className="w-full bg-gray-200 h-2 rounded mt-3">
          <div className="bg-blue-600 h-2 rounded" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div className="flex gap-6 max-w-6xl mx-auto">
        {/* LEFT PANEL */}
        <div className="flex-1 bg-white rounded-xl shadow p-6">
          <div className="flex items-center gap-3 mb-4">
            <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded text-sm">
              Question {currentQuestion + 1}
            </span>
            <span className="text-sm text-gray-500">{q.marks || 1} marks</span>
          </div>

          <h3 style={{ fontSize: "1.3rem", marginBottom: "1.2rem" }}>{q.text}</h3>

          {/* OPTIONS */}
          <div className="space-y-3">
            {/* TRUE / FALSE */}
            {q.type === "TrueFalse" ? (
              ["True", "False"].map((opt, idx) => (
                <label
                  key={idx}
                  className={`flex items-center gap-3 border rounded-lg p-3 cursor-pointer ${
                    answers[currentQuestion] === opt
                      ? "bg-blue-100 border-blue-400"
                      : "hover:bg-gray-50"
                  }`}
                >
                  <input
                    type="radio"
                    name={`question-${currentQuestion}`}
                    value={opt}
                    checked={answers[currentQuestion] === opt}
                    onChange={() => handleAnswer(currentQuestion, opt)}
                  />
                  {opt}
                </label>
              ))
            ) : Array.isArray(q.options) &&
              q.options.filter((opt) => opt.trim() !== "").length > 0 ? (

              /* MCQ RADIO BUTTONS */
              q.options
                .filter((opt) => opt.trim() !== "")
                .map((opt, idx) => (
                  <label
                    key={idx}
                    className={`flex items-center gap-3 border rounded-lg p-3 cursor-pointer ${
                      answers[currentQuestion] === opt
                        ? "bg-blue-100 border-blue-400"
                        : "hover:bg-gray-50"
                    }`}
                  >
                    <input
                      type="radio"
                      name={`question-${currentQuestion}`}
                      value={opt}
                      checked={answers[currentQuestion] === opt}
                      onChange={() => handleAnswer(currentQuestion, opt)}
                    />
                    {opt}
                  </label>
                ))
            ) : (

              /* SHORT ANSWER */
              <input
                type="text"
                value={answers[currentQuestion] || ""}
                onChange={(e) =>
                  setAnswers((prev) => ({
                    ...prev,
                    [currentQuestion]: e.target.value,
                  }))
                }
                className="border p-3 rounded w-full focus:ring-2 focus:ring-blue-400 outline-none"
                placeholder="Type your answer..."
              />
            )}

          </div>

          {/* NAV */}
          <div className="flex justify-between mt-6">
            <button
              disabled={currentQuestion === 0}
              onClick={() => setCurrentQuestion((q) => q - 1)}
              className="px-4 py-2 bg-gray-300 rounded"
            >
              Previous
            </button>

            {currentQuestion < questions.length - 1 ? (
              <button
                onClick={() => setCurrentQuestion((q) => q + 1)}
                className="btn-modern-primary"
              >
                Next →
              </button>
            ) : (
              <button
                onClick={() => handleSubmit(false)}
                className="btn-modern-primary" style={{ background: "linear-gradient(135deg, #10b981, #34d399)" }}
              >
                Submit
              </button>
            )}
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="w-72 flex flex-col gap-5">
          <div className="glass-panel">
            <p>⏱ Time Remaining</p>
            <h2 style={{ fontSize: "2rem", marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>{formatTime(timeLeft)}</h2>
          </div>

          <div className="glass-panel">
            <h3 className="font-bold mb-3">Questions</h3>
            <div className="grid grid-cols-5 gap-2">
              {questions.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentQuestion(idx)}
                  className={`py-2 rounded ${
                    currentQuestion === idx
                      ? "bg-blue-600 text-white"
                      : answers[idx]
                      ? "bg-green-200"
                      : "bg-gray-200"
                  }`}
                >
                  {idx + 1}
                </button>
              ))}
            </div>
            <button
              onClick={() => handleSubmit(false)}
              className="btn-modern-primary" style={{ background: "linear-gradient(135deg, #10b981, #34d399)" }}
            >
              Submit Quiz
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizAttempt;