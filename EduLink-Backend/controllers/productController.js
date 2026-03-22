// ============================================================
// controllers/productController.js — Product CRUD Operations
// ============================================================
// Handles all business logic for products:
//   - List all products (with search/filter support)
//   - Get a single product by ID
//   - Create a new product listing
//   - Update an existing product
//   - Delete a product
// Each function is an Express route handler (req, res) => { ... }
// ============================================================

const Product = require("../models/Product");

/**
 * GET /api/products
 * Fetch all available products, with optional filtering.
 *
 * Query parameters (all optional):
 *   ?category=Electronics   → filter by category
 *   ?search=arduino         → search in name and description (case-insensitive)
 *   ?sellerId=student001    → filter by seller
 */
const getProducts = async (req, res) => {
  try {
    // Extract optional filter parameters from the query string
    const { category, search, sellerId } = req.query;

    // Start with base filter: only show available products
    const filter = { isAvailable: true };

    // Add optional filters if they were provided
    if (category) {
      filter.category = category; // Exact match for category
    }
    if (sellerId) {
      filter.sellerId = sellerId; // Exact match for seller ID
    }
    if (search) {
      // Use MongoDB $or to search in BOTH name and description fields
      // $regex enables partial matching, $options: "i" makes it case-insensitive
      // Example: search="arduino" matches "Arduino Starter Kit" and "arduino board for projects"
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    // Fetch matching products, sorted by newest first
    const products = await Product.find(filter).sort({ createdAt: -1 });

    res.json({ products });
  } catch (error) {
    res.status(500).json({ message: "Failed to get products", error: error.message });
  }
};

/**
 * GET /api/products/:id
 * Fetch a single product by its MongoDB _id.
 * Used when the user clicks on a product card to see full details.
 */
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    // Return 404 if no product found with that ID
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({ product });
  } catch (error) {
    res.status(500).json({ message: "Failed to get product", error: error.message });
  }
};

/**
 * POST /api/products
 * Create a new product listing.
 *
 * Request body should contain:
 *   { name, description, price, image, category, sellerId, sellerName, condition, stock }
 *
 * Mongoose validates the data against the Product schema before saving.
 */
const createProduct = async (req, res) => {
  try {
    // Auto-set seller info from authenticated user
    const productData = {
      ...req.body,
      sellerId: req.user._id.toString(),
      sellerName: req.user.name,
    };

    const product = new Product(productData);
    await product.save();

    res.status(201).json({
      message: "Product listed successfully!",
      product,
    });
  } catch (error) {
    res.status(400).json({ message: "Failed to create product", error: error.message });
  }
};

/**
 * PUT /api/products/:id
 * Update an existing product listing.
 * Only the fields included in the request body will be updated.
 */
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Only the owner can update their product
    if (product.sellerId !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to update this product" });
    }

    Object.assign(product, req.body);
    await product.save();

    res.json({ message: "Product updated", product });
  } catch (error) {
    res.status(400).json({ message: "Failed to update product", error: error.message });
  }
};

/**
 * DELETE /api/products/:id
 * Delete a product listing permanently from the database.
 */
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Only the owner can delete their product
    if (product.sellerId !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to delete this product" });
    }

    await Product.findByIdAndDelete(req.params.id);

    res.json({ message: "Product deleted" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete product", error: error.message });
  }
};

// Export all controller functions so they can be used in the routes file
module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
