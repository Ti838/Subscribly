/**
 * server.js
 * Main Express app entry — Supabase replaces MongoDB
 * No DB connection call needed (Supabase is HTTP-based)
 */

require('dotenv').config();
// Initialize Supabase client on startup
require('./config/supabase');

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const subscriptionRoutes = require('./routes/subscription');
const apiRoutes = require('./routes/api');

const app = express();

// ─── Security & Utilities ──────────────────────────────────────────────────
app.use(helmet());
app.use(cors({
    origin: process.env.ALLOWED_ORIGINS || '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-api-key'],
}));
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true }));

// Global brute-force rate limiter
app.use(rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 200,
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, message: 'Too many requests. Try again after 15 minutes.' },
}));

// ─── Health Check ──────────────────────────────────────────────────────────
app.get('/', (req, res) => {
    res.status(200).json({
        success: true,
        service: 'Subscribly — SaaS Subscription API',
        version: '2.0.0',
        database: 'Supabase (PostgreSQL)',
        status: 'running',
        timestamp: new Date().toISOString(),
        endpoints: {
            auth: 'POST /api/auth/register  |  POST /api/auth/login',
            users: 'GET  /api/users/profile  |  GET /api/users (admin)',
            subscriptions: 'GET  /api/subscriptions/plans  |  POST /api/subscriptions/subscribe',
            api: 'GET  /api/data  (x-api-key header required)',
        },
    });
});

// ─── Routes ────────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api', apiRoutes);

// ─── 404 Handler ───────────────────────────────────────────────────────────
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: `Route not found: ${req.method} ${req.originalUrl}`,
    });
});

// ─── Global Error Handler ──────────────────────────────────────────────────
app.use((err, req, res, next) => {
    console.error('Unhandled Error:', err);

    if (err.name === 'JsonWebTokenError') {
        return res.status(401).json({ success: false, message: 'Invalid token.' });
    }
    if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ success: false, message: 'Token expired.' });
    }

    res.status(err.statusCode || 500).json({
        success: false,
        message: err.message || 'Internal Server Error',
    });
});

// ─── Start ─────────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`
╔══════════════════════════════════════════════════╗
║       Subscribly API v2 — Supabase Edition       ║
╠══════════════════════════════════════════════════╣
║  Port     : ${PORT}                                  ║
║  Mode     : ${process.env.NODE_ENV || 'development'}                     ║
║  Database : Supabase (PostgreSQL)                ║
║  Health   : http://localhost:${PORT}                 ║
╚══════════════════════════════════════════════════╝
  `);
});

module.exports = app;
