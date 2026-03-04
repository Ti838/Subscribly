/**
 * controllers/apiController.js
 * Protected endpoints authenticated via API key + rate limit middleware
 */

const usageService = require('../services/usageService');

const getData = async (req, res) => {
    try {
        const todayLog = await usageService.getTodayLog(req.user.id);
        return res.status(200).json({
            success: true,
            message: 'Data retrieved successfully.',
            data: {
                sampleData: [
                    { id: 1, title: 'API Record #1', value: Math.random().toFixed(4) },
                    { id: 2, title: 'API Record #2', value: Math.random().toFixed(4) },
                    { id: 3, title: 'API Record #3', value: Math.random().toFixed(4) },
                ],
                meta: {
                    plan: req.plan.name,
                    dailyLimit: req.plan.daily_limit === -1 ? 'Unlimited' : req.plan.daily_limit,
                    usedToday: todayLog?.request_count || 1,
                    requestTime: new Date().toISOString(),
                },
            },
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Failed to fetch data.' });
    }
};

const getStatus = async (req, res) => {
    try {
        const todayLog = await usageService.getTodayLog(req.user.id);
        const used = todayLog?.request_count || 0;
        const limit = req.plan.daily_limit;
        const remaining = limit === -1 ? 'Unlimited' : Math.max(0, limit - used);

        return res.status(200).json({
            success: true,
            status: 'active',
            user: { id: req.user.id, name: req.user.name, email: req.user.email },
            plan: { name: req.plan.name, dailyLimit: limit === -1 ? 'Unlimited' : limit },
            usage: { today: used, remaining, resetsAt: 'Midnight UTC' },
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Server error.' });
    }
};

const getUsageHistory = async (req, res) => {
    try {
        const days = parseInt(req.query.days) || 30;
        const logs = await usageService.getHistory(req.user.id, days);
        const totalCalls = logs.reduce((sum, l) => sum + l.request_count, 0);

        return res.status(200).json({
            success: true,
            history: logs.map((l) => ({
                date: l.date,
                requests: l.request_count,
                lastRequestAt: l.last_request_at,
            })),
            summary: {
                totalCalls,
                daysTracked: logs.length,
                averagePerDay: logs.length > 0 ? (totalCalls / logs.length).toFixed(1) : 0,
            },
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Server error.' });
    }
};

module.exports = { getData, getStatus, getUsageHistory };
