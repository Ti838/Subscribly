/**
 * routes/subscription.js
 * Plan management (admin) and subscription routes (users)
 */

const express = require('express');
const router = express.Router();
const {
    getPlans,
    createPlan,
    updatePlan,
    deletePlan,
    subscribe,
    getMySubscription,
    cancelSubscription,
    getAllSubscriptions,
} = require('../controllers/subscriptionController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// ─── Public plan listing ───────────────────────────────────────────────────
router.get('/plans', getPlans);

// ─── Admin: Plan management ────────────────────────────────────────────────
router.post('/plans', protect, adminOnly, createPlan);
router.put('/plans/:id', protect, adminOnly, updatePlan);
router.delete('/plans/:id', protect, adminOnly, deletePlan);

// ─── Admin: View all subscriptions ────────────────────────────────────────
router.get('/all', protect, adminOnly, getAllSubscriptions);

// ─── User: Subscription management ───────────────────────────────────────
router.post('/subscribe', protect, subscribe);
router.get('/my-subscription', protect, getMySubscription);
router.post('/cancel', protect, cancelSubscription);

module.exports = router;
