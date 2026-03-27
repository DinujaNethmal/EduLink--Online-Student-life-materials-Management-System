import { Routes, Route } from "react-router-dom";
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
  };

  return (
    <div className="app-shell">
      <Routes>
        {/* Admin Routes */}
        <Route 
          path="/admin" 
          element={
            adminUser ? (
              <AdminDashboard admin={adminUser} onLogout={handleAdminLogout} />
            ) : (
              <AdminLogin onLoginSuccess={setAdminUser} />
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

