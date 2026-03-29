import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './QuizAnalytics.css';

const QuizAnalytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/admin/analytics/quizzes');
      setAnalytics(response.data.data);
      setError('');
    } catch (err) {
      setError('Failed to load quiz analytics');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading quiz analytics...</div>;
  }

  return (
    <div className="quiz-analytics">
      <h2>Quiz Analytics</h2>

      {error && <div className="error-msg">{error}</div>}

      {/* Top Stats */}
      <div className="stats-cards">
        <div className="stat-card">
          <h3>Total Quizzes</h3>
          <p className="value">{analytics?.totalQuizzes || 0}</p>
        </div>
        <div className="stat-card">
          <h3>Total Attempts</h3>
          <p className="value">{analytics?.totalAttempts || 0}</p>
        </div>
        <div className="stat-card">
          <h3>Avg Attempts per Quiz</h3>
          <p className="value">
            {analytics?.totalQuizzes > 0
              ? (analytics?.totalAttempts / analytics?.totalQuizzes).toFixed(1)
              : 0}
          </p>
        </div>
      </div>

      {/* Quiz Performance */}
      <div className="section">
        <h3>Quiz Performance</h3>
        <div className="quiz-table">
          {analytics?.quizPerformance && analytics.quizPerformance.length > 0 ? (
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Quiz Name</th>
                    <th>Attempts</th>
                    <th>Avg Score</th>
                    <th>Performance</th>
                  </tr>
                </thead>
                <tbody>
                  {analytics.quizPerformance.map((quiz) => {
                    const avgPercentage = (quiz.averageScore / quiz.totalPoints) * 100;
                    const performanceColor = avgPercentage >= 75 ? '#3c3' : avgPercentage >= 50 ? '#ff9800' : '#c33';
                    return (
                      <tr key={quiz._id}>
                        <td className="quiz-name">{quiz.quizInfo[0]?.title || 'Unknown Quiz'}</td>
                        <td>{quiz.attempts}</td>
                        <td>{quiz.averageScore.toFixed(2)} / {quiz.totalPoints.toFixed(2)}</td>
                        <td>
                          <div className="performance-bar">
                            <div
                              className="bar-fill"
                              style={{
                                width: `${Math.min(avgPercentage, 100)}%`,
                                backgroundColor: performanceColor
                              }}
                            ></div>
                          </div>
                          <span className="percentage">{avgPercentage.toFixed(0)}%</span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="no-data">No quiz performance data available</p>
          )}
        </div>
      </div>

      {/* Difficulty Analysis */}
      <div className="section">
        <h3>Quiz Difficulty Analysis</h3>
        <div className="difficulty-grid">
          {analytics?.difficultyAnalysis && analytics.difficultyAnalysis.length > 0 ? (
            analytics.difficultyAnalysis.map((quiz) => {
              const avgPercentage = quiz.avgScore * 100;
              let difficulty = 'Hard';
              if (avgPercentage >= 75) difficulty = 'Easy';
              else if (avgPercentage >= 50) difficulty = 'Medium';
              
              return (
                <div key={quiz._id} className="difficulty-card">
                  <h4>{quiz.quiz.title}</h4>
                  <div className="difficulty-level" data-level={difficulty.toLowerCase()}>
                    {difficulty}
                  </div>
                  <div className="score-circle">
                    <p className="score">{avgPercentage.toFixed(0)}%</p>
                    <p className="label">Avg Score</p>
                  </div>
                  <p className="attempts">Attempts: {quiz.attempts}</p>
                </div>
              );
            })
          ) : (
            <p className="no-data">No difficulty analysis data available</p>
          )}
        </div>
      </div>

      {/* Score Distribution */}
      <div className="section">
        <h3>Score Distribution</h3>
        <div className="distribution-chart">
          {analytics?.scoreDistribution && analytics.scoreDistribution.length > 0 ? (
            analytics.scoreDistribution.map((dist, index) => {
              const ranges = ['0-20%', '20-40%', '40-60%', '60-80%', '80-100%'];
              const maxCount = Math.max(...analytics.scoreDistribution.map(d => d.count));
              
              return (
                <div key={index} className="distribution-bar">
                  <div className="bar-label">{ranges[index]}</div>
                  <div className="bar-container">
                    <div
                      className="bar"
                      style={{
                        height: `${(dist.count / maxCount) * 100}px`
                      }}
                    ></div>
                  </div>
                  <div className="bar-count">{dist.count}</div>
                </div>
              );
            })
          ) : (
            <p className="no-data">No score distribution data available</p>
          )}
        </div>
      </div>

      {/* Insights */}
      <div className="section insights-section">
        <h3>Key Insights</h3>
        <div className="insights">
          <div className="insight-item">
            <span className="icon">📊</span>
            <p>{analytics?.totalAttempts || 0} total quiz attempts have been recorded across {analytics?.totalQuizzes || 0} quizzes.</p>
          </div>
          <div className="insight-item">
            <span className="icon">👥</span>
            <p>Average attempts per quiz: {analytics?.totalQuizzes > 0 ? (analytics?.totalAttempts / analytics?.totalQuizzes).toFixed(1) : 0}</p>
          </div>
          <div className="insight-item">
            <span className="icon">📈</span>
            <p>Monitor the quizzes with lower performance scores and consider providing additional learning materials.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizAnalytics;
