// ============================================================
// components/ProductCard.jsx — Product Card Component
// ============================================================
// A reusable card that displays a product's key info in a grid layout.
// Shown on the Home page for each product in the listing.
//
// Features:
//   - Colored placeholder image (based on category) when no image URL exists
//   - Category and condition badges overlaid on the image
//   - Product name, seller, and price
//   - "Add to Cart" and "Buy Now" action buttons
//   - Clicking the card navigates to the full product detail page
// ============================================================

import { useNavigate } from "react-router-dom";        // Hook to programmatically navigate to another page
import { FiShoppingCart, FiZap } from "react-icons/fi"; // Icons for cart and buy-now buttons
import { addToCart } from "../services/api";               // API call for cart
import toast from "react-hot-toast";                     // Toast notification popups
import "./ProductCard.css";                              // Card-specific styles

function ProductCard({ product }) {
  const navigate = useNavigate();

  /**
   * Handle "Add to Cart" button click.
   * e.stopPropagation() prevents the click from bubbling up to the card's onClick,
   * which would navigate to the product detail page.
   * Works for both logged-in users and guests.
   */
  const handleAddToCart = async (e) => {
    e.stopPropagation();
    try {
      await addToCart(product._id);
      toast.success(`"${product.name}" added to cart!`);
    } catch (error) {
      toast.error("Failed to add to cart");
    }
  };

  /**
   * Handle "Buy Now" button click.
   * Navigates to the confirmation page where the user reviews
   * the order before it's actually placed.
   */
  const handleBuyNow = (e) => {
    e.stopPropagation();
    navigate(`/confirm-order?type=buy-now&productId=${product._id}&quantity=1`);
  };

  // Color map for category-based placeholder backgrounds
  // When a product has no image, we show a colored box with the category's first letter
  const categoryColors = {
    Textbooks: "#4a90d9",
    Electronics: "#e74c3c",
    Stationery: "#27ae60",
    Clothing: "#8e44ad",
    "Food & Drinks": "#f39c12",
    Services: "#1abc9c",
    Other: "#95a5a6",
  };

  return (
    // Clicking anywhere on the card navigates to the product detail page
    <div
      className="product-card"
      onClick={() => navigate(`/product/${product._id}`)}
    >
      {/* Product Image — shows actual image or a colored placeholder */}
      <div
        className="product-image"
        style={{
          backgroundColor: categoryColors[product.category] || "#ccc",
        }}
      >
        {product.image ? (
          <img src={product.image} alt={product.name} />
        ) : (
          // Placeholder: first letter of the category (e.g., "E" for Electronics)
          <span className="image-placeholder">
            {product.category?.charAt(0)}
          </span>
        )}
        {/* Overlay badges for category and condition */}
        <span className="category-badge">{product.category}</span>
        <span className="condition-badge">{product.condition}</span>
      </div>

      {/* Product Info Section */}
      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        <p className="product-seller">by {product.sellerName}</p>
        <p className="product-price">Rs. {product.price.toLocaleString()}</p>

        {/* Action Buttons */}
        <div className="product-actions">
          <button className="btn btn-primary btn-sm" onClick={handleAddToCart}>
            <FiShoppingCart size={14} />
            Add to Cart
          </button>
          <button className="btn btn-gold btn-sm" onClick={handleBuyNow}>
            <FiZap size={14} />
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
