# EduLink Backend - SLIIT Student Marketplace API

A RESTful API built with **Express.js** and **MongoDB** that powers the SLIIT Student Marketplace. Students can list items for sale, browse products, manage shopping carts, and place orders.

---

## Table of Contents

- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Endpoints](#api-endpoints)
  - [Products](#products)
  - [Cart](#cart)
  - [Orders](#orders)
  - [Health Check](#health-check)
- [Database Models](#database-models)
- [Sample Data](#sample-data)
- [Scripts](#scripts)

---

## Tech Stack

| Technology | Purpose |
|---|---|
| **Express.js 5** | Web framework for REST API |
| **Mongoose 9** | MongoDB ODM (Object Data Modeling) |
| **MongoDB Memory Server** | In-memory MongoDB for zero-config development |
| **Morgan** | HTTP request logger |
| **CORS** | Cross-Origin Resource Sharing for frontend access |
| **dotenv** | Environment variable management |
| **Nodemon** | Auto-restart server on file changes (dev) |

---

## Project Structure

```
EduLink-Backend/
├── config/
│   └── db.js                  # MongoDB connection logic (with in-memory fallback)
├── controllers/
│   ├── productController.js   # Product CRUD business logic
│   ├── cartController.js      # Shopping cart operations
│   └── orderController.js     # Order processing (buy now + checkout)
├── models/
│   ├── Product.js             # Product schema (name, price, category, stock, etc.)
│   ├── Cart.js                # Cart schema (userId, items with product refs)
│   └── Order.js               # Order schema (items snapshot, total, status)
├── routes/
│   ├── productRoutes.js       # Product route definitions
│   ├── cartRoutes.js          # Cart route definitions
│   └── orderRoutes.js         # Order route definitions
├── seeds/
│   └── seedProducts.js        # 10 sample products + seeding script
├── server.js                  # Main entry point — middleware, routes, startup
├── .env.example               # Environment variables template
└── package.json               # Dependencies and scripts
```

---

## Getting Started

### Prerequisites

- **Node.js** v18 or higher
- **npm** (comes with Node.js)
- **MongoDB** (optional — the app falls back to an in-memory database if MongoDB isn't available)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/tarini0782/EduLink-Backend.git
cd EduLink-Backend

# 2. Install dependencies
npm install

# 3. Create your environment file (optional)
cp .env.example .env

# 4. Start the development server
npm run dev
```

The server will start on **http://localhost:5000**. If the database is empty, 10 sample products are automatically seeded.

### Quick Test

```bash
curl http://localhost:5000/api/health
# → { "status": "ok", "message": "SLIIT Marketplace API is running" }

curl http://localhost:5000/api/products
# → { "products": [ ... ] }
```

---

## Environment Variables

Create a `.env` file in the root directory (or copy `.env.example`):

| Variable | Default | Description |
|---|---|---|
| `MONGODB_URI` | `memory` | MongoDB connection string. Set to `memory` or leave blank to use the in-memory database. |
| `PORT` | `5000` | Port the server listens on. |
| `NODE_ENV` | `development` | Environment mode. |

### Database Connection Behavior

1. If `MONGODB_URI` is set to a real MongoDB URI → connects to that database
2. If the connection fails → automatically falls back to an in-memory MongoDB
3. If `MONGODB_URI` is blank or set to `memory` → uses in-memory MongoDB directly

The in-memory database is great for development (no MongoDB install required!) but all data resets when the server restarts.

---

## API Endpoints

### Products

| Method | Endpoint | Description | Body/Params |
|---|---|---|---|
| `GET` | `/api/products` | List all available products | Query: `?category=`, `?search=`, `?sellerId=` |
| `GET` | `/api/products/:id` | Get a single product | - |
| `POST` | `/api/products` | Create a new product listing | JSON body (see below) |
| `PUT` | `/api/products/:id` | Update a product | JSON body (partial update) |
| `DELETE` | `/api/products/:id` | Delete a product | - |

**Create/Update Product body:**

```json
{
  "name": "Arduino Starter Kit",
  "description": "Complete kit with breadboard, LEDs, sensors...",
  "price": 5500,
  "image": "",
  "category": "Electronics",
  "sellerId": "student001",
  "sellerName": "Kamal Perera",
  "condition": "New",
  "stock": 3
}
```

**Valid categories:** `Textbooks`, `Electronics`, `Stationery`, `Clothing`, `Food & Drinks`, `Services`, `Other`

**Valid conditions:** `New`, `Like New`, `Used - Good`, `Used - Fair`

---

### Cart

| Method | Endpoint | Description | Body/Params |
|---|---|---|---|
| `GET` | `/api/cart/:userId` | Get a user's cart (with product details and total) | - |
| `POST` | `/api/cart/add` | Add item to cart (or increase quantity) | `{ userId, productId, quantity }` |
| `PUT` | `/api/cart/update` | Update item quantity | `{ userId, productId, quantity }` |
| `DELETE` | `/api/cart/:userId/item/:productId` | Remove a specific item | - |
| `DELETE` | `/api/cart/:userId` | Clear the entire cart | - |

**Example — Add to cart:**

```bash
curl -X POST http://localhost:5000/api/cart/add \
  -H "Content-Type: application/json" \
  -d '{"userId": "demo-user-001", "productId": "PRODUCT_ID_HERE", "quantity": 1}'
```

---

### Orders

| Method | Endpoint | Description | Body/Params |
|---|---|---|---|
| `POST` | `/api/orders/buy-now` | Buy a single product instantly | `{ userId, productId, quantity }` |
| `POST` | `/api/orders/checkout` | Checkout entire cart | `{ userId }` |
| `GET` | `/api/orders/:userId` | Get order history for a user | - |
| `GET` | `/api/orders/detail/:orderId` | Get a specific order | - |

**Order flow:**
1. **Buy Now** — Creates an order for a single product, deducts stock
2. **Checkout** — Validates all cart items, creates an order, deducts stock for each item, clears the cart

**Order statuses:** `Pending` → `Confirmed` → `Delivered` (or `Cancelled`)

---

### Health Check

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Returns `{ status: "ok" }` if the server is running |

---

## Database Models

### Product

| Field | Type | Required | Description |
|---|---|---|---|
| `name` | String | Yes | Product name |
| `description` | String | Yes | Product description |
| `price` | Number | Yes | Price in LKR (min: 0) |
| `image` | String | No | Image URL (default: empty) |
| `category` | String | Yes | Product category (enum) |
| `sellerId` | String | Yes | Seller's user ID |
| `sellerName` | String | Yes | Seller's display name |
| `condition` | String | No | Item condition (default: "Used - Good") |
| `stock` | Number | No | Available quantity (default: 1) |
| `isAvailable` | Boolean | No | Whether the product is listed (default: true) |
| `createdAt` | Date | Auto | Timestamp |
| `updatedAt` | Date | Auto | Timestamp |

### Cart

| Field | Type | Required | Description |
|---|---|---|---|
| `userId` | String | Yes | Owner's user ID (unique — one cart per user) |
| `items` | Array | - | Array of `{ product: ObjectId, quantity: Number }` |
| `createdAt` | Date | Auto | Timestamp |

### Order

| Field | Type | Required | Description |
|---|---|---|---|
| `userId` | String | Yes | Who placed the order |
| `items` | Array | Yes | Snapshot: `{ product, name, price, quantity, image }` |
| `totalAmount` | Number | Yes | Total price for the order |
| `status` | String | No | Order status (default: "Pending") |
| `orderType` | String | Yes | "buy-now" or "cart-checkout" |
| `createdAt` | Date | Auto | Timestamp |

---

## Sample Data

The database is auto-seeded with **10 sample products** on first run:

| Product | Category | Price (LKR) | Seller |
|---|---|---|---|
| Data Structures & Algorithms Textbook | Textbooks | 3,500 | Kamal Perera |
| Scientific Calculator (Casio fx-991EX) | Electronics | 4,200 | Nimesha Silva |
| Arduino Starter Kit | Electronics | 5,500 | Dinesh Fernando |
| SLIIT Hoodie - Size M | Clothing | 2,000 | Tharushi Jayawardena |
| A4 Lecture Notebooks (Pack of 5) | Stationery | 750 | Nimesha Silva |
| Web Development Bootcamp Notes | Stationery | 1,500 | Kamal Perera |
| Homemade Chocolate Chip Cookies (12 pack) | Food & Drinks | 600 | Sachini Bandara |
| Resume Review Service | Services | 1,000 | Ravindu Wickramasinghe |
| Logitech Wireless Mouse | Electronics | 1,800 | Tharushi Jayawardena |
| Software Engineering Principles (PDF Notes) | Textbooks | 500 | Dinesh Fernando |

---

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the server with auto-reload (uses Nodemon) |
| `npm start` | Start the server for production |
| `npm run seed` | Seed the database with sample products (requires MongoDB URI in .env) |
