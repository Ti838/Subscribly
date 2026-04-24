# Product Requirements Document

## Product Name

Subscribly

## Summary

Subscribly is a subscription management platform for SaaS applications. It helps a business sell API access through paid plans, issue and revoke API keys, enforce daily usage limits, and let customers monitor their usage through a dashboard.

## Problem Statement

Many SaaS products need a lightweight system for controlling paid API access. Teams often piece together authentication, billing state, API-key management, and rate limiting across multiple services. Subscribly centralizes that workflow in one system.

## Goals

- Provide account registration and login.
- Allow customers to subscribe to a plan and receive an API key.
- Show users their active plan, limits, and usage in a dashboard.
- Protect API endpoints with valid API keys.
- Enforce daily request caps by plan.
- Give admins the ability to manage plans and review subscriptions.

## Non-Goals

- No payment processing is implemented in the current codebase.
- No email notifications or invoice generation are included.
- No multi-tenant organization model exists yet.
- No public developer portal or SDK generator is included.

## Target Users

- SaaS end users who subscribe to API access.
- Internal admins who manage plans, subscriptions, and users.
- Developers integrating with the protected API.

## Primary User Journeys

### Visitor

1. Opens the landing page.
2. Reviews available plans.
3. Registers for an account.

### Customer

1. Logs in.
2. Views their dashboard.
3. Subscribes to a plan.
4. Receives an API key.
5. Uses the API key to call protected endpoints.
6. Monitors usage and subscription state.

### Admin

1. Logs in with admin privileges.
2. Creates or updates plans.
3. Reviews subscriptions and user activity.
4. Deactivates users when necessary.

## Functional Requirements

- Users must be able to register with name, email, and password.
- Users must be able to log in and receive a JWT.
- The system must store users, plans, subscriptions, and usage logs in Supabase.
- The system must list active plans publicly.
- The system must create a subscription for a chosen plan.
- The system must generate a new API key when a user subscribes.
- The system must revoke the API key when a subscription is cancelled.
- The system must reject protected API requests without a valid `x-api-key` header.
- The system must reject requests when the daily plan limit has been reached.
- The system must let admins create, update, and deactivate plans.
- The system must let admins inspect users and subscriptions.

## Business Rules

- A user can have one active subscription at a time.
- Subscribing to a new plan cancels any existing active subscription.
- Free, Pro, and Premium are the supported plan names in the current schema.
- A daily limit of `-1` means unlimited usage.
- Protected API usage is tracked per user per day.
- Only active users may authenticate with JWT or API key.

## Success Metrics

- Users can complete registration and login without manual intervention.
- A subscription creates a usable API key immediately.
- API requests are blocked correctly when no subscription or key is present.
- Usage totals remain consistent with daily limit enforcement.
- Admins can manage plans without database access.

## Risks and Constraints

- Billing is not wired to a payment gateway, so plan changes are manual.
- The current API response data is sample data, not production domain data.
- Unlimited plans still require usage logging for analytics.
