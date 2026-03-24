// ============================================================
// models/Order.js — Order Schema (Mongoose Model)
// ============================================================
// Defines the structure of a purchase in MongoDB.
// An Order is created when a user clicks "Buy Now" (single item)
// or "Checkout" (entire cart). It stores a SNAPSHOT of the items
// at the time of purchase — so the order history stays accurate
// even if a seller later changes or deletes their product.
//
// New orders start with status "Awaiting Payment" and paymentStatus "pending".
// The payment module is responsible for updating these fields and
// deducting product stock after successful payment.
// ============================================================

const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    // Which user placed this order
    userId: {
      type: String,
      required: [true, "User ID is required"],
    },

    // Snapshot of items at the time of purchase
    // We copy product details (name, price, image) into the order so that
    // the order history remains accurate even if products are later modified/deleted
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",       // Reference to the original product (may be deleted later)
          required: true,
        },
        name: { type: String, required: true },     // Product name at time of purchase
        price: { type: Number, required: true },     // Price per unit at time of purchase
        quantity: { type: Number, required: true, min: 1 }, // How many were bought
        image: { type: String, default: "" },        // Product image URL
      },
    ],

    // Total price for the entire order (sum of price * quantity for all items)
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },

    // Order lifecycle status — can be updated as the order progresses
    status: {
      type: String,
      enum: ["Awaiting Payment", "Confirmed", "Delivered", "Cancelled"],
      default: "Awaiting Payment", // Orders start here until payment module confirms
    },

    // Payment status — managed by the payment module.
    // The payment module should update this to "paid" after successful payment,
    // then also update status to "Confirmed" and deduct product stock.
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "pending",
    },

    // How the order was created — helps distinguish in order history
    orderType: {
      type: String,
      enum: ["buy-now", "cart-checkout"], // "buy-now" = single item, "cart-checkout" = from cart
      required: true,
    },
  },
  {
    // Automatically adds createdAt and updatedAt fields
    timestamps: true,
  }
);

// Export the Order model for use in the order controller
module.exports = mongoose.model("Order", orderSchema);
