// ============================================================
// models/Product.js — Product Schema (Mongoose Model)
// ============================================================
// Defines the shape of a "Product" document in MongoDB.
// A Product represents an item that a SLIIT student is selling
// on the marketplace (e.g., a textbook, calculator, hoodie).
// ============================================================

const mongoose = require("mongoose");

// Define the schema (structure) for products in the database
const productSchema = new mongoose.Schema(
  {
    // --- Basic product info ---

    name: {
      type: String,
      required: [true, "Product name is required"], // Custom error message if missing
      trim: true, // Automatically remove leading/trailing whitespace
    },
    description: {
      type: String,
      required: [true, "Product description is required"],
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"], // Validation: price must be >= 0
    },
    image: {
      type: String,
      default: "", // Empty string = no image uploaded; frontend shows a placeholder
    },

    // --- Category (used for filtering on the frontend) ---
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: [
        // Only these values are allowed (enforced by MongoDB)
        "Textbooks",
        "Electronics",
        "Stationery",
        "Clothing",
        "Food & Drinks",
        "Services",
        "Other",
      ],
    },

    // --- Seller info ---
    // Who is selling this item (just a user ID string for now)
    // When authentication is added, this can be linked to a User model
    sellerId: {
      type: String,
      required: [true, "Seller ID is required"],
    },
    sellerName: {
      type: String,
      required: [true, "Seller name is required"],
    },

    // --- Item condition (buyers want to know how used it is) ---
    condition: {
      type: String,
      enum: ["New", "Like New", "Used - Good", "Used - Fair"],
      default: "Used - Good",
    },

    // --- Inventory tracking ---
    stock: {
      type: Number,
      default: 1,                          // Most students sell just 1 item
      min: [0, "Stock cannot be negative"],
    },
    isAvailable: {
      type: Boolean,
      default: true, // Set to false when stock reaches 0 (auto-managed by order controller)
    },
  },
  {
    // Automatically adds createdAt and updatedAt timestamp fields to every document
    timestamps: true,
  }
);

// Export the model so it can be used in controllers (e.g., Product.find(), Product.create())
module.exports = mongoose.model("Product", productSchema);
