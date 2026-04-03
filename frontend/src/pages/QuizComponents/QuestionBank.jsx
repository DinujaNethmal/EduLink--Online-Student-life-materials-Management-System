import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const QuestionBank = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [search, setSearch] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState("All");
  const [subjectsFilter, setSubjectsFilter] = useState("All");

  const navigate = useNavigate();

  // Fetch quizzes from backend
  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/quiz");
        const data = await res.json();
        console.log("Fetched quizzes:", data);
        setQuizzes(Array.isArray(data) ? data : [data]); // ensure array
      } catch (err) {
        console.error("Error fetching quizzes:", err);
      }
    };

    fetchQuizzes();
  }, []);

  // Delete quiz
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/quiz/${id}`);
      setQuizzes(quizzes.filter((quiz) => quiz._id !== id));
    } catch (err) {
      console.error("Error deleting quiz:", err);
    }
  };

  // Flatten questions from quizzes
  const allQuestions = quizzes.flatMap((quiz) =>
    quiz.questions.map((q) => ({
      ...q,
      quizId: quiz._id,
      title: quiz.title,
      academicYear: quiz.year, // backend field
      semester: quiz.semester,
      subject: quiz.subject,
      questionText: q.text, // map 'text' to 'questionText'
    }))
  );

  // Filter questions
  const filteredQuestions = allQuestions.filter((q) => {
    const questionText = q.questionText || ""; // fallback to empty string
    const difficulty = q.difficulty || "";
    const subject = q.subject || "";

    return (
      questionText.toLowerCase().includes(search.toLowerCase()) &&
      (difficultyFilter === "All" || difficulty === difficultyFilter) &&
      (subjectsFilter === "All" || subject === subjectsFilter)
    );
  });

  return (
    <div className="p-6">
      <h2 style={{ fontSize: "2rem", marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>Question Bank</h2>

      {/* Search + Filter */}
      <div className="flex gap-4 mb-4">
        <input
          type="text"
          placeholder="Search questions..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2 rounded w-1/2"
        />

        <select
          value={difficultyFilter}
          onChange={(e) => setDifficultyFilter(e.target.value)}
          className="modern-input"
        >
          <option value="All">All Difficulties</option>
          <option value="Easy">Easy</option>
          <option value="Medium">Medium</option>
          <option value="Hard">Hard</option>
        </select>

        <select
          value={subjectsFilter}
          onChange={(e) => setSubjectsFilter(e.target.value)}
          className="modern-input"
        >
          
          <option value="Select Subject">Select Subject</option>
          <option value="OOP">OOP</option>
          <option value="SE">SE</option>
          <option value="DBMS">DBMS</option>
          <option value="IWT">IWT</option>
          <option value="DSA">DSA</option>
          <option value="DS">DS</option>
        </select>

        <button
          className="bg-blue-700 text-white px-4 py-2 rounded"
          onClick={() => navigate("/quiz-form")}
        >
          + Add Question
        </button>
      </div>

      {/* Table */}
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2 border">Subject</th>
            <th className="p-2 border">Topic</th>
            <th className="p-2 border">Academic Year</th>
            <th className="p-2 border">Semester</th>
            <th className="p-2 border">Question Type</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>

        <tbody>
          {filteredQuestions.length === 0 ? (
            <tr>
              <td colSpan="6" className="text-center p-4">
                No questions found
              </td>
            </tr>
          ) : (
            filteredQuestions.map((q, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="p-2 border">{q.subject}</td>
                <td className="p-2 border">{q.title}</td>
                <td className="p-2 border">{q.academicYear}</td>
                <td className="p-2 border">{q.semester}</td>
                <td className="p-2 border">{q.type}</td>
                <td className="p-2 border space-x-2">
                  <button
                  className="text-blue-500"
                  onClick={() => navigate(`/edit-quiz/${q.quizId}`)}
                >
                  Edit
                </button>

                  <button
                    className="text-red-500"
                    onClick={() => handleDelete(q.quizId)}
                  >
                    Delete
                  </button>
                 
                  <button
                    className="text-green-500"
                    onClick={() => navigate('/view-quizzes')}
                  >
                    Preview
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default QuestionBank;