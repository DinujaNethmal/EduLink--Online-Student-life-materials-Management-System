import { Routes, Route, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Home from "./pages/Home.jsx";
import Register from "./pages/Register.jsx";
import Login from "./pages/Login.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import Profile from "./pages/Profile.jsx";
import FindingGroups from "./pages/FindingGroups.jsx";
import AdminLogin from "./pages/AdminLogin.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";

import QuizForm from "./pages/QuizComponents/QuizForm.jsx";
import QuizResults from "./pages/QuizComponents/QuizResults.jsx";
import QuestionBank from "./pages/QuizComponents/QuestionBank.jsx"; 
import ViewQuizzes from "./pages/QuizComponents/ViewQuizzes.jsx";
import QuizAttempt from "./pages/QuizComponents/QuizAttempt.jsx";
import EditQuiz from "./pages/QuizComponents/EditQuiz.jsx";
import Charts from "./pages/QuizComponents/Charts.jsx";

export default function App() {
  const [adminUser, setAdminUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if admin is already logged in
    const savedAdmin = localStorage.getItem('adminUser');
    if (savedAdmin) {
      setAdminUser(JSON.parse(savedAdmin));
    }
  }, []);

  const handleAdminLogout = () => {
    localStorage.removeItem('adminUser');
    setAdminUser(null);
    navigate('/login');
  };

  return (
    <div className="app-shell">
      <Routes>
        {/* Admin Routes (Restricted Component to Unified Login) */}
        <Route 
          path="/admin" 
          element={
            adminUser ? (
              <AdminDashboard admin={adminUser} onLogout={handleAdminLogout} />
            ) : (
              <div style={{ padding: "5rem", textAlign: "center", color: "white", minHeight: "100vh" }}>
                 <h2 style={{ fontSize: "2rem", color: "#f87171" }}>🔒 Access Denied</h2>
                 <p style={{ color: "#94a3b8" }}>Admin privileges required to view the dashboard. Please sign in via the main Login portal.</p>
              </div>
            )
          } 
        />

        {/* Regular User Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/finding-groups" element={<FindingGroups />} />

        <Route path="/quiz-form" element={<QuizForm />} />
        <Route path="/quiz-results" element={<QuizResults />} />
        <Route path="/question-bank" element={<QuestionBank />} />
        <Route path="/view-quizzes" element={<ViewQuizzes />} />
        <Route path="/quiz-attempt/:id" element={<QuizAttempt/>} />
        <Route path="/edit-quiz/:id" element={<EditQuiz />} />
        <Route path="/charts" element={<Charts />} />

        
      </Routes>
    </div>
  );
}

