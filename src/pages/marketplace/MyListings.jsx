// ============================================================
// pages/MyListings.jsx — Current User's Product Listings
// ============================================================
// Displays all products listed by the logged-in user.
// Each listing has Edit and Delete actions.
// Shows an empty state with a link to create a new listing.
// ============================================================

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FiEdit2, FiTrash2, FiPlusCircle } from "react-icons/fi";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import { getProducts, deleteProduct } from "../../services/api";
import "./MyListings.css";

function MyListings() {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMyProducts = async () => {
    try {
      const res = await getProducts({ sellerId: user.id });
      setProducts(res.data.products);
    } catch {
      toast.error("Failed to load your listings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyProducts();
  }, []);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete "${name}"? This cannot be undone.`)) return;
    try {
      await deleteProduct(id);
      toast.success("Product deleted");
      setProducts((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete");
    }
  };

  if (loading) return <div className="my-listings container"><p>Loading...</p></div>;

  return (
    <div className="my-listings container">
      <div className="listings-header">
        <h1 className="page-title">My Listings</h1>
        <Link to="/marketplace/sell" className="btn btn-gold">
          <FiPlusCircle size={18} /> New Listing
        </Link>
      </div>

      {products.length === 0 ? (
        <div className="empty-state">
          <p>You haven't listed anything yet.</p>
          <Link to="/marketplace/sell" className="btn btn-primary btn-lg">List Your First Item</Link>
        </div>
      ) : (
        <div className="listings-table-wrapper">
          <table className="listings-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Condition</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p._id}>
                  <td>
                    <Link to={`/product/${p._id}`} className="product-name-link">{p.name}</Link>
                  </td>
                  <td>{p.category}</td>
                  <td>LKR {p.price.toLocaleString()}</td>
                  <td>{p.stock}</td>
                  <td>{p.condition}</td>
                  <td className="actions-cell">
                    <Link to={`/marketplace/edit-product/${p._id}`} className="btn btn-sm btn-outline" title="Edit">
                      <FiEdit2 size={14} />
                    </Link>
                    <button className="btn btn-sm btn-danger" title="Delete" onClick={() => handleDelete(p._id, p.name)}>
                      <FiTrash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default MyListings;
