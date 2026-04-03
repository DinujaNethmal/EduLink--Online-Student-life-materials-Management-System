import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { registerUser } from "../services/api";
import toast from "react-hot-toast";
import "./styles.css";

const initialForm = {
  name: "",
  email: "",
  password: "",
};

export default function Register() {
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

    if (!form.name.trim()) {
      nextErrors.name = "Name is required.";
    }

    if (!form.email.trim()) {
      nextErrors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      nextErrors.email = "Please enter a valid email address.";
    }

    if (!form.password) {
      nextErrors.password = "Password is required.";
    } else if (form.password.length < 6) {
      nextErrors.password = "Password must be at least 6 characters.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);

    try {
      const res = await registerUser({
        name: form.name,
        email: form.email,
        password: form.password,
      });
      const { token, user } = res.data;
      login(user, token);
      toast.success("Account created successfully!");
      navigate("/");
    } catch (err) {
      const msg = err.response?.data?.message || "Registration failed. Please try again.";
      setErrors({ email: msg });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-page auth-split-page">
      <section className="auth-visual-panel">
        <div className="auth-visual-content">
          <h2>Join EduLink</h2>
          <p>
            Create your account and find smart group opportunities with students
            who match your skills.
          </p>
        </div>
      </section>

      <div className="auth-card auth-card-glass">
        <div className="auth-header">
          <div className="auth-logo">
            <span className="logo-mark">EL</span>
            <span className="logo-text">EduLink</span>
          </div>
          <h1>Create your student account</h1>
          <p>
            Register to access smart group formation, skill-based matching, and
            your student dashboard.
          </p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <div className="field-group">
            <label htmlFor="name">Full Name</label>
            <input
              id="name"
              name="name"
              type="text"
              placeholder="e.g. Kasun Perera"
              value={form.name}
              onChange={handleChange}
            />
            {errors.name && <span className="field-error">{errors.name}</span>}
          </div>

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
            {errors.email && (
              <span className="field-error">{errors.email}</span>
            )}
          </div>

          <div className="field-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="Minimum 6 characters"
              value={form.password}
              onChange={handleChange}
            />
            {errors.password && (
              <span className="field-error">{errors.password}</span>
            )}
          </div>

          <button
            type="submit"
            className="btn-primary btn-full"
            disabled={submitting}
          >
            {submitting ? "Creating account..." : "Create account"}
          </button>
        </form>

        <div className="auth-footer">
          <span>Already registered?</span>
          <Link to="/login">Go to Login</Link>
        </div>
      </div>
    </div>
  );
}

