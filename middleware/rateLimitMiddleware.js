/**
 * middleware/rateLimitMiddleware.js
 * API key auth + per-plan daily rate limiting — Supabase powered
 *
 * Free    → 50 req/day → 429 on exceed
 * Pro     → 500 req/day → 429 on exceed
 * Premium → Unlimited (-1)
 */

const userService = require('../services/userService');
const subscriptionService = require('../services/subscriptionService');
const usageService = require('../services/usageService');

// ─── Step 1: Authenticate via API key ─────────────────────────────────────
const authenticateApiKey = async (req, res, next) => {
    const apiKey = req.headers['x-api-key'];

    if (!apiKey) {
        return res.status(401).json({
            success: false,
            message: 'API key is required. Pass it in the "x-api-key" header.',
        });
    }

    try {
        const user = await userService.findByApiKey(apiKey);
        if (!user) {
            return res.status(401).json({ success: false, message: 'Invalid or revoked API key.' });
        }
        req.user = user;
        next();
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Error authenticating API key.' });
    }
};

// ─── Step 2: Check subscription + enforce rate limit ─────────────────────
const rateLimiter = async (req, res, next) => {
    try {
        const subscription = await subscriptionService.getActive(req.user.id);

        if (!subscription) {
            return res.status(403).json({
                success: false,
                message: 'No active subscription. Please subscribe to a plan.',
            });
        }

        const plan = subscription.plan;
        const dailyLimit = plan.daily_limit;

        // Unlimited plan (-1) — track but never block
        if (dailyLimit === -1) {
            await usageService.incrementUsage(req.user.id);
            req.plan = plan;
            req.subscription = subscription;
            return next();
        }

        // Get today's usage
        const todayLog = await usageService.getTodayLog(req.user.id);
        const usedToday = todayLog?.request_count || 0;

        if (usedToday >= dailyLimit) {
            return res.status(429).json({
                success: false,
                message: `Daily API limit reached (${dailyLimit} requests/day). Upgrade your plan or wait until tomorrow.`,
                limit: dailyLimit,
                used: usedToday,
                resetsAt: 'Midnight UTC',
                upgrade: 'POST /api/subscriptions/subscribe',
            });
        }

        // Increment and allow
        await usageService.incrementUsage(req.user.id);

        res.setHeader('X-RateLimit-Limit', dailyLimit);
        res.setHeader('X-RateLimit-Remaining', dailyLimit - usedToday - 1);
        res.setHeader('X-RateLimit-Plan', plan.name);

        req.plan = plan;
        req.subscription = subscription;
        next();
    } catch (error) {
        console.error('Rate limiter error:', error);
        return res.status(500).json({ success: false, message: 'Error checking rate limit.' });
    }
};

module.exports = { authenticateApiKey, rateLimiter };
