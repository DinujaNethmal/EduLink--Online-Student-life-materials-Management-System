import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const initialForm = {
  email: "",
  password: "",
};

export default function Login() {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const nextErrors = {};

    if (!form.email.trim()) {
      nextErrors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      nextErrors.email = "Please enter a valid email address.";
    }

    if (!form.password) {
      nextErrors.password = "Password is required.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);

    try {
      // TODO: integrate with backend login API.
      await new Promise((res) => setTimeout(res, 600));
      navigate("/");
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
          <h1>Welcome back</h1>
          <p>Login to manage your student profile, groups, and learning space.</p>
        </div>

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
            {errors.email && <span className="field-error">{errors.email}</span>}
          </div>

          <div className="field-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="Enter your password"
              value={form.password}
              onChange={handleChange}
            />
            {errors.password && (
              <span className="field-error">{errors.password}</span>
            )}
          </div>

          <div className="auth-row auth-right">
            <Link to="/forgot-password" className="auth-link">
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            className="btn-primary btn-full"
            disabled={submitting}
          >
            {submitting ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="auth-footer">
          <span>New to EduLink?</span>
          <Link to="/register">Create account</Link>
        </div>
      </div>
    </div>
  );
}
