import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

// Unified navbar (always visible)
import Navbar from "./components/Navbar";

// Dinuja's pages (main site)
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import DinujaProfile from "./pages/Profile";
import FindingGroups from "./pages/FindingGroups";

// Unified admin dashboard
import AdminDashboard from "./pages/AdminDashboard";

// Tarini's marketplace pages (under /marketplace)
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

// Sahlaan's payment pages
import CreditCardPayment from "./pages/marketplace/CreditCardPayment";
import BankTransfer from "./pages/marketplace/BankTransfer";

import "./App.css";

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

function App() {
  const location = useLocation();

  // Pages where the navbar should NOT appear (admin has its own header)
  const hideNavbar = location.pathname === "/admin";

  return (
    <div className="app">
      {/* Single unified navbar across the entire site */}
      {!hideNavbar && <Navbar />}

      <main className={hideNavbar ? "" : "main-content"}>
        <Routes>
          {/* ===== Main Site Routes ===== */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/profile" element={<DinujaProfile />} />
          <Route path="/finding-groups" element={<FindingGroups />} />
          <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />

          {/* ===== Marketplace Routes ===== */}
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

          {/* ===== Payment Routes ===== */}
          <Route path="/marketplace/payment/credit-card/:orderId" element={<CreditCardPayment />} />
          <Route path="/marketplace/payment/bank-transfer/:orderId" element={<BankTransfer />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
