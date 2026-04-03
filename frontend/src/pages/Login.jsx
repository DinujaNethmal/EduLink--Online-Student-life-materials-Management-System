import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { loginUser } from "../services/api";
import toast from "react-hot-toast";
import "./styles.css";

const initialForm = {
  email: "",
  password: "",
};

export default function Login() {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

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
      const res = await loginUser({ email: form.email, password: form.password });
      const { token, user } = res.data;

      login(user, token);
      toast.success(`Welcome back, ${user.name}!`);

      if (user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (err) {
      const msg = err.response?.data?.message || "Login failed. Please check your credentials.";
      setErrors({ email: msg });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-page auth-split-page">
      <section className="auth-visual-panel">
        <div className="auth-visual-content">
          <h2>Welcome Back</h2>
          <p>
            Continue your EduLink journey, manage groups, and stay connected
            with the right teammates.
          </p>
        </div>
      </section>

      <div className="auth-card auth-card-glass">
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
