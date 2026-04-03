// ============================================================
// pages/ConfirmOrder.jsx — Order Confirmation Page
// ============================================================
// Shown before an order is actually placed. Gives the user a
// chance to review their order summary and confirm or cancel.
//
// Reached via query params:
//   /confirm-order?type=buy-now&productId=X&quantity=N
//   /confirm-order?type=checkout
//
// For "buy-now": fetches the single product and shows it.
// For "checkout": fetches the user's cart and shows all items.
//
// The "Place Order" button actually calls the backend API.
// The payment module can later insert a payment step between
// this page and the order success page.
// ============================================================

import { useState, useEffect } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { FiArrowLeft, FiCheckCircle, FiCreditCard } from "react-icons/fi";
import { BsBank2 } from "react-icons/bs";
import {
  getProductById,
  getCart,
  buyNow,
  checkout,
} from "../../services/api";
import toast from "react-hot-toast";
import "./ConfirmOrder.css";

function ConfirmOrder() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const type = searchParams.get("type"); // "buy-now" or "checkout"
  const productId = searchParams.get("productId");
  const quantity = Number(searchParams.get("quantity")) || 1;

  const [items, setItems] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [placing, setPlacing] = useState(false);
  const [orderId, setOrderId] = useState(null); // set after order is placed

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (type === "buy-now" && productId) {
          const res = await getProductById(productId);
          const p = res.data.product;
          setItems([{ name: p.name, price: p.price, quantity }]);
          setTotalAmount(p.price * quantity);
        } else if (type === "checkout") {
          const res = await getCart();
          const cart = res.data;
          setItems(
            cart.items.map((item) => ({
              name: item.product?.name || "Unknown product",
              price: item.product?.price || 0,
              quantity: item.quantity,
            }))
          );
          setTotalAmount(cart.totalAmount);
        } else {
          toast.error("Invalid order type");
          navigate("/marketplace");
        }
      } catch {
        toast.error("Failed to load order details");
        navigate("/marketplace");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [type, productId, quantity, navigate]);

  const handlePlaceOrder = async () => {
    setPlacing(true);
    try {
      let id;
      if (type === "buy-now") {
        const res = await buyNow(productId, quantity);
        id = res.data.order._id;
      } else {
        const res = await checkout();
        id = res.data.order._id;
      }
      toast.success("Order placed! Choose your payment method.");
      setOrderId(id);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to place order");
    } finally {
      setPlacing(false);
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Loading order summary...</p>
      </div>
    );
  }

  // After order is placed, show payment method selection
  if (orderId) {
    return (
      <div className="confirm-order container">
        <div className="confirm-card">
          <div className="payment-select-icon">
            <FiCheckCircle size={48} color="#28a745" />
          </div>
          <h1>Order Placed!</h1>
          <p className="confirm-subtitle">
            Choose how you'd like to pay for your order.
          </p>

          <div className="confirm-total-row" style={{ marginBottom: "24px" }}>
            <span>Total</span>
            <span className="confirm-total">
              Rs. {totalAmount.toLocaleString()}
            </span>
          </div>

          <div className="payment-methods">
            <button
              className="payment-method-btn"
              onClick={() => navigate(`/marketplace/payment/credit-card/${orderId}`)}
            >
              <FiCreditCard size={28} />
              <div>
                <strong>Credit / Debit Card</strong>
                <span>Pay securely with your card</span>
              </div>
            </button>

            <button
              className="payment-method-btn"
              onClick={() => navigate(`/marketplace/payment/bank-transfer/${orderId}`)}
            >
              <BsBank2 size={28} />
              <div>
                <strong>Bank Transfer</strong>
                <span>Transfer directly to our bank account</span>
              </div>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="confirm-order container">
      <button className="back-btn" onClick={() => navigate(-1)}>
        <FiArrowLeft size={18} />
        Back
      </button>

      <div className="confirm-card">
        <h1>Confirm Your Order</h1>
        <p className="confirm-subtitle">
          Review your order, then place it to proceed to payment.
        </p>

        {/* Order Items */}
        <div className="confirm-items">
          {items.map((item, index) => (
            <div key={index} className="confirm-item-row">
              <div className="confirm-item-info">
                <span className="confirm-item-name">{item.name}</span>
                <span className="confirm-item-qty">x{item.quantity}</span>
              </div>
              <span className="confirm-item-price">
                Rs. {(item.price * item.quantity).toLocaleString()}
              </span>
            </div>
          ))}
        </div>

        {/* Total */}
        <div className="confirm-total-row">
          <span>Total</span>
          <span className="confirm-total">
            Rs. {totalAmount.toLocaleString()}
          </span>
        </div>

        {/* Actions */}
        <div className="confirm-actions">
          <button
            className="btn btn-gold btn-lg"
            onClick={handlePlaceOrder}
            disabled={placing}
          >
            <FiCheckCircle size={18} />
            {placing ? "Placing Order..." : "Place Order & Pay"}
          </button>
          <Link to="/marketplace" className="btn btn-outline btn-lg">
            Cancel
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ConfirmOrder;
