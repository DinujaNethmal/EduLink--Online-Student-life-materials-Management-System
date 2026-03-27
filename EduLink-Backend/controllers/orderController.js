// ============================================================
// controllers/orderController.js — Order Processing Logic
// ============================================================
// Handles order creation and retrieval:
//   - buyNow: Instantly buy a single product (skips the cart)
//   - checkout: Buy everything in the user's cart at once
//   - getOrders: Retrieve a user's order history
//   - getOrderById: Get details of a specific order
//
// IMPORTANT: Both buyNow and checkout:
//   1. Validate product availability and stock
//   2. Create an order with a SNAPSHOT of product data
//   3. Order starts with status "Awaiting Payment" / paymentStatus "pending"
//
// NOTE: Stock is NOT deducted at order creation. The payment module
// is responsible for deducting stock after successful payment.
// ============================================================

const Order = require("../models/Order");
const Cart = require("../models/Cart");
const Product = require("../models/Product");

/**
 * POST /api/orders/buy-now
 * Instantly purchase a single product (bypasses the cart).
 *
 * Request body: { userId, productId, quantity }
 *
 * Flow:
 *   1. Validate the product exists, is available, and has enough stock
 *   2. Create an Order document with a snapshot of the product data
 *      (status: "Awaiting Payment", paymentStatus: "pending")
 *
 * NOTE: Stock is NOT deducted here — the payment module handles that.
 */
const buyNow = async (req, res) => {
  try {
    const { userId, productId, quantity = 1 } = req.body;

    // Validate required fields
    if (!userId || !productId) {
      return res.status(400).json({ message: "userId and productId are required" });
    }

    // Fetch the product and run availability checks
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    if (!product.isAvailable) {
      return res.status(400).json({ message: "Product is no longer available" });
    }
    if (product.stock < quantity) {
      return res.status(400).json({ message: "Not enough stock available" });
    }

    // Calculate total and create the order
    // We store product details (name, price, image) directly in the order
    // so the order history remains accurate even if the product is later changed/deleted
    const totalAmount = product.price * quantity;
    const order = new Order({
      userId,
      items: [
        {
          product: product._id,    // Reference to the original product
          name: product.name,      // Snapshot: product name at purchase time
          price: product.price,    // Snapshot: price at purchase time
          quantity,
          image: product.image,    // Snapshot: image URL at purchase time
        },
      ],
      totalAmount: Math.round(totalAmount * 100) / 100, // Round to 2 decimals
      orderType: "buy-now", // Indicates this was a direct purchase, not cart checkout
    });

    await order.save();

    // NOTE: Stock is NOT deducted here. The payment module should deduct stock
    // after confirming payment (update paymentStatus → "paid", status → "Confirmed",
    // then deduct stock and mark unavailable if stock reaches 0).

    res.status(201).json({
      message: "Order placed successfully!",
      order,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to place order", error: error.message });
  }
};

/**
 * POST /api/orders/checkout
 * Purchase everything in the user's shopping cart.
 *
 * Request body: { userId }
 *
 * Flow:
 *   1. Fetch the user's cart with full product details
 *   2. Validate EVERY item is still available and has sufficient stock
 *   3. Create an Order with snapshots of all items
 *      (status: "Awaiting Payment", paymentStatus: "pending")
 *   4. Clear the user's cart after successful checkout
 *
 * NOTE: Stock is NOT deducted here — the payment module handles that.
 */
const checkout = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ message: "userId is required" });
    }

    // Fetch the user's cart and populate product details for each item
    const cart = await Cart.findOne({ userId }).populate("items.product");
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    // --- Validation pass: Check every item before creating the order ---
    const orderItems = []; // Will hold the snapshot data for each item
    let totalAmount = 0;

    for (const item of cart.items) {
      // Check: product still exists in database?
      if (!item.product) {
        return res
          .status(400)
          .json({ message: "A product in your cart no longer exists" });
      }
      // Check: product still marked as available?
      if (!item.product.isAvailable) {
        return res.status(400).json({
          message: `"${item.product.name}" is no longer available`,
        });
      }
      // Check: enough stock for the requested quantity?
      if (item.product.stock < item.quantity) {
        return res.status(400).json({
          message: `Not enough stock for "${item.product.name}". Available: ${item.product.stock}`,
        });
      }

      // Build the snapshot for this order item
      orderItems.push({
        product: item.product._id,
        name: item.product.name,
        price: item.product.price,
        quantity: item.quantity,
        image: item.product.image,
      });

      // Accumulate the running total
      totalAmount += item.product.price * item.quantity;
    }

    // --- Create the order ---
    const order = new Order({
      userId,
      items: orderItems,
      totalAmount: Math.round(totalAmount * 100) / 100,
      orderType: "cart-checkout", // Indicates this came from the cart
    });

    await order.save();

    // NOTE: Stock is NOT deducted here. The payment module should deduct stock
    // after confirming payment (update paymentStatus → "paid", status → "Confirmed",
    // then deduct stock and mark unavailable if stock reaches 0).

    // --- Clear the cart after successful checkout ---
    cart.items = [];
    await cart.save();

    res.status(201).json({
      message: "Checkout successful! Order placed.",
      order,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to checkout", error: error.message });
  }
};

/**
 * GET /api/orders/:userId
 * Retrieve all orders for a specific user (order history).
 * Returns orders sorted by newest first.
 */
const getOrders = async (req, res) => {
  try {
    const { userId } = req.params;

    // Find all orders for this user, newest first
    const orders = await Order.find({ userId }).sort({ createdAt: -1 });

    res.json({ orders });
  } catch (error) {
    res.status(500).json({ message: "Failed to get orders", error: error.message });
  }
};

/**
 * GET /api/orders/detail/:orderId
 * Retrieve a single order by its ID.
 * Used to display order confirmation/details after purchase.
 */
const getOrderById = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json({ order });
  } catch (error) {
    res.status(500).json({ message: "Failed to get order", error: error.message });
  }
};

// Export all order controller functions for use in routes
module.exports = { buyNow, checkout, getOrders, getOrderById };
