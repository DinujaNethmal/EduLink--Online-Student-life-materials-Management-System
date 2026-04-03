import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const QuizResults = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Data passed from QuizAttempt
  const { answers, questions, score } = location.state || {};

  if (!questions || !answers) {
    return (
      <div className="p-6 text-center">
        <p>❌ No result data available.</p>
        <button
          onClick={() => navigate("/")}
          className="mt-4 bg-orange-500 text-white px-4 py-2 rounded"
        >
          Go Home
        </button>
      </div>
    );
  }

  const totalMarks = questions.reduce((sum, q) => sum + q.marks, 0);
  const correctCount = questions.filter((q, idx) => {
    const userAns = answers[idx];
    return (
      q.correctAnswer &&
      userAns?.toString().trim().toLowerCase() ===
        q.correctAnswer.toString().trim().toLowerCase()
    );
  }).length;

  const incorrectCount = questions.length - correctCount;
  const percentage = ((score / totalMarks) * 100).toFixed(1);
  const gradeStatus = percentage >= 50 ? "Pass" : "Fail";

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8">
      {/* Quiz Summary */}
      <div className="bg-white shadow rounded p-6 text-center">
        <h2 className="text-2xl font-bold mb-4">Quiz Completed!</h2>
        <h3 className="text-xl font-semibold mb-2">{location.state?.quizTitle || "Quiz"}</h3>
        <p
          className={`text-4xl font-bold mb-4 ${
            gradeStatus === "Pass" ? "text-green-600" : "text-red-600"
          }`}
        >
          {gradeStatus}
        </p>
        <p className="text-lg mb-2">
          {score} / {totalMarks}
        </p>
        <p className="text-lg mb-2">{percentage}% Score</p>
        <p className="text-gray-700 mb-1">{correctCount} Correct Answers</p>
        <p className="text-gray-700 mb-1">{incorrectCount} Incorrect Answers</p>
      </div>

      {/* Answer Review */}
      <div className="bg-white shadow rounded p-6">
        <h2 className="text-xl font-bold mb-4">Answer Review</h2>
        {questions.map((q, idx) => {
          const userAns = answers[idx] || "No Answer";
          const correctAns = q.correctAnswer || q.answer;
          const isCorrect =
            correctAns &&
            userAns.toString().trim().toLowerCase() === correctAns.toString().trim().toLowerCase();

          return (
            <div key={idx} className="mb-6 border-b pb-4">
              <p className="font-semibold mb-2">
                Q{idx + 1}: {q.text}
              </p>
              <p className={`mb-1 ${isCorrect ? "text-green-600" : "text-red-600"}`}>
                Your Answer: {userAns}
              </p>
              {correctAns && <p className="text-green-600">Correct Answer: {correctAns}</p>}
              {q.explanation && <p className="text-gray-700 italic mt-1">Explanation: {q.explanation}</p>}
              <p className={`font-bold ${isCorrect ? "text-green-600" : "text-red-600"} mt-1`}>
                {isCorrect ? "Correct" : "Incorrect"}
              </p>
            </div>
          );
        })}
      </div>
      <div className="text-left">
        <button
          onClick={() => navigate("/")}
          className="mb-4 bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded"
        >
          ← Back to Home
        </button>
      </div>
    </div>
  );
};

export default QuizResults;