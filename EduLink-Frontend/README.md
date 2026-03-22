# EduLink Frontend - SLIIT Student Marketplace

A **React** single-page application for the SLIIT Student Marketplace. Students can browse products, search and filter by category, manage their shopping cart, and place orders — all with a responsive, modern UI.

---

## Table of Contents

- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Pages & Features](#pages--features)
  - [Home Page](#home-page--browse-products)
  - [Product Detail Page](#product-detail-page)
  - [Cart Page](#cart-page)
  - [Order Success Page](#order-success-page)
  - [Order History Page](#order-history-page)
- [Components](#components)
- [API Service Layer](#api-service-layer)
- [Routing](#routing)
- [Connecting to the Backend](#connecting-to-the-backend)
- [Scripts](#scripts)

---

## Tech Stack

| Technology | Purpose |
|---|---|
| **React 19** | UI library for building components |
| **Vite 8** | Fast dev server and build tool |
| **React Router DOM 7** | Client-side routing (page navigation) |
| **Axios** | HTTP client for API requests |
| **React Hot Toast** | Toast notification popups |
| **React Icons (Feather)** | Icon library (cart, search, menu, etc.) |
| **ESLint** | Code linting and quality checks |

---

## Project Structure

```
EduLink-Frontend/
├── public/
│   ├── favicon.svg              # Browser tab icon
│   └── icons.svg                # SVG icon sprite
├── src/
│   ├── components/
│   │   ├── Navbar.jsx           # Top navigation bar (brand, links, cart badge)
│   │   ├── Navbar.css
│   │   ├── ProductCard.jsx      # Product card for grid display
│   │   ├── ProductCard.css
│   │   ├── CartItem.jsx         # Single item row in the cart
│   │   └── CartItem.css
│   ├── pages/
│   │   ├── Home.jsx             # Homepage — search, filter, product grid
│   │   ├── Home.css
│   │   ├── ProductDetail.jsx    # Full product view with quantity selector
│   │   ├── ProductDetail.css
│   │   ├── CartPage.jsx         # Shopping cart with checkout
│   │   ├── CartPage.css
│   │   ├── OrderSuccess.jsx     # Order confirmation after purchase
│   │   ├── OrderSuccess.css
│   │   ├── OrderHistory.jsx     # List of all past orders
│   │   └── OrderHistory.css
│   ├── services/
│   │   └── api.js               # Centralized API client (Axios)
│   ├── App.jsx                  # Root component with route definitions
│   ├── App.css                  # App-level layout styles
│   ├── main.jsx                 # Entry point — renders the app to DOM
│   └── index.css                # Global styles (fonts, colors, resets)
├── index.html                   # HTML template with #root div
├── vite.config.js               # Vite config (React plugin + API proxy)
├── eslint.config.js             # ESLint configuration
└── package.json                 # Dependencies and scripts
```

---

## Getting Started

### Prerequisites

- **Node.js** v18 or higher
- **npm** (comes with Node.js)
- **EduLink Backend** running on port 5000 (see the [backend repo](https://github.com/tarini0782/EduLink-Backend))

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/tarini0782/EduLink-Frontend.git
cd EduLink-Frontend

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
```

The frontend will start on **http://localhost:5173** (Vite's default port).

### Important: Start the Backend First!

The frontend expects the backend API to be running on port 5000. Start it before using the frontend:

```bash
# In a separate terminal
cd EduLink-Backend
npm run dev
# → Server running on port 5000
```

Vite's proxy (configured in `vite.config.js`) automatically forwards all `/api/*` requests from the frontend to `http://localhost:5000`.

---

## Pages & Features

### Home Page — Browse Products

**Route:** `/`

The main landing page where users can discover products.

| Feature | Description |
|---|---|
| **Hero Section** | Welcome banner with the marketplace tagline |
| **Search Bar** | Search products by name or description (case-insensitive) |
| **Category Filters** | Filter by: All, Textbooks, Electronics, Stationery, Clothing, Food & Drinks, Services, Other |
| **Product Grid** | Responsive grid of ProductCard components |
| **Loading State** | Spinner while fetching products |
| **Error State** | Helpful message if the backend is unreachable, with a "Try Again" button |
| **Empty State** | "No products found" message with a "Clear Filters" option |

---

### Product Detail Page

**Route:** `/product/:id`

Shows full details for a single product when clicked from the grid.

| Feature | Description |
|---|---|
| **Product Image** | Large image or colored placeholder based on category |
| **Product Info** | Name, description, seller, category, condition |
| **Price & Stock** | Price in LKR and stock availability indicator |
| **Quantity Selector** | +/- buttons (min: 1, max: available stock) |
| **Add to Cart** | Adds the selected quantity to the shopping cart |
| **Buy Now** | Instantly purchases the product and redirects to order confirmation |
| **Back Button** | Returns to the previous page |

---

### Cart Page

**Route:** `/cart`

Manages the user's shopping cart.

| Feature | Description |
|---|---|
| **Cart Items List** | Each item shows thumbnail, name, seller, price, quantity controls, and subtotal |
| **Quantity Controls** | +/- buttons to adjust quantity per item |
| **Remove Item** | Trash icon to delete a single item |
| **Clear Cart** | Button to remove all items at once |
| **Order Summary** | Sidebar showing total item count and total price |
| **Proceed to Checkout** | Purchases all cart items and redirects to confirmation |
| **Empty Cart State** | Friendly message with a link to browse products |

---

### Order Success Page

**Route:** `/order-success/:orderId`

Confirmation page shown after a successful purchase.

| Feature | Description |
|---|---|
| **Success Icon** | Green checkmark animation |
| **Order ID** | Unique order reference number |
| **Items List** | Name, quantity, and subtotal for each item |
| **Total Paid** | Final amount |
| **Order Status** | Current status (e.g., "Pending") |
| **Navigation Links** | "View My Orders" and "Continue Shopping" |

---

### Order History Page

**Route:** `/orders`

Lists all past orders for the current user.

| Feature | Description |
|---|---|
| **Order Cards** | One card per order with header, items, and footer |
| **Short Order ID** | Last 8 characters of the MongoDB ID (uppercased) |
| **Order Type Badge** | "Buy Now" or "Cart Checkout" |
| **Status Badge** | Pending, Confirmed, Delivered, or Cancelled |
| **Item Details** | Product name, quantity, and line item total |
| **Date & Time** | Formatted in Sri Lanka locale (e.g., "Mar 18, 2026, 02:30 PM") |
| **Total Amount** | Total for each order |
| **Empty State** | "No orders yet" message with browse link |

---

## Components

### Navbar (`src/components/Navbar.jsx`)

Persistent top navigation bar visible on every page.

- **Brand logo** — links to the homepage
- **Nav links** — Browse, My Orders, Cart (with active state highlighting)
- **Cart badge** — shows total item count (auto-refreshes on page navigation)
- **Mobile menu** — hamburger toggle for responsive layout

### ProductCard (`src/components/ProductCard.jsx`)

Reusable card displayed in the product grid on the Home page.

- **Colored placeholder** — category-based background color when no image
- **Category & condition badges** — overlaid on the image area
- **Quick actions** — "Add to Cart" and "Buy Now" buttons (with `stopPropagation` to prevent card navigation)
- **Click handler** — clicking the card navigates to the full detail page

### CartItem (`src/components/CartItem.jsx`)

A single item row in the shopping cart.

- **Thumbnail** — product image or colored placeholder
- **Info** — name, seller, unit price
- **Quantity controls** — minus/plus buttons
- **Subtotal** — calculated as price * quantity
- **Remove button** — trash icon to delete the item

---

## API Service Layer

All API calls are centralized in `src/services/api.js`. This file creates an Axios instance with `baseURL: "/api"` and exports functions for every endpoint:

| Function | HTTP Method | Endpoint | Description |
|---|---|---|---|
| `getProducts(params)` | GET | `/api/products` | Fetch products with optional filters |
| `getProductById(id)` | GET | `/api/products/:id` | Fetch a single product |
| `getCart()` | GET | `/api/cart/:userId` | Get current user's cart |
| `addToCart(productId, qty)` | POST | `/api/cart/add` | Add item to cart |
| `updateCartItem(productId, qty)` | PUT | `/api/cart/update` | Update item quantity |
| `removeFromCart(productId)` | DELETE | `/api/cart/:userId/item/:productId` | Remove item from cart |
| `clearCart()` | DELETE | `/api/cart/:userId` | Clear entire cart |
| `buyNow(productId, qty)` | POST | `/api/orders/buy-now` | Buy a product instantly |
| `checkout()` | POST | `/api/orders/checkout` | Checkout entire cart |
| `getOrders()` | GET | `/api/orders/:userId` | Get order history |
| `getOrderById(orderId)` | GET | `/api/orders/detail/:orderId` | Get a specific order |

> **Note:** The user ID is currently hardcoded as `"demo-user-001"`. When authentication is added, replace this with the actual logged-in user's ID.

---

## Routing

Defined in `App.jsx` using React Router DOM:

| Path | Component | Description |
|---|---|---|
| `/` | `Home` | Product listing with search and filters |
| `/product/:id` | `ProductDetail` | Full product details and purchase options |
| `/cart` | `CartPage` | Shopping cart management |
| `/order-success/:orderId` | `OrderSuccess` | Order confirmation page |
| `/orders` | `OrderHistory` | All past orders |

---

## Connecting to the Backend

During development, Vite proxies all `/api/*` requests to the backend:

```js
// vite.config.js
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:5000',
      changeOrigin: true,
    },
  },
}
```

This means:
- Frontend runs on `http://localhost:5173`
- API calls like `GET /api/products` are forwarded to `http://localhost:5000/api/products`
- No CORS issues during development

For production, you'll need to either:
1. Serve the frontend build from the Express server, or
2. Configure a reverse proxy (e.g., Nginx) to route `/api` to the backend

---

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the Vite development server (with hot reload) |
| `npm run build` | Build for production (outputs to `dist/`) |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint to check for code issues |
