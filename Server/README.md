# Supermarket API

A production-ready REST API built with **Node.js**, **Express**, and **PostgreSQL** covering a full e-commerce workflow — browse products, manage a cart, place orders, and administer the store. The server exposes all routes under `/api` and automatically initializes the database schema, enum types, and SQL views on startup.

---

## Features

- **JWT authentication** — register, login, and protect routes with Bearer tokens
- **Role-based access control** — `user` and `admin` roles enforced at the route level
- **Products & categories** — list, search, filter by price range and category; many-to-many product-category relationships via junction table
- **Shopping cart** — cart auto-created on registration; add items with stock validation, update quantity (upsert), remove items
- **Orders** — checkout selected cart items with address snapshot, stock deduction inside a transaction, cancel with stock restoration
- **Payments** — Cash on Delivery flow; payment record created with order, marked paid on delivery
- **User profile** — view/update profile, change password (with current password verification), manage shipping address, view order history
- **Admin dashboard** — manage products/categories (with Cloudinary image uploads), manage order statuses with transition validation, view all users and store statistics
- **Request validation** — Joi schemas on all write endpoints
- **SQL views** — `products_view`, `cart_view`, and `orders_view` for aggregated, join-free queries across services
- **Image uploads** — Cloudinary integration via Multer for product images

---

## Tech Stack

| Layer | Technology |
| ----- | ---------- |
| Runtime | Node.js |
| Framework | Express |
| Database | PostgreSQL (`pg` connection pool) |
| Auth | bcrypt, jsonwebtoken |
| Validation | Joi |
| File uploads | Multer + Cloudinary |
| Config | dotenv |
| Dev server | nodemon |

---

## Project Structure

```
supermarket-api/
├── index.js                    # App entry point
├── src/
│   ├── config/
│   │   ├── db.js               # PostgreSQL pool
│   │   └── cloudinary.js       # Cloudinary SDK config
├── routes/                     # Express routers
│   ├── route.js                # Mounts all routes under /api
│   ├── authRoute.js
│   ├── productsRoute.js
│   ├── cartRoute.js
│   ├── ordersRoute.js
│   ├── userRoutes.js
│   └── adminRoute.js
├── controllers/                # Request handlers (req/res only)
│   ├── authController.js
│   ├── productsController.js
│   ├── cartController.js
│   ├── ordersController.js
│   ├── userController.js
│   └── adminController.js
├── models/                     # Service layer (SQL + business logic)
│   ├── authModel.js
│   ├── productsModel.js
│   ├── cartModel.js
│   ├── orderModel.js
│   ├── userModel.js
│   └── adminModel.js
├── middlewares/
│   ├── authHandler.js      # JWT protect
│   ├── validateHandler.js  # Joi validation wrapper
│   └── uploadMiddleware.js    # Multer + Cloudinary storage
|   └── errorHandler.js         # global error handler
|   └── parseCategoryId.js      # parse categoryId to array type
├── validators/                 # Joi schemas
│   ├── authValidator.js
│   ├── productValidator.js
│   ├── cartValidator.js
│   └── orderValidator.js
|   └── userValidator.js
├── utils/
│   └── token.js           # generate and verify jwt tokens
└── data/
    ├── init.js                 # Runs all tables + views on startup
    ├── data.sql                # all tables DDL in sql
    ├── tables/                 # CREATE TABLE scripts (numbered for FK order)
    │   ├── Types.js
    │   ├── Users.js
    │   ├── Addresses.js
    │   ├── Categories.js
    │   ├── Products.js
    │   ├── Product_categories.js
    │   ├── Carts.js
    │   ├── Cart_items.js
    │   ├── Orders.js
    │   ├── Order_items.js
    │   └── Payment.js
    └── sql-views/
        ├── views.sql       # all views in sql
        ├── productsView.js
        ├── cartView.js
        └── ordersView.js
```

---

## Prerequisites

- [Node.js](https://nodejs.org/) v18+
- [PostgreSQL](https://www.postgresql.org/) running locally or remotely
- A PostgreSQL database created for this project
- A [Cloudinary](https://cloudinary.com/) account for image uploads

---

## Getting Started

### 1. Clone and install

```bash
git clone https://github.com/Vivekannad/Supermarket-api
cd supermarket-api
npm install
```

### 2. Environment variables

Create a `.env` file in the project root:

```env
# PostgreSQL connection
USER=your_db_user
HOST=localhost
DATABASE=your_db_name
PASSWORD=your_db_password
PORT=5432

# JWT
ACCESS_KEY_SECRET=your_jwt_secret

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

> **Note:** `PORT` in `.env` is the **database** port. The HTTP server runs on port **3000**.

### 3. Start the server

```bash
# Development (auto-reload)
npm run dev

# Production
node index.js
```

On first run, `initDB()` creates all tables, enum types, and views. You'll see confirmation logs in the console:

```
✓ types ready
✓ users table ready
✓ products table ready
...
✓ products_view ready
✓ cart_view ready
✓ orders_view ready
Server running on port 3000
```

### 4. Health check

```bash
curl http://localhost:3000/
```

```json
{ "message": "Hello World" }
```

---

## Authentication

Protected routes require a JWT Bearer token:

```
Authorization: Bearer <token>
```

Tokens are issued on login and expire after **7 days**. The payload contains `id` and `role`.

### Register

```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "vivek123",
  "email": "vivek@example.com",
  "password": "secret123"
}
```

A cart is automatically created for each new user inside the same transaction.

### Login

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "vivek@example.com",
  "password": "secret123"
}
```

Response:

```json
{
  "message": "User logged in successfully",
  "user": { "username": "vivek123", "email": "vivek@example.com", "role": "user" },
  "token": "<jwt>"
}
```

---

## API Reference

All routes are prefixed with `/api`. Authentication is required unless noted.

### Products

| Method | Endpoint | Access | Description |
| ------ | -------- | ------ | ----------- |
| GET | `/products` | Public | List products (`?minprice`, `?maxprice`, `?page`, `?limit`) |
| GET | `/products/categories` | Public | List all categories |
| GET | `/products/category/:categoryId` | Public | Products in a category |
| GET | `/products/:id` | Public | Single product |
| POST | `/products/addproduct` | Admin | Add product (multipart/form-data) |
| POST | `/products/addcategory` | Admin | Add category |
| PUT | `/products/editproduct/:id` | Admin | Edit product |
| DELETE | `/products/removeproduct/:id` | Admin | Soft delete product |

**Add product — form-data fields:**

```
name          string    required
description   string    optional
price         number    required
stock         number    required
categoryIds   string    required  e.g. [1,2]
image         file      optional  jpg/jpeg/png/webp, max 5MB
```

### Cart

| Method | Endpoint | Description |
| ------ | -------- | ----------- |
| POST | `/cart/add` | Add item to cart |
| GET | `/cart/view` | View cart with subtotals and total |
| DELETE | `/cart/remove/:cartItemId` | Remove item from cart |

**Add to cart:**

```json
{ "productId": 3, "quantity": 2 }
```

### Orders

| Method | Endpoint | Access | Description |
| ------ | -------- | ------ | ----------- |
| POST | `/orders` | User | Place order from selected cart items |
| GET | `/orders/getorder/:orderid` | User | View own order |
| PUT | `/orders/cancel/:orderid` | User | Cancel order (pending only, restores stock) |
| GET | `/orders/admin/getorders` | Admin | All orders |
| GET | `/orders/admin/getorder/:orderid` | Admin | Any order |
| PUT | `/orders/admin/updateorderstatus/:orderid` | Admin | Update order status |

**Place order:**

```json
{
  "cartItemIds": [3, 7],
  "address": {
    "street": "House 5, Block B, Gulshan",
    "city": "Karachi",
    "state": "Sindh",
    "zip": "75300",
    "country": "Pakistan"
  }
}
```

`address` is optional if the user already has one saved — saved address is used automatically.

**Valid order status transitions:**

```
pending → confirmed → shipped → delivered
pending → cancelled
confirmed → cancelled
```

Marking an order `delivered` automatically flips its payment status to `paid`.

### User Profile (`/me`)

| Method | Endpoint | Description |
| ------ | -------- | ----------- |
| GET | `/me` | View profile |
| POST | `/me` | Update username / email |
| POST | `/me/password` | Change password (requires current password) |
| GET | `/me/address` | Get saved address |
| POST | `/me/address` | Create or update address |
| GET | `/me/orders` | Order history |

### Admin

| Method | Endpoint | Description |
| ------ | -------- | ----------- |
| GET | `/admin/users` | All users |
| GET | `/admin/user/:id` | Single user |
| GET | `/admin/stats` | Dashboard statistics |

**Stats response:**

```json
{
  "total_users": 42,
  "total_products": 87,
  "total_orders": 156,
  "pending_orders": 12,
  "delivered_orders": 130,
  "cancelled_orders": 14,
  "total_revenue": 458920.50,
  "out_of_stock_products": 3
}
```

---

## Database Schema

### Custom Enum Types

| Type | Values |
| ---- | ------ |
| `user_role` | `user`, `admin` |
| `order_status` | `pending`, `confirmed`, `shipped`, `delivered`, `cancelled` |
| `payment_status` | `pending`, `paid`, `failed` |

### Tables

| Table | Purpose |
| ----- | ------- |
| `users` | Accounts with hashed passwords and roles |
| `products` | Product catalog with stock and soft-delete flag |
| `categories` | Product categories with slugs |
| `product_categories` | Many-to-many product ↔ category (composite PK) |
| `cart` | One cart per user (enforced by UNIQUE constraint) |
| `cart_items` | Items in a cart (UNIQUE on cart_id + product_id) |
| `address` | One shipping address per user (UNIQUE on user_id) |
| `orders` | Placed orders with address snapshot and status |
| `order_items` | Line items with unit_price snapshot at purchase time |
| `payment` | COD payment records linked to orders |

### SQL Views

| View | Description |
| ---- | ----------- |
| `products_view` | Products with `ARRAY_AGG` category names, price cast to float |
| `cart_view` | Cart items joined with product details and subtotals |
| `orders_view` | Orders with nested items via `json_build_object` + `ARRAY_AGG` |

---

## Key Design Decisions

**Address snapshot in orders** — shipping address fields are copied into the `orders` table at checkout time. If a user later updates their address, historical orders still show where the package was actually sent.

**`unit_price` in order_items** — product price at the time of purchase is recorded in `order_items`. If an admin changes a product's price later, old orders are unaffected.

**Transactions on multi-table writes** — order creation (stock deduction + order + order_items + cart clear + payment insert) and order cancellation (stock restoration + status update) both run inside `BEGIN/COMMIT/ROLLBACK` blocks.

**Upsert for cart** — `INSERT ... ON CONFLICT (cart_id, product_id) DO UPDATE` handles adding the same product twice by incrementing quantity rather than creating duplicate rows.

---

## Error Handling

| Status | Meaning |
| ------ | ------- |
| 400 | Validation error (Joi), bad request |
| 401 | Missing or invalid JWT |
| 403 | Valid JWT but insufficient role |
| 404 | Resource not found |
| 500 | Unexpected server error |

Validation errors return an `errors` array with all Joi messages. All other errors pass through the global `errorHandler` middleware which reads `err.statusCode` (set via `throwError` utility) and falls back to `500`.

---

## Scripts

| Command | Description |
| ------- | ----------- |
| `npm run dev` | Start with nodemon |
| `node index.js` | Start in production |