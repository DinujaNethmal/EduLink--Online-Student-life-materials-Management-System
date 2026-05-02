import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './MarketplaceAnalytics.css';

const MarketplaceAnalytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [approvalAction, setApprovalAction] = useState(null);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/admin/analytics/marketplace');
      setAnalytics(response.data.data);

      // Fetch pending products
      const productsResponse = await axios.get('http://localhost:5000/api/admin/products/pending');
      setProducts(productsResponse.data.data);

      setError('');
    } catch (err) {
      setError('Failed to load marketplace analytics');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveProduct = async (productId) => {
    try {
      await axios.put(`http://localhost:5000/api/admin/products/${productId}/approve`, {
        approval: 'approved'
      });
      setApprovalAction(`Product approved!`);
      fetchAnalytics();
      setTimeout(() => setApprovalAction(null), 3000);
    } catch (err) {
      setError('Failed to approve product');
    }
  };

  const handleRejectProduct = async (productId) => {
    try {
      await axios.put(`http://localhost:5000/api/admin/products/${productId}/approve`, {
        approval: 'rejected'
      });
      setApprovalAction(`Product rejected!`);
      fetchAnalytics();
      setTimeout(() => setApprovalAction(null), 3000);
    } catch (err) {
      setError('Failed to reject product');
    }
  };

  if (loading) {
    return <div className="loading">Loading marketplace analytics...</div>;
  }

  return (
    <div className="marketplace-analytics">
      <h2>Marketplace Analytics</h2>

      {error && <div className="error-msg">{error}</div>}
      {approvalAction && <div className="success-msg">{approvalAction}</div>}

      {/* Analytics Cards */}
      <div className="analytics-cards">
        <div className="card">
          <h3>Total Products</h3>
          <p className="value">{analytics?.totalProducts || 0}</p>
        </div>
        <div className="card">
          <h3>Available Products</h3>
          <p className="value">{analytics?.approvedProducts || 0}</p>
        </div>
        <div className="card">
          <h3>Sold Products</h3>
          <p className="value">{analytics?.soldProducts || 0}</p>
        </div>
        <div className="card">
          <h3>Total Revenue</h3>
          <p className="value revenue">Rs. {analytics?.totalRevenue || 0}</p>
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="section">
        <h3>Product Categories</h3>
        <div className="category-breakdown">
          {analytics?.categoryBreakdown && analytics.categoryBreakdown.length > 0 ? (
            analytics.categoryBreakdown.map((cat, index) => (
              <div key={index} className="category-item">
                <span className="category-name">{cat._id || 'Unknown'}</span>
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{
                      width: `${(cat.count / analytics.totalProducts) * 100}%`
                    }}
                  ></div>
                </div>
                <span className="category-count">{cat.count}</span>
              </div>
            ))
          ) : (
            <p>No products available</p>
          )}
        </div>
      </div>

      {/* Recent Products */}
      <div className="section">
        <h3>Recent Products</h3>
        <div className="recent-products">
          {analytics?.recentProducts && analytics.recentProducts.length > 0 ? (
            analytics.recentProducts.map((product) => (
              <div key={product._id} className="product-card">
                <h4>{product.name}</h4>
                <p className="description">{product.description}</p>
                <div className="product-meta">
                  <span className="category">{product.category}</span>
                  <span className="price">Rs. {product.price}</span>
                </div>
                <p className="seller">Seller: {product.seller?.name || 'Unknown'}</p>
              </div>
            ))
          ) : (
            <p>No recent products</p>
          )}
        </div>
      </div>

      {/* Products for Approval */}
      <div className="section">
        <h3>Products Pending Approval</h3>
        <div className="products-approval">
          {products && products.length > 0 ? (
            products.map((product) => (
              <div key={product._id} className="approval-item">
                <div className="product-info">
                  <h4>{product.name}</h4>
                  <p className="category">Category: {product.category}</p>
                  <p className="price">Price: Rs. {product.price}</p>
                  <p className="seller">Seller: {product.seller?.name} ({product.seller?.email})</p>
                  <p className="description">{product.description}</p>
                </div>
                <div className="approval-actions">
                  <button
                    className="approve-btn"
                    onClick={() => handleApproveProduct(product._id)}
                  >
                    ✓ Approve
                  </button>
                  <button
                    className="reject-btn"
                    onClick={() => handleRejectProduct(product._id)}
                  >
                    ✗ Reject
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="no-products">No products pending approval</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default MarketplaceAnalytics;
