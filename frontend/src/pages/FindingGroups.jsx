import React, { useMemo, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Users, Filter, PlusCircle, Search, Copy, CheckCircle } from "lucide-react";
import "./ModernPages.css";
import ChatSidebar from "../components/ChatSidebar";
import { MessageSquare } from "lucide-react";

const memberPostsSeed = [
  {
    id: 1,
    name: "Nethmi Perera",
    personalEmail: "nethmi.perera@gmail.com",
    contactNumber: "0771234567",
    campus: "Malabe",
    subject: "SE",
    lookingGroupType: "Research",
    gender: "Female",
    gpa: "3.62",
    showGpa: true,
    details: "Strong in React and UI. Looking for active team members.",
    miniPoster: "Need a serious group for final year project.",
  },
  {
    id: 2,
    name: "Dulaj Fernando",
    personalEmail: "dulaj.fernando@gmail.com",
    contactNumber: "0712345678",
    campus: "Kandy",
    subject: "DBMS",
    lookingGroupType: "Assignment",
    gender: "Male",
    gpa: "",
    showGpa: false,
    details: "Can handle backend APIs and MongoDB schema design.",
    miniPoster: "Looking for a backend focused team.",
  },
];

const groupBannersSeed = [
  {
    id: 1,
    groupName: "Team Quantum",
    leaderName: "Sahan",
    personalEmail: "teamquantum.lead@gmail.com",
    contactNumber: "0765432109",
    campus: "Malabe",
    subject: "OOP",
    subgroup: "Development",
    wantedGender: "Any",
    minGpa: "3.0",
    details: "We need 1 member for frontend + testing.",
    banner: "We want members to our group. Please DM.",
  },
  {
    id: 2,
    groupName: "Data Spark",
    leaderName: "Nimali",
    personalEmail: "dataspark.team@gmail.com",
    contactNumber: "0751112233",
    campus: "Metro",
    subject: "DSA",
    subgroup: "Research",
    wantedGender: "Female",
    minGpa: "2.8",
    details: "Need one student with strong algorithm basics.",
    banner: "Open spot available now. Join us!",
  },
];

const filterDefaults = {
  campus: "All",
  subject: "All",
  groupType: "All",
  gender: "All",
};

const newMemberDefault = {
  name: "",
  personalEmail: "",
  contactNumber: "",
  campus: "Malabe",
  subject: "SE",
  lookingGroupType: "Research",
  gender: "Any",
  gpa: "",
  showGpa: false,
  details: "",
  miniPoster: "",
};

const newBannerDefault = {
  groupName: "",
  leaderName: "",
  personalEmail: "",
  contactNumber: "",
  campus: "Malabe",
  subject: "SE",
  subgroup: "Development",
  wantedGender: "Any",
  minGpa: "",
  details: "",
  banner: "",
};

export default function FindingGroups() {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const userStr = localStorage.getItem('currentUser');
    if (userStr) {
      try { 
        const parsed = JSON.parse(userStr);
        setCurrentUser(parsed); 
        setMemberForm(prev => ({ ...prev, personalEmail: parsed.email }));
        setBannerForm(prev => ({ ...prev, personalEmail: parsed.email }));
      } catch (e) {}
    }
  }, []);

  const [activeTab, setActiveTab] = useState("member");
  const [filters, setFilters] = useState(filterDefaults);
  const [memberPosts, setMemberPosts] = useState(memberPostsSeed);
  const [groupBanners, setGroupBanners] = useState(groupBannersSeed);


  const fetchMemberPosts = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/finding-groups/members');
      const data = await res.json();
      if (data.success) {
        setMemberPosts(data.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchGroupBanners = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/finding-groups/banners');
      const data = await res.json();
      if (data.success) {
        setGroupBanners(data.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchMemberPosts();
    fetchGroupBanners();
  }, []);
  const [memberForm, setMemberForm] = useState(newMemberDefault);
  const [bannerForm, setBannerForm] = useState(newBannerDefault);
  const [copyMessage, setCopyMessage] = useState("");

  const filteredMemberPosts = useMemo(
    () =>
      memberPosts.filter(
        (post) =>
          (filters.campus === "All" || post.campus === filters.campus) &&
          (filters.subject === "All" || post.subject === filters.subject) &&
          (filters.groupType === "All" || post.lookingGroupType === filters.groupType) &&
          (filters.gender === "All" || post.gender === filters.gender)
      ),
    [memberPosts, filters]
  );

  const filteredGroupBanners = useMemo(
    () =>
      groupBanners.filter(
        (banner) =>
          (filters.campus === "All" || banner.campus === filters.campus) &&
          (filters.subject === "All" || banner.subject === filters.subject) &&
          (filters.groupType === "All" || banner.subgroup === filters.groupType) &&
          (filters.gender === "All" || banner.wantedGender === filters.gender)
      ),
    [groupBanners, filters]
  );

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleMemberFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setMemberForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleBannerFormChange = (e) => {
    const { name, value } = e.target;
    setBannerForm((prev) => ({ ...prev, [name]: value }));
  };

  const submitMemberPost = async (e) => {
    e.preventDefault();
    if (!memberForm.name.trim() || !memberForm.personalEmail.trim() || !memberForm.contactNumber.trim() || !memberForm.miniPoster.trim()) return;

    const payload = { ...memberForm, personalEmail: currentUser ? currentUser.email : memberForm.personalEmail };

    try {
      if (memberForm._id) {
        const res = await fetch(`http://localhost:5000/api/finding-groups/members/${memberForm._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (data.success) {
          setMemberPosts(prev => prev.map(p => p._id === data.data._id ? data.data : p));
          setMemberForm({ ...newMemberDefault, personalEmail: currentUser ? currentUser.email : '' });
        }
      } else {
        const res = await fetch('http://localhost:5000/api/finding-groups/members', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (data.success) {
          setMemberPosts((prev) => [data.data, ...prev]);
          setMemberForm({ ...newMemberDefault, personalEmail: currentUser ? currentUser.email : '' });
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const submitGroupBanner = async (e) => {
    e.preventDefault();
    if (!bannerForm.groupName.trim() || !bannerForm.personalEmail.trim() || !bannerForm.contactNumber.trim() || !bannerForm.banner.trim()) return;

    const payload = { ...bannerForm, personalEmail: currentUser ? currentUser.email : bannerForm.personalEmail };

    try {
      if (bannerForm._id) {
        const res = await fetch(`http://localhost:5000/api/finding-groups/banners/${bannerForm._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (data.success) {
          setGroupBanners(prev => prev.map(p => p._id === data.data._id ? data.data : p));
          setBannerForm({ ...newBannerDefault, personalEmail: currentUser ? currentUser.email : '' });
        }
      } else {
        const res = await fetch('http://localhost:5000/api/finding-groups/banners', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (data.success) {
          setGroupBanners((prev) => [data.data, ...prev]);
          setBannerForm({ ...newBannerDefault, personalEmail: currentUser ? currentUser.email : '' });
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteMemberPost = async (id) => {
    if(!window.confirm("Are you sure you want to delete your member post?")) return;
    try {
      const res = await fetch(`http://localhost:5000/api/finding-groups/members/${id}`, { method: 'DELETE' });
      if(res.ok) setMemberPosts(prev => prev.filter(p => (p._id || p.id) !== id));
    } catch (err) { console.error(err); }
  };

  const handleEditMemberPost = (post) => {
    setActiveTab("member");
    setMemberForm(post);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteGroupBanner = async (id) => {
    if(!window.confirm("Are you sure you want to delete your group banner?")) return;
    try {
      const res = await fetch(`http://localhost:5000/api/finding-groups/banners/${id}`, { method: 'DELETE' });
      if(res.ok) setGroupBanners(prev => prev.filter(b => (b._id || b.id) !== id));
    } catch (err) { console.error(err); }
  };

  const handleEditGroupBanner = (banner) => {
    setActiveTab("group");
    setBannerForm(banner);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const copyToClipboard = async (value, label) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopyMessage(`${label} copied`);
      window.setTimeout(() => setCopyMessage(""), 1400);
    } catch {
      setCopyMessage("Copy failed");
      window.setTimeout(() => setCopyMessage(""), 1400);
    }
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

      {/* Copy notification popup */}
      <AnimatePresence>
        {copyMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, x: "-50%" }}
            animate={{ opacity: 1, y: 20, x: "-50%" }}
            exit={{ opacity: 0, y: -20, x: "-50%" }}
            style={{ 
              position: "fixed", top: "80px", left: "50%", zIndex: 9999, 
              background: "#4ade80", color: "#166534", padding: "0.75rem 1.5rem", borderRadius: "99px", fontWeight: "bold", boxShadow: "0 10px 25px rgba(0,0,0,0.3)", display: "flex", gap: "0.5rem", alignItems: "center" 
            }}
          >
            <CheckCircle size={18} /> {copyMessage}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="modern-content-wrapper">
        <motion.section 
          className="groups-hero-modern"
          initial="hidden" animate="visible" variants={fadeUp}
        >
          <h1><Users size={48} style={{ display: "inline", verticalAlign: "bottom", marginRight: "1rem", color: "#f97316" }}/>Finding Groups</h1>
          <p>Post your request, discover matching students, and reliably build the right project team using Smart Filters.</p>
        </motion.section>

        {/* FILTERS */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel" 
          style={{ padding: "2rem", marginBottom: "3rem" }}
        >
          <h2 style={{ fontSize: "1.3rem", marginBottom: "1.2rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Filter size={20} color="#a855f7" /> Filter Posters & Banners
          </h2>
          <div className="form-grid-4">
            <div className="modern-form">
              <label>Campus</label>
              <select name="campus" value={filters.campus} onChange={handleFilterChange} className="modern-select">
                <option>All</option><option>Malabe</option><option>Metro</option><option>Kandy</option><option>Matara</option>
              </select>
            </div>
            <div className="modern-form">
              <label>Subject</label>
              <select name="subject" value={filters.subject} onChange={handleFilterChange} className="modern-select">
                <option>All</option><option>SE</option><option>DBMS</option><option>DSA</option><option>OOP</option>
              </select>
            </div>
            <div className="modern-form">
              <label>Group Type</label>
              <select name="groupType" value={filters.groupType} onChange={handleFilterChange} className="modern-select">
                <option>All</option><option>Research</option><option>Development</option><option>Assignment</option>
              </select>
            </div>
            <div className="modern-form">
              <label>Gender Preference</label>
              <select name="gender" value={filters.gender} onChange={handleFilterChange} className="modern-select">
                <option>All</option><option>Any</option><option>Male</option><option>Female</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Tab Switching */}
        <motion.div className="tab-buttons" initial="hidden" animate="visible" variants={fadeUp} transition={{ delay: 0.3 }}>
          <button type="button" className={`tab-btn ${activeTab === "member" ? "active" : ""}`} onClick={() => setActiveTab("member")}>I Need a Group</button>
          <button type="button" className={`tab-btn ${activeTab === "banner" ? "active" : ""}`} onClick={() => setActiveTab("banner")}>Our Group Needs Members</button>
        </motion.div>

        {/* Tab Content Wrapper */}
        <motion.div
           key={activeTab}
           initial={{ opacity: 0, x: activeTab === "member" ? -20 : 20 }}
           animate={{ opacity: 1, x: 0 }}
           transition={{ duration: 0.4 }}
        >
          {activeTab === "member" ? (
            <div className="form-grid-2" style={{ gridTemplateColumns: "1fr" }}>
              {/* Member Form Card */}
              <div className="glass-panel">
                <h3 style={{ fontSize: "1.5rem", marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <PlusCircle size={22} color="#38bdf8" /> Create Member Poster
                </h3>
                <form className="modern-form" onSubmit={submitMemberPost}>
                  <div className="form-grid-3">
                    <div className="field-group">
                      <label>Your Name</label>
                      <input name="name" className="modern-input" value={memberForm.name} onChange={handleMemberFormChange} placeholder="e.g. Kasun Perera" />
                    </div>
                    <div className="field-group">
                      <label>Personal Gmail</label>
                      <input name="personalEmail" type="email" className="modern-input" value={memberForm.personalEmail} onChange={handleMemberFormChange} placeholder="user@gmail.com" disabled={!!currentUser} />
                    </div>
                    <div className="field-group">
                      <label>Contact Number</label>
                      <input name="contactNumber" type="tel" className="modern-input" value={memberForm.contactNumber} onChange={handleMemberFormChange} placeholder="07XXXXXXXX" minLength="10" pattern="[0-9]{10,}" title="Contact number must be at least 10 digits" required />
                    </div>
                  </div>

                  <div className="form-grid-2">
                    <div className="field-group">
                      <label>Campus</label>
                      <select name="campus" className="modern-select" value={memberForm.campus} onChange={handleMemberFormChange}>
                        <option>Malabe</option><option>Metro</option><option>Kandy</option><option>Matara</option>
                      </select>
                    </div>
                    <div className="field-group">
                      <label>Main Subject</label>
                      <select name="subject" className="modern-select" value={memberForm.subject} onChange={handleMemberFormChange}>
                        <option>SE</option><option>DBMS</option><option>DSA</option><option>OOP</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-grid-3">
                    <div className="field-group">
                      <label>Looking Group Type</label>
                      <select name="lookingGroupType" className="modern-select" value={memberForm.lookingGroupType} onChange={handleMemberFormChange}>
                        <option>Research</option><option>Development</option><option>Assignment</option>
                      </select>
                    </div>
                    <div className="field-group">
                      <label>Gender</label>
                      <select name="gender" className="modern-select" value={memberForm.gender} onChange={handleMemberFormChange}>
                        <option>Any</option><option>Male</option><option>Female</option>
                      </select>
                    </div>
                    <div className="field-group">
                      <label>GPA (Optional)</label>
                      <input name="gpa" className="modern-input" value={memberForm.gpa} onChange={handleMemberFormChange} placeholder="3.45" disabled={!memberForm.showGpa}/>
                    </div>
                  </div>

                  <div style={{ marginBottom: "1rem" }}>
                    <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer", color: "#fff" }}>
                      <input type="checkbox" name="showGpa" checked={memberForm.showGpa} onChange={handleMemberFormChange} style={{ transform: "scale(1.2)" }}/>
                      Display my GPA broadly across the poster card
                    </label>
                  </div>

                  <div className="field-group">
                    <label>Details / Skills</label>
                    <input name="details" className="modern-input" value={memberForm.details} onChange={handleMemberFormChange} placeholder="Strong in APIs, looking for backend tasks..." />
                  </div>
                  <div className="field-group">
                    <label>Catchy Mini Poster Message</label>
                    <textarea name="miniPoster" className="modern-textarea" rows={2} value={memberForm.miniPoster} onChange={handleMemberFormChange} placeholder="Seeking serious members for research..." />
                  </div>
                  
                  <button type="submit" className="btn-modern-primary" style={{ width: "100%", marginTop: "1rem" }}>Post Member Poster</button>
                </form>
              </div>

              {/* Members List */}
              <div className="glass-panel">
                <h3 style={{ fontSize: "1.5rem", marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <Search size={22} color="#a855f7" /> Member Posters
                </h3>
                {filteredMemberPosts.length === 0 ? (
                  <p style={{ color: "#94a3b8", fontStyle: "italic", textAlign: "center" }}>No member posters match the filters.</p>
                ) : (
                  <div className="posters-grid">
                    {filteredMemberPosts.map(post => (
                      <div key={post._id || post.id} className="poster-card">
                        <div className="poster-header">
                          <h3>{post.name}</h3>
                          <span className="poster-badge">{post.campus}</span>
                        </div>
                        <p className="poster-msg">"{post.miniPoster}"</p>
                        <div className="poster-tags">
                          <span className="poster-tag">{post.subject}</span>
                          <span className="poster-tag">{post.lookingGroupType}</span>
                          <span className="poster-tag">{post.gender}</span>
                          {post.showGpa && post.gpa && <span className="poster-tag" style={{ border: "1px solid #38bdf8", color: "#38bdf8" }}>GPA {post.gpa}</span>}
                        </div>
                        <p style={{ color: "#cbd5e1", fontSize: "0.9rem", marginBottom: "1.5rem" }}>{post.details}</p>
                        <div className="poster-actions">
                          <button className="action-btn" onClick={() => copyToClipboard(post.personalEmail, "Email")}>
                            <Copy size={14}/> {post.personalEmail}
                          </button>
                          <button className="action-btn" onClick={() => copyToClipboard(post.contactNumber, "Number")}>
                            <Copy size={14}/> {post.contactNumber}
                          </button>
                          <button className="action-btn" style={{ borderColor: "#10b981", color: "#10b981" }} onClick={() => { window.dispatchEvent(new CustomEvent('openChat', { detail: post.personalEmail })); }}>
                            <MessageSquare size={14}/> Chat
                          </button>
                          {currentUser && currentUser.email === post.personalEmail && (
                            <>
                              <button className="action-btn" style={{ borderColor: "#38bdf8", color: "#38bdf8" }} onClick={() => handleEditMemberPost(post)}>
                                Edit
                              </button>
                              <button className="action-btn" style={{ borderColor: "#ef4444", color: "#ef4444" }} onClick={() => handleDeleteMemberPost(post._id || post.id)}>
                                Delete
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

          ) : (

            <div className="form-grid-2" style={{ gridTemplateColumns: "1fr" }}>
              {/* Banner Form Card */}
              <div className="glass-panel">
                <h3 style={{ fontSize: "1.5rem", marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <PlusCircle size={22} color="#f97316" /> Create Group Banner
                </h3>
                <form className="modern-form" onSubmit={submitGroupBanner}>
                  <div className="form-grid-3">
                    <div className="field-group">
                      <label>Group Name</label>
                      <input name="groupName" className="modern-input" value={bannerForm.groupName} onChange={handleBannerFormChange} placeholder="Team Vision" />
                    </div>
                    <div className="field-group">
                      <label>Leader Name</label>
                      <input name="leaderName" className="modern-input" value={bannerForm.leaderName} onChange={handleBannerFormChange} placeholder="Lahiru" />
                    </div>
                    <div className="field-group">
                      <label>Group Email (Leader)</label>
                      <input name="personalEmail" type="email" className="modern-input" value={bannerForm.personalEmail} onChange={handleBannerFormChange} placeholder="leader@gmail.com" disabled={!!currentUser} />
                    </div>
                  </div>

                  <div className="form-grid-2">
                    <div className="field-group">
                      <label>Contact Number</label>
                      <input name="contactNumber" type="tel" className="modern-input" value={bannerForm.contactNumber} onChange={handleBannerFormChange} placeholder="07XXXXXXXX" minLength="10" pattern="[0-9]{10,}" title="Contact number must be at least 10 digits" required />
                    </div>
                    <div className="field-group">
                      <label>Campus</label>
                      <select name="campus" className="modern-select" value={bannerForm.campus} onChange={handleBannerFormChange}>
                        <option>Malabe</option><option>Metro</option><option>Kandy</option><option>Matara</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-grid-3">
                    <div className="field-group">
                      <label>Subject</label>
                      <select name="subject" className="modern-select" value={bannerForm.subject} onChange={handleBannerFormChange}>
                        <option>SE</option><option>DBMS</option><option>DSA</option><option>OOP</option>
                      </select>
                    </div>
                    <div className="field-group">
                      <label>Wanted Subgroup</label>
                      <select name="subgroup" className="modern-select" value={bannerForm.subgroup} onChange={handleBannerFormChange}>
                        <option>Development</option><option>Research</option><option>Documentation</option>
                      </select>
                    </div>
                    <div className="field-group">
                      <label>Wanted Gender</label>
                      <select name="wantedGender" className="modern-select" value={bannerForm.wantedGender} onChange={handleBannerFormChange}>
                        <option>Any</option><option>Male</option><option>Female</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-grid-3">
                    <div className="field-group" style={{ gridColumn: "span 1" }}>
                      <label>Min GPA (Optional)</label>
                      <input name="minGpa" className="modern-input" value={bannerForm.minGpa} onChange={handleBannerFormChange} placeholder="3.00" />
                    </div>
                    <div className="field-group" style={{ gridColumn: "span 2" }}>
                      <label>Details / Requirements</label>
                      <input name="details" className="modern-input" value={bannerForm.details} onChange={handleBannerFormChange} placeholder="Requires strong CSS and React skills." />
                    </div>
                  </div>

                  <div className="field-group">
                    <label>Main Banner Display Text</label>
                    <textarea name="banner" className="modern-textarea" rows={2} value={bannerForm.banner} onChange={handleBannerFormChange} placeholder="Team Vision looking for 2 members..." />
                  </div>
                  
                  <button type="submit" className="btn-modern-primary" style={{ width: "100%", marginTop: "1rem", background: "linear-gradient(135deg, #f97316, #ec4899)" }}>Post Group Banner</button>
                </form>
              </div>

              {/* Banners List */}
              <div className="glass-panel">
                <h3 style={{ fontSize: "1.5rem", marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <Search size={22} color="#f97316" /> Active Subgroup Banners
                </h3>
                {filteredGroupBanners.length === 0 ? (
                  <p style={{ color: "#94a3b8", fontStyle: "italic", textAlign: "center" }}>No active banners match the filters.</p>
                ) : (
                  <div className="posters-grid">
                    {filteredGroupBanners.map(banner => (
                      <div key={banner._id || banner.id} className="poster-card" style={{ borderColor: 'rgba(249,115,22,0.2)' }}>
                        <div className="poster-header">
                          <h3 style={{ color: "#f97316" }}>{banner.groupName}</h3>
                          <span className="poster-badge" style={{ background: "rgba(249,115,22,0.15)", color: "#fdba74" }}>{banner.campus}</span>
                        </div>
                        <p className="poster-msg">"{banner.banner}"</p>
                        <div className="poster-tags">
                          <span className="poster-tag">{banner.subject}</span>
                          <span className="poster-tag">{banner.subgroup}</span>
                          <span className="poster-tag">Require: {banner.wantedGender}</span>
                          {banner.minGpa && <span className="poster-tag" style={{ border: "1px solid #f97316", color: "#fdba74" }}>Min GPA {banner.minGpa}</span>}
                        </div>
                        <p style={{ color: "#cbd5e1", fontSize: "0.9rem", marginBottom: "1.5rem" }}>
                          Leader: <strong>{banner.leaderName}</strong> | {banner.details}
                        </p>
                        <div className="poster-actions">
                          <button className="action-btn" onClick={() => copyToClipboard(banner.personalEmail, "Email")}>
                            <Copy size={14}/> {banner.personalEmail}
                          </button>
                          <button className="action-btn" onClick={() => copyToClipboard(banner.contactNumber, "Number")}>
                            <Copy size={14}/> {banner.contactNumber}
                          </button>
                          <button className="action-btn" style={{ borderColor: "#10b981", color: "#10b981" }} onClick={() => { window.dispatchEvent(new CustomEvent('openChat', { detail: banner.personalEmail })); }}>
                            <MessageSquare size={14}/> Chat
                          </button>
                          {currentUser && currentUser.email === banner.personalEmail && (
                            <>
                              <button className="action-btn" style={{ borderColor: "#38bdf8", color: "#38bdf8" }} onClick={() => handleEditGroupBanner(banner)}>
                                Edit
                              </button>
                              <button className="action-btn" style={{ borderColor: "#ef4444", color: "#ef4444" }} onClick={() => handleDeleteGroupBanner(banner._id || banner.id)}>
                                Delete
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            
          )}
        </motion.div>
      </div>

      <div style={{ textAlign: "center", paddingTop: "2rem", borderTop: "1px solid rgba(255,255,255,0.05)", marginTop: "3rem" }}>
         <p style={{ color: "#64748b", fontSize: "0.95rem" }}>© {new Date().getFullYear()} EduLink. Designed for university projects.</p>
      </div>

    </div>
  );
}
