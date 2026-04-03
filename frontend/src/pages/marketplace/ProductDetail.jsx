// ============================================================
// pages/ProductDetail.jsx — Product Detail Page
// ============================================================
// Shows the full details of a single product when a user clicks
// on a ProductCard. Features:
//   - Large product image (or colored placeholder)
//   - Full description, category, condition, seller name
//   - Price and stock availability indicator
//   - Quantity selector (with min 1, max = stock)
//   - "Add to Cart" and "Buy Now" buttons
//   - Back button to return to the previous page
//
// The product ID is extracted from the URL (e.g., /product/6651a3b2f1...)
// using React Router's useParams hook.
// ============================================================

import { useState, useEffect } from "react";              // React hooks
import { useParams, useNavigate } from "react-router-dom"; // URL params + navigation
import {
  FiShoppingCart,  // Cart icon
  FiZap,           // Lightning bolt icon (Buy Now)
  FiArrowLeft,     // Back arrow icon
  FiMinus,         // Minus icon (quantity)
  FiPlus,          // Plus icon (quantity)
} from "react-icons/fi";
import { getProductById, addToCart } from "../../services/api"; // API calls
import toast from "react-hot-toast";   // Toast notifications
import "./ProductDetail.css";          // Page-specific styles

function ProductDetail() {
  // Extract the product ID from the URL path (e.g., /product/:id)
  const { id } = useParams();
  const navigate = useNavigate();

  // --- State ---
  const [product, setProduct] = useState(null);  // Product data from the API
  const [loading, setLoading] = useState(true);  // Loading spinner toggle
  const [quantity, setQuantity] = useState(1);   // Selected quantity for purchase

  // Fetch the product details when the component mounts (or when ID changes)
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await getProductById(id);
        setProduct(res.data.product);
      } catch {
        toast.error("Product not found");
        navigate("/marketplace"); // Redirect to homepage if product doesn't exist
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id, navigate]);

  /**
   * Add the product to the cart with the selected quantity.
   */
  const handleAddToCart = async () => {
    try {
      await addToCart(product._id, quantity);
      toast.success(`Added ${quantity}x "${product.name}" to cart!`);
    } catch (error) {
      toast.error("Failed to add to cart");
    }
  };

  /**
   * Navigate to the confirmation page where the user reviews
   * the order before it's actually placed.
   */
  const handleBuyNow = () => {
    navigate(
      `/marketplace/confirm-order?type=buy-now&productId=${product._id}&quantity=${quantity}`
    );
  };

  // Color map for category-based placeholder backgrounds
  const categoryColors = {
    Textbooks: "#4a90d9",
    Electronics: "#e74c3c",
    Stationery: "#27ae60",
    Clothing: "#8e44ad",
    "Food & Drinks": "#f39c12",
    Services: "#1abc9c",
    Other: "#95a5a6",
  };

  // Show loading spinner while fetching product data
  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Loading product...</p>
      </div>
    );
  }

  // Safety check: don't render if product is null (shouldn't happen due to redirect above)
  if (!product) return null;

  return (
    <div className="product-detail container">
      {/* Back Button — navigates to the previous page in browser history */}
      <button className="back-btn" onClick={() => navigate(-1)}>
        <FiArrowLeft size={18} />
        Back
      </button>

      <div className="detail-layout">
        {/* ---- Left side: Product Image ---- */}
        <div
          className="detail-image"
          style={{
            backgroundColor: categoryColors[product.category] || "#ccc",
          }}
        >
          {product.image ? (
            <img src={product.image} alt={product.name} />
          ) : (
            <span className="detail-placeholder">
              {product.category?.charAt(0)}
            </span>
          )}
        </div>

        {/* ---- Right side: Product Info ---- */}
        <div className="detail-info">
          {/* Category label */}
          <span className="detail-category">{product.category}</span>

          {/* Product name */}
          <h1 className="detail-name">{product.name}</h1>

          {/* Seller name */}
          <p className="detail-seller">
            Sold by <strong>{product.sellerName}</strong>
          </p>

          {/* Price and condition row */}
          <div className="detail-price-row">
            <span className="detail-price">
              Rs. {product.price.toLocaleString()}
            </span>
            <span className="detail-condition">{product.condition}</span>
          </div>

          {/* Stock availability indicator */}
          <div className="detail-stock">
            {product.stock > 0 ? (
              <span className="in-stock">
                {product.stock} in stock
              </span>
            ) : (
              <span className="out-of-stock">Out of stock</span>
            )}
          </div>

          {/* Full product description */}
          <p className="detail-description">{product.description}</p>

          {/* Quantity Selector — min 1, max = available stock */}
          <div className="detail-quantity">
            <span className="qty-label">Quantity:</span>
            <div className="qty-controls">
              {/* Decrease quantity (can't go below 1) */}
              <button
                className="qty-btn"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={quantity <= 1}
              >
                <FiMinus size={16} />
              </button>
              <span className="qty-value">{quantity}</span>
              {/* Increase quantity (can't exceed stock) */}
              <button
                className="qty-btn"
                onClick={() =>
                  setQuantity(Math.min(product.stock, quantity + 1))
                }
                disabled={quantity >= product.stock}
              >
                <FiPlus size={16} />
              </button>
            </div>
          </div>

          {/* Action Buttons — disabled when out of stock */}
          <div className="detail-actions">
            <button
              className="btn btn-primary btn-lg"
              onClick={handleAddToCart}
              disabled={product.stock === 0}
            >
              <FiShoppingCart size={18} />
              Add to Cart
            </button>
            <button
              className="btn btn-gold btn-lg"
              onClick={handleBuyNow}
              disabled={product.stock === 0}
            >
              <FiZap size={18} />
              Buy Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;
