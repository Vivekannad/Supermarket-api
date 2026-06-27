# Supermarket Frontend

A clean, minimal e-commerce frontend built with **React**, **Vite**, and **Tailwind CSS** — connected to the [Supermarket API](https://github.com/Vivekannad/Supermarket-api) backend.

---

## Features

- **JWT authentication** — login, register, persistent session via localStorage
- **Role-based routing** — user and admin see completely different interfaces; protected routes redirect unauthorized access
- **Product browsing** — search, filter by category, filter by price range, pagination
- **Product detail** — image, categories, stock badge, quantity selector, add to cart
- **Cart** — add, remove, update quantity, clear, live subtotal and total, item count badge in navbar
- **Checkout** — select specific cart items to order, pre-fill saved address or enter new one, COD payment
- **Orders** — order history with status badges, item thumbnails, cancel (pending only), view detail
- **Order detail** — step-by-step status tracker, items list, delivery address, payment status
- **User profile** — update username/email, change password (verifies current), manage delivery address
- **Admin dashboard** — stats (users, products, orders, revenue, out-of-stock alerts), quick action links
- **Admin products** — table view with image/categories/price/stock, edit, soft delete
- **Add/Edit product** — image upload with preview, category multi-select, all fields pre-filled on edit
- **Admin categories** — add with live slug preview, remove with confirmation
- **Admin orders** — filter by status, advance order status, cancel orders
- **Admin users** — searchable list, click to view user detail in sidebar panel

---

## Tech Stack

| Layer | Technology |
| ----- | ---------- |
| Framework | React 18 (Vite) |
| Styling | Tailwind CSS |
| Routing | React Router v6 |
| HTTP client | Axios |
| State | React Context (Auth + Cart) |

---

## Project Structure

```
supermarket-frontend/
├── public/
├── src/
│   ├── api/
│   │   └── axios.js                # Base Axios instance with JWT interceptor
│   │
│   ├── context/
│   │   ├── AuthContext.jsx         # User session, login, logout
│   │   └── CartContext.jsx         # Cart state, addToCart, removeFromCart, itemCount
│   │
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Navbar.jsx          # Sticky nav, cart badge, role-aware links
│   │   │   └── ProtectedRoute.jsx  # Redirects unauthenticated or wrong-role users
│   │   ├── products/
│   │   │   └── ProductCard.jsx     # Product card with image, categories, add to cart
│   │   └── ui/
│   │       ├── Button.jsx          # Reusable button (variants + sizes + loading state)
│   │       ├── Input.jsx           # Labeled input with error state
│   │       ├── Spinner.jsx         # Inline and full-page spinner
│   │       ├── Toast.jsx           # Toast provider + useToast hook
│   │       ├── Badge.jsx           # Status badge (maps order statuses to colors)
│   │       ├── EmptyState.jsx      # Reusable empty state with icon + action
│   │       └── ErrorMessage.jsx    # Red error banner
│   │
│   ├── pages/
│   │   ├── auth/
│   │   │   ├── Login.jsx
│   │   │   └── Register.jsx
│   │   ├── user/
│   │   │   ├── Home.jsx            # Product listing with search, filters, pagination
│   │   │   ├── ProductDetail.jsx   # Single product page
│   │   │   ├── Cart.jsx            # Cart with quantity controls and order summary
│   │   │   ├── Checkout.jsx        # Item selection, address, COD payment
│   │   │   ├── Orders.jsx          # Order history list
│   │   │   ├── OrderDetail.jsx     # Single order with status tracker
│   │   │   └── Profile.jsx         # Account info, password, address
│   │   └── admin/
│   │       ├── Dashboard.jsx       # Stats grid + quick action links
│   │       ├── Products.jsx        # Products table with edit/remove
│   │       ├── AddProduct.jsx      # Add product form with image upload
│   │       ├── EditProduct.jsx     # Edit product form pre-filled
│   │       ├── Categories.jsx      # Add/remove categories
│   │       ├── Orders.jsx          # All orders with status management
│   │       └── Users.jsx           # Users list with detail panel
│   │
│   ├── App.jsx                     # Routes + context providers
│   └── main.jsx
├── tailwind.config.js
├── vite.config.js
└── package.json
```

---

## Prerequisites

- [Node.js](https://nodejs.org/) v18+
- The [Supermarket API](https://github.com/Vivekannad/Supermarket-api) running on `http://localhost:3000`

---

## Getting Started

### 1. Clone and install

```bash
git clone <your-frontend-repo-url>
cd supermarket-frontend
npm install
```

### 2. Configure the API base URL

The base URL is set in `src/api/axios.js`:

```js
const api = axios.create({
  baseURL: 'http://localhost:3000/api'
});
```

Change this if your backend runs on a different port or host.

### 3. Start the dev server

```bash
npm run dev
```

App runs at `http://localhost:5173` by default.

### 4. Build for production

```bash
npm run build
```

---

## Environment

No `.env` file is required — the API base URL is hardcoded in `src/api/axios.js`. Update it there before deploying.

---

## Authentication Flow

Tokens are stored in `localStorage` and attached to every request automatically via an Axios interceptor:

```js
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
```

Logout clears the token and user from `localStorage` and redirects to `/login`. No backend call needed — JWT auth is stateless.

---

## Role-Based Routing

`ProtectedRoute` wraps every authenticated page:

```jsx
<ProtectedRoute role='admin'>
  <AdminDashboard />
</ProtectedRoute>
```

| Role | Redirect if not authenticated |
| ---- | ----------------------------- |
| Any | → `/login` |
| `user` accessing admin route | → `/` |
| `admin` accessing user route | Not restricted (admin can view all) |

After login, users are redirected to `/` and admins to `/admin` automatically.

---

## Page Reference

### Public

| Page | Path | Description |
| ---- | ---- | ----------- |
| Home | `/` | Product listing with search, category filter, price range, pagination |
| Product Detail | `/products/:id` | Single product with add to cart |
| Login | `/login` | JWT login |
| Register | `/register` | Create account |

### User (authenticated)

| Page | Path | Description |
| ---- | ---- | ----------- |
| Cart | `/cart` | View and manage cart items |
| Checkout | `/checkout` | Select items, enter address, place order |
| Orders | `/orders` | Order history |
| Order Detail | `/orders/:id` | Status tracker, items, address, payment |
| Profile | `/profile` | Account details, password, address |

### Admin

| Page | Path | Description |
| ---- | ---- | ----------- |
| Dashboard | `/admin` | Store stats and quick links |
| Products | `/admin/products` | Product table with edit/remove |
| Add Product | `/admin/products/add` | Add new product with image upload |
| Edit Product | `/admin/products/edit/:id` | Edit existing product |
| Categories | `/admin/categories` | Add and remove categories |
| Orders | `/admin/orders` | Manage all orders and statuses |
| Users | `/admin/users` | Browse users, view detail panel |

---

## Key Design Decisions

**CartContext over local state** — cart item count is needed in the Navbar (badge) and multiple pages. Lifting it to context avoids prop drilling and keeps the cart in sync across the whole app without extra API calls.

**Skeleton loaders over spinners** — every data-fetching page shows a skeleton that matches the layout of the loaded content. This prevents layout shift and feels faster than a full-page spinner.

**Optimistic UI for cart** — when a user removes or updates a cart item, the UI reflects the change immediately after the API responds and re-fetches the cart. No manual state patching needed since the view is always derived from the server.

**Address pre-fill at checkout** — `GET /me/address` is called when the checkout page loads. If an address exists it's pre-selected; if not, the full address form is shown. The address is saved/updated automatically when an order is placed.

**FormData for product uploads** — product add/edit uses `multipart/form-data` to support image file uploads. `categoryIds` is sent as a JSON string (`JSON.stringify([1, 2])`) since FormData doesn't support arrays natively.

---

## Scripts

| Command | Description |
| ------- | ----------- |
| `npm run dev` | Start dev server with HMR |
| `npm run build` | Production build |
| `npm run preview` | Preview production build locally |