# Software Requirements Specification

## 1. Introduction

### 1.1 Purpose

This document defines the functional and non-functional requirements for Subscribly, a subscription-based API access platform with a React dashboard and Express backend.

### 1.2 Scope

Subscribly provides:

- User authentication with JWT.
- Subscription plan management.
- API key generation and revocation.
- Protected API endpoints with daily rate limiting.
- Dashboard views for subscription and usage status.
- Admin endpoints for plan and user management.

### 1.3 Intended Audience

- Developers maintaining the app.
- Product owners reviewing feature scope.
- QA testers writing validation scenarios.

## 2. System Overview

### 2.1 Architecture

Subscribly uses a split architecture:

- Backend API: Node.js and Express.
- Data layer: Supabase PostgreSQL.
- Frontend: React with Vite.

The backend serves both the customer-facing app and the protected API endpoints.

### 2.2 Major Components

- Authentication controller and middleware.
- Subscription controller and service layer.
- User controller and service layer.
- API controller for protected data endpoints.
- API key authentication and daily rate limit middleware.
- React landing page, login, register, and dashboard screens.

## 3. Data Model

### 3.1 Entities

#### User

- `id`
- `name`
- `email`
- `password`
- `role` (`user`, `admin`)
- `api_key`
- `is_active`
- `created_at`

#### Plan

- `id`
- `name`
- `price`
- `duration`
- `daily_limit`
- `features`
- `is_active`
- `created_at`

#### Subscription

- `id`
- `user_id`
- `plan_id`
- `start_date`
- `expiry_date`
- `status` (`active`, `expired`, `cancelled`)

#### Usage Log

- `id`
- `user_id`
- `date`
- `request_count`
- `last_request_at`

## 4. External Interfaces

### 4.1 Frontend Pages

- `/` landing page with plan pricing.
- `/login` sign-in screen.
- `/register` sign-up screen.
- `/dashboard` authenticated customer area.

### 4.2 Public API Endpoints

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/subscriptions/plans`
- `GET /api/auth/me`

### 4.3 Protected API Endpoints

Protected API routes require an `x-api-key` header.

- `GET /api/data`
- `GET /api/status`
- `GET /api/usage-history`

## 5. Functional Requirements

### 5.1 Authentication

- The system shall allow users to register with name, email, and password.
- The system shall allow users to log in using email and password.
- The system shall issue JWTs for authenticated users.
- The system shall reject invalid or expired JWTs.

### 5.2 Subscription Management

- The system shall list active plans publicly.
- The system shall allow authenticated users to subscribe to a plan.
- The system shall create a subscription record when a plan is purchased.
- The system shall calculate the expiry date from the plan duration.
- The system shall generate a new API key for the user upon subscription.
- The system shall cancel existing active subscriptions before activating a new one.
- The system shall revoke the API key when a subscription is cancelled.

### 5.3 Protected API Access

- The system shall authenticate requests using the `x-api-key` header.
- The system shall reject requests with missing, invalid, or revoked keys.
- The system shall require an active subscription for protected API access.
- The system shall enforce daily request limits for limited plans.
- The system shall allow unlimited usage for plans whose limit is `-1`.
- The system shall increment usage logs for every successful protected API call.

### 5.4 User and Admin Functions

- The system shall let users fetch their profile and subscription details.
- The system shall let users update their display name.
- The system shall let admins create, update, and deactivate plans.
- The system shall let admins view all users and all subscriptions.
- The system shall let admins deactivate users.
- The system shall expose usage and activity analytics for admins.

## 6. Non-Functional Requirements

### 6.1 Security

- Passwords shall be hashed before storage.
- Protected routes shall use JWT verification or API-key verification as appropriate.
- Security headers shall be enabled through Helmet.
- Cross-origin requests shall be restricted through CORS configuration.

### 6.2 Performance

- Protected API checks shall complete quickly enough for real-time request gating.
- Usage logs shall support one row per user per day.

### 6.3 Reliability

- The system shall return structured JSON error responses.
- The system shall handle missing routes with a 404 response.
- The system shall handle unexpected errors with a global error handler.

### 6.4 Maintainability

- Business logic shall be separated into controllers and services.
- Database schema shall be stored in `scripts/schema.sql`.

## 7. Business Rules

- Only one active subscription may exist per user at a time.
- A subscription cancellation must revoke the API key.
- Admin-only operations require the authenticated user role `admin`.
- Daily rate limits reset on the next UTC day.

## 8. Validation Criteria

- A new user can register, log in, and view dashboard data.
- A subscribed user can call `/api/data` with a valid API key.
- The system returns `429` once a limited plan exceeds its daily quota.
- Admin routes reject non-admin users.
- Cancelling a subscription invalidates future API-key calls.

## 9. Assumptions

- Supabase is the only persistence layer used in the current implementation.
- Payment collection is handled outside the app or in a future iteration.
- The sample protected API response is a placeholder for a real business payload.
