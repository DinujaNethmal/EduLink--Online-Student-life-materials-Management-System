// ============================================================
// pages/OrderHistory.jsx — Order History Page (Updated)
// Added: Pay Now button, Payment Method Modal, success toast
// ============================================================

import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FiPackage, FiShoppingBag, FiCreditCard, FiX, FiXCircle } from "react-icons/fi";
import { BsBank2 } from "react-icons/bs";
import { getOrders, cancelOrder } from "../../services/api";
import toast from "react-hot-toast";
import "./OrderHistory.css";

function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [paymentModal, setPaymentModal] = useState(null); // holds the orderId when modal is open
  const [successToast, setSuccessToast] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  // Fetch orders on mount
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await getOrders();
        setOrders(res.data.orders);
      } catch {
        // silent fail
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  // Show success toast if redirected back after payment
  useEffect(() => {
    if (location.state?.paymentSuccess) {
      setSuccessToast(true);
      // Clear the location state so toast doesn't reappear on refresh
      window.history.replaceState({}, document.title);
      const timer = setTimeout(() => setSuccessToast(false), 4000);
      return () => clearTimeout(timer);
    }
  }, [location.state]);

  // Open the payment method modal for a specific order
  const handlePayNow = (orderId) => {
    setPaymentModal(orderId);
  };

  // Cancel an unpaid order
  const handleCancelOrder = async (orderId) => {
    try {
      await cancelOrder(orderId);
      toast.success("Order cancelled");
      setOrders((prev) =>
        prev.map((o) =>
          o._id === orderId ? { ...o, status: "Cancelled", paymentStatus: "failed" } : o
        )
      );
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to cancel order");
    }
  };

  // Navigate to the chosen payment page
  const handleMethodSelect = (method) => {
    if (method === "credit-card") {
      navigate(`/marketplace/payment/credit-card/${paymentModal}`);
    } else {
      navigate(`/marketplace/payment/bank-transfer/${paymentModal}`);
    }
    setPaymentModal(null);
  };

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

      {/* ── Payment Success Toast ── */}
      {successToast && (
        <div className="payment-success-toast">
          ✅ Payment submitted successfully! Your order is being confirmed.
        </div>
      )}

      {orders.length === 0 ? (
        /* ── Empty State ── */
        <div className="empty-orders">
          <FiShoppingBag size={64} />
          <h2>No orders yet</h2>
          <p>When you buy something, your orders will appear here.</p>
          <Link to="/marketplace" className="btn btn-primary btn-lg">
            Browse Products
          </Link>
        </div>
      ) : (
        /* ── Orders List ── */
        <div className="orders-list">
          {orders.map((order) => (
            <div key={order._id} className="order-card">

              {/* Header: ID, type badge, status badges */}
              <div className="order-card-header">
                <div className="order-card-id">
                  <FiPackage size={16} />
                  <span>{order._id.slice(-8).toUpperCase()}</span>
                </div>
                <span className="order-type-badge">
                  {order.orderType === "buy-now" ? "Buy Now" : "Cart Checkout"}
                </span>
                <span className="order-status-badge">{order.status}</span>
                <span className={`payment-status-badge ${order.paymentStatus || "pending"}`}>
                  {order.paymentStatus === "paid" ? "Paid" : "Unpaid"}
                </span>
              </div>

              {/* Items list */}
              <div className="order-card-items">
                {order.items.map((item, index) => (
                  <div key={index} className="order-card-item">
                    <span>
                      {item.name} <span className="qty">x{item.quantity}</span>
                    </span>
                    <span className="item-total">
                      Rs. {(item.price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>

              {/* Footer: date + total + Pay Now */}
              <div className="order-card-footer">
                <span className="order-date">
                  {new Date(order.createdAt).toLocaleDateString("en-LK", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
                <div className="order-footer-right">
                  <span className="order-card-total">
                    Total: Rs. {order.totalAmount.toLocaleString()}
                  </span>
                  {/* Only show Pay Now and Cancel if the order hasn't been paid and isn't cancelled */}
                  {order.paymentStatus !== "paid" && order.status !== "Cancelled" && (
                    <>
                      <button
                        className="btn-pay-now"
                        onClick={() => handlePayNow(order._id)}
                      >
                        Pay Now
                      </button>
                      <button
                        className="btn-cancel-order"
                        onClick={() => handleCancelOrder(order._id)}
                      >
                        <FiXCircle size={14} />
                        Cancel
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Payment Method Modal ── */}
      {paymentModal && (
        <div
          className="payment-modal-overlay"
          onClick={() => setPaymentModal(null)} // close on backdrop click
        >
          <div
            className="payment-modal"
            onClick={(e) => e.stopPropagation()} // prevent backdrop click from firing inside
          >
            <div className="payment-modal-header">
              <h2>Select Payment Method</h2>
              <button
                className="modal-close-btn"
                onClick={() => setPaymentModal(null)}
                aria-label="Close"
              >
                <FiX size={20} />
              </button>
            </div>
            <p className="payment-modal-subtitle">
              How would you like to complete your payment?
            </p>

            <div className="payment-options">
              {/* Option 1: Credit / Debit Card */}
              <button
                className="payment-option-card"
                onClick={() => handleMethodSelect("credit-card")}
              >
                <FiCreditCard size={36} />
                <span className="payment-option-title">Credit / Debit Card</span>
                <span className="payment-option-desc">
                  Visa, Mastercard, Amex
                </span>
              </button>

              {/* Option 2: Bank Transfer */}
              <button
                className="payment-option-card"
                onClick={() => handleMethodSelect("bank-transfer")}
              >
                <BsBank2 size={36} />
                <span className="payment-option-title">Bank Transfer</span>
                <span className="payment-option-desc">
                  Direct bank deposit
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default OrderHistory;