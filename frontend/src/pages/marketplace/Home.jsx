// ============================================================
// pages/Home.jsx — Homepage / Product Listing Page
// ============================================================
// The main landing page of the SLIIT Marketplace. Features:
//   - Hero section with a search bar
//   - Category filter chips (All, Textbooks, Electronics, etc.)
//   - Product grid showing all matching products as ProductCards
//   - Loading spinner, error message, and empty state handling
//
// Products are fetched from the backend API with optional
// search text and category filters applied.
// ============================================================

import { useState, useEffect } from "react";        // React hooks for state and lifecycle
import { FiSearch, FiFilter } from "react-icons/fi"; // Icons for search bar and filter label
import { getProducts } from "../../services/api";        // API call to fetch products
import ProductCard from "../../components/ProductCard";  // Card component for each product
import "./Home.css";                                  // Home page styles

// List of all product categories (matches the backend's enum in Product model)
// "All" is a frontend-only option that means "no category filter"
const CATEGORIES = [
  "All",
  "Textbooks",
  "Electronics",
  "Stationery",
  "Clothing",
  "Food & Drinks",
  "Services",
  "Other",
];

function Home() {
  // --- State variables ---
  const [products, setProducts] = useState([]);     // Array of product objects from the API
  const [loading, setLoading] = useState(true);     // True while fetching data
  const [error, setError] = useState("");           // Error message (empty = no error)
  const [search, setSearch] = useState("");         // Current search text input
  const [category, setCategory] = useState("All"); // Currently selected category filter

  /**
   * Fetch products from the backend API.
   * Applies the current search text and category filter.
   * Called on page load and whenever filters change.
   */
  const fetchProducts = async () => {
    setLoading(true);
    setError("");
    try {
      // Build query parameters — only include non-empty filters
      const params = {};
      if (search.trim()) params.search = search.trim();
      if (category !== "All") params.category = category;

      // Call the backend: GET /api/products?search=...&category=...
      const res = await getProducts(params);
      setProducts(res.data.products);
    } catch {
      setError(
        "Could not load products. Make sure the backend is running on port 5000."
      );
    } finally {
      setLoading(false); // Stop the loading spinner regardless of success/failure
    }
  };

  // Fetch products on initial page load and whenever the category changes
  useEffect(() => {
    fetchProducts();
  }, [category]); // Re-fetch when category changes (search is triggered by form submit)

  /**
   * Handle search form submission.
   * Triggered when user presses Enter or clicks the Search button.
   */
  const handleSearch = (e) => {
    e.preventDefault(); // Prevent page reload on form submit
    fetchProducts();    // Re-fetch with the current search text
  };

  return (
    <div className="marketplace-home">
      {/* ---- Hero Section: Title + Search Bar ---- */}
      <section className="hero-section">
        <div className="container">
          <h1 className="hero-title">
            Buy & Sell Within <span className="highlight">SLIIT</span>
          </h1>
          <p className="hero-subtitle">
            Your trusted marketplace for textbooks, electronics, stationery, and
            more — from fellow SLIIT students.
          </p>

          {/* Search bar — submits on Enter or button click */}
          <form className="search-bar" onSubmit={handleSearch}>
            <FiSearch className="search-icon" size={20} />
            <input
              type="text"
              placeholder="Search for textbooks, electronics, notes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button type="submit" className="btn btn-gold">
              Search
            </button>
          </form>
        </div>
      </section>

      {/* ---- Category Filter Chips ---- */}
      <section className="container">
        <div className="category-filter">
          <FiFilter size={16} />
          {/* Render a button for each category — clicking one sets it as active */}
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              className={`category-chip ${category === cat ? "active" : ""}`}
              onClick={() => setCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* ---- Products Grid (or loading/error/empty states) ---- */}
      <section className="container products-section">
        {/* Loading state — show spinner while fetching */}
        {loading && (
          <div className="loading">
            <div className="spinner"></div>
            <p>Loading products...</p>
          </div>
        )}

        {/* Error state — show error message with retry button */}
        {error && (
          <div className="error-message">
            <p>{error}</p>
            <button className="btn btn-outline" onClick={fetchProducts}>
              Try Again
            </button>
          </div>
        )}

        {/* Empty state — no products match the current filters */}
        {!loading && !error && products.length === 0 && (
          <div className="empty-message">
            <p>No products found.</p>
            {/* Show "Clear Filters" button if any filters are active */}
            {(search || category !== "All") && (
              <button
                className="btn btn-outline"
                onClick={() => {
                  setSearch("");
                  setCategory("All");
                }}
              >
                Clear Filters
              </button>
            )}
          </div>
        )}

        {/* Success state — render the product grid */}
        {!loading && !error && products.length > 0 && (
          <>
            {/* Results count (e.g., "10 products found") */}
            <p className="results-count">
              {products.length} product{products.length !== 1 ? "s" : ""} found
            </p>
            {/* Grid of ProductCard components */}
            <div className="products-grid">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          </>
        )}
      </section>
    </div>
  );
}

export default Home;
