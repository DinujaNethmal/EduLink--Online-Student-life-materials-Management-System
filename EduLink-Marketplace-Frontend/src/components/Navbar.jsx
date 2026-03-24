// ============================================================
// components/Navbar.jsx — Top Navigation Bar
// ============================================================
// Responsive navbar with mobile hamburger menu.
// Shows different links based on auth state:
//   - Always: Browse, Cart (with badge count)
//   - Logged in: Sell, My Listings, My Orders, Profile, Logout
//   - Admin: Admin dashboard link (gold shield icon)
//   - Guest: Sign In, Register
// ============================================================

import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FiShoppingCart, FiMenu, FiX, FiPlusCircle, FiLogOut, FiUser, FiShield } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import { getCart } from "../services/api";
import "./Navbar.css";

function Navbar() {
  const [cartCount, setCartCount] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  // Fetch cart count for both logged-in users and guests
  useEffect(() => {
    const fetchCartCount = async () => {
      try {
        const res = await getCart();
        const total = res.data.items.reduce((sum, item) => sum + item.quantity, 0);
        setCartCount(total);
      } catch {
        // Backend might not be running yet
      }
    };
    fetchCartCount();
  }, [location, user]);

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    navigate("/");
  };

  return (
    <nav className="navbar">
      <div className="navbar-inner container">
        <Link to="/" className="navbar-brand">
          <div className="brand-logo">
            <span className="brand-icon">S</span>
          </div>
          <div className="brand-text">
            <span className="brand-name">EduLink</span>
            <span className="brand-tagline">Student Marketplace</span>
          </div>
        </Link>

        <button
          className="menu-toggle"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>

        <div className={`navbar-links ${menuOpen ? "open" : ""}`}>
          <Link
            to="/"
            className={`nav-link ${location.pathname === "/" ? "active" : ""}`}
            onClick={() => setMenuOpen(false)}
          >
            Browse
          </Link>

          {/* Cart link — always visible for guests and logged-in users */}
          <Link
            to="/cart"
            className="nav-link cart-link"
            onClick={() => setMenuOpen(false)}
          >
            <FiShoppingCart size={20} />
            <span>Cart</span>
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </Link>

          {user ? (
            <>
              <Link
                to="/sell"
                className={`nav-link ${location.pathname === "/sell" ? "active" : ""}`}
                onClick={() => setMenuOpen(false)}
              >
                <FiPlusCircle size={16} /> Sell
              </Link>
              <Link
                to="/my-listings"
                className={`nav-link ${location.pathname === "/my-listings" ? "active" : ""}`}
                onClick={() => setMenuOpen(false)}
              >
                My Listings
              </Link>
              <Link
                to="/orders"
                className={`nav-link ${location.pathname === "/orders" ? "active" : ""}`}
                onClick={() => setMenuOpen(false)}
              >
                My Orders
              </Link>
              {user.role === "admin" && (
                <Link
                  to="/admin"
                  className={`nav-link admin-link ${location.pathname === "/admin" ? "active" : ""}`}
                  onClick={() => setMenuOpen(false)}
                >
                  <FiShield size={16} /> Admin
                </Link>
              )}
              <Link
                to="/profile"
                className={`nav-link ${location.pathname === "/profile" ? "active" : ""}`}
                onClick={() => setMenuOpen(false)}
              >
                <FiUser size={16} /> Profile
              </Link>
              <button className="nav-link logout-btn" onClick={handleLogout}>
                <FiLogOut size={16} /> Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className={`nav-link ${location.pathname === "/login" ? "active" : ""}`}
                onClick={() => setMenuOpen(false)}
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="btn btn-gold btn-sm"
                onClick={() => setMenuOpen(false)}
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
