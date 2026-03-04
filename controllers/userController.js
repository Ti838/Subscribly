/**
 * controllers/userController.js
 * User profile and admin management — fully Supabase powered
 */

const userService = require('../services/userService');
const subscriptionService = require('../services/subscriptionService');
const usageService = require('../services/usageService');

// ─── GET /api/users/profile ───────────────────────────────────────────────
const getProfile = async (req, res) => {
    try {
        const user = await userService.findById(req.user.id);
        const subscription = await subscriptionService.getActive(req.user.id);
        const todayLog = await usageService.getTodayLog(req.user.id);

        return res.status(200).json({
            success: true,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                apiKey: user.api_key,
                createdAt: user.created_at,
            },
            subscription: subscription
                ? {
                    plan: subscription.plan.name,
                    price: subscription.plan.price,
                    dailyLimit: subscription.plan.daily_limit === -1 ? 'Unlimited' : subscription.plan.daily_limit,
                    startDate: subscription.start_date,
                    expiryDate: subscription.expiry_date,
                    status: subscription.status,
                }
                : null,
            todayUsage: todayLog?.request_count || 0,
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Server error.' });
    }
};

// ─── PUT /api/users/profile ───────────────────────────────────────────────
const updateProfile = async (req, res) => {
    try {
        const { name } = req.body;
        const user = await userService.update(req.user.id, { name });
        return res.status(200).json({
            success: true,
            message: 'Profile updated.',
            user: { id: user.id, name: user.name, email: user.email },
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Update failed.' });
    }
};

// ─── ADMIN: GET /api/users ────────────────────────────────────────────────
const getAllUsers = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        const { users, total } = await userService.findAll(page, limit);

        // Enrich each user with their active subscription
        const enriched = await Promise.all(
            users.map(async (user) => {
                const sub = await subscriptionService.getActive(user.id);
                return {
                    ...user,
                    subscription: sub
                        ? { plan: sub.plan.name, expiryDate: sub.expiry_date, status: sub.status }
                        : null,
                };
            })
        );

        return res.status(200).json({
            success: true,
            total,
            page,
            totalPages: Math.ceil(total / limit),
            users: enriched,
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Server error.' });
    }
};

// ─── ADMIN: GET /api/users/:id ────────────────────────────────────────────
const getUserById = async (req, res) => {
    try {
        const user = await userService.findById(req.params.id);
        if (!user) return res.status(404).json({ success: false, message: 'User not found.' });

        const subscription = await subscriptionService.getActive(user.id);
        const todayLog = await usageService.getTodayLog(user.id);
        const weeklyUsage = await usageService.getHistory(user.id, 7);

        return res.status(200).json({
            success: true,
            user,
            subscription: subscription || null,
            todayUsage: todayLog?.request_count || 0,
            weeklyUsage,
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Server error.' });
    }
};

// ─── ADMIN: PATCH /api/users/:id/deactivate ───────────────────────────────
const deactivateUser = async (req, res) => {
    try {
        const user = await userService.update(req.params.id, { is_active: false });
        if (!user) return res.status(404).json({ success: false, message: 'User not found.' });

        return res.status(200).json({
            success: true,
            message: `User ${user.email} has been deactivated.`,
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Server error.' });
    }
};

// ─── ADMIN: GET /api/users/analytics ─────────────────────────────────────
const getAnalytics = async (req, res) => {
    try {
        const [totalUsers, activeSubscriptions, totalCalls, todayCalls, topUsers] = await Promise.all([
            userService.countUsers(),
            subscriptionService.countActive(),
            usageService.getTotalCalls(),
            usageService.getTodayTotalCalls(),
            usageService.getTopUsers(5),
        ]);

        return res.status(200).json({
            success: true,
            analytics: {
                totalUsers,
                activeSubscriptions,
                totalApiCalls: totalCalls,
                todayApiCalls: todayCalls,
                topUsersToday: topUsers,
            },
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Server error.' });
    }
};

module.exports = { getProfile, updateProfile, getAllUsers, getUserById, deactivateUser, getAnalytics };
