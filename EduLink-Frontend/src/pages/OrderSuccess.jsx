// ============================================================
// pages/OrderSuccess.jsx — Order Success Page
// ============================================================
// Displayed after a successful purchase (either "Buy Now" or "Checkout").
// Shows:
//   - A success checkmark icon and confirmation message
//   - Order ID for reference
//   - List of purchased items with quantities and prices
//   - Total amount paid
//   - Current order status and payment status
//   - Links to view all orders or continue shopping
//
// The order ID is extracted from the URL (/order-success/:orderId)
// and used to fetch the order details from the backend.
// ============================================================

import { useState, useEffect } from "react";          // React hooks
import { useParams, Link } from "react-router-dom";    // URL params + link component
import { FiCheckCircle, FiPackage } from "react-icons/fi"; // Icons for success and package
import { getOrderById } from "../services/api";         // API call to fetch order details
import "./OrderSuccess.css";                            // Page-specific styles

function OrderSuccess() {
  // Extract the order ID from the URL path (e.g., /order-success/6651a3b2f1...)
  const { orderId } = useParams();

  // --- State ---
  const [order, setOrder] = useState(null);  // Order data from the API
  const [loading, setLoading] = useState(true);

  // Fetch the order details when the component mounts
  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await getOrderById(orderId);
        setOrder(res.data.order);
      } catch {
        // Order might not exist — page will still show the success message
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [orderId]);

  // Show loading spinner while fetching order data
  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Loading order...</p>
      </div>
    );
  }

  return (
    <div className="order-success container">
      <div className="success-card">
        {/* Large green checkmark icon */}
        <div className="success-icon">
          <FiCheckCircle size={56} />
        </div>

        {/* Success heading and subtitle */}
        <h1>Order Placed Successfully!</h1>
        <p className="success-subtitle">
          Thank you for your purchase. Your order has been confirmed.
        </p>

        {/* Order details — only shown if the order was fetched successfully */}
        {order && (
          <div className="order-details">
            {/* Order ID for reference */}
            <div className="order-id">
              <FiPackage size={16} />
              Order ID: <strong>{order._id}</strong>
            </div>

            {/* List of items purchased */}
            <div className="order-items-list">
              {order.items.map((item, index) => (
                <div key={index} className="order-item-row">
                  {/* Item name and quantity */}
                  <span className="item-name">
                    {item.name} x{item.quantity}
                  </span>
                  {/* Item subtotal (price * quantity) */}
                  <span className="item-price">
                    Rs. {(item.price * item.quantity).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>

            {/* Total amount paid */}
            <div className="order-total-row">
              <span>Total Paid</span>
              <span className="order-total">
                Rs. {order.totalAmount.toLocaleString()}
              </span>
            </div>

            {/* Current order status and payment status */}
            <div className="order-status">
              Status: <span className="status-badge">{order.status}</span>
            </div>
            <div className="order-status">
              Payment:{" "}
              <span
                className={`status-badge ${order.paymentStatus === "paid" ? "status-paid" : "status-unpaid"}`}
              >
                {order.paymentStatus === "paid" ? "Paid" : "Unpaid"}
              </span>
            </div>
          </div>
        )}

        {/* Navigation links — view all orders or go back to shopping */}
        <div className="success-actions">
          <Link to="/orders" className="btn btn-primary">
            View My Orders
          </Link>
          <Link to="/" className="btn btn-outline">
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}

export default OrderSuccess;
