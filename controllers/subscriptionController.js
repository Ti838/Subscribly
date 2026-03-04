/**
 * controllers/subscriptionController.js
 * Plan CRUD (admin) + subscription management (users) — Supabase powered
 */

const { v4: uuidv4 } = require('uuid');
const planService = require('../services/planService');
const subscriptionService = require('../services/subscriptionService');
const userService = require('../services/userService');

const generateApiKey = () => `sk_live_${uuidv4().replace(/-/g, '')}`;

// ─── GET /api/subscriptions/plans ─────────────────────────────────────────
const getPlans = async (req, res) => {
    try {
        const plans = await planService.findAll(true);
        return res.status(200).json({ success: true, plans });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Server error.' });
    }
};

// ─── POST /api/subscriptions/plans (Admin) ────────────────────────────────
const createPlan = async (req, res) => {
    try {
        const { name, price, duration, dailyLimit, features } = req.body;
        if (!name || price === undefined || !duration || dailyLimit === undefined) {
            return res.status(400).json({
                success: false,
                message: 'name, price, duration, and dailyLimit are required.',
            });
        }

        const plan = await planService.create({ name, price, duration, dailyLimit, features });
        return res.status(201).json({ success: true, message: 'Plan created.', plan });
    } catch (error) {
        if (error.code === '23505') {
            return res.status(409).json({ success: false, message: 'Plan name already exists.' });
        }
        return res.status(500).json({ success: false, message: error.message });
    }
};

// ─── PUT /api/subscriptions/plans/:id (Admin) ────────────────────────────
const updatePlan = async (req, res) => {
    try {
        const plan = await planService.update(req.params.id, req.body);
        if (!plan) return res.status(404).json({ success: false, message: 'Plan not found.' });
        return res.status(200).json({ success: true, message: 'Plan updated.', plan });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

// ─── DELETE /api/subscriptions/plans/:id (Admin) ─────────────────────────
const deletePlan = async (req, res) => {
    try {
        const plan = await planService.deactivate(req.params.id);
        if (!plan) return res.status(404).json({ success: false, message: 'Plan not found.' });
        return res.status(200).json({ success: true, message: 'Plan deactivated.' });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Server error.' });
    }
};

// ─── POST /api/subscriptions/subscribe ───────────────────────────────────
const subscribe = async (req, res) => {
    try {
        const { planId } = req.body;
        if (!planId) {
            return res.status(400).json({ success: false, message: 'planId is required.' });
        }

        const plan = await planService.findById(planId);
        if (!plan || !plan.is_active) {
            return res.status(404).json({ success: false, message: 'Plan not found or inactive.' });
        }

        // Cancel any existing active subscription
        await subscriptionService.cancelAllActive(req.user.id);

        // Calculate dates
        const startDate = new Date();
        const expiryDate = new Date(startDate);
        expiryDate.setDate(expiryDate.getDate() + plan.duration);

        // Create subscription
        await subscriptionService.create({
            userId: req.user.id,
            planId: plan.id,
            startDate: startDate.toISOString(),
            expiryDate: expiryDate.toISOString(),
        });

        // Generate and save new API key
        const apiKey = generateApiKey();
        await userService.update(req.user.id, { api_key: apiKey });

        return res.status(201).json({
            success: true,
            message: `Successfully subscribed to ${plan.name} plan!`,
            subscription: {
                plan: plan.name,
                price: plan.price,
                dailyLimit: plan.daily_limit === -1 ? 'Unlimited' : plan.daily_limit,
                startDate,
                expiryDate,
                status: 'active',
            },
            apiKey,
        });
    } catch (error) {
        console.error('Subscribe error:', error);
        return res.status(500).json({ success: false, message: 'Subscription failed.' });
    }
};

// ─── GET /api/subscriptions/my-subscription ──────────────────────────────
const getMySubscription = async (req, res) => {
    try {
        const subscription = await subscriptionService.getActive(req.user.id);

        if (!subscription) {
            return res.status(200).json({ success: true, message: 'No active subscription.', subscription: null });
        }

        const plan = subscription.plan;
        const daysLeft = Math.ceil(
            (new Date(subscription.expiry_date) - new Date()) / (1000 * 60 * 60 * 24)
        );

        return res.status(200).json({
            success: true,
            subscription: {
                id: subscription.id,
                plan: plan.name,
                price: plan.price,
                dailyLimit: plan.daily_limit === -1 ? 'Unlimited' : plan.daily_limit,
                features: plan.features,
                startDate: subscription.start_date,
                expiryDate: subscription.expiry_date,
                daysRemaining: daysLeft,
                status: subscription.status,
            },
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Server error.' });
    }
};

// ─── POST /api/subscriptions/cancel ──────────────────────────────────────
const cancelSubscription = async (req, res) => {
    try {
        const existing = await subscriptionService.getActive(req.user.id);
        if (!existing) {
            return res.status(404).json({ success: false, message: 'No active subscription found.' });
        }

        await subscriptionService.cancel(req.user.id);
        await userService.update(req.user.id, { api_key: null });

        return res.status(200).json({
            success: true,
            message: 'Subscription cancelled. Your API key has been revoked.',
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Server error.' });
    }
};

// ─── ADMIN: GET /api/subscriptions/all ───────────────────────────────────
const getAllSubscriptions = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        const { subscriptions, total } = await subscriptionService.findAll(page, limit);

        return res.status(200).json({
            success: true,
            total,
            page,
            totalPages: Math.ceil(total / limit),
            subscriptions,
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Server error.' });
    }
};

module.exports = {
    getPlans, createPlan, updatePlan, deletePlan,
    subscribe, getMySubscription, cancelSubscription, getAllSubscriptions,
};
