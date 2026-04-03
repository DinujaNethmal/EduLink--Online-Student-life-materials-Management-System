import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function SharedNav() {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const userStr = localStorage.getItem('currentUser');
    if (userStr) {
      try { 
        setCurrentUser(JSON.parse(userStr)); 
      } catch (e) {}
    }
  }, []);

  return (
    <motion.nav 
      className="landing-nav"
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Link to="/" className="landing-logo">
        EL EduLink
      </Link>
      <div className="landing-links">
        <Link to="/">Home</Link>
        <Link to="/profile">Profile</Link>
        <Link to="/finding-groups">Finding Groups</Link>
        <Link to="/view-quizzes">Quizzes</Link>
        {currentUser ? (
          <div style={{ display: "flex", alignItems: "center", gap: "1.2rem", marginLeft: "0.5rem" }}>
            <span style={{ color: "#fff", fontWeight: "600", fontSize: "1rem" }}>Welcome, {currentUser.name}</span>
            <Link to="/profile" style={{ 
              width: "42px", height: "42px", borderRadius: "50%", 
              background: "linear-gradient(135deg, #0ea5e9, #38bdf8)", 
              display: "flex", alignItems: "center", justifyContent: "center", 
              color: "white", fontWeight: "bold", fontSize: "1.2rem", textDecoration: "none",
              boxShadow: "0 4px 14px rgba(14, 165, 233, 0.4)",
              overflow: "hidden"
            }}>
              {currentUser.profilePhoto ? (
                <img src={currentUser.profilePhoto} alt="Profile" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              ) : (
                currentUser.name.charAt(0).toUpperCase()
              )}
            </Link>
            <button 
              onClick={() => { localStorage.clear(); window.location.href = "/"; }} 
              className="btn-landing-secondary" 
              style={{ padding: "0.4rem 0.8rem", fontSize: "0.85rem", border: "1px solid rgba(255,255,255,0.1)", background: "rgba(0,0,0,0.2)" }}
            >
              Logout
            </button>
          </div>
        ) : (
          <>
            <Link to="/login" className="btn-landing-secondary" style={{ padding: "0.5rem 1.25rem" }}>Login</Link>
            <Link to="/register" className="btn-landing-primary">Register</Link>
          </>
        )}
      </div>
    </motion.nav>
  );
}
