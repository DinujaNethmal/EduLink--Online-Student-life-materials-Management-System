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
import ModernLayout from "./components/ModernLayout.jsx";
import ChatSidebar from "./components/ChatSidebar.jsx";
import { io } from "socket.io-client";
import { AnimatePresence, motion } from "framer-motion";
import { MessageCircle } from "lucide-react";

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

  // --- GLOBAL CHAT STATE ---
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatReceiver, setChatReceiver] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const [globalSocket, setGlobalSocket] = useState(null);

  useEffect(() => {
    const userStr = localStorage.getItem('currentUser');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        setCurrentUser(user);

        // Listen for new messages globally
        const socket = io('http://localhost:5000');
        setGlobalSocket(socket);
        socket.emit('join', user.email);

        socket.on('receiveMessage', (data) => {
          // If we receive a message and chat isn't open OR is for a different user, 
          // we popup the chat for the new sender!
          if (data.receiver === user.email) {
            setChatReceiver(""); // Reset to force re-fetch of history
            setTimeout(() => {
              setChatReceiver(data.sender);
              setIsChatOpen(true);
            }, 0);
          }
        });

        // Listen for internal chat open requests (from buttons)
        const handleOpenChat = (e) => {
          setChatReceiver(""); // Reset first to trigger effect if same
          setTimeout(() => {
            setChatReceiver(e.detail);
            setIsChatOpen(true);
          }, 0);
        };
        window.addEventListener('openChat', handleOpenChat);

        return () => {
          socket.disconnect();
          window.removeEventListener('openChat', handleOpenChat);
        };
      } catch (e) {}
    }
  }, []);

  const openChat = (receiverEmail) => {
    setChatReceiver("");
    setTimeout(() => {
      setChatReceiver(receiverEmail);
      setIsChatOpen(true);
    }, 0);
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

        <Route path="/quiz-form" element={<ModernLayout><QuizForm /></ModernLayout>} />
        <Route path="/quiz-results" element={<ModernLayout><QuizResults /></ModernLayout>} />
        <Route path="/question-bank" element={<ModernLayout><QuestionBank /></ModernLayout>} />
        <Route path="/view-quizzes" element={<ModernLayout><ViewQuizzes /></ModernLayout>} />
        <Route path="/quiz-attempt/:id" element={<ModernLayout><QuizAttempt/></ModernLayout>} />
        <Route path="/edit-quiz/:id" element={<ModernLayout><EditQuiz /></ModernLayout>} />
        <Route path="/charts" element={<ModernLayout><Charts /></ModernLayout>} />

        
      </Routes>

      {/* Global Chat FAB */}
      {currentUser && !isChatOpen && (
        <motion.button
          initial={{ scale: 0, rotate: -45 }}
          animate={{ scale: 1, rotate: 0 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsChatOpen(true)}
          className="fixed bottom-6 right-6 w-14 h-14 rounded-full flex items-center justify-center text-white shadow-2xl z-[1500]"
          style={{ background: 'linear-gradient(135deg, #4f46e5, #c026d3)' }}
        >
          <MessageCircle size={28} />
          {/* Unread indicator placeholder */}
          <div className="absolute top-0 right-0 w-4 h-4 bg-red-500 rounded-full border-2 border-[#0b0b10]"></div>
        </motion.button>
      )}

      <AnimatePresence>
        {isChatOpen && currentUser && globalSocket && (
          <ChatSidebar 
            currentUser={currentUser} 
            receiverEmail={chatReceiver} 
            socket={globalSocket}
            onClose={() => setIsChatOpen(false)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}

