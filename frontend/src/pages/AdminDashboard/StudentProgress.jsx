import React, { useState, useEffect } from 'react';
import { getStudentProgress as fetchStudentProgressAPI } from '../../services/api';
import './StudentProgress.css';

const StudentProgress = () => {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedStudent, setExpandedStudent] = useState(null);

  useEffect(() => {
    fetchStudentProgress();
  }, []);

  useEffect(() => {
    filterStudents();
  }, [searchTerm, students]);

  const fetchStudentProgress = async () => {
    try {
      setLoading(true);
      const response = await fetchStudentProgressAPI();
      setStudents(response.data.data);
      setError('');
    } catch (err) {
      setError('Failed to load student progress data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filterStudents = () => {
    if (!searchTerm) {
      setFilteredStudents(students);
      return;
    }

    const filtered = students.filter((student) =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredStudents(filtered);
  };

  const toggleExpanded = (studentId) => {
    setExpandedStudent(expandedStudent === studentId ? null : studentId);
  };

  if (loading) {
    return <div className="loading">Loading student progress data...</div>;
  }

  return (
    <div className="student-progress">
      <h2>Student Progress Reports</h2>

      {error && <div className="error-msg">{error}</div>}

      {/* Search Bar */}
      <div className="search-section">
        <input
          type="text"
          placeholder="Search by student name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <p className="result-count">{filteredStudents.length} students found</p>
      </div>

      {/* Students List */}
      <div className="students-list">
        {filteredStudents && filteredStudents.length > 0 ? (
          filteredStudents.map((student) => (
            <div key={student.studentId} className="student-card">
              <div
                className="student-header"
                onClick={() => toggleExpanded(student.studentId)}
              >
                <div className="student-info">
                  <h3>{student.name}</h3>
                  <p className="student-email">{student.email}</p>
                  <p className="student-meta">{student.degreeProgram || 'N/A'} • {student.campus}</p>
                </div>

                <div className="student-stats">
                  <div className="stat">
                    <span className="stat-label">Quizzes Attempted</span>
                    <span className="stat-value">{student.totalQuizzesAttempted}</span>
                  </div>
                  <div className="stat">
                    <span className="stat-label">Average Score</span>
                    <span className="stat-value">{student.averageScore}%</span>
                  </div>
                  <button className="expand-btn">
                    {expandedStudent === student.studentId ? '▲' : '▼'}
                  </button>
                </div>
              </div>

              {/* Expanded Details */}
              {expandedStudent === student.studentId && (
                <div className="student-details">
                  <div className="progress-summary">
                    <div className="progress-item">
                      <h4>Overall Performance</h4>
                      <div className="progress-bar-container">
                        <div
                          className="progress-bar"
                          style={{
                            width: `${student.averageScore}%`,
                            background: student.averageScore >= 75
                              ? '#3c3'
                              : student.averageScore >= 50
                              ? '#ff9800'
                              : '#c33'
                          }}
                        ></div>
                      </div>
                      <span className="progress-text">{student.averageScore}%</span>
                    </div>
                  </div>

                  {/* Recent Results */}
                  <div className="recent-results">
                    <h4>Recent Quiz Results</h4>
                    {student.recentResults && student.recentResults.length > 0 ? (
                      <div className="results-list">
                        {student.recentResults.map((result, index) => (
                          <div key={index} className="result-item">
                            <div className="result-info">
                              <p className="quiz-title">{result.quiz?.title || 'Unknown Quiz'}</p>
                              <p className="quiz-module">{result.quiz?.module || 'No Module'}</p>
                            </div>
                            <div className="result-score">
                              <span className="score">{result.score}/{result.total}</span>
                              <span className="percentage">
                                {((result.score / result.total) * 100).toFixed(0)}%
                              </span>
                            </div>
                            <p className="result-date">
                              {new Date(result.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="no-results">No recent quiz results</p>
                    )}
                  </div>

                  {/* Statistics */}
                  <div className="stats-breakdown">
                    <h4>Statistics</h4>
                    <div className="stats-grid">
                      <div className="stat-box">
                        <span className="label">Total Quizzes Attempted</span>
                        <span className="value">{student.totalQuizzesAttempted}</span>
                      </div>
                      <div className="stat-box">
                        <span className="label">Average Score</span>
                        <span className="value">{student.averageScore}%</span>
                      </div>
                      <div className="stat-box">
                        <span className="label">Performance Level</span>
                        <span
                          className={`value level ${
                            student.averageScore >= 75
                              ? 'excellent'
                              : student.averageScore >= 50
                              ? 'good'
                              : 'needs-improvement'
                          }`}
                        >
                          {student.averageScore >= 75
                            ? '⭐ Excellent'
                            : student.averageScore >= 50
                            ? '✓ Good'
                            : '⚠ Needs Improvement'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="no-students">
            <p>No students found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentProgress;
