// ============================================================
// config/db.js — MongoDB Connection Logic
// ============================================================
// Handles connecting to MongoDB with a smart fallback strategy:
//   1. If MONGODB_URI is set in .env → try connecting to that database
//   2. If connection fails OR no URI provided → use an in-memory MongoDB
// The in-memory database is great for development (no MongoDB install needed!)
// but all data is lost when the server restarts.
// ============================================================

const mongoose = require("mongoose");                         // MongoDB ODM (Object Data Modeling) library
const { MongoMemoryServer } = require("mongodb-memory-server"); // Spins up a temporary MongoDB instance in RAM

// Keep a reference to the in-memory server so it stays alive
let mongoServer;

/**
 * connectDB — Establishes the MongoDB connection
 *
 * Connection priority:
 *   1. Use MONGODB_URI from .env if provided and reachable
 *   2. Fall back to in-memory MongoDB if URI is missing, set to "memory", or unreachable
 *   3. Exit the process if all connection attempts fail
 */
const connectDB = async () => {
  try {
    let uri = process.env.MONGODB_URI;

    // Case 1: No URI provided or explicitly set to "memory" → use in-memory DB
    if (!uri || uri === "memory") {
      mongoServer = await MongoMemoryServer.create(); // Download & start a mini MongoDB
      uri = mongoServer.getUri();                     // Get the connection string for it
      console.log("Using in-memory MongoDB");
    } else {
      // Case 2: URI is provided → try connecting to it first
      try {
        const conn = await mongoose.connect(uri, {
          serverSelectionTimeoutMS: 3000, // Wait max 3 seconds before giving up
        });
        console.log(`MongoDB connected: ${conn.connection.host}`);
        return; // Successfully connected — we're done!
      } catch (err) {
        // Case 3: External MongoDB is unreachable → fall back to in-memory
        console.log(`Could not connect to ${uri}, falling back to in-memory MongoDB...`);
        mongoServer = await MongoMemoryServer.create();
        uri = mongoServer.getUri();
      }
    }

    // Connect to whichever URI we ended up with (in-memory)
    const conn = await mongoose.connect(uri);
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    // If even the in-memory DB fails, something is seriously wrong — exit
    console.error(`MongoDB connection error: ${error.message}`);
    process.exit(1); // Exit with error code 1 (non-zero = failure)
  }
};

module.exports = connectDB;
