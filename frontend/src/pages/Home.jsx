import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Shield, Key, Users, CheckCircle, LayoutDashboard, Heart, BookOpen, Clock, BarChart, Star, ListPlus, Filter, ShoppingCart, History, LogOut } from "lucide-react";
import "./Home.css"; // Import new landing page styles

export default function Home() {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const userStr = localStorage.getItem('currentUser');
    if (userStr) {
      try { setCurrentUser(JSON.parse(userStr)); } catch (e) {}
    }
  }, []);

  // Animation Variants
  const fadeUp = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  const slideLeft = {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  const slideRight = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
  };

  return (
    <div className="landing-page">
      {/* Navigation */}
      <motion.nav 
        className="landing-nav"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <Link to="/" className="landing-logo">
          EL EduLink
        </Link>
        <div className="landing-links">
          <Link to="/">Home</Link>
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
                onClick={() => { localStorage.clear(); window.location.reload(); }} 
                className="btn-landing-secondary" 
                style={{ 
                  padding: "0.5rem 1rem", 
                  fontSize: "0.85rem", 
                  border: "1px solid rgba(239, 68, 68, 0.2)", 
                  background: "rgba(239, 68, 68, 0.1)",
                  color: "#f87171",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  transition: "all 0.3s ease"
                }}
                onMouseOver={(e) => { e.currentTarget.style.background = "rgba(239, 68, 68, 0.2)"; }}
                onMouseOut={(e) => { e.currentTarget.style.background = "rgba(239, 68, 68, 0.1)"; }}
              >
                <LogOut size={16} /> Logout
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

      {/* Hero Section */}
      <section className="landing-section section-hero">
        <div className="hero-content">
          <motion.div 
            className="hero-text"
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            <motion.div variants={fadeUp} className="hero-badge">
              University Student Platform
            </motion.div>
            <motion.h1 variants={fadeUp}>
              Smart Learning & Group Formation
              <span>for Every Student</span>
            </motion.h1>
            <motion.p variants={fadeUp}>
              EduLink helps university students securely sign in, manage skills, and form the right project groups so that no student is left without a team.
            </motion.p>
            <motion.div variants={fadeUp} className="hero-buttons">
              {currentUser ? (
                <Link to="/profile" className="btn-landing-primary large">
                  Welcome back, {currentUser.name}
                </Link>
              ) : (
                <Link to="/register" className="btn-landing-primary large">
                  Get Started – Register
                </Link>
              )}
              <Link to="/finding-groups" className="btn-landing-secondary">
                Find Groups
              </Link>
              <Link to="/profile" className="btn-landing-secondary">
                View Profile
              </Link>
            </motion.div>
          </motion.div>
          
          <motion.div 
            className="hero-image-container"
            initial={{ opacity: 0, scale: 0.9, rotateY: 15 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <img src="/images/hero.png" alt="University Students Platform" />
          </motion.div>
        </div>
      </section>

      {/* Authentication Section */}
      <section className="landing-section section-auth">
        <motion.div 
          className="feature-grid"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          <motion.div className="feature-image" variants={slideLeft}>
            <img src="/images/auth.png" alt="Secure Authentication" />
          </motion.div>
          
          <motion.div className="feature-text" variants={slideRight}>
            <h2>Secure Authentication</h2>
            <p>
              Your data safety is our priority. We offer robust, role-based access for students and administrators, ensuring all protected records remain private.
            </p>
            <div className="glass-list">
              <div className="glass-item">
                <div className="icon-box"><Shield size={24} /></div>
                <span>Role-based access (student, admin)</span>
              </div>
              <div className="glass-item">
                <div className="icon-box"><Key size={24} /></div>
                <span>Encrypted protected data</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Smart Grouping Section */}
      <section className="landing-section section-grouping">
        <motion.div 
          className="feature-grid reverse"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          <motion.div className="feature-image" variants={slideRight}>
            <img src="/images/grouping.png" alt="Smart Grouping" />
          </motion.div>
          
          <motion.div className="feature-text" variants={slideLeft}>
            <h2>Smart Grouping</h2>
            <p>
              Never get left behind. Create groups, send join requests, set specific skill tags, and efficiently manage team capacities dynamically.
            </p>
            <div className="glass-list">
              <div className="glass-item">
                <div className="icon-box"><Users size={24} /></div>
                <span>Group creation & join requests</span>
              </div>
              <div className="glass-item">
                <div className="icon-box"><CheckCircle size={24} /></div>
                <span>Skill tags and capacity control</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Quiz & Review Management Section */}
      <section className="landing-section section-quiz">
        <motion.div 
          className="feature-grid"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          <motion.div className="feature-image" variants={slideLeft}>
            <img src="/images/quiz.png" alt="Quiz & Review System" />
          </motion.div>
          
          <motion.div className="feature-text" variants={slideRight}>
            <h2>Smart Quiz & Review System</h2>
            <p>
              Practice past papers using dynamic quizzes with automatic grading and performance tracking. Identify weak areas and significantly improve learning outcomes.
            </p>
            <div className="glass-list">
              <div className="glass-item">
                <div className="icon-box"><BookOpen size={24} /></div>
                <span>Dynamic quiz generation</span>
              </div>
              <div className="glass-item">
                <div className="icon-box"><Clock size={24} /></div>
                <span>Timed quizzes with auto-submit</span>
              </div>
              <div className="glass-item">
                <div className="icon-box"><BarChart size={24} /></div>
                <span>Instant scoring & performance dashboard</span>
              </div>
              <div className="glass-item">
                <div className="icon-box"><Star size={24} /></div>
                <span>User reviews and ratings</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Marketplace Section */}
      <section className="landing-section section-marketplace">
        <motion.div 
          className="feature-grid reverse"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          <motion.div className="feature-image" variants={slideRight}>
            <img src="/images/marketplace.png" alt="Student Marketplace" />
          </motion.div>
          
          <motion.div className="feature-text" variants={slideLeft}>
            <h2>Student Marketplace</h2>
            <p>
              A seamless, secure platform tailored for students to buy, sell, or exchange academic items such as books, notes, and technical equipment right on campus.
            </p>
            <div className="glass-list">
              <div className="glass-item">
                <div className="icon-box"><ListPlus size={24} /></div>
                <span>Product listing and management</span>
              </div>
              <div className="glass-item">
                <div className="icon-box"><Filter size={24} /></div>
                <span>Category filtering and search</span>
              </div>
              <div className="glass-item">
                <div className="icon-box"><ShoppingCart size={24} /></div>
                <span>Add to cart and order placement</span>
              </div>
              <div className="glass-item">
                <div className="icon-box"><History size={24} /></div>
                <span>Order history tracking</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Why EduLink Section */}
      <section className="landing-section section-why">
        <motion.div 
          className="why-header"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
        >
          <h2>Why EduLink?</h2>
          <p>Designed precisely to elevate the university project experience, resolving teamwork challenges before they even happen.</p>
        </motion.div>

        <motion.div 
          className="why-cards"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={staggerContainer}
        >
          <motion.div className="why-card" variants={fadeUp}>
            <div className="card-icon"><Users size={28} /></div>
            <h3>Balanced Teams</h3>
            <p>Skill-based group formation so that each team is robust, balanced, and productive.</p>
          </motion.div>

          <motion.div className="why-card" variants={fadeUp}>
            <div className="card-icon"><CheckCircle size={28} /></div>
            <h3>Simple Workflow</h3>
            <p>Effortlessly send and approve join requests with an extremely seamless review process.</p>
          </motion.div>

          <motion.div className="why-card" variants={fadeUp}>
            <div className="card-icon"><LayoutDashboard size={28} /></div>
            <h3>Unified Dashboard</h3>
            <p>Always stay updated—see your current groups, pending requests, and skills at a single glance.</p>
          </motion.div>

          <motion.div className="why-card" variants={fadeUp}>
            <div className="card-icon"><Heart size={28} /></div>
            <h3>Total Inclusivity</h3>
            <p>Automatically avoids overcrowded groups and actively ensures no student is ever left behind.</p>
          </motion.div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="landing-footer-content">
          <div className="landing-logo" style={{ fontSize: "1.2rem" }}>EL EduLink</div>
          <p>© {new Date().getFullYear()} EduLink. Designed for university projects.</p>
        </div>
      </footer>
    </div>
  );
}

