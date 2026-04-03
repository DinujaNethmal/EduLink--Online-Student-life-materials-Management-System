import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  FiShoppingCart, FiMenu, FiX, FiPlusCircle,
  FiLogOut, FiUser, FiShield, FiHome, FiUsers,
  FiList, FiPackage, FiCreditCard
} from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import { getCart } from "../services/api";
import "./Navbar.css";

function Navbar() {
  const [cartCount, setCartCount] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const isMarketplace = location.pathname.startsWith("/marketplace");

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

  const close = () => setMenuOpen(false);
  const isActive = (path) => location.pathname === path ? "active" : "";

  return (
    <nav className="navbar">
      <div className="navbar-inner container">
        {/* Brand */}
        <Link to="/" className="navbar-brand" onClick={close}>
          <div className="brand-logo">
            <span className="brand-icon">EL</span>
          </div>
          <div className="brand-text">
            <span className="brand-name">EduLink</span>
            <span className="brand-tagline">Student Platform</span>
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
          {/* ── Main Site Links ── */}
          <Link to="/" className={`nav-link ${isActive("/")}`} onClick={close}>
            <FiHome size={16} /> Home
          </Link>
          <Link to="/profile" className={`nav-link ${isActive("/profile")}`} onClick={close}>
            <FiUser size={16} /> Profile
          </Link>
          <Link to="/finding-groups" className={`nav-link ${isActive("/finding-groups")}`} onClick={close}>
            <FiUsers size={16} /> Groups
          </Link>

          {/* ── Marketplace Section ── */}
          <span className="nav-divider">|</span>

          <Link
            to="/marketplace"
            className={`nav-link marketplace-link ${isMarketplace ? "active" : ""}`}
            onClick={close}
          >
            <FiPackage size={16} /> Marketplace
          </Link>

          {/* Cart, Sell, Listings, Orders — only visible on marketplace pages */}
          {isMarketplace && (
            <>
              <Link to="/marketplace/cart" className="nav-link cart-link" onClick={close}>
                <FiShoppingCart size={18} />
                <span>Cart</span>
                {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
              </Link>
              {user && (
                <>
                  <Link to="/marketplace/sell" className={`nav-link ${isActive("/marketplace/sell")}`} onClick={close}>
                    <FiPlusCircle size={16} /> Sell
                  </Link>
                  <Link to="/marketplace/my-listings" className={`nav-link ${isActive("/marketplace/my-listings")}`} onClick={close}>
                    <FiList size={16} /> Listings
                  </Link>
                  <Link to="/marketplace/orders" className={`nav-link ${isActive("/marketplace/orders")}`} onClick={close}>
                    <FiCreditCard size={16} /> Orders
                  </Link>
                </>
              )}
            </>
          )}

          {/* ── Auth / Admin ── */}
          <span className="nav-divider">|</span>

          {user ? (
            <>
              {user.role === "admin" && (
                <Link to="/admin" className={`nav-link admin-link ${isActive("/admin")}`} onClick={close}>
                  <FiShield size={16} /> Admin
                </Link>
              )}
              <span className="nav-user-name">Hi, {user.name}</span>
              <button className="nav-link logout-btn" onClick={handleLogout}>
                <FiLogOut size={16} /> Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className={`nav-link ${isActive("/login")}`} onClick={close}>
                Sign In
              </Link>
              <Link to="/register" className="btn btn-gold btn-sm" onClick={close}>
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
