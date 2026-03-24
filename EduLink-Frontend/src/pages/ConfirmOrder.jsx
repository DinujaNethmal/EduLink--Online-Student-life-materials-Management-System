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
import { FiArrowLeft, FiCheckCircle } from "react-icons/fi";
import {
  getProductById,
  getCart,
  buyNow,
  checkout,
} from "../services/api";
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
          navigate("/");
        }
      } catch {
        toast.error("Failed to load order details");
        navigate("/");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [type, productId, quantity, navigate]);

  const handlePlaceOrder = async () => {
    setPlacing(true);
    try {
      let orderId;
      if (type === "buy-now") {
        const res = await buyNow(productId, quantity);
        orderId = res.data.order._id;
      } else {
        const res = await checkout();
        orderId = res.data.order._id;
      }
      toast.success("Order placed successfully!");
      navigate(`/order-success/${orderId}`);
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

  return (
    <div className="confirm-order container">
      <button className="back-btn" onClick={() => navigate(-1)}>
        <FiArrowLeft size={18} />
        Back
      </button>

      <div className="confirm-card">
        <h1>Confirm Your Order</h1>
        <p className="confirm-subtitle">
          Please review your order before placing it.
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

        {/* Payment notice */}
        <p className="confirm-payment-notice">
          Payment will be collected after order placement.
        </p>

        {/* Actions */}
        <div className="confirm-actions">
          <button
            className="btn btn-gold btn-lg"
            onClick={handlePlaceOrder}
            disabled={placing}
          >
            <FiCheckCircle size={18} />
            {placing ? "Placing Order..." : "Place Order"}
          </button>
          <Link to="/" className="btn btn-outline btn-lg">
            Cancel
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ConfirmOrder;
