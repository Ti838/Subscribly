/**
 * middleware/subscriptionMiddleware.js
 * Validates that the user has an active non-expired subscription — Supabase
 */

const subscriptionService = require('../services/subscriptionService');

const requireSubscription = async (req, res, next) => {
    try {
        const subscription = await subscriptionService.getActive(req.user.id);

        if (!subscription) {
            return res.status(403).json({
                success: false,
                message: 'No active subscription. Please subscribe to a plan.',
                hint: 'POST /api/subscriptions/subscribe',
            });
        }

        if (new Date() > new Date(subscription.expiry_date)) {
            await subscriptionService.markExpired(subscription.id);
            return res.status(403).json({
                success: false,
                message: 'Your subscription has expired. Please renew.',
            });
        }

        req.subscription = subscription;
        req.plan = subscription.plan;
        next();
    } catch (error) {
        console.error('Subscription middleware error:', error);
        return res.status(500).json({ success: false, message: 'Error verifying subscription.' });
    }
};

module.exports = { requireSubscription };
