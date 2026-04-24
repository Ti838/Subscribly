# Subscribly

Subscribly is a subscription infrastructure app for SaaS products. It combines a marketing site, authenticated customer dashboard, subscription management, API-key issuance, and a protected API layer with usage tracking and daily limits.

## What It Does

- Lets users register, sign in, and view their subscription status.
- Lets users subscribe to plans and receive an API key.
- Exposes protected API endpoints that require an `x-api-key` header.
- Enforces per-plan daily request limits.
- Gives admins plan and subscription management endpoints.

## Tech Stack

- Backend: Node.js, Express, Supabase PostgreSQL
- Frontend: React 19, Vite, React Router, Axios, Framer Motion
- Security: JWT, Helmet, CORS, request rate limiting

## Repository Structure

- `server.js` - Express app entry point and global middleware
- `controllers/` - Request handlers for auth, users, subscriptions, and API access
- `middleware/` - JWT auth and API-key rate limiting
- `services/` - Database access and business logic
- `routes/` - HTTP route definitions
- `frontend/` - React client application
- `scripts/schema.sql` - Supabase schema for tables and indexes

## Getting Started

### Backend

1. Install dependencies:

```bash
npm install
```

2. Create a `.env` file in the repository root with the required variables:

```env
PORT=5000
NODE_ENV=development
JWT_SECRET=your-secret
JWT_EXPIRES_IN=7d
ALLOWED_ORIGINS=http://localhost:5173
SUPABASE_URL=your-supabase-url
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
```

3. Start the server:

```bash
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## Available Scripts

- `npm start` - Start the backend server.
- `npm run dev` - Start the backend server with Nodemon.
- `cd frontend && npm run dev` - Start the frontend dev server.
- `cd frontend && npm run build` - Build the frontend for production.
- `cd frontend && npm run lint` - Lint the frontend code.

## Core API Endpoints

### Auth

- `POST /api/auth/register` - Register a user.
- `POST /api/auth/login` - Log in and receive a JWT.
- `GET /api/auth/me` - Fetch the current authenticated user.

### Users

- `GET /api/users/profile` - Fetch the current user profile.
- `PUT /api/users/profile` - Update the current user profile.
- `GET /api/users` - Admin only, list users.
- `GET /api/users/:id` - Admin only, inspect a user.
- `PATCH /api/users/:id/deactivate` - Admin only, deactivate a user.
- `GET /api/users/analytics` - Admin only, summary metrics.

### Subscriptions

- `GET /api/subscriptions/plans` - List active plans.
- `POST /api/subscriptions/subscribe` - Subscribe to a plan and issue an API key.
- `GET /api/subscriptions/my-subscription` - Fetch the active subscription.
- `POST /api/subscriptions/cancel` - Cancel the active subscription.
- `GET /api/subscriptions/all` - Admin only, list all subscriptions.

### Protected API

- `GET /api/data` - Protected data endpoint.
- `GET /api/status` - Subscription and usage status.
- `GET /api/usage-history` - Historical usage summary.

All protected API routes require an `x-api-key` header.

## Database Model

The Supabase schema includes these primary tables:

- `plans`
- `users`
- `subscriptions`
- `usage_logs`

See `scripts/schema.sql` for the full schema.

## Deployment Notes

- The backend is designed to run locally or on a serverless host such as Vercel.
- The frontend is a separate Vite app under `frontend/`.
- Supabase is used as the database layer through the service-role key.
