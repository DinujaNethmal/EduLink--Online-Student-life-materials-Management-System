// ============================================================
// pages/OrderHistory.jsx — Order History Page
// ============================================================
// Displays a list of all past orders placed by the current user.
// Each order card shows:
//   - Short order ID (last 8 characters, uppercased)
//   - Order type badge ("Buy Now" or "Cart Checkout")
//   - Order status badge (Awaiting Payment, Confirmed, etc.)
//   - Payment status badge (Paid / Unpaid)
//   - List of items with quantities and individual totals
//   - Order date/time (formatted for Sri Lanka locale)
//   - Total order amount
//
// If the user has no orders, an empty state is shown with a
// link to browse products.
// ============================================================

import { useState, useEffect } from "react";         // React hooks
import { Link } from "react-router-dom";              // Link component for navigation
import { FiPackage, FiShoppingBag } from "react-icons/fi"; // Icons for package and shopping bag
import { getOrders } from "../services/api";           // API call to fetch user's order history
import "./OrderHistory.css";                           // Page-specific styles

function OrderHistory() {
  // --- State ---
  const [orders, setOrders] = useState([]);    // Array of order objects from the API
  const [loading, setLoading] = useState(true); // Loading spinner toggle

  // Fetch the user's order history when the component mounts
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await getOrders();
        setOrders(res.data.orders); // API returns orders sorted by newest first
      } catch {
        // Backend might not be running — silently fail
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  // Show loading spinner while fetching orders
  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Loading orders...</p>
      </div>
    );
  }

  return (
    <div className="order-history container">
      <h1>My Orders</h1>

      {orders.length === 0 ? (
        /* ---- Empty State: No orders yet ---- */
        <div className="empty-orders">
          <FiShoppingBag size={64} />
          <h2>No orders yet</h2>
          <p>When you buy something, your orders will appear here.</p>
          <Link to="/" className="btn btn-primary btn-lg">
            Browse Products
          </Link>
        </div>
      ) : (
        /* ---- Orders List: One card per order ---- */
        <div className="orders-list">
          {orders.map((order) => (
            <div key={order._id} className="order-card">
              {/* Order Card Header — ID, type badge, status badge */}
              <div className="order-card-header">
                <div className="order-card-id">
                  <FiPackage size={16} />
                  {/* Show only the last 8 characters of the ID for readability */}
                  <span>
                    {order._id.slice(-8).toUpperCase()}
                  </span>
                </div>
                {/* Badge showing how the order was placed */}
                <span className="order-type-badge">
                  {order.orderType === "buy-now" ? "Buy Now" : "Cart Checkout"}
                </span>
                {/* Badge showing current order status */}
                <span className="order-status-badge">{order.status}</span>
                {/* Payment status badge — shows whether payment has been completed */}
                <span className={`payment-status-badge ${order.paymentStatus || "pending"}`}>
                  {order.paymentStatus === "paid" ? "Paid" : "Unpaid"}
                </span>
              </div>

              {/* Order Items — list of products in this order */}
              <div className="order-card-items">
                {order.items.map((item, index) => (
                  <div key={index} className="order-card-item">
                    <span>
                      {item.name} <span className="qty">x{item.quantity}</span>
                    </span>
                    {/* Subtotal for this line item */}
                    <span className="item-total">
                      Rs. {(item.price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>

              {/* Order Card Footer — date and total */}
              <div className="order-card-footer">
                {/* Format the date in a human-readable way using Sri Lanka locale */}
                <span className="order-date">
                  {new Date(order.createdAt).toLocaleDateString("en-LK", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
                {/* Total amount for the entire order */}
                <span className="order-card-total">
                  Total: Rs. {order.totalAmount.toLocaleString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default OrderHistory;
