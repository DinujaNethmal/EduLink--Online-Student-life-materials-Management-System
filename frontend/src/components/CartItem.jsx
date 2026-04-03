// ============================================================
// components/CartItem.jsx — Single Cart Item Row
// ============================================================
// Displays one item in the shopping cart with:
//   - Product thumbnail (image or colored placeholder)
//   - Product name, seller, and unit price
//   - Quantity controls (minus/plus buttons)
//   - Subtotal (price * quantity)
//   - Remove button (trash icon)
//
// This component receives callback functions from CartPage
// to handle quantity updates and item removal.
// ============================================================

import { FiMinus, FiPlus, FiTrash2 } from "react-icons/fi"; // Icons for quantity buttons and delete
import "./CartItem.css";

/**
 * CartItem Component
 * @param {Object} item - Cart item object containing { product, quantity }
 * @param {Function} onUpdateQuantity - Callback: (productId, newQuantity) => void
 * @param {Function} onRemove - Callback: (productId) => void
 */
function CartItem({ item, onUpdateQuantity, onRemove }) {
  // Destructure the product data and quantity from the cart item
  const { product, quantity } = item;

  // Safety check: if the product was deleted from the database, don't render anything
  if (!product) return null;

  // Color map for product thumbnail placeholder backgrounds (same as ProductCard)
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
    <div className="cart-item">
      {/* Product Thumbnail — image or colored placeholder with category initial */}
      <div
        className="cart-item-image"
        style={{
          backgroundColor: categoryColors[product.category] || "#ccc",
        }}
      >
        {product.image ? (
          <img src={product.image} alt={product.name} />
        ) : (
          <span>{product.category?.charAt(0)}</span>
        )}
      </div>

      {/* Item Details — name, seller, and unit price */}
      <div className="cart-item-info">
        <h4 className="cart-item-name">{product.name}</h4>
        <p className="cart-item-seller">by {product.sellerName}</p>
        <p className="cart-item-price">Rs. {product.price.toLocaleString()}</p>
      </div>

      {/* Quantity Controls — minus button, current quantity, plus button */}
      <div className="cart-item-quantity">
        {/* Decrease quantity (disabled at minimum of 1) */}
        <button
          className="qty-btn"
          onClick={() => onUpdateQuantity(product._id, quantity - 1)}
          disabled={quantity <= 1}
        >
          <FiMinus size={14} />
        </button>
        {/* Display current quantity */}
        <span className="qty-value">{quantity}</span>
        {/* Increase quantity */}
        <button
          className="qty-btn"
          onClick={() => onUpdateQuantity(product._id, quantity + 1)}
        >
          <FiPlus size={14} />
        </button>
      </div>

      {/* Subtotal — price * quantity for this item */}
      <div className="cart-item-subtotal">
        <p className="subtotal-label">Subtotal</p>
        <p className="subtotal-value">
          Rs. {(product.price * quantity).toLocaleString()}
        </p>
      </div>

      {/* Remove Button — deletes this item from the cart entirely */}
      <button
        className="cart-item-remove"
        onClick={() => onRemove(product._id)}
        aria-label="Remove item"
      >
        <FiTrash2 size={18} />
      </button>
    </div>
  );
}

export default CartItem;
