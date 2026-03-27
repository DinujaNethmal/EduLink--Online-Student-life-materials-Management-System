// ============================================================
// routes/orderRoutes.js — Order API Route Definitions
// ============================================================
// Maps HTTP methods + URL paths to the order controller functions.
// All routes here are prefixed with /api/orders (set in server.js).
//
// Route summary:
//   POST   /api/orders/buy-now          → Buy a single product instantly
//   POST   /api/orders/checkout         → Checkout the entire cart
//   GET    /api/orders/:userId          → Get order history for a user
//   GET    /api/orders/detail/:orderId  → Get a specific order's details
// ============================================================

const express = require("express");
const router = express.Router();

// Import order controller functions
const {
  buyNow,
  checkout,
  getOrders,
  getOrderById,
} = require("../controllers/orderController");

// Define routes

router.post("/buy-now", buyNow);             // Instant single-product purchase (body: userId, productId, quantity)
router.post("/checkout", checkout);          // Cart checkout — buy all cart items (body: userId)
router.get("/detail/:orderId", getOrderById); // Fetch one specific order by its ID (must be before /:userId)
router.get("/:userId", getOrders);           // Fetch all orders for a user (order history)

// Export the router for server.js
module.exports = router;
