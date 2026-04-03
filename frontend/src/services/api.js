import axios from "axios";

const API = axios.create({
  baseURL: "/api",
});

// Attach auth token to every request if available
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Helper: get current user ID from localStorage
const getUserId = () => {
  const user = localStorage.getItem("user");
  if (user) return JSON.parse(user).id;

  let guestId = localStorage.getItem("guestId");
  if (!guestId) {
    guestId = "guest-" + crypto.randomUUID();
    localStorage.setItem("guestId", guestId);
  }
  return guestId;
};

// ==================== AUTH APIs ====================
export const registerUser = (data) => API.post("/auth/register", data);
export const loginUser = (data) => API.post("/auth/login", data);
export const getMe = () => API.get("/auth/me");
export const deleteAccount = () => API.delete("/auth/me");

// ==================== PRODUCT APIs ====================
export const getProducts = (params) => API.get("/products", { params });
export const getProductById = (id) => API.get(`/products/${id}`);
export const createProduct = (data) => API.post("/products", data);
export const updateProduct = (id, data) => API.put(`/products/${id}`, data);
export const deleteProduct = (id) => API.delete(`/products/${id}`);

// ==================== CART APIs ====================
export const getCart = () => API.get(`/cart/${getUserId()}`);
export const addToCart = (productId, quantity = 1) =>
  API.post("/cart/add", { userId: getUserId(), productId, quantity });
export const updateCartItem = (productId, quantity) =>
  API.put("/cart/update", { userId: getUserId(), productId, quantity });
export const removeFromCart = (productId) =>
  API.delete(`/cart/${getUserId()}/item/${productId}`);
export const clearCart = () => API.delete(`/cart/${getUserId()}`);

// ==================== ORDER APIs ====================
export const buyNow = (productId, quantity = 1) =>
  API.post("/orders/buy-now", { userId: getUserId(), productId, quantity });
export const checkout = () =>
  API.post("/orders/checkout", { userId: getUserId() });
export const getOrders = () => API.get(`/orders/${getUserId()}`);
export const getOrderById = (orderId) => API.get(`/orders/detail/${orderId}`);

export const cancelOrder = (orderId) => API.put(`/orders/${orderId}/cancel`);

// ==================== PAYMENT APIs ====================
export const processPayment = (orderId, paymentData) => {
  const isFormData = paymentData instanceof FormData;
  return API.post(`/orders/${orderId}/pay`, paymentData, {
    headers: isFormData ? {} : { "Content-Type": "application/json" },
  });
};

// ==================== ADMIN APIs (Tarini's CRUD) ====================
export const getAdminStats = () => API.get("/admin/stats");
export const getAdminUsers = () => API.get("/admin/users");
export const adminDeleteUser = (id) => API.delete(`/admin/users/${id}`);
export const adminUpdateUserRole = (id, role) => API.put(`/admin/users/${id}/role`, { role });
export const getAdminProducts = () => API.get("/admin/products");
export const adminDeleteProduct = (id) => API.delete(`/admin/products/${id}`);

// ==================== ADMIN APIs (Dinuja's Analytics) ====================
export const getAdminDashboardSummary = () => API.get("/admin/dashboard-summary");
export const getMarketplaceAnalytics = () => API.get("/admin/analytics/marketplace");
export const getQuizAnalytics = () => API.get("/admin/analytics/quizzes");
export const getStudentProgress = () => API.get("/admin/student-progress");
export const getPendingProducts = () => API.get("/admin/products/pending");
export const approveProduct = (id, approval) => API.put(`/admin/products/${id}/approve`, { approval });

// ==================== USER PROFILE APIs (Dinuja's) ====================
export const getStudentProfile = (email) => API.get("/users/student", { params: { email } });
export const updateStudentProfile = (data) => API.put("/users/student", data);
