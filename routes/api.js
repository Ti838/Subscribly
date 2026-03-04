/**
 * routes/api.js
 * Protected API routes — require API key + active subscription + rate limit
 */

const express = require('express');
const router = express.Router();
const { getData, getStatus, getUsageHistory } = require('../controllers/apiController');
const { authenticateApiKey, rateLimiter } = require('../middleware/rateLimitMiddleware');

// All routes below require: valid API key + active subscription + under daily limit
router.use(authenticateApiKey, rateLimiter);

router.get('/data', getData);
router.get('/status', getStatus);
router.get('/usage-history', getUsageHistory);

module.exports = router;
