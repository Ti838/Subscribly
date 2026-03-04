/**
 * controllers/authController.js
 * Handles user registration and login using Supabase
 */

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const userService = require('../services/userService');

// ─── Helper: Generate JWT ─────────────────────────────────────────────────
const generateToken = (id) =>
    jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    });

// ─── POST /api/auth/register ──────────────────────────────────────────────
const register = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Name, email, and password are required.',
            });
        }

        // Check existing user
        const existing = await userService.findByEmail(email);
        if (existing) {
            return res.status(409).json({ success: false, message: 'Email already registered.' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(12);
        const hashedPassword = await bcrypt.hash(password, salt);

        const userRole = role === 'admin' ? 'admin' : 'user';
        const user = await userService.create({ name, email, password: hashedPassword, role: userRole });

        const token = generateToken(user.id);

        return res.status(201).json({
            success: true,
            message: 'Registration successful!',
            token,
            user: { id: user.id, name: user.name, email: user.email, role: user.role },
        });
    } catch (error) {
        console.error('Register error:', error);
        if (error.code === '23505') {
            return res.status(409).json({ success: false, message: 'Email already registered.' });
        }
        return res.status(500).json({ success: false, message: 'Server error during registration.' });
    }
};

const subscriptionService = require('../services/subscriptionService');
const usageService = require('../services/usageService');

// ─── POST /api/auth/login ─────────────────────────────────────────────────
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, message: 'Email and password are required.' });
        }

        const user = await userService.findByEmail(email);

        if (!user || !user.is_active) {
            return res.status(401).json({ success: false, message: 'Invalid credentials.' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Invalid credentials.' });
        }

        const token = generateToken(user.id);

        // Fetch real-time data for the dashboard
        const activeSub = await subscriptionService.getActive(user.id);
        const usage = await usageService.getTodayLog(user.id);

        return res.status(200).json({
            success: true,
            message: 'Login successful!',
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                apiKey: user.api_key,
                subscription: activeSub ? {
                    planId: activeSub.plan_id,
                    planName: activeSub.plan?.name,
                    dailyLimit: activeSub.plan?.daily_limit,
                    status: activeSub.status,
                    expiryDate: activeSub.expiry_date
                } : null,
                usage: {
                    dailyCount: usage?.request_count || 0,
                    totalRequests: usage?.request_count || 0 // Total is usually historical, but for now today's count
                }
            },
        });
    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({ success: false, message: 'Server error during login.' });
    }
};

// ─── GET /api/auth/me ─────────────────────────────────────────────────────
const getMe = async (req, res) => {
    try {
        const user = await userService.findById(req.user.id);
        const activeSub = await subscriptionService.getActive(user.id);
        const usage = await usageService.getTodayLog(user.id);

        return res.status(200).json({
            success: true,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                apiKey: user.api_key,
                subscription: activeSub ? {
                    planId: activeSub.plan_id,
                    planName: activeSub.plan?.name,
                    dailyLimit: activeSub.plan?.daily_limit,
                    status: activeSub.status,
                    expiryDate: activeSub.expiry_date
                } : null,
                usage: {
                    dailyCount: usage?.request_count || 0,
                    totalRequests: usage?.request_count || 0
                }
            },
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Server error.' });
    }
};

module.exports = { register, login, getMe };
