import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AdminDashboard.css';
import MarketplaceAnalytics from './AdminDashboard/MarketplaceAnalytics';
import QuizAnalytics from './AdminDashboard/QuizAnalytics';
import StudentProgress from './AdminDashboard/StudentProgress';
import DashboardOverview from './AdminDashboard/DashboardOverview';

const AdminDashboard = ({ admin, onLogout }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardSummary();
  }, []);

  const fetchDashboardSummary = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/admin/dashboard-summary');
      setDashboardData(response.data.data);
      setError('');
    } catch (err) {
      setError('Failed to load dashboard data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="admin-dashboard">
      {/* Header */}
      <header className="admin-header">
        <div className="header-content">
          <h1>EduLink Admin Dashboard</h1>
          <div className="admin-info">
            <span>Welcome, {admin.name}</span>
            <button onClick={onLogout} className="logout-btn">Logout</button>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="admin-nav">
        <button
          className={`nav-btn ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => handleTabChange('overview')}
        >
          📊 Overview
        </button>
        <button
          className={`nav-btn ${activeTab === 'marketplace' ? 'active' : ''}`}
          onClick={() => handleTabChange('marketplace')}
        >
          🛒 Marketplace
        </button>
        <button
          className={`nav-btn ${activeTab === 'quizzes' ? 'active' : ''}`}
          onClick={() => handleTabChange('quizzes')}
        >
          📝 Quizzes
        </button>
        <button
          className={`nav-btn ${activeTab === 'progress' ? 'active' : ''}`}
          onClick={() => handleTabChange('progress')}
        >
          📈 Student Progress
        </button>
      </nav>

      {/* Main Content */}
      <main className="admin-main">
        {error && <div className="error-alert">{error}</div>}

        {activeTab === 'overview' && (
          <DashboardOverview data={dashboardData} loading={loading} />
        )}

        {activeTab === 'marketplace' && (
          <MarketplaceAnalytics />
        )}

        {activeTab === 'quizzes' && (
          <QuizAnalytics />
        )}

        {activeTab === 'progress' && (
          <StudentProgress />
        )}
      </main>

      {/* Footer */}
      <footer className="admin-footer">
        <p>&copy; 2024 EduLink Administration. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default AdminDashboard;
