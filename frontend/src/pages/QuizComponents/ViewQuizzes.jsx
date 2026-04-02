import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const ViewQuizzes = () => {
  const navigate = useNavigate();

  const [filters, setFilters] = useState({
    year: "All",
    semester: "All",
    subject: "All",
    difficulty: "All",
  });

  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch quizzes from backend
  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/quiz"); // Adjust your endpoint
        setQuizzes(res.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("❌ Failed to fetch quizzes");
        setLoading(false);
      }
    };
    fetchQuizzes();
  }, []);

  // Apply filters
  const filteredQuizzes = quizzes.filter((q) =>
    (filters.difficulty === "All" || q.difficulty === filters.difficulty) &&
    (filters.subject === "All" || q.subject === filters.subject) &&
    (filters.year === "All" || q.year === filters.year) &&
    (filters.semester === "All" || q.semester === filters.semester)
  );

  if (loading) return <div className="p-6 text-center">Loading quizzes...</div>;
  if (error) return <div className="p-6 text-center text-red-600">{error}</div>;
  if (quizzes.length === 0) return <div className="p-6 text-center">No quizzes available.</div>;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Available Quizzes</h2>

      {/* Filters */}
      <div className="bg-white shadow rounded p-4 mb-6">
        <h3 className="text-lg font-bold mb-4">Filters</h3>
        <div className="grid grid-cols-4 gap-4">
          {/* Academic Year */}
          <div className="flex flex-col">
            <label className="font-semibold mb-1">Academic Year</label>
            <select
              className="border p-2 rounded"
              value={filters.year}
              onChange={(e) => setFilters({ ...filters, year: e.target.value })}
            >
              <option value="All">All Years</option>
              <option value="2025">2022</option>
              <option value="2025">2023</option>
              <option value="2025">2024</option>
              <option value="2025">2025</option>
              <option value="2026">2026</option>
            </select>
          </div>

          {/* Semester */}
          <div className="flex flex-col">
            <label className="font-semibold mb-1">Semester</label>
            <select
              className="border p-2 rounded"
              value={filters.semester}
              onChange={(e) => setFilters({ ...filters, semester: e.target.value })}
            >
              <option value="All">All Semesters</option>
              <option value="Semester 1">Semester 1</option>
              <option value="Semester 2">Semester 2</option>
            </select>
          </div>

          {/* Subject */}
          <div className="flex flex-col">
            <label className="font-semibold mb-1">Subject</label>
            <select
              className="border p-2 rounded"
              value={filters.subject}
              onChange={(e) => setFilters({ ...filters, subject: e.target.value })}
            >
              <option value="All">All Subjects</option>
              <option value="Web Development">Web Development</option>
              <option value="Computer Science">Computer Science</option>
              <option value="Frontend Development">Frontend Development</option>
              <option value="Full Stack Development">Full Stack Development</option>
              <option value="Programming">Programming</option>
              <option value="Database Systems">Database Systems</option>
            </select>
          </div>

          {/* Difficulty */}
          <div className="flex flex-col">
            <label className="font-semibold mb-1">Difficulty</label>
            <select
              className="border p-2 rounded"
              value={filters.difficulty}
              onChange={(e) => setFilters({ ...filters, difficulty: e.target.value })}
            >
              <option value="All">All Levels</option>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>
        </div>
      </div>

      {/* Quiz Table */}
      <div className="bg-white shadow rounded p-4">
        <h3 className="text-xl font-bold mb-4">Available Quizzes</h3>
        <table className="w-full border-collapse border">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2 text-left">Title</th>
              <th className="border p-2 text-left">Subject</th>
              <th className="border p-2 text-left">Duration</th>
              <th className="border p-2 text-left">Questions</th>
              <th className="border p-2 text-left">Difficulty</th>
              <th className="border p-2 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredQuizzes.map((quiz) => (
              <tr key={quiz._id} className="hover:bg-gray-50">
                <td className="border p-2">{quiz.title}</td>
                <td className="border p-2">{quiz.subject}</td>
                <td className="border p-2">{quiz.duration}</td>
                <td className="border p-2">{quiz.questions.length}</td>
                <td className="border p-2">{quiz.difficulty}</td>
                <td className="border p-2">
                  <button
                    className="bg-blue-600 text-white px-3 py-1 rounded"
                    onClick={() => navigate(`/quiz-attempt/${quiz._id}`)}
                  >
                    View Quiz
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ViewQuizzes;