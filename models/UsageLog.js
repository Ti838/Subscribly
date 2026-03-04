/**
 * models/UsageLog.js
 * Tracks daily API usage per user
 * One document per user per day — reset at midnight each day
 */

const mongoose = require('mongoose');

const usageLogSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        // Date stored as YYYY-MM-DD string for easy daily grouping
        date: {
            type: String,
            required: true,
        },
        // Number of API requests made today
        requestCount: {
            type: Number,
            default: 0,
        },
        lastRequestAt: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: true,
    }
);

// ─── Compound Index: Ensure one log per user per day ─────────────────────
usageLogSchema.index({ userId: 1, date: 1 }, { unique: true });

// ─── Static: Get or create today's usage log for a user ──────────────────
usageLogSchema.statics.getTodayLog = async function (userId) {
    const today = new Date().toISOString().split('T')[0]; // "YYYY-MM-DD"

    let log = await this.findOne({ userId, date: today });

    if (!log) {
        log = await this.create({ userId, date: today, requestCount: 0 });
    }

    return log;
};

// ─── Static: Increment today's request count ─────────────────────────────
usageLogSchema.statics.incrementUsage = async function (userId) {
    const today = new Date().toISOString().split('T')[0];

    return await this.findOneAndUpdate(
        { userId, date: today },
        {
            $inc: { requestCount: 1 },
            $set: { lastRequestAt: new Date() },
        },
        { upsert: true, new: true }
    );
};

module.exports = mongoose.model('UsageLog', usageLogSchema);
