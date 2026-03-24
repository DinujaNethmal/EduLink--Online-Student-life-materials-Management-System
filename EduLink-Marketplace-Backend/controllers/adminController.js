// ============================================================
// controllers/adminController.js — Admin Dashboard Operations
// ============================================================
// Handles admin-only actions: viewing stats, managing users
// (list, delete, change roles), and managing all products.
//
// All routes require authentication + admin role.
//
// Route summary:
//   GET    /api/admin/stats          → Dashboard statistics
//   GET    /api/admin/users          → List all users
//   DELETE /api/admin/users/:id      → Delete a user + their listings
//   PUT    /api/admin/users/:id/role → Change user role (user ↔ admin)
//   GET    /api/admin/products       → List all products
//   DELETE /api/admin/products/:id   → Delete any product
// ============================================================

const User = require("../models/User");
const Product = require("../models/Product");
const Order = require("../models/Order");

/**
 * GET /api/admin/stats
 * Dashboard summary statistics.
 */
const getStats = async (req, res) => {
  try {
    const [userCount, productCount, orderCount] = await Promise.all([
      User.countDocuments(),
      Product.countDocuments(),
      Order.countDocuments(),
    ]);

    res.json({ stats: { users: userCount, products: productCount, orders: orderCount } });
  } catch (error) {
    res.status(500).json({ message: "Failed to load stats", error: error.message });
  }
};

/**
 * GET /api/admin/users
 * List all registered users (excluding passwords).
 */
const getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.json({ users });
  } catch (error) {
    res.status(500).json({ message: "Failed to load users", error: error.message });
  }
};

/**
 * DELETE /api/admin/users/:id
 * Delete a user and all their product listings.
 * Admins cannot delete themselves.
 */
const deleteUser = async (req, res) => {
  try {
    if (req.params.id === req.user._id.toString()) {
      return res.status(400).json({ message: "Cannot delete your own admin account" });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Remove all products listed by this user
    await Product.deleteMany({ sellerId: req.params.id });

    await User.findByIdAndDelete(req.params.id);

    res.json({ message: `User "${user.name}" deleted` });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete user", error: error.message });
  }
};

/**
 * PUT /api/admin/users/:id/role
 * Change a user's role (user ↔ admin).
 */
const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    if (!["user", "admin"].includes(role)) {
      return res.status(400).json({ message: "Role must be 'user' or 'admin'" });
    }

    if (req.params.id === req.user._id.toString()) {
      return res.status(400).json({ message: "Cannot change your own role" });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: `Role updated to "${role}"`, user });
  } catch (error) {
    res.status(500).json({ message: "Failed to update role", error: error.message });
  }
};

/**
 * GET /api/admin/products
 * List ALL products (including unavailable ones).
 */
const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json({ products });
  } catch (error) {
    res.status(500).json({ message: "Failed to load products", error: error.message });
  }
};

/**
 * DELETE /api/admin/products/:id
 * Admin can delete any product.
 */
const adminDeleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json({ message: `Product "${product.name}" deleted` });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete product", error: error.message });
  }
};

module.exports = {
  getStats,
  getUsers,
  deleteUser,
  updateUserRole,
  getAllProducts,
  adminDeleteProduct,
};
