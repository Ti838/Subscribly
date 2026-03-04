/**
 * middleware/authMiddleware.js
 * JWT verification and role-based access — uses Supabase userService
 */

const jwt = require('jsonwebtoken');
const userService = require('../services/userService');

const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization?.startsWith('Bearer ')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return res.status(401).json({ success: false, message: 'Access denied. No token provided.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await userService.findById(decoded.id);

        if (!user) {
            return res.status(401).json({ success: false, message: 'User not found. Token is invalid.' });
        }

        if (!user.is_active) {
            return res.status(403).json({ success: false, message: 'Your account has been deactivated.' });
        }

        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({ success: false, message: 'Token is invalid or expired.' });
    }
};

const adminOnly = (req, res, next) => {
    if (!req.user || req.user.role !== 'admin') {
        return res.status(403).json({ success: false, message: 'Admin privileges required.' });
    }
    next();
};

module.exports = { protect, adminOnly };
