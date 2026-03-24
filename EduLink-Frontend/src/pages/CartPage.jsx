// ============================================================
// pages/CartPage.jsx — Shopping Cart Page
// ============================================================
// Displays the user's shopping cart with all items and an order summary.
// Features:
//   - List of cart items (using CartItem component) with quantity controls
//   - "Clear Cart" button to remove all items at once
//   - Order summary sidebar showing item count and total price
//   - "Proceed to Checkout" button → navigates to confirmation page
//   - Empty cart state with link to browse products
//   - Loading state while fetching cart data
// ============================================================

import { useState, useEffect } from "react";                // React hooks
import { useNavigate, Link } from "react-router-dom";       // Navigation and link components
import { FiShoppingBag, FiTrash2, FiArrowLeft } from "react-icons/fi"; // Icons
import {
  getCart,         // Fetch cart data from backend
  updateCartItem,  // Update item quantity
  removeFromCart,   // Remove a single item
  clearCart,        // Remove all items
} from "../services/api";
import CartItem from "../components/CartItem";  // Individual cart item row component
import toast from "react-hot-toast";            // Toast notifications
import "./CartPage.css";                        // Page-specific styles

function CartPage() {
  // --- State ---
  const [cart, setCart] = useState({ items: [], totalAmount: 0 }); // Cart data from API
  const [loading, setLoading] = useState(true);    // Loading spinner toggle
  const navigate = useNavigate();

  /**
   * Fetch the current user's cart from the backend.
   * Called on mount and after any cart modification (add, remove, update, clear).
   */
  const fetchCart = async () => {
    try {
      const res = await getCart();
      setCart(res.data);
    } catch {
      toast.error("Could not load cart. Is the backend running?");
    } finally {
      setLoading(false);
    }
  };

  // Fetch cart data when the page first loads
  useEffect(() => {
    fetchCart();
  }, []);

  /**
   * Handle quantity change for a cart item.
   * If the new quantity is 0 or less, remove the item entirely.
   * Otherwise, update the quantity via the API.
   */
  const handleUpdateQuantity = async (productId, quantity) => {
    try {
      if (quantity <= 0) {
        // Quantity dropped to 0 — remove the item from the cart
        await removeFromCart(productId);
        toast.success("Item removed");
      } else {
        // Update to the new quantity
        await updateCartItem(productId, quantity);
      }
      fetchCart(); // Refresh cart data to reflect changes
    } catch {
      toast.error("Failed to update cart");
    }
  };

  /**
   * Handle removing a specific item from the cart.
   */
  const handleRemove = async (productId) => {
    try {
      await removeFromCart(productId);
      toast.success("Item removed from cart");
      fetchCart(); // Refresh cart
    } catch {
      toast.error("Failed to remove item");
    }
  };

  /**
   * Handle clearing all items from the cart.
   */
  const handleClearCart = async () => {
    try {
      await clearCart();
      toast.success("Cart cleared");
      fetchCart(); // Refresh to show empty cart
    } catch {
      toast.error("Failed to clear cart");
    }
  };

  /**
   * Navigate to the confirmation page where the user reviews
   * the full cart order before it's actually placed.
   */
  const handleCheckout = () => {
    navigate("/confirm-order?type=checkout");
  };

  // Show loading spinner while fetching cart data
  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Loading cart...</p>
      </div>
    );
  }

  return (
    <div className="cart-page container">
      {/* Page Header — title + clear cart button */}
      <div className="cart-header">
        <h1>Shopping Cart</h1>
        {/* Only show "Clear Cart" if there are items */}
        {cart.items.length > 0 && (
          <button className="btn btn-outline btn-sm" onClick={handleClearCart}>
            <FiTrash2 size={14} />
            Clear Cart
          </button>
        )}
      </div>

      {cart.items.length === 0 ? (
        /* ---- Empty Cart State ---- */
        <div className="empty-cart">
          <FiShoppingBag size={64} />
          <h2>Your cart is empty</h2>
          <p>Browse products and add some items to your cart!</p>
          <Link to="/" className="btn btn-primary btn-lg">
            Browse Products
          </Link>
        </div>
      ) : (
        /* ---- Cart with Items ---- */
        <div className="cart-layout">
          {/* Left: List of cart items */}
          <div className="cart-items">
            {cart.items.map((item) => (
              <CartItem
                key={item.product?._id || item._id}
                item={item}
                onUpdateQuantity={handleUpdateQuantity}
                onRemove={handleRemove}
              />
            ))}
          </div>

          {/* Right: Order Summary Sidebar */}
          <div className="cart-summary">
            <div className="summary-card">
              <h3>Order Summary</h3>

              {/* Item count and subtotal */}
              <div className="summary-row">
                <span>
                  {/* Sum all item quantities for the total count */}
                  Items ({cart.items.reduce((s, i) => s + i.quantity, 0)})
                </span>
                <span>Rs. {cart.totalAmount.toLocaleString()}</span>
              </div>

              <div className="summary-divider"></div>

              {/* Total row */}
              <div className="summary-row summary-total">
                <span>Total</span>
                <span>Rs. {cart.totalAmount.toLocaleString()}</span>
              </div>

              {/* Checkout button — navigates to the order confirmation page */}
              <button
                className="btn btn-gold btn-lg checkout-btn"
                onClick={handleCheckout}
              >
                Proceed to Checkout
              </button>

              {/* Link to continue browsing */}
              <Link to="/" className="continue-shopping">
                <FiArrowLeft size={14} />
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CartPage;
