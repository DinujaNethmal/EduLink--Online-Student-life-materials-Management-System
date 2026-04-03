import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FiUsers, FiPackage, FiShoppingBag, FiTrash2, FiShield, FiUser, FiHome } from "react-icons/fi";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import {
  getAdminStats,
  getAdminUsers,
  adminDeleteUser,
  adminUpdateUserRole,
  getAdminProducts,
  adminDeleteProduct,
  getAdminDashboardSummary,
} from "../services/api";
import DashboardOverview from "./AdminDashboard/DashboardOverview";
import MarketplaceAnalytics from "./AdminDashboard/MarketplaceAnalytics";
import QuizAnalytics from "./AdminDashboard/QuizAnalytics";
import StudentProgress from "./AdminDashboard/StudentProgress";
import "./AdminDashboard.css";

function AdminDashboard() {
  const [tab, setTab] = useState("overview");
  const [stats, setStats] = useState({ users: 0, products: 0, orders: 0 });
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [statsRes, usersRes, productsRes, summaryRes] = await Promise.all([
        getAdminStats().catch(() => ({ data: { stats: { users: 0, products: 0, orders: 0 } } })),
        getAdminUsers().catch(() => ({ data: { users: [] } })),
        getAdminProducts().catch(() => ({ data: { products: [] } })),
        getAdminDashboardSummary().catch(() => ({ data: { data: null } })),
      ]);
      setStats(statsRes.data.stats);
      setUsers(usersRes.data.users);
      setProducts(productsRes.data.products);
      setDashboardData(summaryRes.data.data);
      setError("");
    } catch {
      setError("Failed to load admin data");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (id, name) => {
    if (!window.confirm(`Delete user "${name}" and all their listings?`)) return;
    try {
      await adminDeleteUser(id);
      toast.success(`User "${name}" deleted`);
      setUsers((prev) => prev.filter((u) => u._id !== id));
      setStats((prev) => ({ ...prev, users: prev.users - 1 }));
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete user");
    }
  };

  const handleToggleRole = async (id, currentRole) => {
    const newRole = currentRole === "admin" ? "user" : "admin";
    try {
      await adminUpdateUserRole(id, newRole);
      toast.success(`Role changed to "${newRole}"`);
      setUsers((prev) => prev.map((u) => (u._id === id ? { ...u, role: newRole } : u)));
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update role");
    }
  };

  const handleDeleteProduct = async (id, name) => {
    if (!window.confirm(`Delete product "${name}"?`)) return;
    try {
      await adminDeleteProduct(id);
      toast.success(`Product "${name}" deleted`);
      setProducts((prev) => prev.filter((p) => p._id !== id));
      setStats((prev) => ({ ...prev, products: prev.products - 1 }));
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete product");
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="admin-dashboard">
      {/* Header */}
      <header className="admin-header">
        <div className="header-content">
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <Link to="/" style={{ color: "#94a3b8", textDecoration: "none", display: "flex", alignItems: "center", gap: "0.4rem" }}>
              <FiHome size={18} /> EduLink
            </Link>
            <span style={{ color: "#475569" }}>|</span>
            <h1 style={{ margin: 0 }}>Admin Dashboard</h1>
          </div>
          <div className="admin-info">
            <span>Welcome, {user?.name || "Admin"}</span>
            <button onClick={handleLogout} className="logout-btn">Logout</button>
          </div>
        </div>
      </header>

      {/* Tab Navigation - Merged */}
      <nav className="admin-nav">
        <button className={`nav-btn ${tab === "overview" ? "active" : ""}`} onClick={() => setTab("overview")}>
          Overview
        </button>
        <button className={`nav-btn ${tab === "marketplace" ? "active" : ""}`} onClick={() => setTab("marketplace")}>
          Marketplace Analytics
        </button>
        <button className={`nav-btn ${tab === "quizzes" ? "active" : ""}`} onClick={() => setTab("quizzes")}>
          Quiz Analytics
        </button>
        <button className={`nav-btn ${tab === "progress" ? "active" : ""}`} onClick={() => setTab("progress")}>
          Student Progress
        </button>
        <button className={`nav-btn ${tab === "users" ? "active" : ""}`} onClick={() => setTab("users")}>
          <FiUsers size={14} /> Manage Users ({users.length})
        </button>
        <button className={`nav-btn ${tab === "products" ? "active" : ""}`} onClick={() => setTab("products")}>
          <FiPackage size={14} /> Manage Products ({products.length})
        </button>
      </nav>

      {/* Main Content */}
      <main className="admin-main">
        {error && <div className="error-alert">{error}</div>}

        {/* Dinuja's Analytics Tabs */}
        {tab === "overview" && <DashboardOverview data={dashboardData} loading={loading} />}
        {tab === "marketplace" && <MarketplaceAnalytics />}
        {tab === "quizzes" && <QuizAnalytics />}
        {tab === "progress" && <StudentProgress />}

        {/* Tarini's Management Tabs */}
        {tab === "users" && (
          <div className="admin-table-wrapper" style={{ padding: "1.5rem" }}>
            <h2 style={{ marginBottom: "1rem", color: "#e2e8f0" }}>User Management</h2>
            {loading ? (
              <p>Loading...</p>
            ) : (
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Student ID</th>
                    <th>Role</th>
                    <th>Joined</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u._id}>
                      <td className="name-cell">{u.name}</td>
                      <td>{u.email}</td>
                      <td>{u.studentId || "—"}</td>
                      <td>
                        <span className={`role-badge ${u.role}`}>
                          {u.role === "admin" ? <FiShield size={12} /> : <FiUser size={12} />}
                          {u.role}
                        </span>
                      </td>
                      <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                      <td className="actions-cell">
                        <button className="btn btn-sm btn-outline" onClick={() => handleToggleRole(u._id, u.role)}>
                          {u.role === "admin" ? "Demote" : "Promote"}
                        </button>
                        <button className="btn btn-sm btn-danger" onClick={() => handleDeleteUser(u._id, u.name)}>
                          <FiTrash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {tab === "products" && (
          <div className="admin-table-wrapper" style={{ padding: "1.5rem" }}>
            <h2 style={{ marginBottom: "1rem", color: "#e2e8f0" }}>Product Management</h2>
            {loading ? (
              <p>Loading...</p>
            ) : (
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Seller</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((p) => (
                    <tr key={p._id}>
                      <td className="name-cell">{p.name}</td>
                      <td>{p.sellerName}</td>
                      <td>{p.category}</td>
                      <td>LKR {p.price?.toLocaleString()}</td>
                      <td>{p.stock}</td>
                      <td>
                        <span className={`status-badge ${p.isAvailable ? "available" : "unavailable"}`}>
                          {p.isAvailable ? "Available" : "Sold Out"}
                        </span>
                      </td>
                      <td className="actions-cell">
                        <button className="btn btn-sm btn-danger" onClick={() => handleDeleteProduct(p._id, p.name)}>
                          <FiTrash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </main>

      <footer className="admin-footer">
        <p>&copy; {new Date().getFullYear()} EduLink Administration. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default AdminDashboard;
