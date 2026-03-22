// ============================================================
// routes/adminRoutes.js — Admin API Route Definitions
// ============================================================
// All routes require authentication + admin role.
//
// Route summary:
//   GET    /api/admin/stats          → Dashboard statistics
//   GET    /api/admin/users          → List all users
//   DELETE /api/admin/users/:id      → Delete a user + their listings
//   PUT    /api/admin/users/:id/role → Change user role
//   GET    /api/admin/products       → List all products
//   DELETE /api/admin/products/:id   → Delete any product
// ============================================================

const express = require("express");
const router = express.Router();
const { protect, adminOnly } = require("../middleware/auth");
const {
  getStats,
  getUsers,
  deleteUser,
  updateUserRole,
  getAllProducts,
  adminDeleteProduct,
} = require("../controllers/adminController");

// All admin routes require authentication + admin role
router.use(protect, adminOnly);

router.get("/stats", getStats);
router.get("/users", getUsers);
router.delete("/users/:id", deleteUser);
router.put("/users/:id/role", updateUserRole);
router.get("/products", getAllProducts);
router.delete("/products/:id", adminDeleteProduct);

module.exports = router;
