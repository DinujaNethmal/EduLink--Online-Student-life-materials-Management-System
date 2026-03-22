// ============================================================
// pages/EditProduct.jsx — Edit Existing Product Listing
// ============================================================
// Pre-fills a form with the product's current data (fetched by ID).
// Only the product owner can save changes (enforced by backend).
// ============================================================

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { getProductById, updateProduct } from "../services/api";
import "./ProductForm.css";

const CATEGORIES = [
  "Textbooks",
  "Electronics",
  "Stationery",
  "Clothing",
  "Food & Drinks",
  "Services",
  "Other",
];

const CONDITIONS = ["New", "Like New", "Used - Good", "Used - Fair"];

function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    image: "",
    category: "Textbooks",
    condition: "Used - Good",
    stock: 1,
  });

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await getProductById(id);
        const p = res.data.product;
        setForm({
          name: p.name,
          description: p.description,
          price: p.price,
          image: p.image || "",
          category: p.category,
          condition: p.condition,
          stock: p.stock,
        });
      } catch {
        toast.error("Product not found");
        navigate("/my-listings");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await updateProduct(id, { ...form, price: Number(form.price), stock: Number(form.stock) });
      toast.success("Product updated!");
      navigate("/my-listings");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update product");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="product-form-page container"><p>Loading...</p></div>;

  return (
    <div className="product-form-page container">
      <h1 className="page-title">Edit Product</h1>
      <form onSubmit={handleSubmit} className="product-form">
        <div className="form-group">
          <label htmlFor="name">Product Name</label>
          <input id="name" name="name" value={form.name} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea id="description" name="description" value={form.description} onChange={handleChange} rows={4} required />
        </div>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="price">Price (LKR)</label>
            <input id="price" name="price" type="number" min="0" step="0.01" value={form.price} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="stock">Quantity</label>
            <input id="stock" name="stock" type="number" min="0" value={form.stock} onChange={handleChange} />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="category">Category</label>
            <select id="category" name="category" value={form.category} onChange={handleChange}>
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="condition">Condition</label>
            <select id="condition" name="condition" value={form.condition} onChange={handleChange}>
              {CONDITIONS.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="image">Image URL (optional)</label>
          <input id="image" name="image" value={form.image} onChange={handleChange} />
        </div>
        <div className="form-actions">
          <button type="button" className="btn btn-outline" onClick={() => navigate(-1)}>Cancel</button>
          <button type="submit" className="btn btn-gold btn-lg" disabled={submitting}>
            {submitting ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditProduct;
