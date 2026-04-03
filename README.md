# Zorvyn — Finance Dashboard

A full-stack finance dashboard with **role-based access control**, **CRUD financial record management**, **aggregated analytics**, and **interactive data visualisation**.

Built with **React 19 + Vite** on the frontend and **Node.js + Express + MongoDB** on the backend.

---

## Table of Contents

1. [Features](#features)
2. [Tech Stack](#tech-stack)
3. [Project Structure](#project-structure)
4. [Prerequisites](#prerequisites)
5. [Getting Started](#getting-started)
6. [Environment Variables](#environment-variables)
7. [Seeding the Database](#seeding-the-database)
8. [API Reference](#api-reference)
9. [Role-Based Access Control (RBAC)](#role-based-access-control-rbac)
10. [Architecture & Design Decisions](#architecture--design-decisions)
11. [Assumptions](#assumptions)
12. [Tradeoffs](#tradeoffs)
13. [License](#license)

---

## Features

| Area | Highlights |
|---|---|
| **Authentication** | JWT-based login & registration with bcrypt password hashing |
| **RBAC** | Three roles — Admin, Analyst, Viewer — with granular route-level and UI-level enforcement |
| **Financial Records** | Full CRUD (income/expense), soft-delete, filtering by type/category/date |
| **Dashboard Analytics** | Summary cards, income-vs-expense charts, category breakdowns, 12-month trend lines |
| **Security** | Rate limiting (auth + general), Joi request validation, centralised error handling |
| **Frontend** | Responsive layout, sidebar navigation, modals, toast notifications, Chart.js visualisations |

---

## Tech Stack

### Backend

| Dependency | Purpose |
|---|---|
| **Express 4** | HTTP framework |
| **Mongoose 8** | MongoDB ODM |
| **jsonwebtoken** | JWT authentication |
| **bcryptjs** | Password hashing (12 salt rounds) |
| **Joi** | Request body validation |
| **express-rate-limit** | Brute-force protection |
| **morgan** | HTTP request logging (dev only) |
| **cors** | Cross-origin resource sharing |
| **dotenv** | Environment variable management |

### Frontend

| Dependency | Purpose |
|---|---|
| **React 19** | UI framework |
| **Vite 8** | Build tool & dev server |
| **React Router 7** | Client-side routing |
| **Axios** | HTTP client with interceptors |
| **Chart.js + react-chartjs-2** | Data visualisation |

---

## Project Structure

```
Zorvyn/
├── backend/
│   ├── config/
│   │   └── db.js                  # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js      # Register, login, get-me
│   │   ├── dashboardController.js # Summary, trends, breakdowns
│   │   ├── recordController.js    # CRUD for financial records
│   │   └── userController.js      # Admin user management
│   ├── middleware/
│   │   ├── auth.js                # JWT verification
│   │   ├── rbac.js                # Role-based access control
│   │   ├── rateLimiter.js         # Rate limiting (auth + general)
│   │   ├── validate.js            # Joi schema validation
│   │   └── errorHandler.js        # Centralised error handler
│   ├── models/
│   │   ├── User.js                # User schema (name, email, password, role, status)
│   │   └── Record.js              # Financial record schema (amount, type, category, date)
│   ├── routes/
│   │   ├── authRoutes.js          # /api/auth/*
│   │   ├── dashboardRoutes.js     # /api/dashboard/*
│   │   ├── recordRoutes.js        # /api/records/*
│   │   └── userRoutes.js          # /api/users/*
│   ├── seed/
│   │   └── seed.js                # Database seeder with demo data
│   ├── services/
│   │   ├── dashboardService.js    # Aggregation pipelines for analytics
│   │   ├── recordService.js       # Record business logic
│   │   └── userService.js         # User business logic
│   ├── validators/
│   │   ├── authValidator.js       # Login/register schemas
│   │   ├── recordValidator.js     # Record create/update schemas
│   │   └── userValidator.js       # Role/status update schemas
│   ├── .env.example               # Environment variable template
│   ├── package.json
│   └── server.js                  # App entry point
│
├── frontend/
│   ├── public/                    # Static assets
│   ├── src/
│   │   ├── api/
│   │   │   └── axios.js           # Axios instance with auth interceptor
│   │   ├── components/
│   │   │   ├── Charts/
│   │   │   │   ├── CategoryChart.jsx
│   │   │   │   ├── IncomeExpenseChart.jsx
│   │   │   │   └── TrendChart.jsx
│   │   │   ├── ui/
│   │   │   │   └── Toast.jsx
│   │   │   ├── DataTable.jsx
│   │   │   ├── Header.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   ├── RecordModal.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   └── StatsCard.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx     # Auth state management
│   │   ├── hooks/
│   │   │   └── useAuth.js          # Auth context hook
│   │   ├── pages/
│   │   │   ├── DashboardPage.jsx   # Analytics overview
│   │   │   ├── LoginPage.jsx       # Login form
│   │   │   ├── RegisterPage.jsx    # Registration form
│   │   │   ├── RecordsPage.jsx     # Record CRUD table
│   │   │   └── UsersPage.jsx       # Admin user management
│   │   ├── styles/                 # Modular CSS files
│   │   ├── App.jsx                 # Root component + routing
│   │   └── main.jsx                # Vite entry point
│   ├── .env                        # Frontend environment variables
│   ├── vite.config.js
│   └── package.json
│
├── .gitignore
└── README.md                       # ← You are here
```

---

## Prerequisites

- **Node.js** ≥ 18.x
- **npm** ≥ 9.x
- **MongoDB** — a running instance (local or [MongoDB Atlas](https://www.mongodb.com/atlas) cloud cluster)

---

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/<your-username>/zorvyn.git
cd zorvyn
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file by copying the template:

```bash
cp .env.example .env
```

Fill in the required values (see [Environment Variables](#environment-variables) below).

Start the backend server:

```bash
# Development (with hot-reload via nodemon)
npm run dev

# Production
npm start
```

The API will be available at **http://localhost:5000**.

### 3. Frontend Setup

```bash
cd frontend
npm install
```

Create a `.env` file:

```
VITE_API_URL=http://localhost:5000/api
```

Start the dev server:

```bash
npm run dev
```

The app will be available at **http://localhost:5173**.

### 4. Seed Demo Data (Optional)

```bash
cd backend
npm run seed
```

This creates three demo users and 50 financial records (see [Seeding the Database](#seeding-the-database)).

---

## Environment Variables

### Backend (`backend/.env`)

| Variable | Description | Example |
|---|---|---|
| `MONGO_URI` | MongoDB connection string 
| `JWT_SECRET` | Secret key for signing JWTs | `my_super_secret_key_123` |
| `JWT_EXPIRE` | Token expiration duration | `7d` |
| `PORT` | Server port | `5000` |
| `NODE_ENV` | Environment mode | `development` or `production` |
| `FRONTEND_URL` | *(production only)* Allowed CORS origin | `https://zorvyn.vercel.app` |

### Frontend (`frontend/.env`)

| Variable | Description | Example |
|---|---|---|
| `VITE_API_URL` | Backend API base URL | `http://localhost:5000/api` |

---

## Seeding the Database

Run the seed script to populate the database with demo data:

```bash
cd backend
npm run seed
```

### Demo User Accounts

| Role | Email | Password |
|---|---|---|
| **Admin** | `admin@zorvyn.com` | `admin123` |
| **Analyst** | `analyst@zorvyn.com` | `analyst123` |
| **Viewer** | `viewer@zorvyn.com` | `viewer123` |

### Seed Data Details

- **3 users** (one per role) with hashed passwords
- **50 financial records** spanning the last 12 months
  - Mix of income categories: Salary, Freelance, Investments, Rental Income, Bonus, Consulting
  - Mix of expense categories: Rent, Utilities, Software, Marketing, Salaries, Office Supplies, Travel, Insurance, Equipment, Training
  - Each record has a realistic description, random date, and random amount

> **⚠️ Warning:** Running the seed script **clears all existing users and records** before inserting demo data.

---

## API Reference

All endpoints return responses in a consistent envelope format:

```json
// Success
{
  "success": true,
  "data": { ... }
}

// Error
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable description."
  }
}
```

### Health Check

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/health` | ✗ | Returns server status and timestamp |

### Authentication (`/api/auth`)

| Method | Endpoint | Auth | Rate Limited | Description |
|---|---|---|---|---|
| `POST` | `/api/auth/register` | ✗ | ✔ (20 req/15 min) | Register a new user |
| `POST` | `/api/auth/login` | ✗ | ✔ (20 req/15 min) | Login and receive a JWT |
| `GET` | `/api/auth/me` | ✔ | ✗ | Get the current authenticated user |

**Register** — `POST /api/auth/register`
```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "securepass123"
}
```

**Login** — `POST /api/auth/login`
```json
{
  "email": "admin@zorvyn.com",
  "password": "admin123"
}
```

**Response** (both register and login):
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
      "_id": "...",
      "name": "Admin User",
      "email": "admin@zorvyn.com",
      "role": "admin",
      "status": "active"
    }
  }
}
```

### Financial Records (`/api/records`)

> All record routes require authentication via `Authorization: Bearer <token>` header.

| Method | Endpoint | Roles | Description |
|---|---|---|---|
| `GET` | `/api/records` | Admin, Analyst | List all records (with optional query filters) |
| `GET` | `/api/records/:id` | Admin, Analyst | Get a single record by ID |
| `POST` | `/api/records` | Admin | Create a new record |
| `PUT` | `/api/records/:id` | Admin | Update an existing record |
| `DELETE` | `/api/records/:id` | Admin | Soft-delete a record |

**Create Record** — `POST /api/records`
```json
{
  "amount": 5000,
  "type": "income",
  "category": "Freelance",
  "date": "2026-03-15",
  "description": "Web development project payment"
}
```

**Update Record** — `PUT /api/records/:id`
```json
{
  "amount": 5500,
  "description": "Updated project payment"
}
```

### Dashboard Analytics (`/api/dashboard`)

> All dashboard routes require authentication.

| Method | Endpoint | Roles | Description |
|---|---|---|---|
| `GET` | `/api/dashboard/summary` | All roles | Totals: income, expense, net balance, record count |
| `GET` | `/api/dashboard/recent` | All roles | Last 10 transactions |
| `GET` | `/api/dashboard/category-breakdown` | Admin, Analyst | Income/expense breakdown by category |
| `GET` | `/api/dashboard/trends` | Admin, Analyst | Monthly income vs expense for the last 12 months |

**Summary Response Example:**
```json
{
  "success": true,
  "data": {
    "totalIncome": 385000,
    "totalExpense": 142000,
    "netBalance": 243000,
    "totalRecords": 50
  }
}
```

### User Management (`/api/users`)

> All user routes require **Admin** role.

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/users` | List all users |
| `GET` | `/api/users/:id` | Get a user by ID |
| `PUT` | `/api/users/:id/role` | Update a user's role |
| `PUT` | `/api/users/:id/status` | Activate or deactivate a user |
| `DELETE` | `/api/users/:id` | Permanently delete a user |

**Update Role** — `PUT /api/users/:id/role`
```json
{
  "role": "analyst"
}
```

**Update Status** — `PUT /api/users/:id/status`
```json
{
  "status": "inactive"
}
```

---

## Role-Based Access Control (RBAC)

Zorvyn implements a three-tier RBAC model enforced at both the **API middleware layer** and the **frontend routing layer**.

| Permission | Admin | Analyst | Viewer |
|---|:---:|:---:|:---:|
| View dashboard summary | ✔ | ✔ | ✔ |
| View recent transactions | ✔ | ✔ | ✔ |
| View category breakdowns | ✔ | ✔ | ✗ |
| View trend analytics | ✔ | ✔ | ✗ |
| List/view financial records | ✔ | ✔ | ✗ |
| Create financial records | ✔ | ✗ | ✗ |
| Update financial records | ✔ | ✗ | ✗ |
| Delete financial records | ✔ | ✗ | ✗ |
| Manage users (CRUD) | ✔ | ✗ | ✗ |

### How It Works

1. **`auth` middleware** — Verifies the JWT, fetches the user from the database, and attaches `req.user` to the request. Also checks if the user's account is still active.
2. **`rbac(...roles)` middleware** — Accepts a list of allowed roles and returns `403 Forbidden` if the authenticated user's role is not in the list.
3. **Frontend `<ProtectedRoute>`** — A wrapper component that conditionally renders children based on the user's role. Unauthorized users are redirected to the dashboard.
4. **Sidebar navigation** — Dynamically shows/hides menu items based on the current user's role.

---

## Architecture & Design Decisions

### Layered Backend Architecture

The backend follows a **Controller → Service → Model** pattern:

- **Controllers** handle HTTP request/response concerns only
- **Services** contain business logic and database queries
- **Models** define Mongoose schemas with built-in validation

This separation makes the codebase testable and maintainable. Business logic is not coupled to HTTP concerns.

### Soft Deletes

Financial records use an `isDeleted` boolean flag instead of permanent deletion. This ensures:
- Data integrity for audit trails
- Ability to recover accidentally deleted records
- Accurate historical analytics (soft-deleted records are excluded from queries)

### Centralised Error Handling

A single `errorHandler` middleware catches and normalises all errors:
- Mongoose validation errors → `400` with field-level details
- Duplicate key errors → `409`
- Invalid ObjectId → `400`
- JWT errors → `401`
- Everything else → `500` (message hidden in production)

### Rate Limiting

Two tiers of rate limiting protect the API:
- **Auth routes**: 20 requests per 15-minute window (prevents brute-force)
- **General routes**: 200 requests per 15-minute window (prevents abuse)

### Frontend State Management

Auth state is managed via React Context (`AuthContext`) rather than a third-party state library. This keeps the dependency footprint small and is sufficient for the scope of this application.

### CSS Architecture

The frontend uses modular, vanilla CSS files (no CSS-in-JS or utility frameworks):
- `variables.css` — Design tokens (colors, spacing, typography)
- `base.css` — Reset and global styles
- `layout.css` — App shell (sidebar, header, content)
- `components.css` — Shared component styles
- Page-specific files: `dashboard.css`, `records.css`, `users.css`, `login.css`

---

## Assumptions

1. **Single-tenant** — The application assumes a single organisation. All users share the same set of financial records.
2. **Admin creates records** — In the seed data, all records are attributed to the admin user. In practice, any admin can create records.
3. **New users default to Viewer** — Self-registered users are assigned the `viewer` role. An admin must manually promote them.
4. **MongoDB is pre-provisioned** — The setup assumes you have access to a running MongoDB instance (local or Atlas).
5. **No email verification** — Registration does not require email verification. Accounts are immediately active.
6. **Auth tokens are stored in localStorage** — The frontend persists the JWT in `localStorage` for simplicity. The token has a configurable expiry (default: 7 days).
7. **No pagination** — Record and user lists currently return all items. This is acceptable for the demo scale (~50 records, ~3 users) but would need pagination for production-scale data.
8. **Date formatting** — All dates are stored as UTC in MongoDB. The frontend displays them in the user's local timezone.

---

## Tradeoffs

| Decision | Rationale | Alternative Considered |
|---|---|---|
| **JWT in localStorage** vs httpOnly cookies | Simpler implementation, no need for cookie-based CORS configuration | httpOnly cookies are more secure against XSS but add complexity for cross-origin setups |
| **Soft delete** vs hard delete | Preserves financial data integrity and audit history | Hard delete uses less storage but loses records permanently |
| **Vanilla CSS** vs Tailwind/CSS Modules | Full control, no build-step dependency, smaller bundle | Tailwind is faster to develop with but adds config overhead |
| **Context API** vs Redux/Zustand | Minimal boilerplate for auth-only state; avoids over-engineering | Redux would be warranted if global state grew significantly |
| **Joi validation** vs express-validator | More expressive schema definitions, better error messages | express-validator has lighter bundle size |
| **No pagination** vs cursor/offset pagination | Keeps the frontend simple for demo-scale data | Pagination is essential for production datasets |
| **Monorepo (single repo)** vs separate repos | Easier to clone, deploy, and manage for a small team | Separate repos give independent deploy pipelines |
| **bcrypt salt rounds = 12** vs 10 | Stronger hashing with negligible performance impact at this scale | 10 rounds are the common default |
| **Morgan logging dev-only** | Avoids noisy logs in production while aiding local debugging | Structured logging (Winston/Pino) would be better for production observability |

---

## License

This project is for educational and demonstration purposes.
