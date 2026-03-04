/**
 * models/Subscription.js
 * Subscription model - tracks which plan a user is on and its validity
 */

const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        planId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Plan',
            required: true,
        },
        startDate: {
            type: Date,
            default: Date.now,
        },
        // Automatically calculated: startDate + plan.duration days
        expiryDate: {
            type: Date,
            required: true,
        },
        status: {
            type: String,
            enum: ['active', 'expired', 'cancelled'],
            default: 'active',
        },
    },
    {
        timestamps: true,
    }
);

// ─── Virtual: Check if subscription is currently active ───────────────────
subscriptionSchema.virtual('isActive').get(function () {
    return this.status === 'active' && this.expiryDate > new Date();
});

// ─── Static Method: Get active subscription for a user ────────────────────
subscriptionSchema.statics.getActiveSubscription = async function (userId) {
    return await this.findOne({
        userId,
        status: 'active',
        expiryDate: { $gt: new Date() },
    }).populate('planId');
};

module.exports = mongoose.model('Subscription', subscriptionSchema);
