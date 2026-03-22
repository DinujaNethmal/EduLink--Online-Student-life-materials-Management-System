// ============================================================
// server.js — Main entry point for the SLIIT Marketplace API
// ============================================================
// This file sets up the Express server, registers all middleware,
// mounts the API routes, and starts listening for requests.
// It also auto-seeds the database with sample products if empty.
// ============================================================

const express = require("express");   // Web framework for building the REST API
const cors = require("cors");         // Allows the React frontend to call this API (Cross-Origin Resource Sharing)
const morgan = require("morgan");     // Logs every HTTP request to the console (e.g., "GET /api/products 200 12ms")
const dotenv = require("dotenv");     // Loads environment variables from the .env file (e.g., PORT, MONGODB_URI)
const connectDB = require("./config/db"); // Our custom function to connect to MongoDB

// Load environment variables from .env file into process.env
dotenv.config();

// Create the Express application instance
const app = express();

// --------------- Middleware ---------------
// Middleware = functions that run on every request BEFORE it reaches the route handler

// Allow requests from the React frontend (runs on a different port during development)
app.use(cors());

// Parse JSON request bodies — when the frontend sends data (e.g., new product),
// this makes it available as req.body
app.use(express.json());

// Log HTTP requests in the console (helpful for debugging)
// "dev" format shows: METHOD URL STATUS RESPONSE_TIME (e.g., "POST /api/cart/add 200 5ms")
app.use(morgan("dev"));

// --------------- API Routes ---------------
// Each route file handles a specific resource (products, cart, orders)
// The first argument is the URL prefix; the second is the router that handles sub-routes

app.use("/api/auth", require("./routes/authRoutes"));         // Auth endpoints (register, login, me)
app.use("/api/admin", require("./routes/adminRoutes"));       // Admin dashboard endpoints
app.use("/api/products", require("./routes/productRoutes")); // All product endpoints start with /api/products
app.use("/api/cart", require("./routes/cartRoutes"));         // All cart endpoints start with /api/cart
app.use("/api/orders", require("./routes/orderRoutes"));      // All order endpoints start with /api/orders

// Health check endpoint — quick way to verify the server is running
// Visit http://localhost:5000/api/health in your browser to test
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "SLIIT Marketplace API is running" });
});

// --------------- Start Server ---------------
// Use the PORT from .env, or default to 5000 if not set
const PORT = process.env.PORT || 5000;

/**
 * startServer — async function that:
 * 1. Connects to MongoDB (or spins up an in-memory DB)
 * 2. Seeds the database with sample products if it's empty
 * 3. Starts the Express server on the configured port
 */
const startServer = async () => {
  // Step 1: Connect to MongoDB (see config/db.js for connection logic)
  await connectDB();

  // Step 2: Auto-seed if database is empty (useful for first run or in-memory mode)
  const Product = require("./models/Product");
  const User = require("./models/User");

  const productCount = await Product.countDocuments();
  if (productCount === 0) {
    console.log("Empty database detected — seeding sample products...");
    const { sampleProducts } = require("./seeds/seedProducts");
    await Product.insertMany(sampleProducts);
    console.log("Database seeded!");
  }

  // Seed a default admin account if no admin exists
  const adminExists = await User.findOne({ role: "admin" });
  if (!adminExists) {
    await User.create({
      name: "Admin",
      email: "admin@sliit.lk",
      password: "admin123",
      role: "admin",
    });
    console.log("Default admin created — email: admin@sliit.lk / password: admin123");
  }

  // Step 3: Start listening for incoming HTTP requests
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Health check: http://localhost:${PORT}/api/health`);
  });
};

// Call the async function to boot up the server
startServer();
