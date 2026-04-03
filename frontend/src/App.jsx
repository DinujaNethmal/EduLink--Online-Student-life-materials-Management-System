import React, { useState, useEffect } from "react";
import { Routes, Route, useNavigate, useLocation, Navigate } from "react-router-dom";
import { io } from "socket.io-client";
import { AnimatePresence, motion } from "framer-motion";
import { MessageCircle } from "lucide-react";
import { useAuth } from "./context/AuthContext";

// Components
import ModernLayout from "./components/ModernLayout.jsx";
import ChatSidebar from "./components/ChatSidebar.jsx";

// Pages
import Home from "./pages/Home.jsx";
import Register from "./pages/Register.jsx";
import Login from "./pages/Login.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import Profile from "./pages/Profile.jsx";
import FindingGroups from "./pages/FindingGroups.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";

// Quiz Components
import QuizForm from "./pages/QuizComponents/QuizForm.jsx";
import QuizResults from "./pages/QuizComponents/QuizResults.jsx";
import QuestionBank from "./pages/QuizComponents/QuestionBank.jsx"; 
import ViewQuizzes from "./pages/QuizComponents/ViewQuizzes.jsx";
import QuizAttempt from "./pages/QuizComponents/QuizAttempt.jsx";
import EditQuiz from "./pages/QuizComponents/EditQuiz.jsx";
import Charts from "./pages/QuizComponents/Charts.jsx";

// Marketplace Pages
import MarketplaceHome from "./pages/marketplace/Home";
import ProductDetail from "./pages/marketplace/ProductDetail";
import CartPage from "./pages/marketplace/CartPage";
import ConfirmOrder from "./pages/marketplace/ConfirmOrder";
import OrderSuccess from "./pages/marketplace/OrderSuccess";
import OrderHistory from "./pages/marketplace/OrderHistory";
import CreateProduct from "./pages/marketplace/CreateProduct";
import EditProduct from "./pages/marketplace/EditProduct";
import MyListings from "./pages/marketplace/MyListings";
import MarketplaceProfile from "./pages/marketplace/Profile";

// Payment Pages
import CreditCardPayment from "./pages/marketplace/CreditCardPayment";
import BankTransfer from "./pages/marketplace/BankTransfer";

import "./App.css";

// Route Guards
function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  return user ? children : <Navigate to="/login" />;
}

function AdminRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" />;
  if (user.role !== "admin") return <Navigate to="/" />;
  return children;
}

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user: currentUserData } = useAuth();

  // --- GLOBAL CHAT STATE ---
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatReceiver, setChatReceiver] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const [globalSocket, setGlobalSocket] = useState(null);

  useEffect(() => {
    // Sync current user from AuthContext or LocalStorage
    const userStr = localStorage.getItem('currentUser');
    if (userStr || currentUserData) {
      try {
        const user = currentUserData || JSON.parse(userStr);
        setCurrentUser(user);

        // Listen for new messages globally
        const socket = io('http://localhost:5000');
        setGlobalSocket(socket);
        socket.emit('join', user.email);

        socket.on('receiveMessage', (data) => {
          if (data.receiver === user.email) {
            setChatReceiver(""); // Reset to force re-fetch of history
            setTimeout(() => {
              setChatReceiver(data.sender);
              setIsChatOpen(true);
            }, 0);
          }
        });

        const handleOpenChat = (e) => {
          setChatReceiver(""); 
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
  }, [currentUserData]);

  return (
    <div className="app-shell">
      <AnimatePresence mode="wait">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, scale: 1.02, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.98, y: -10 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="page-transition-wrapper"
        >
          <Routes location={location}>
            {/* Core Pages */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/finding-groups" element={<FindingGroups />} />

            {/* Admin Dashboard */}
            <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />

            {/* Quiz Routes */}
            <Route path="/quiz-form" element={<ModernLayout><QuizForm /></ModernLayout>} />
            <Route path="/quiz-results" element={<ModernLayout><QuizResults /></ModernLayout>} />
            <Route path="/question-bank" element={<ModernLayout><QuestionBank /></ModernLayout>} />
            <Route path="/view-quizzes" element={<ModernLayout><ViewQuizzes /></ModernLayout>} />
            <Route path="/quiz-attempt/:id" element={<ModernLayout><QuizAttempt/></ModernLayout>} />
            <Route path="/edit-quiz/:id" element={<ModernLayout><EditQuiz /></ModernLayout>} />
            <Route path="/charts" element={<ModernLayout><Charts /></ModernLayout>} />

            {/* Marketplace Routes */}
            <Route path="/marketplace" element={<MarketplaceHome />} />
            <Route path="/marketplace/product/:id" element={<ProductDetail />} />
            <Route path="/marketplace/cart" element={<CartPage />} />
            <Route path="/marketplace/confirm-order" element={<ConfirmOrder />} />
            <Route path="/marketplace/order-success/:orderId" element={<OrderSuccess />} />
            <Route path="/marketplace/orders" element={<OrderHistory />} />
            <Route path="/marketplace/sell" element={<ProtectedRoute><CreateProduct /></ProtectedRoute>} />
            <Route path="/marketplace/edit-product/:id" element={<ProtectedRoute><EditProduct /></ProtectedRoute>} />
            <Route path="/marketplace/my-listings" element={<ProtectedRoute><MyListings /></ProtectedRoute>} />
            <Route path="/marketplace/profile" element={<ProtectedRoute><MarketplaceProfile /></ProtectedRoute>} />

            {/* Payment Routes */}
            <Route path="/marketplace/payment/credit-card/:orderId" element={<CreditCardPayment />} />
            <Route path="/marketplace/payment/bank-transfer/:orderId" element={<BankTransfer />} />
          </Routes>
        </motion.div>
      </AnimatePresence>

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
