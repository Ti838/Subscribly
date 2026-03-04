/**
 * routes/user.js
 * User profile and admin user management routes
 */

const express = require('express');
const router = express.Router();
const {
    getProfile,
    updateProfile,
    getAllUsers,
    getUserById,
    deactivateUser,
    getAnalytics,
} = require('../controllers/userController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// ─── User routes (authenticated) ──────────────────────────────────────────
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);

// ─── Admin routes ─────────────────────────────────────────────────────────
router.get('/', protect, adminOnly, getAllUsers);
router.get('/analytics', protect, adminOnly, getAnalytics);
router.get('/:id', protect, adminOnly, getUserById);
router.patch('/:id/deactivate', protect, adminOnly, deactivateUser);

module.exports = router;
