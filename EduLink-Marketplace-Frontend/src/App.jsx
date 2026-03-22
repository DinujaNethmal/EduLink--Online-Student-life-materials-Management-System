// ============================================================
// App.jsx — Root Application Component
// ============================================================
// Defines the client-side routing for the entire app.
// Uses ProtectedRoute for authenticated pages and
// AdminRoute for the admin dashboard (role === "admin").
// ============================================================

import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import ProductDetail from "./pages/ProductDetail";
import CartPage from "./pages/CartPage";
import OrderSuccess from "./pages/OrderSuccess";
import OrderHistory from "./pages/OrderHistory";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CreateProduct from "./pages/CreateProduct";
import EditProduct from "./pages/EditProduct";
import MyListings from "./pages/MyListings";
import Profile from "./pages/Profile";
import AdminDashboard from "./pages/AdminDashboard";
import ConfirmOrder from "./pages/ConfirmOrder";
import "./App.css";

// Wrapper that redirects to login if not authenticated
function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  return user ? children : <Navigate to="/login" />;
}

// Wrapper that requires admin role
function AdminRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" />;
  if (user.role !== "admin") return <Navigate to="/" />;
  return children;
}

function App() {
  return (
    <div className="app">
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/confirm-order" element={<ConfirmOrder />} />
          <Route path="/order-success/:orderId" element={<OrderSuccess />} />
          <Route path="/orders" element={<OrderHistory />} />
          <Route path="/sell" element={<ProtectedRoute><CreateProduct /></ProtectedRoute>} />
          <Route path="/edit-product/:id" element={<ProtectedRoute><EditProduct /></ProtectedRoute>} />
          <Route path="/my-listings" element={<ProtectedRoute><MyListings /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
