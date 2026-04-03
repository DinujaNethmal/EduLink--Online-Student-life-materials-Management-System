import { useState } from "react";
import { Link } from "react-router-dom";
import "./styles.css";

const initialForm = {
  email: "",
};

export default function ForgotPassword() {
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  const handleChange = (e) => {
    setForm({ email: e.target.value });
    setError("");
  };

  const validate = () => {
    if (!form.email.trim()) {
      setError("Email is required.");
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setError("Please enter a valid email address.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    setError("");

    try {
      // TODO: integrate with backend reset-password API.
      await new Promise((res) => setTimeout(res, 700));
      setSent(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-logo">
            <span className="logo-mark">EL</span>
            <span className="logo-text">EduLink</span>
          </div>
          <h1>Forgot your password?</h1>
          <p>
            Enter your university email and we will send a password reset link.
          </p>
        </div>

        {sent ? (
          <div className="auth-notice">
            <p>
              Password reset instructions have been sent to <strong>{form.email}</strong>.
            </p>
            <Link to="/login" className="btn-secondary btn-full">
              Back to Login
            </Link>
          </div>
        ) : (
          <form className="auth-form" onSubmit={handleSubmit} noValidate>
            <div className="field-group">
              <label htmlFor="email">University Email</label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="e.g. it12345678@my.sliit.lk"
                value={form.email}
                onChange={handleChange}
              />
              {error && <span className="field-error">{error}</span>}
            </div>

            <button
              type="submit"
              className="btn-primary btn-full"
              disabled={submitting}
            >
              {submitting ? "Sending link..." : "Send reset link"}
            </button>
          </form>
        )}

        <div className="auth-footer">
          <span>Remember your password?</span>
          <Link to="/login">Back to Login</Link>
        </div>
      </div>
    </div>
  );
}
