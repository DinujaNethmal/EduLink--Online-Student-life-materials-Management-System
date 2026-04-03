// ============================================================
// pages/CreditCardPayment.jsx — Credit / Debit Card Payment
// Validates card details using the Luhn Algorithm, then
// calls the processPayment API and redirects to /orders.
// ============================================================

import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FiCreditCard, FiArrowLeft, FiLock } from "react-icons/fi";
import { processPayment } from "../../services/api";
import "./CreditCardPayment.css";

// ── Luhn Algorithm: industry-standard card number check ──
const luhnCheck = (cardNumber) => {
  const digits = cardNumber.replace(/\s/g, "");
  if (!/^\d+$/.test(digits)) return false;
  let sum = 0;
  let alternate = false;
  for (let i = digits.length - 1; i >= 0; i--) {
    let n = parseInt(digits[i], 10);
    if (alternate) {
      n *= 2;
      if (n > 9) n -= 9;
    }
    sum += n;
    alternate = !alternate;
  }
  return sum % 10 === 0;
};

// ── Detect card brand from first digits ──
const detectCardBrand = (number) => {
  const n = number.replace(/\s/g, "");
  if (/^4/.test(n)) return "VISA";
  if (/^5[1-5]/.test(n) || /^2[2-7]/.test(n)) return "Mastercard";
  if (/^3[47]/.test(n)) return "Amex";
  return null;
};

// ── Form validation ──
const validateCard = ({ cardHolder, cardNumber, expiry, cvv }) => {
  const errors = {};

  if (!cardHolder.trim()) {
    errors.cardHolder = "Cardholder name is required";
  } else if (cardHolder.trim().length < 3) {
    errors.cardHolder = "Name must be at least 3 characters";
  }

  const rawCard = cardNumber.replace(/\s/g, "");
  if (!rawCard) {
    errors.cardNumber = "Card number is required";
  } else if (rawCard.length !== 16) {
    errors.cardNumber = "Card number must be exactly 16 digits";
  } else if (!luhnCheck(rawCard)) {
    errors.cardNumber = "Invalid card number";
  }

  if (!expiry) {
    errors.expiry = "Expiry date is required";
  } else if (!/^\d{2}\/\d{2}$/.test(expiry)) {
    errors.expiry = "Use MM/YY format";
  } else {
    const [mm, yy] = expiry.split("/");
    const month = parseInt(mm, 10);
    const year = parseInt(`20${yy}`, 10);
    const now = new Date();
    const expDate = new Date(year, month - 1);
    if (month < 1 || month > 12) {
      errors.expiry = "Invalid month";
    } else if (expDate < new Date(now.getFullYear(), now.getMonth())) {
      errors.expiry = "This card has expired";
    }
  }

  if (!cvv) {
    errors.cvv = "CVV is required";
  } else if (!/^\d{3,4}$/.test(cvv)) {
    errors.cvv = "CVV must be 3 or 4 digits";
  }

  return errors;
};

function CreditCardPayment() {
  const { orderId } = useParams();
  const navigate = useNavigate();

  const [fields, setFields] = useState({
    cardHolder: "",
    cardNumber: "",
    expiry: "",
    cvv: "",
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  // ── Auto-format card number as user types: XXXX XXXX XXXX XXXX ──
  const handleCardNumberChange = (e) => {
    const raw = e.target.value.replace(/\D/g, "").slice(0, 16);
    const formatted = raw.match(/.{1,4}/g)?.join(" ") || raw;
    setFields((prev) => ({ ...prev, cardNumber: formatted }));
    if (errors.cardNumber) setErrors((prev) => ({ ...prev, cardNumber: "" }));
  };

  // ── Auto-format expiry as MM/YY ──
  const handleExpiryChange = (e) => {
    let raw = e.target.value.replace(/\D/g, "").slice(0, 4);
    if (raw.length > 2) raw = `${raw.slice(0, 2)}/${raw.slice(2)}`;
    setFields((prev) => ({ ...prev, expiry: raw }));
    if (errors.expiry) setErrors((prev) => ({ ...prev, expiry: "" }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFields((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateCard(fields);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setSubmitting(true);
    setSubmitError("");

    try {
      // NEVER send CVV to the server — only send safe metadata
      await processPayment(orderId, {
        method: "credit_card",
        cardHolder: fields.cardHolder,
        last4: fields.cardNumber.replace(/\s/g, "").slice(-4),
        brand: detectCardBrand(fields.cardNumber) || "Unknown",
      });
      navigate("/marketplace/orders", { state: { paymentSuccess: true } });
    } catch {
      setSubmitError("Payment failed. Please check your details and try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const cardBrand = detectCardBrand(fields.cardNumber);

  return (
    <div className="payment-page container">
      <button className="btn-back" onClick={() => navigate(-1)}>
        <FiArrowLeft size={16} /> Back to Orders
      </button>

      <div className="payment-card-wrapper">
        {/* Page Header */}
        <div className="payment-card-header">
          <div className="payment-header-icon card-icon">
            <FiCreditCard size={24} />
          </div>
          <div>
            <h1>Card Payment</h1>
            <p>Order #{orderId.slice(-8).toUpperCase()}</p>
          </div>
        </div>

        <form className="payment-form" onSubmit={handleSubmit} noValidate>

          {/* Cardholder Name */}
          <div className={`form-group ${errors.cardHolder ? "has-error" : ""}`}>
            <label htmlFor="cardHolder">Cardholder Name</label>
            <input
              id="cardHolder"
              name="cardHolder"
              type="text"
              placeholder="e.g. Kasun Perera"
              value={fields.cardHolder}
              onChange={handleChange}
              autoComplete="cc-name"
            />
            {errors.cardHolder && (
              <span className="field-error">⚠ {errors.cardHolder}</span>
            )}
          </div>

          {/* Card Number */}
          <div className={`form-group ${errors.cardNumber ? "has-error" : ""}`}>
            <label htmlFor="cardNumber">
              Card Number
              {cardBrand && (
                <span className="card-brand-badge">{cardBrand}</span>
              )}
            </label>
            <input
              id="cardNumber"
              name="cardNumber"
              type="text"
              placeholder="1234 5678 9012 3456"
              value={fields.cardNumber}
              onChange={handleCardNumberChange}
              maxLength={19}
              autoComplete="cc-number"
              inputMode="numeric"
            />
            {errors.cardNumber && (
              <span className="field-error">⚠ {errors.cardNumber}</span>
            )}
          </div>

          {/* Expiry + CVV side by side */}
          <div className="form-row">
            <div className={`form-group ${errors.expiry ? "has-error" : ""}`}>
              <label htmlFor="expiry">Expiry Date</label>
              <input
                id="expiry"
                name="expiry"
                type="text"
                placeholder="MM/YY"
                value={fields.expiry}
                onChange={handleExpiryChange}
                maxLength={5}
                autoComplete="cc-exp"
                inputMode="numeric"
              />
              {errors.expiry && (
                <span className="field-error">⚠ {errors.expiry}</span>
              )}
            </div>

            <div className={`form-group ${errors.cvv ? "has-error" : ""}`}>
              <label htmlFor="cvv">CVV / CVC</label>
              <input
                id="cvv"
                name="cvv"
                type="password"
                placeholder="•••"
                value={fields.cvv}
                onChange={handleChange}
                maxLength={4}
                autoComplete="cc-csc"
                inputMode="numeric"
              />
              {errors.cvv && (
                <span className="field-error">⚠ {errors.cvv}</span>
              )}
            </div>
          </div>

          {/* Server-side error */}
          {submitError && (
            <div className="submit-error">{submitError}</div>
          )}

          <button type="submit" className="btn-submit" disabled={submitting}>
            {submitting ? (
              <span className="btn-spinner" />
            ) : (
              <>
                <FiLock size={16} />
                Pay Now
              </>
            )}
          </button>

          <p className="secure-note">
            🔒 Your payment is encrypted with 256-bit SSL
          </p>
        </form>
      </div>
    </div>
  );
}

export default CreditCardPayment;