import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Search, Filter, BookOpen, Clock, BarChart, Play } from "lucide-react";
import "../ModernPages.css";

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

  const filteredQuizzes = quizzes.filter((q) =>
    (filters.difficulty === "All" || q.difficulty === filters.difficulty) &&
    (filters.subject === "All" || q.subject === filters.subject) &&
    (filters.year === "All" || q.year === filters.year) &&
    (filters.semester === "All" || q.semester === filters.semester)
  );

  if (loading) return (
    <div className="modern-page-container flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mx-auto mb-4"></div>
        <p className="text-gray-400">Loading available quizzes...</p>
      </div>
    </div>
  );

  return (
    <div className="modern-page-container">
      <div className="modern-content-wrapper">
        <div className="groups-hero-modern">
          <h1>Explore <span className="highlight">Quizzes</span></h1>
          <p>Test your knowledge with community-curated quizzes across all subjects.</p>
        </div>

        {/* Filter Section */}
        <div className="poster-card mb-8" style={{ minHeight: 'auto', padding: '2rem' }}>
          <div className="flex items-center gap-2 mb-6 text-purple-400">
            <Filter size={20} />
            <h3 className="text-lg font-bold m-0">Refine Search</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="modern-form">
              <div className="field-group">
                <label>Academic Year</label>
                <select
                  className="bg-transparent text-white border border-gray-700 p-3 rounded-xl focus:border-purple-500 outline-none"
                  value={filters.year}
                  onChange={(e) => setFilters({ ...filters, year: e.target.value })}
                >
                  <option value="All">All Years</option>
                  <option value="2022">2022</option>
                  <option value="2023">2023</option>
                  <option value="2024">2024</option>
                  <option value="2025">2025</option>
                  <option value="2026">2026</option>
                </select>
              </div>
            </div>

            <div className="modern-form">
              <div className="field-group">
                <label>Semester</label>
                <select
                  className="bg-transparent text-white border border-gray-700 p-3 rounded-xl focus:border-purple-500 outline-none"
                  value={filters.semester}
                  onChange={(e) => setFilters({ ...filters, semester: e.target.value })}
                >
                  <option value="All">All Semesters</option>
                  <option value="Semester 1">Semester 1</option>
                  <option value="Semester 2">Semester 2</option>
                </select>
              </div>
            </div>

            <div className="modern-form">
              <div className="field-group">
                <label>Subject</label>
                <select
                  className="bg-transparent text-white border border-gray-700 p-3 rounded-xl focus:border-purple-500 outline-none"
                  value={filters.subject}
                  onChange={(e) => setFilters({ ...filters, subject: e.target.value })}
                >
                  <option value="All">All Subjects</option>
                  <option value="Web Development">Web Development</option>
                  <option value="Computer Science">Computer Science</option>
                  <option value="Full Stack Development">Full Stack Development</option>
                  <option value="Database Systems">Database Systems</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div className="modern-form">
              <div className="field-group">
                <label>Difficulty</label>
                <select
                  className="bg-transparent text-white border border-gray-700 p-3 rounded-xl focus:border-purple-500 outline-none"
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
        </div>

        {/* Results Info */}
        <div className="flex justify-between items-center mb-6">
          <p className="text-gray-400 font-medium">
            Showing <span className="text-white">{filteredQuizzes.length}</span> quizzes found
          </p>
        </div>

        {/* Quiz Grid/Table */}
        {filteredQuizzes.length === 0 ? (
          <div className="poster-card text-center py-20">
            <h3 className="text-gray-500">No quizzes match your filters.</h3>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {filteredQuizzes.map((quiz) => (
              <div key={quiz._id} className="poster-card" style={{ minHeight: 'auto', padding: '1.5rem 2.5rem' }}>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold m-0">{quiz.title}</h3>
                      <span className={`poster-badge ${quiz.difficulty.toLowerCase()}`}>
                        {quiz.difficulty}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-6 text-gray-400 text-sm">
                      <div className="flex items-center gap-2">
                        <BookOpen size={16} className="text-purple-400" />
                        {quiz.subject}
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock size={16} className="text-blue-400" />
                        {quiz.duration} Minutes
                      </div>
                      <div className="flex items-center gap-2">
                        <BarChart size={16} className="text-green-400" />
                        {quiz.questions?.length || 0} Questions
                      </div>
                    </div>
                  </div>
                  
                  <button
                    className="tab-btn active"
                    style={{ padding: '0.8rem 2rem', margin: 0 }}
                    onClick={() => navigate(`/quiz-attempt/${quiz._id}`)}
                  >
                    <div className="flex items-center gap-2">
                      <Play size={18} fill="white" />
                      Start Quiz
                    </div>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewQuizzes;