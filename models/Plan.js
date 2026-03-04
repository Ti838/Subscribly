/**
 * models/Plan.js
 * Subscription Plan model - defines tiers (Free, Pro, Premium)
 */

const mongoose = require('mongoose');

const planSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Plan name is required'],
            unique: true,
            trim: true,
            enum: {
                values: ['Free', 'Pro', 'Premium'],
                message: 'Plan must be Free, Pro, or Premium',
            },
        },
        price: {
            type: Number,
            required: [true, 'Price is required'],
            min: [0, 'Price cannot be negative'],
        },
        // Duration in days (e.g., 30 = monthly, 365 = yearly)
        duration: {
            type: Number,
            required: [true, 'Duration is required'],
            min: [1, 'Duration must be at least 1 day'],
        },
        // Daily API request limit (-1 = unlimited)
        dailyLimit: {
            type: Number,
            required: [true, 'Daily limit is required'],
            default: 50,
        },
        features: {
            type: [String],
            default: [],
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Plan', planSchema);
