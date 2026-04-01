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
      </Routes>
    </div>
  );
}

