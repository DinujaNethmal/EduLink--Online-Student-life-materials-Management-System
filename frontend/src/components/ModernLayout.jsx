import React from "react";
import SharedNav from "./SharedNav";
import "../pages/ModernPages.css";

export default function ModernLayout({ children }) {
  return (
    <div className="modern-page-container">
      <SharedNav />
      <div className="modern-content-wrapper">
        {children}
      </div>
      <div style={{ textAlign: "center", paddingTop: "2rem", borderTop: "1px solid rgba(255,255,255,0.05)", marginTop: "3rem" }}>
         <p style={{ color: "#64748b", fontSize: "0.95rem" }}>© {new Date().getFullYear()} EduLink. Designed for university projects.</p>
      </div>
    </div>
  );
}
