import React from 'react';
import './DashboardOverview.css';

const DashboardOverview = ({ data, loading }) => {
  if (loading) {
    return <div className="loading">Loading dashboard...</div>;
  }

  const stats = [
    {
      label: 'Total Students',
      value: data?.totalStudents || 0,
      icon: '👥',
      color: '#667eea'
    },
    {
      label: 'Total Products',
      value: data?.totalProducts || 0,
      icon: '🛒',
      color: '#764ba2'
    },
    {
      label: 'Total Quizzes',
      value: data?.totalQuizzes || 0,
      icon: '📝',
      color: '#f093fb'
    },
    {
      label: 'Quiz Attempts',
      value: data?.totalQuizAttempts || 0,
      icon: '✅',
      color: '#4facfe'
    }
  ];

  return (
    <div className="dashboard-overview">
      <h2>Dashboard Overview</h2>

      <div className="stats-grid">
        {stats.map((stat, index) => (
          <div key={index} className="stat-card" style={{ borderLeftColor: stat.color }}>
            <div className="stat-icon">{stat.icon}</div>
            <div className="stat-content">
              <p className="stat-label">{stat.label}</p>
              <h3 className="stat-value">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="metrics-section">
        <div className="metric-card">
          <h3>Average Student Performance</h3>
          <div className="performance-score">
            {data?.avgStudentPerformance || '0%'}
          </div>
          <p>Average quiz score across all students</p>
        </div>

        <div className="metric-card">
          <h3>Recent Activity</h3>
          <div className="activity-list">
            {data?.recentActivity && data.recentActivity.length > 0 ? (
              data.recentActivity.map((activity, index) => (
                <div key={index} className="activity-item">
                  <span className="activity-icon">📦</span>
                  <div className="activity-details">
                    <p className="activity-name">{activity.name}</p>
                    <p className="activity-seller">by {activity.seller?.name || 'Unknown'}</p>
                  </div>
                  <span className="activity-time">
                    {new Date(activity.createdAt).toLocaleDateString()}
                  </span>
                </div>
              ))
            ) : (
              <p className="no-data">No recent activity</p>
            )}
          </div>
        </div>
      </div>

      <div className="quick-actions">
        <h3>Quick Actions</h3>
        <div className="action-buttons">
          <button className="action-btn marketplace-btn">
            🛒 Manage Marketplace
          </button>
          <button className="action-btn quiz-btn">
            📝 View Quizzes
          </button>
          <button className="action-btn student-btn">
            👥 Review Student Progress
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
