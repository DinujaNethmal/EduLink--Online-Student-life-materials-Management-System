// ============================================================
// pages/BankTransfer.jsx — Bank Transfer Payment
// User submits their bank details + payment slip upload.
// After confirmation it redirects back to /orders.
// ============================================================

import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FiArrowLeft, FiUpload, FiCheckCircle } from "react-icons/fi";
import { BsBank2 } from "react-icons/bs";
import { processPayment } from "../../services/api";
import "./BankTransfer.css";

// Sri Lankan banks list
const SL_BANKS = [
  "Bank of Ceylon",
  "People's Bank",
  "Commercial Bank of Ceylon",
  "Hatton National Bank (HNB)",
  "Sampath Bank",
  "Seylan Bank",
  "Nations Trust Bank (NTB)",
  "DFCC Bank",
  "National Development Bank (NDB)",
  "Pan Asia Banking Corporation",
  "Cargills Bank",
  "Amana Bank",
  "Other",
];

// ── Your store's receiving bank details ──
// ⚠ Replace these with your actual business bank details
const STORE_BANK = {
  bank: "Commercial Bank of Ceylon",
  accountName: "EduLink (Pvt) Ltd",
  accountNumber: "8001234567",
  branch: "Colombo 03",
};

const validateBankForm = (fields) => {
  const errors = {};
  if (!fields.accountHolder.trim())
    errors.accountHolder = "Account holder name is required";
  if (!fields.bankName)
    errors.bankName = "Please select your bank";
  if (!fields.accountNumber.trim()) {
    errors.accountNumber = "Account number is required";
  } else if (!/^\d{8,16}$/.test(fields.accountNumber.replace(/[\s-]/g, ""))) {
    errors.accountNumber = "Enter a valid account number (8–16 digits)";
  }
  if (!fields.branchName.trim())
    errors.branchName = "Branch name is required";
  if (!fields.paymentSlip)
    errors.paymentSlip = "Please upload your payment slip or receipt";
  return errors;
};

function BankTransfer() {
  const { orderId } = useParams();
  const navigate = useNavigate();

  const referenceCode = `ORDER-${orderId.slice(-8).toUpperCase()}`;

  const [fields, setFields] = useState({
    accountHolder: "",
    bankName: "",
    accountNumber: "",
    branchName: "",
    reference: referenceCode,
    paymentSlip: null,
  });
  const [errors, setErrors] = useState({});
  const [slipPreview, setSlipPreview] = useState(null); // image URL or "pdf"
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFields((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const allowed = ["image/jpeg", "image/png", "image/webp", "application/pdf"];
    if (!allowed.includes(file.type)) {
      setErrors((prev) => ({
        ...prev,
        paymentSlip: "Only JPG, PNG, WEBP, or PDF files are allowed",
      }));
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setErrors((prev) => ({
        ...prev,
        paymentSlip: "File size must be under 5 MB",
      }));
      return;
    }

    setFields((prev) => ({ ...prev, paymentSlip: file }));
    setErrors((prev) => ({ ...prev, paymentSlip: "" }));

    // Generate a preview URL for images only
    if (file.type.startsWith("image/")) {
      setSlipPreview(URL.createObjectURL(file));
    } else {
      setSlipPreview("pdf");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateBankForm(fields);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setSubmitting(true);
    setSubmitError("");

    try {
      // Use FormData to include the file upload
      const formData = new FormData();
      formData.append("method", "bank_transfer");
      formData.append("accountHolder", fields.accountHolder);
      formData.append("bankName", fields.bankName);
      formData.append("accountNumber", fields.accountNumber);
      formData.append("branchName", fields.branchName);
      formData.append("reference", fields.reference);
      formData.append("paymentSlip", fields.paymentSlip);

      await processPayment(orderId, formData);
      navigate("/marketplace/orders", { state: { paymentSuccess: true } });
    } catch {
      setSubmitError(
        "Submission failed. Please try again or contact support."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="payment-page container">
      <button className="btn-back" onClick={() => navigate(-1)}>
        <FiArrowLeft size={16} /> Back to Orders
      </button>

      <div className="payment-card-wrapper">
        {/* Page Header */}
        <div className="payment-card-header">
          <div className="payment-header-icon bank-icon">
            <BsBank2 size={24} />
          </div>
          <div>
            <h1>Bank Transfer</h1>
            <p>Order #{orderId.slice(-8).toUpperCase()}</p>
          </div>
        </div>

        {/* Store's bank details — user transfers TO this account */}
        <div className="bank-info-box">
          <p className="bank-info-title">Transfer to this account</p>
          <div className="bank-info-row">
            <span>Bank</span>
            <strong>{STORE_BANK.bank}</strong>
          </div>
          <div className="bank-info-row">
            <span>Account Name</span>
            <strong>{STORE_BANK.accountName}</strong>
          </div>
          <div className="bank-info-row">
            <span>Account Number</span>
            <strong className="highlight-text">{STORE_BANK.accountNumber}</strong>
          </div>
          <div className="bank-info-row">
            <span>Branch</span>
            <strong>{STORE_BANK.branch}</strong>
          </div>
          <div className="bank-info-row">
            <span>Reference / Remark</span>
            <strong className="highlight-text">{referenceCode}</strong>
          </div>
        </div>

        <form className="payment-form" onSubmit={handleSubmit} noValidate>
          <p className="form-section-label">Your Payment Details</p>

          {/* Account Holder Name */}
          <div className={`form-group ${errors.accountHolder ? "has-error" : ""}`}>
            <label htmlFor="accountHolder">Account Holder Name</label>
            <input
              id="accountHolder"
              name="accountHolder"
              type="text"
              placeholder="Name as shown on your bank account"
              value={fields.accountHolder}
              onChange={handleChange}
            />
            {errors.accountHolder && (
              <span className="field-error">⚠ {errors.accountHolder}</span>
            )}
          </div>

          {/* Bank Name */}
          <div className={`form-group ${errors.bankName ? "has-error" : ""}`}>
            <label htmlFor="bankName">Your Bank</label>
            <select
              id="bankName"
              name="bankName"
              value={fields.bankName}
              onChange={handleChange}
            >
              <option value="">-- Select your bank --</option>
              {SL_BANKS.map((bank) => (
                <option key={bank} value={bank}>
                  {bank}
                </option>
              ))}
            </select>
            {errors.bankName && (
              <span className="field-error">⚠ {errors.bankName}</span>
            )}
          </div>

          {/* Account Number + Branch */}
          <div className="form-row">
            <div className={`form-group ${errors.accountNumber ? "has-error" : ""}`}>
              <label htmlFor="accountNumber">Your Account Number</label>
              <input
                id="accountNumber"
                name="accountNumber"
                type="text"
                placeholder="e.g. 0012345678"
                value={fields.accountNumber}
                onChange={handleChange}
                inputMode="numeric"
              />
              {errors.accountNumber && (
                <span className="field-error">⚠ {errors.accountNumber}</span>
              )}
            </div>

            <div className={`form-group ${errors.branchName ? "has-error" : ""}`}>
              <label htmlFor="branchName">Your Branch</label>
              <input
                id="branchName"
                name="branchName"
                type="text"
                placeholder="e.g. Nugegoda"
                value={fields.branchName}
                onChange={handleChange}
              />
              {errors.branchName && (
                <span className="field-error">⚠ {errors.branchName}</span>
              )}
            </div>
          </div>

          {/* Reference — read only */}
          <div className="form-group">
            <label htmlFor="reference">Payment Reference (use when transferring)</label>
            <input
              id="reference"
              name="reference"
              type="text"
              value={fields.reference}
              readOnly
              className="input-readonly"
            />
            <span className="field-hint">
              ℹ️ Use this exact reference in your bank transfer remarks
            </span>
          </div>

          {/* Payment Slip Upload */}
          <div className={`form-group ${errors.paymentSlip ? "has-error" : ""}`}>
            <label>Upload Payment Slip / Receipt</label>
            <label className="file-upload-zone" htmlFor="paymentSlipInput">
              {slipPreview ? (
                slipPreview === "pdf" ? (
                  <div className="slip-pdf-preview">
                    <FiCheckCircle size={32} />
                    <span>{fields.paymentSlip.name}</span>
                    <small>Click to change</small>
                  </div>
                ) : (
                  <div className="slip-img-wrapper">
                    <img
                      src={slipPreview}
                      alt="Payment slip preview"
                      className="slip-img-preview"
                    />
                    <div className="slip-img-overlay">Click to change</div>
                  </div>
                )
              ) : (
                <div className="file-upload-placeholder">
                  <FiUpload size={28} />
                  <span>Click to upload your payment slip</span>
                  <small>JPG, PNG, WEBP or PDF · Max 5 MB</small>
                </div>
              )}
            </label>
            <input
              id="paymentSlipInput"
              type="file"
              accept="image/jpeg,image/png,image/webp,application/pdf"
              onChange={handleFileChange}
              className="file-input-hidden"
            />
            {errors.paymentSlip && (
              <span className="field-error">⚠ {errors.paymentSlip}</span>
            )}
          </div>

          {/* Server error */}
          {submitError && (
            <div className="submit-error">{submitError}</div>
          )}

          <button type="submit" className="btn-submit" disabled={submitting}>
            {submitting ? <span className="btn-spinner" /> : "Confirm Payment"}
          </button>

          <p className="secure-note">
            📋 Your transfer will be verified within 24 hours
          </p>
        </form>
      </div>
    </div>
  );
}

export default BankTransfer;