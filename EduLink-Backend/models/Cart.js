// ============================================================
// models/Cart.js — Shopping Cart Schema (Mongoose Model)
// ============================================================
// Defines the structure of a user's shopping cart in MongoDB.
// Each user has exactly ONE cart (enforced by the unique userId).
// The cart holds an array of items, where each item references
// a Product and tracks the desired quantity.
// ============================================================

const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema(
  {
    // Which user owns this cart — one cart per user (unique constraint)
    userId: {
      type: String,
      required: [true, "User ID is required"],
      unique: true, // Ensures only one cart document exists per user
    },

    // Array of items in the cart
    items: [
      {
        // Reference to the Product document in the "products" collection
        // Using ObjectId + ref allows us to use .populate() to fetch full product details
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product", // Tells Mongoose which model to look up when populating
          required: true,
        },
        // How many of this product the user wants to buy
        quantity: {
          type: Number,
          required: true,
          min: [1, "Quantity must be at least 1"],
          default: 1,
        },
      },
    ],
  },
  {
    // Automatically adds createdAt and updatedAt fields
    timestamps: true,
  }
);

// Export the Cart model for use in the cart controller
module.exports = mongoose.model("Cart", cartSchema);
