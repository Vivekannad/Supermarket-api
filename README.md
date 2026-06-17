# Auth System

A REST API built with **Express** and **PostgreSQL** for user authentication and a small e-commerce workflow: browse products, manage a cart, place orders, and administer the store.

The server runs on port **3000** and exposes all business routes under `/api`. On startup it automatically creates database tables, custom enum types, and SQL views.

---

## Features

- **JWT authentication** — register, login, and protect routes with Bearer tokens
- **Role-based access** — `user` and `admin` roles with route-level restrictions
- **Products & categories** — list, filter, search by category; admins can add, edit, and remove products/categories
- **Shopping cart** — each user gets a cart on registration; add, view, and remove items
- **Orders** — checkout from cart items, cancel orders, admin order management and status updates
- **User profile** — view/update profile, password, and shipping address; view order history
- **Admin dashboard** — list users, view user details, and fetch store statistics (revenue, order counts, stock alerts)
- **Request validation** — Joi schemas on write endpoints
- **SQL views** — `products_view`, `cart_view`, and `orders_view` for aggregated queries

---

## Tech Stack

| Layer        | Technology                          |
| ------------ | ----------------------------------- |
| Runtime      | Node.js                             |
| Framework    | Express 5                           |
| Database     | PostgreSQL (`pg` connection pool)   |
| Auth         | bcrypt, jsonwebtoken                |
| Validation   | Joi                                 |
| Config       | dotenv                              |
| Dev server   | nodemon                             |

---

## Project Structure

```
auth_system/
├── index.js                 # App entry point
├── src/config/db.js         # PostgreSQL pool configuration
├── routes/                  # Express routers
├── controllers/             # Request handlers
├── models/                  # Database/service layer
├── middlewares/             # Auth, validation, error handling
├── validators/              # Joi schemas
├── utils/token.js           # JWT generate/verify helpers
└── data/
    ├── init.js              # Runs schema + view setup on startup
    ├── tables/              # CREATE TABLE scripts
    ├── sql_views/           # CREATE VIEW scripts
    └── data.sql             # Reference SQL schema (optional manual setup)
```

---

## Prerequisites

- [Node.js](https://nodejs.org/) (v18+ recommended)
- [PostgreSQL](https://www.postgresql.org/) running locally or remotely
- A PostgreSQL database created for this project

---

## Getting Started

### 1. Clone and install

```bash
git clone https://github.com/Vivekannad/Supermarket-api
cd auth_system
npm install
```

### 2. Environment variables

Create a `.env` file in the project root:

```env
# PostgreSQL connection
USER=your_db_user
HOST=localhost
DATABASE=auth_system
PASSWORD=your_db_password
PORT=5432

# JWT signing secret
ACCESS_KEY_SECRET=your_secret_key_here
```

> **Note:** `PORT` in `.env` is the **database** port, not the HTTP server port (which is hardcoded to `3000` in `index.js`).

### 3. Start the server

```bash
# Development (auto-reload)
npm run dev

# Production
node index.js
```

On first run, `initDB()` creates all tables, enum types, and views. You should see confirmation logs in the console, then:

```
Auth system listening at http://localhost:3000
```

### 4. Health check

```bash
curl http://localhost:3000/
```

Expected response:

```json
{ "message": "Hello World" }
```

---

## Authentication

Protected routes require a JWT in the `Authorization` header:

```
Authorization: Bearer <token>
```

Tokens are issued on login and expire after **1 hour**. The payload includes `id` and `role`.

### Register

```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "secret123",
  "role": "user"
}
```

A cart is automatically created for each new user.

### Login

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "secret123"
}
```

Response includes a `token` inside the `user` object — use it for subsequent requests.

---

## API Reference

All routes below are prefixed with `/api`. Unless noted, routes require authentication.

### Products

| Method | Endpoint | Access | Description |
| ------ | -------- | ------ | ----------- |
| GET | `/products` | Any authenticated user | List products (`?minprice`, `maxprice`, `page`, `limit`) |
| GET | `/products/categories` | Any authenticated user | List all categories |
| GET | `/products/category/:categoryId` | Any authenticated user | Products in a category |
| GET | `/products/:id` | Any authenticated user | Single product by ID |
| POST | `/products/addproduct` | Admin | Add a product |
| POST | `/products/addcategory` | Admin | Add a category |
| PUT | `/products/editproduct/:id` | Admin | Edit a product |
| DELETE | `/products/removeproduct/:id` | Admin | Remove a product |

**Add product body example:**

```json
{
  "name": "Wireless Mouse",
  "description": "Ergonomic wireless mouse with long battery life",
  "price": 29.99,
  "stock": 100,
  "categoryIds": [1, 2]
}
```

### Cart (user only)

| Method | Endpoint | Description |
| ------ | -------- | ----------- |
| POST | `/cart/add` | Add item to cart |
| GET | `/cart/view` | View cart contents |
| DELETE | `/cart/remove/:cartItemsId` | Remove item from cart |

**Add to cart body:**

```json
{
  "productId": 1,
  "quantity": 2
}
```

### Orders

| Method | Endpoint | Access | Description |
| ------ | -------- | ------ | ----------- |
| POST | `/orders` | User | Create order from cart items |
| GET | `/orders/getorder/:orderid` | User | Get own order |
| PUT | `/orders/cancel/:orderid` | User | Cancel own order |
| GET | `/orders/admin/getorders` | Admin | List all orders |
| GET | `/orders/admin/getorder/:orderid` | Admin | Get any order |
| PUT | `/orders/admin/updateorderstatus/:orderid` | Admin | Update order status |

**Create order body:**

```json
{
  "cartItemIds": [1, 2],
  "address": {
    "street": "123 Main St",
    "city": "Springfield",
    "state": "IL",
    "zip": "62701",
    "country": "USA"
  }
}
```

`address` is optional if the user already has one saved. Valid order statuses: `pending`, `confirmed`, `shipped`, `delivered`, `cancelled`.

### User profile (`/me`, user only)

| Method | Endpoint | Description |
| ------ | -------- | ----------- |
| GET | `/me` | Get profile info |
| POST | `/me` | Update username/email |
| POST | `/me/password` | Change password |
| GET | `/me/address` | Get saved address |
| POST | `/me/address` | Create or update address |
| GET | `/me/orders` | List own orders |

### Admin

| Method | Endpoint | Description |
| ------ | -------- | ----------- |
| GET | `/admin/users` | List all users |
| GET | `/admin/user/:id` | Get user by ID |
| GET | `/admin/stats` | Dashboard statistics |

Admin stats include total users, products, orders, pending/delivered/cancelled counts, revenue, and out-of-stock product count.

---

## Database Schema

### Custom types

- `user_role` — `user`, `admin`
- `order_status` — `pending`, `confirmed`, `shipped`, `delivered`, `cancelled`
- `payment_status` — `pending`, `paid`, `failed`

### Tables

| Table | Purpose |
| ----- | ------- |
| `users` | Accounts with hashed passwords and roles |
| `products` | Product catalog |
| `categories` | Product categories |
| `product_categories` | Many-to-many product ↔ category |
| `cart` | One cart per user |
| `cart_items` | Items in a cart |
| `address` | One shipping address per user |
| `orders` | Placed orders with totals and status |
| `order_items` | Line items copied from cart at checkout |
| `payment` | Payment records linked to orders |

### Views

- **`products_view`** — products with aggregated category names
- **`cart_view`** — cart items with product details and subtotals
- **`orders_view`** — orders with user, item, and pricing details

---

## Error Handling

Validation errors return **400** with an array of Joi messages. Authentication failures return **401**, forbidden role access returns **403**, and unhandled errors pass through the global `errorHandler` middleware.

---

## Scripts

| Command | Description |
| ------- | ----------- |
| `npm run dev` | Start with nodemon (auto-reload) |
| `node index.js` | Start the server |

---
