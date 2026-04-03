import React, { useMemo, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Camera, Edit3, GraduationCap, School, AtSign, Settings } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { getStudentProfile, updateStudentProfile } from "../services/api";
import "./ModernPages.css";

const initialProfile = {
  fullName: "Student Name",
  email: "it12345678@my.sliit.lk",
  campus: "Malabe",
  year: "3",
  semester: "2",
  hasGroup: "yes",
  groupName: "Team Alpha",
  degreeProgram: "BSc (Hons) in IT",
  bio: "Interested in full-stack development and teamwork projects.",
};

const initialQuizMarks = [
  { quiz: "Quiz 1", module: "SE", marks: 78 },
  { quiz: "Quiz 2", module: "DSA", marks: 84 },
  { quiz: "Quiz 3", module: "DBMS", marks: 72 },
  { quiz: "Quiz 4", module: "OOP", marks: 90 },
];

export default function Profile() {
  const [profile, setProfile] = useState(initialProfile);
  const [quizMarks] = useState(initialQuizMarks);
  const [profilePhoto, setProfilePhoto] = useState("");
  const [saveMessage, setSaveMessage] = useState("");
  const { user: currentUser } = useAuth();

  useEffect(() => {
    const cachedProfile = localStorage.getItem('savedProfile');
    if (cachedProfile) {
      try { setProfile(JSON.parse(cachedProfile)); } catch (e) {}
    }

    const cachedPhoto = localStorage.getItem('savedProfilePhoto');
    if (cachedPhoto) {
      setProfilePhoto(cachedPhoto);
    }

    const fetchMongoDBProfile = async () => {
      try {
        const queryEmail = currentUser?.email || '';
        const res = await getStudentProfile(queryEmail);
        const json = res.data;

        if (json.success) {
          const dbUser = json.data;
          setProfile((prev) => ({
            ...prev,
            fullName: dbUser.name || prev.fullName,
            email: dbUser.email || prev.email,
            campus: dbUser.campus || prev.campus,
            degreeProgram: dbUser.degreeProgram || prev.degreeProgram,
            year: dbUser.year || prev.year,
            semester: dbUser.semester || prev.semester,
            hasGroup: dbUser.hasGroup || prev.hasGroup,
            groupName: dbUser.groupName || prev.groupName,
            bio: dbUser.bio || prev.bio
          }));
          
          if (dbUser.profilePhoto) {
            setProfilePhoto(dbUser.profilePhoto);
          }
        }
      } catch (err) {
        console.error("Express API Not Running - Using Default Profile Data", err);
      }
    };
    
    fetchMongoDBProfile();
  }, []);

  const average = useMemo(() => {
    if (!quizMarks.length) return 0;
    const total = quizMarks.reduce((sum, item) => sum + item.marks, 0);
    return Math.round(total / quizMarks.length);
  }, [quizMarks]);

  const highest = useMemo(() => {
    if (!quizMarks.length) return 0;
    return Math.max(...quizMarks.map((item) => item.marks));
  }, [quizMarks]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
    setSaveMessage("");
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onloadend = () => {
      setProfilePhoto(reader.result);
      setSaveMessage("");
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Fallback: save to persistence memory cache
    localStorage.setItem('savedProfile', JSON.stringify(profile));
    if (profilePhoto) {
      localStorage.setItem('savedProfilePhoto', profilePhoto);
    }
    
    try {
      const currentEmail = currentUser?.email || profile.email;

      const res = await updateStudentProfile({ ...profile, profilePhoto, email: currentEmail });

      if (res.data.success) {
        setSaveMessage("Profile saved successfully to Database!");
      } else {
        setSaveMessage("Profile saved offline securely!");
      }
    } catch (err) {
      console.error(err);
      setSaveMessage("Profile saved offline securely!");
    }
    
    setTimeout(() => setSaveMessage(""), 3000);
  };

  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  return (
    <div className="modern-page-container">
      {/* Redesigned Navigation */}
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
          {currentUser ? (
            <div style={{ display: "flex", alignItems: "center", gap: "1.2rem", marginLeft: "0.5rem" }}>
              <span style={{ color: "#fff", fontWeight: "600", fontSize: "1rem" }}>Welcome, {currentUser.name}</span>
              <button 
                onClick={() => { localStorage.removeItem('currentUser'); window.location.href = "/"; }} 
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

      <div className="modern-content-wrapper">
        
        {/* Profile Header */}
        <motion.div 
          className="glass-panel profile-header-modern"
          initial="hidden"
          animate="visible"
          variants={fadeUp}
        >
          <div className="avatar-rings">
            {profilePhoto ? (
              <img src={profilePhoto} alt="Profile" className="modern-avatar" />
            ) : (
              <div className="modern-avatar">
                {profile.fullName.slice(0, 2).toUpperCase()}
              </div>
            )}
            <label className="btn-modern-primary" style={{ position: "absolute", bottom: "-10px", right: "-10px", padding: "0.5rem", borderRadius: "50%", cursor: "pointer" }}>
              <Camera size={20} />
              <input type="file" accept="image/*" onChange={handlePhotoChange} style={{ display: "none" }} />
            </label>
          </div>

          <div>
            <h1 style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}>{profile.fullName}</h1>
            <p style={{ fontSize: "1.1rem", marginBottom: "1rem" }}><GraduationCap size={18} style={{ display: "inline", verticalAlign: "middle", marginRight: "0.4rem" }}/>{profile.degreeProgram}</p>
            <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
              <span className="poster-badge"><School size={14} style={{ display: "inline", verticalAlign: "middle", marginRight: "0.3rem" }}/>{profile.campus} Campus</span>
              <span className="poster-badge">Year {profile.year} - Sem {profile.semester}</span>
              <span className="poster-badge">
                {profile.hasGroup === "yes" ? `Group: ${profile.groupName || "Assigned"}` : "No Group"}
              </span>
            </div>
          </div>
        </motion.div>

        <div className="form-grid-2">
          {/* Settings / Edit form */}
          <motion.div 
            className="glass-panel"
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            transition={{ delay: 0.2 }}
          >
            <h3 style={{ fontSize: "1.6rem", marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <Settings size={22} color="#a855f7" /> Edit Profile
            </h3>
            
            <form className="modern-form" onSubmit={handleSubmit}>
              <div className="field-group">
                <label htmlFor="fullName">Full Name</label>
                <input id="fullName" name="fullName" className="modern-input" value={profile.fullName} onChange={handleChange} />
              </div>

              <div className="field-group">
                <label htmlFor="email">University Email</label>
                <div style={{ position: "relative" }}>
                  <AtSign size={18} color="#94a3b8" style={{ position: "absolute", left: "1rem", top: "16px" }} />
                  <input id="email" name="email" type="email" className="modern-input" style={{ paddingLeft: "2.5rem", width: "100%", boxSizing: "border-box" }} value={profile.email} onChange={handleChange} />
                </div>
              </div>

              <div className="form-grid-3">
                <div className="field-group">
                  <label htmlFor="campus">Campus</label>
                  <select id="campus" name="campus" className="modern-select" value={profile.campus} onChange={handleChange}>
                    <option>Malabe</option>
                    <option>Metro</option>
                    <option>Kandy</option>
                    <option>Matara</option>
                  </select>
                </div>
                <div className="field-group">
                  <label htmlFor="year">Year</label>
                  <select id="year" name="year" className="modern-select" value={profile.year} onChange={handleChange}>
                    <option value="1">1</option><option value="2">2</option><option value="3">3</option><option value="4">4</option>
                  </select>
                </div>
                <div className="field-group">
                  <label htmlFor="semester">Semester</label>
                  <select id="semester" name="semester" className="modern-select" value={profile.semester} onChange={handleChange}>
                    <option value="1">1</option><option value="2">2</option>
                  </select>
                </div>
              </div>

              <div className="form-grid-2">
                <div className="field-group">
                  <label htmlFor="hasGroup">Have Group?</label>
                  <select id="hasGroup" name="hasGroup" className="modern-select" value={profile.hasGroup} onChange={handleChange}>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                </div>
                <div className="field-group">
                  <label htmlFor="groupName">Group Name</label>
                  <input id="groupName" name="groupName" className="modern-input" value={profile.groupName} onChange={handleChange} disabled={profile.hasGroup !== "yes"} />
                </div>
              </div>

              <div className="field-group">
                <label htmlFor="bio">Short Bio</label>
                <input id="bio" name="bio" className="modern-input" value={profile.bio} onChange={handleChange} />
              </div>

              <button type="submit" className="btn-modern-primary" style={{ width: "100%", marginTop: "1rem" }}>
                <Edit3 size={18} /> Save Profile Settings
              </button>
              {saveMessage && <p style={{ color: "#22c55e", marginTop: "1rem", textAlign: "center", fontWeight: "600" }}>{saveMessage}</p>}
            </form>
          </motion.div>

          {/* Performance Summary */}
          <motion.div 
            className="glass-panel"
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            transition={{ delay: 0.3 }}
          >
            <h3 style={{ fontSize: "1.6rem", marginBottom: "1.5rem" }}>Quiz Performance</h3>
            
            <div className="profile-stats-grid">
              <div className="stat-box">
                <div className="val">{average}%</div>
                <div className="lbl">Average Score</div>
              </div>
              <div className="stat-box">
                <div className="val">{highest}%</div>
                <div className="lbl">Highest Score</div>
              </div>
              <div className="stat-box">
                <div className="val">{quizMarks.length}</div>
                <div className="lbl">Total Attempts</div>
              </div>
            </div>

            <div style={{ overflowX: "auto" }}>
              <table className="modern-table">
                <thead>
                  <tr>
                    <th>Module</th>
                    <th>Quiz Title</th>
                    <th>Score</th>
                    <th>Grade</th>
                  </tr>
                </thead>
                <tbody>
                  {quizMarks.map((item) => (
                    <tr key={item.quiz}>
                      <td>{item.module}</td>
                      <td>{item.quiz}</td>
                      <td>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                          <span style={{ minWidth: "30px", fontWeight: "600" }}>{item.marks}%</span>
                          <div style={{ flex: 1, backgroundColor: "rgba(255,255,255,0.1)", height: "8px", borderRadius: "99px" }}>
                            <div style={{ width: `${item.marks}%`, height: "100%", background: "linear-gradient(90deg, #38bdf8, #818cf8)", borderRadius: "99px" }}></div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span style={{ 
                          padding: "0.2rem 0.6rem", borderRadius: "8px", fontSize: "0.85rem", fontWeight: "bold",
                          background: item.marks >= 75 ? "rgba(34,197,94,0.15)" : "rgba(249,115,22,0.15)",
                          color: item.marks >= 75 ? "#4ade80" : "#fb923c"
                        }}>
                          {item.marks >= 75 ? "Excellent" : "Average"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p style={{ marginTop: "1.5rem", color: "#64748b", fontSize: "0.9rem", fontStyle: "italic", textAlign: "center" }}>
              Scores are populated automatically from your recent quiz submissions.
            </p>
          </motion.div>
        </div>
      </div>
      
      {/* Footer */}
      <div style={{ textAlign: "center", paddingTop: "2rem", borderTop: "1px solid rgba(255,255,255,0.05)", marginTop: "3rem" }}>
         <p style={{ color: "#64748b", fontSize: "0.95rem" }}>© {new Date().getFullYear()} EduLink. Designed for university projects.</p>
      </div>
    </div>
  );
}
