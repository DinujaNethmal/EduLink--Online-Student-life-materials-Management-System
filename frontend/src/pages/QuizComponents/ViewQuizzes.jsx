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
        const res = await axios.get("http://localhost:5000/api/quiz"); 
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
      <h2 style={{ fontSize: "2rem", marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>Available Quizzes</h2>

      {/* Filters */}
      <div className="glass-panel" style={{ padding: "1rem", marginBottom: "1.5rem" }}>
        <h3 style={{ fontSize: "1.2rem", marginBottom: "1rem" }}>Filters</h3>
        <div className="grid grid-cols-4 gap-4">
          {/* Academic Year */}
          <div className="flex flex-col">
            <label className="font-semibold mb-1">Academic Year</label>
            <select  className="modern-select"
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
            <select  className="modern-select"
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
            <select  className="modern-select"
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
            <select  className="modern-select"
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
      <div className="glass-panel" style={{ padding: "1rem", marginBottom: "1.5rem" }}>
        <h3 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>Available Quizzes</h3>
        <table className="modern-table">
          <thead>
            <tr style={{ background: "rgba(255,255,255,0.05)" }}>
              <th >Title</th>
              <th >Subject</th>
              <th >Duration</th>
              <th >Questions</th>
              <th >Difficulty</th>
              <th >Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredQuizzes.map((quiz) => (
              <tr key={quiz._id} className="hover:bg-gray-50">
                <td>{quiz.title}</td>
                <td>{quiz.subject}</td>
                <td>{quiz.duration}</td>
                <td>{quiz.questions.length}</td>
                <td>{quiz.difficulty}</td>
                <td>
                  <button
                    className="btn-modern-primary"
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