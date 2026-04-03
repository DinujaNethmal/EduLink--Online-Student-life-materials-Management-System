# EduLink -- Online Student Life Materials Management System (Frontend)

> **SLIIT Year 2 Group Project** | IT2080 -- Internet Technologies  
> A full-stack MERN application for managing student life materials, marketplace trading, and study collaboration at SLIIT.

---

## Table of Contents

1. [Project Overview](#project-overview)  
2. [Tech Stack](#tech-stack)  
3. [Project Structure](#project-structure)  
4. [Getting Started](#getting-started)  
5. [All Application Routes](#all-application-routes)  
6. [Key Architecture Decisions](#key-architecture-decisions)  
7. [SLIIT Brand Design System](#sliit-brand-design-system)  
8. [How the Branch Merge Was Done](#how-the-branch-merge-was-done)  
9. [Team Contributions](#team-contributions)  

---

## Project Overview

EduLink is a comprehensive platform built exclusively for SLIIT students. It combines several student-life tools into a single, cohesive web application:

- **Student Profiles** -- Manage personal academic information and track progress.
- **Study Group Finder** -- Discover, create, and join study groups across modules.
- **Quiz Portal** -- Take quizzes and review performance analytics.
- **Marketplace** -- Buy and sell student materials (textbooks, notes, electronics, etc.) with full e-commerce functionality including cart, checkout, and payment processing.
- **Admin Dashboard** -- University administrators can monitor platform analytics, manage users, and oversee marketplace products.

This repository contains the **React frontend** which connects to a separate **Express.js / MongoDB backend** (running on port 5000). The frontend was constructed by merging three independent feature branches, each developed by a different team member:

| Branch Owner | Features Developed |
|--------------|--------------------|
| **Dinuja** | Landing page, login/register with glass morphism UI, student profile management, study group finder, quiz portal, admin dashboard with analytics tabs |
| **Tarini** | Full marketplace UI -- product browsing with search/filter, product detail page, shopping cart, checkout flow, order history, seller features (create/edit/manage listings), admin user & product management tabs |
| **Sahlaan** | Payment gateway UI -- credit card payment form and bank transfer page with receipt upload |

---

## Tech Stack

| Category | Technology | Version | Purpose |
|----------|-----------|---------|---------|
| **Framework** | React | 19 | Component-based UI library |
| **Build Tool** | Vite | 8 | Fast dev server with HMR and production bundler |
| **Routing** | React Router DOM | 7 | Client-side routing with nested routes |
| **HTTP Client** | Axios | -- | Centralized API communication with interceptors |
| **Animations** | Framer Motion | -- | Declarative animations and page transitions |
| **Icons** | React Icons (Feather) | -- | Lightweight icon set used across the UI |
| **Icons** | Lucide React | -- | Additional icon set for marketplace pages |
| **Notifications** | React Hot Toast | -- | Toast notifications for user feedback |
| **Styling** | Plain CSS (per-component) | -- | No CSS framework; each component/page has its own stylesheet |

### Why These Choices?

- **React 19 + Vite 8**: Vite provides near-instant hot module replacement (HMR) during development and optimized production builds. React 19 is the latest stable release with improved performance.
- **No CSS framework**: Each team member had creative freedom to style their own pages. CSS custom properties (variables) in `index.css` provide brand consistency without imposing a framework.
- **Axios over fetch**: Axios supports request/response interceptors (used for automatic JWT attachment), has cleaner syntax for error handling, and works consistently across browsers.
- **React Context over Redux**: The authentication state is simple enough (user object + token) that React Context API is sufficient. No need for the boilerplate of Redux.

---

## Project Structure

```
EduLinkMarketPlace-Frontend/
├── index.html                         # Single HTML entry point (Vite injects React here)
├── package.json                       # Dependencies and npm scripts
├── vite.config.js                     # Vite configuration + API proxy setup
├── eslint.config.js                   # ESLint rules
├── public/                            # Static assets served as-is
│
└── src/
    ├── main.jsx                       # App entry: BrowserRouter, AuthProvider, Toaster
    ├── App.jsx                        # All route definitions + unified Navbar rendering
    ├── App.css                        # Layout: .main-content with padding-top for fixed navbar
    ├── index.css                      # Global base styles + SLIIT brand CSS variables
    │
    ├── context/
    │   └── AuthContext.jsx            # Global authentication state via React Context API
    │
    ├── services/
    │   └── api.js                     # Centralized Axios client with JWT interceptor
    │
    ├── components/
    │   ├── Navbar.jsx                 # Unified navigation bar (rendered on all pages)
    │   ├── Navbar.css                 # Navbar styles (responsive, hamburger menu)
    │   ├── ProductCard.jsx            # Reusable product card for marketplace grid
    │   ├── ProductCard.css            # Product card styles
    │   ├── CartItem.jsx               # Cart item row component
    │   └── CartItem.css               # Cart item styles
    │
    └── pages/
        │
        │   ── Main Site Pages (Dinuja) ──
        │
        ├── Home.jsx                   # Landing page with animated feature sections
        ├── Home.css                   # Landing page styles
        ├── Login.jsx                  # User login with glass morphism UI
        ├── Register.jsx               # New account registration
        ├── ForgotPassword.jsx         # Password reset (placeholder page)
        ├── styles.css                 # Shared CSS for all auth pages (glass theme)
        ├── Profile.jsx                # Student profile management
        ├── FindingGroups.jsx          # Study group finder (browse + create groups)
        ├── ModernPages.css            # Shared styles for Profile + Groups pages
        │
        │   ── Admin Dashboard ──
        │
        ├── AdminDashboard.jsx         # Unified admin dashboard (6-tab layout)
        ├── AdminDashboard.css         # Admin dashboard container styles
        ├── AdminDashboard/
        │   ├── DashboardOverview.jsx  # Tab 1: Platform-wide statistics overview
        │   ├── DashboardOverview.css
        │   ├── MarketplaceAnalytics.jsx # Tab 2: Marketplace sales & listing analytics
        │   ├── MarketplaceAnalytics.css
        │   ├── QuizAnalytics.jsx      # Tab 3: Quiz performance analytics
        │   ├── QuizAnalytics.css
        │   ├── StudentProgress.jsx    # Tab 4: Individual student progress tracking
        │   ├── StudentProgress.css
        │   ├── ManageUsers.jsx        # Tab 5: User CRUD (view, edit, delete users)
        │   └── ManageProducts.jsx     # Tab 6: Product moderation (approve, remove)
        │
        │   ── Marketplace Pages (Tarini + Sahlaan) ──
        │
        └── marketplace/
            ├── Home.jsx               # Marketplace home: search bar, category filter, product grid
            ├── Home.css
            ├── ProductDetail.jsx      # Single product view with add-to-cart
            ├── ProductDetail.css
            ├── CartPage.jsx           # Shopping cart (supports guest users)
            ├── CartPage.css
            ├── ConfirmOrder.jsx       # Order review before payment selection
            ├── ConfirmOrder.css
            ├── OrderSuccess.jsx       # Post-payment order confirmation
            ├── OrderSuccess.css
            ├── OrderHistory.jsx       # User's past orders list
            ├── OrderHistory.css
            ├── CreateProduct.jsx      # Form to list a new product for sale
            ├── EditProduct.jsx        # Form to edit an existing listing
            ├── ProductForm.css        # Shared styles for Create/Edit product forms
            ├── MyListings.jsx         # Manage own product listings (edit, delete)
            ├── MyListings.css
            ├── Profile.jsx            # Marketplace account settings (delete account)
            ├── Profile.css
            ├── CreditCardPayment.jsx  # Credit card payment form (Sahlaan)
            ├── CreditCardPayment.css
            ├── BankTransfer.jsx       # Bank transfer with receipt upload (Sahlaan)
            └── BankTransfer.css
```

---

## Getting Started

### Prerequisites

- **Node.js** (v18 or higher recommended)
- **npm** (comes with Node.js)
- The **EduLink backend** must be running on `http://localhost:5000`

### Installation & Running

```bash
# 1. Clone the repository
git clone <repository-url>
cd EduLinkMarketPlace-Frontend

# 2. Install dependencies
npm install

# 3. Make sure the backend server is running on port 5000

# 4. Start the Vite development server
npm run dev
```

The application will be available at **http://localhost:5173**.

### How the Proxy Works

Vite is configured in `vite.config.js` to proxy all requests that start with `/api` to the backend at `http://localhost:5000`. This means:

- Frontend code calls endpoints like `/api/products` (relative URL).
- Vite's dev server intercepts these and forwards them to `http://localhost:5000/api/products`.
- This completely avoids CORS issues during development.
- In production, a reverse proxy (e.g., Nginx) would handle the same routing.

### Build for Production

```bash
npm run build
```

This creates an optimized production build in the `dist/` folder.

---

## All Application Routes

### Main Site Routes

| Path | Component | Auth Required | Description |
|------|-----------|:------------:|-------------|
| `/` | `Home` | No | Landing page with animated feature sections showcasing EduLink's capabilities |
| `/login` | `Login` | No | User login page with glass morphism UI design |
| `/register` | `Register` | No | New account registration form |
| `/forgot-password` | `ForgotPassword` | No | Password reset page (placeholder implementation) |
| `/profile` | `Profile` | No | Student profile management -- view and edit personal information |
| `/finding-groups` | `FindingGroups` | No | Browse existing study groups and create new ones |
| `/admin` | `AdminDashboard` | Admin only | Unified admin dashboard with 6 tabs (analytics + management) |

### Marketplace Routes

| Path | Component | Auth Required | Description |
|------|-----------|:------------:|-------------|
| `/marketplace` | `marketplace/Home` | No | Product listing page with search bar and category filter |
| `/marketplace/product/:id` | `ProductDetail` | No | Single product detail view with add-to-cart button |
| `/marketplace/cart` | `CartPage` | No | Shopping cart (works for both logged-in and guest users) |
| `/marketplace/confirm-order` | `ConfirmOrder` | No | Review order details before selecting payment method |
| `/marketplace/order-success/:orderId` | `OrderSuccess` | No | Order confirmation page shown after successful payment |
| `/marketplace/orders` | `OrderHistory` | No | List of past orders with Pay Now and Cancel buttons |
| `/marketplace/sell` | `CreateProduct` | Yes | Form to list a new product for sale |
| `/marketplace/edit-product/:id` | `EditProduct` | Yes | Edit an existing product listing |
| `/marketplace/my-listings` | `MyListings` | Yes | View and manage own product listings |
| `/marketplace/profile` | `marketplace/Profile` | Yes | Account settings including account deletion |

### Payment Routes (Sahlaan)

| Path | Component | Auth Required | Description |
|------|-----------|:------------:|-------------|
| `/marketplace/payment/credit-card/:orderId` | `CreditCardPayment` | No | Credit card payment form -- enter card details to complete purchase |
| `/marketplace/payment/bank-transfer/:orderId` | `BankTransfer` | No | Bank transfer option with receipt upload functionality |

---

## Key Architecture Decisions

### 1. Unified Navbar (`Navbar.jsx`)

A single navigation bar component is rendered in `App.jsx` for the entire application, rather than having separate navbars per feature area. This was a deliberate merge decision since both Dinuja and Tarini originally had their own navbars.

**How it works:**

- **Always-visible links**: Home, Profile, Groups, Marketplace -- these appear on every page.
- **Conditional marketplace sub-links**: Cart, Sell, Listings, Orders -- these only appear when the current URL starts with `/marketplace`. This is determined using `location.pathname.startsWith("/marketplace")`.
- **Admin link**: Only visible when the logged-in user has `user.role === "admin"`.
- **Hidden on admin page**: The admin dashboard has its own internal header/sidebar, so the main navbar is hidden when `location.pathname === "/admin"`.
- **Mobile responsive**: On screens narrower than 1024px, the navbar collapses into a hamburger menu.

### 2. Authentication System (`AuthContext.jsx`)

Authentication is managed through React's Context API, providing a global auth state accessible from any component via the `useAuth()` hook.

**The context provides:**

| Property/Method | Type | Description |
|----------------|------|-------------|
| `user` | Object or null | The currently logged-in user object (contains `_id`, `name`, `email`, `role`, etc.) |
| `token` | String or null | The JWT token string used for API authorization |
| `loading` | Boolean | `true` while the app is checking localStorage for an existing session on initial load; prevents a flash of unauthenticated content |
| `login(userData, tokenValue)` | Function | Saves user data and token to both React state and localStorage |
| `logout()` | Function | Clears user data and token from both React state and localStorage |

**Session persistence:** On initial mount, `AuthContext` reads from `localStorage` to restore any existing session. This means users stay logged in across page refreshes and browser tabs.

**Why Context and not Redux?** The auth state is simple (just a user object and a token string). React Context is perfectly suited for this level of complexity and avoids the boilerplate overhead of Redux (actions, reducers, store configuration).

### 3. Centralized API Service (`api.js`)

All backend communication goes through a single Axios instance defined in `src/services/api.js`. This file is approximately 86 lines and covers every API endpoint the frontend needs.

**Key features:**

- **Base URL**: Set to `"/api"` so all calls are relative and go through Vite's dev proxy.
- **JWT Interceptor**: A request interceptor automatically attaches the `Authorization: Bearer <token>` header to every outgoing request if a token exists in localStorage. This means individual components never need to worry about auth headers.
- **Guest User Support**: For cart and order operations, if no user is logged in, the service generates an anonymous UUID and stores it in localStorage. This allows guest users to maintain a cart without creating an account.

**API function categories:**

| Category | Functions | Description |
|----------|-----------|-------------|
| Auth | `loginUser`, `registerUser` | User authentication |
| Products | `getProducts`, `getProductById`, `createProduct`, `updateProduct`, `deleteProduct` | Product CRUD for marketplace |
| Cart | `getCart`, `addToCart`, `updateCartItem`, `removeFromCart` | Shopping cart operations |
| Orders | `buyNow`, `checkout`, `getOrders`, `getOrderById`, `cancelOrder` | Order management and cancellation |
| Payment | `processPayment`, `uploadBankReceipt` | Payment processing |
| Admin | `getUsers`, `updateUser`, `deleteUser`, `getAdminProducts`, `updateProductStatus` | Admin management |
| Analytics | `getDashboardStats`, `getMarketplaceAnalytics`, `getQuizAnalytics`, `getStudentProgress` | Admin dashboard data |
| Profiles | `getUserProfile`, `updateUserProfile` | User profile management |

### 4. Route Protection

Two higher-order components handle route protection:

- **`ProtectedRoute`**: Wraps routes that require any authenticated user. If no user is logged in, it redirects to `/login`.
- **`AdminRoute`**: Wraps routes that require admin privileges. It checks both that a `user` exists AND that `user.role === "admin"`. If either condition fails, it redirects appropriately.

These components are used in `App.jsx` to wrap the relevant `<Route>` elements.

### 5. Vite Dev Proxy (`vite.config.js`)

The Vite configuration includes a proxy rule that forwards all `/api` requests to the backend:

```javascript
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:5000',
      changeOrigin: true
    }
  }
}
```

This setup means:
- No CORS configuration needed during development.
- Frontend code uses clean relative URLs (`/api/products` instead of `http://localhost:5000/api/products`).
- Easy to switch to a different backend URL by changing one line.

---

## SLIIT Brand Design System

The `src/index.css` file defines a set of CSS custom properties (variables) that establish SLIIT's brand identity across the entire application:

```css
:root {
  --sliit-blue: #0C2340;    /* Navy blue -- primary brand color */
  --sliit-gold: #F2A900;    /* Gold -- accent/CTA color */

  /* Supporting grays */
  --gray-50:  #f9fafb;
  --gray-100: #f3f4f6;
  --gray-200: #e5e7eb;
  --gray-300: #d1d5db;
  --gray-400: #9ca3af;
  --gray-500: #6b7280;
  --gray-600: #4b5563;
  --gray-700: #374151;
  --gray-800: #1f2937;
  --gray-900: #111827;

  /* Tokens */
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1);
  --radius-sm: 0.375rem;
  --radius-md: 0.5rem;
  --radius-lg: 0.75rem;
}
```

**Design principles followed:**
- **SLIIT Navy** (`#0C2340`) is used for headers, navigation, primary buttons, and major UI surfaces.
- **SLIIT Gold** (`#F2A900`) is used for call-to-action buttons, highlights, active states, and accent elements.
- The **glass morphism** effect on the login/register pages uses `backdrop-filter: blur()` with semi-transparent backgrounds, creating a frosted glass look over a SLIIT-themed background.

---

## How the Branch Merge Was Done

Since three team members developed features independently on separate branches, a careful merge strategy was required to produce a unified application. Below is a step-by-step account of how this was accomplished.

### Step 1: Page Organization

Each team member's pages were placed in a logical folder structure:

| Developer | Original Location | Merged Location |
|-----------|------------------|-----------------|
| Dinuja | Various files in `src/pages/` | `src/pages/` (root level -- kept in place) |
| Tarini | Various files in `src/pages/` | `src/pages/marketplace/` (moved to subfolder) |
| Sahlaan | Standalone payment pages | `src/pages/marketplace/` (placed alongside marketplace) |

This separation ensures no filename collisions (e.g., both Dinuja and Tarini had a `Home.jsx` and a `Profile.jsx`) and makes the codebase navigable.

### Step 2: Unified Navigation

**Problem:** Both Dinuja and Tarini had built separate navigation bars for their features. Having two navbars would confuse users.

**Solution:** A single unified `Navbar.jsx` was created in `src/components/` that:
- Always shows main site links (Home, Profile, Groups, Marketplace).
- Conditionally shows marketplace-specific sub-links (Cart, Sell, Listings, Orders) only when the user is on a `/marketplace/*` route.
- Handles both authenticated and guest user states.
- Both original navbars were removed.

### Step 3: Centralized Authentication

**Problem:** Dinuja's pages used a raw `localStorage.getItem('currentUser')` pattern for auth checks, while Tarini's marketplace had its own separate authentication logic.

**Solution:** A single `AuthContext` was created that both feature sets now use via the `useAuth()` hook. All direct localStorage access for auth was replaced with context-based calls. This ensures consistent auth state across the entire application.

### Step 4: Centralized API Service

**Problem:** Both Dinuja and Tarini had hardcoded Axios calls like `axios.get('http://localhost:5000/api/...')` scattered throughout their components.

**Solution:** All API calls were consolidated into `src/services/api.js`, a single file exporting named functions for every endpoint. Components now import from this file:

```javascript
// Before (scattered across components)
axios.get('http://localhost:5000/api/products', {
  headers: { Authorization: `Bearer ${token}` }
});

// After (centralized)
import { getProducts } from '../../services/api';
const products = await getProducts();
```

Import paths were updated for the marketplace subfolder (using `../../services/api` instead of `../services/api`).

### Step 5: Route Prefixing

**Problem:** Tarini's marketplace routes used root-level paths (e.g., `/cart`, `/product/:id`), which would conflict with Dinuja's main site routes.

**Solution:** All marketplace routes were prefixed with `/marketplace/`:
- `/cart` became `/marketplace/cart`
- `/product/:id` became `/marketplace/product/:id`
- `/sell` became `/marketplace/sell`
- And so on for all marketplace routes.

All internal `navigate()` calls and `<Link to="...">` components within marketplace pages were updated to use the new prefixed paths.

### Step 6: Admin Dashboard Merge

**Problem:** Dinuja built analytics-focused admin tabs (Overview, Marketplace Analytics, Quiz Analytics, Student Progress), while Tarini built management-focused admin tabs (Manage Users, Manage Products). These needed to coexist.

**Solution:** A single `AdminDashboard.jsx` was created with a unified 6-tab layout:

| Tab # | Tab Name | Source | Component |
|-------|----------|--------|-----------|
| 1 | Dashboard Overview | Dinuja | `DashboardOverview.jsx` |
| 2 | Marketplace Analytics | Dinuja | `MarketplaceAnalytics.jsx` |
| 3 | Quiz Analytics | Dinuja | `QuizAnalytics.jsx` |
| 4 | Student Progress | Dinuja | `StudentProgress.jsx` |
| 5 | Manage Users | Tarini | `ManageUsers.jsx` |
| 6 | Manage Products | Tarini | `ManageProducts.jsx` |

All six tab components are housed in the `src/pages/AdminDashboard/` subfolder and rendered conditionally based on the active tab state.

---

## Team Contributions

### Dinuja

- **Landing Page** (`Home.jsx`): Animated hero section and feature showcases using Framer Motion.
- **Authentication UI** (`Login.jsx`, `Register.jsx`, `ForgotPassword.jsx`): Glass morphism design with frosted glass cards over a themed background.
- **Student Profile** (`Profile.jsx`): View and edit personal academic information.
- **Study Groups** (`FindingGroups.jsx`): Browse study groups, filter by module, and create new groups.
- **Quiz Portal**: Quiz-taking interface and performance tracking.
- **Admin Analytics** (`DashboardOverview`, `MarketplaceAnalytics`, `QuizAnalytics`, `StudentProgress`): Data visualization and statistics for administrators.
- **MongoDB Atlas**: Database setup and configuration on MongoDB Atlas cloud.

### Tarini

- **Marketplace Home** (`marketplace/Home.jsx`): Product grid with real-time search and category filtering.
- **Product Detail** (`ProductDetail.jsx`): Full product view with image, description, and add-to-cart.
- **Shopping Cart** (`CartPage.jsx`): Cart management with quantity updates and item removal; supports guest users.
- **Checkout Flow** (`ConfirmOrder.jsx`, `OrderSuccess.jsx`): Order review, payment method selection, and success confirmation.
- **Order History** (`OrderHistory.jsx`): View past orders with status tracking, Pay Now button for unpaid orders, and Cancel button to cancel unpaid orders.
- **Seller Features** (`CreateProduct.jsx`, `EditProduct.jsx`, `MyListings.jsx`): Full CRUD for product listings.
- **JWT Auth Integration**: Implemented token-based authentication flow on the frontend.
- **Admin Management** (`ManageUsers.jsx`, `ManageProducts.jsx`): User and product CRUD for administrators.

### Sahlaan

- **Credit Card Payment** (`CreditCardPayment.jsx`): Payment form with card number, expiry, and CVV fields; validates input and processes payment via the backend.
- **Bank Transfer** (`BankTransfer.jsx`): Bank transfer instructions page with receipt upload functionality for proof of payment.
- **Payment Processing Flow**: Connected payment pages to the order flow, handling navigation from checkout to payment to order confirmation.

---

## Additional Notes

### Environment & Ports

| Service | Port | URL |
|---------|------|-----|
| Frontend (Vite dev server) | 5173 | `http://localhost:5173` |
| Backend (Express.js) | 5000 | `http://localhost:5000` |
| Database (MongoDB Atlas) | -- | Cloud-hosted |

### Browser Compatibility

The application targets modern browsers (Chrome, Firefox, Safari, Edge). CSS features like `backdrop-filter` (used in glass morphism) require a modern browser.

### Known Limitations

- `ForgotPassword.jsx` is a placeholder and does not yet send password reset emails.
- Payment processing is simulated -- no real payment gateway (Stripe, PayPal, etc.) is integrated.
- Some routes marked as "No Auth Required" still behave differently when a user is logged in (e.g., the cart page associates items with the user account).

---

*Built with React + Vite for SLIIT University -- IT2080 Internet Technologies Module*
