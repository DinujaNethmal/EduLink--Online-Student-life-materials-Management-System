// ============================================================
// pages/AdminDashboard.jsx — Admin Dashboard Page
// ============================================================
// Restricted to users with role "admin". Provides:
//   - Summary stat cards (users, products, orders)
//   - Tabbed views for managing users and products
//   - Promote/demote user roles, delete users
//   - Delete any product listing
// ============================================================

import { useState, useEffect } from "react";
import { FiUsers, FiPackage, FiShoppingBag, FiTrash2, FiShield, FiUser } from "react-icons/fi";
import toast from "react-hot-toast";
import {
  getAdminStats,
  getAdminUsers,
  adminDeleteUser,
  adminUpdateUserRole,
  getAdminProducts,
  adminDeleteProduct,
} from "../services/api";
import "./AdminDashboard.css";

function AdminDashboard() {
  const [tab, setTab] = useState("users");
  const [stats, setStats] = useState({ users: 0, products: 0, orders: 0 });
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [statsRes, usersRes, productsRes] = await Promise.all([
        getAdminStats(),
        getAdminUsers(),
        getAdminProducts(),
      ]);
      setStats(statsRes.data.stats);
      setUsers(usersRes.data.users);
      setProducts(productsRes.data.products);
    } catch {
      toast.error("Failed to load admin data");
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
      setUsers((prev) =>
        prev.map((u) => (u._id === id ? { ...u, role: newRole } : u))
      );
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

  if (loading) return <div className="admin-page container"><p>Loading dashboard...</p></div>;

  return (
    <div className="admin-page container">
      <h1 className="page-title">Admin Dashboard</h1>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <FiUsers size={28} />
          <div>
            <span className="stat-number">{stats.users}</span>
            <span className="stat-label">Users</span>
          </div>
        </div>
        <div className="stat-card">
          <FiPackage size={28} />
          <div>
            <span className="stat-number">{stats.products}</span>
            <span className="stat-label">Products</span>
          </div>
        </div>
        <div className="stat-card">
          <FiShoppingBag size={28} />
          <div>
            <span className="stat-number">{stats.orders}</span>
            <span className="stat-label">Orders</span>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="admin-tabs">
        <button
          className={`tab-btn ${tab === "users" ? "active" : ""}`}
          onClick={() => setTab("users")}
        >
          <FiUsers size={16} /> Users ({users.length})
        </button>
        <button
          className={`tab-btn ${tab === "products" ? "active" : ""}`}
          onClick={() => setTab("products")}
        >
          <FiPackage size={16} /> Products ({products.length})
        </button>
      </div>

      {/* Users Tab */}
      {tab === "users" && (
        <div className="admin-table-wrapper">
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
                    <button
                      className="btn btn-sm btn-outline"
                      onClick={() => handleToggleRole(u._id, u.role)}
                      title={u.role === "admin" ? "Demote to user" : "Promote to admin"}
                    >
                      {u.role === "admin" ? "Demote" : "Promote"}
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDeleteUser(u._id, u.name)}
                      title="Delete user"
                    >
                      <FiTrash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Products Tab */}
      {tab === "products" && (
        <div className="admin-table-wrapper">
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
                  <td>LKR {p.price.toLocaleString()}</td>
                  <td>{p.stock}</td>
                  <td>
                    <span className={`status-badge ${p.isAvailable ? "available" : "unavailable"}`}>
                      {p.isAvailable ? "Available" : "Sold Out"}
                    </span>
                  </td>
                  <td className="actions-cell">
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDeleteProduct(p._id, p.name)}
                      title="Delete product"
                    >
                      <FiTrash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
