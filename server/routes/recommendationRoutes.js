const express = require('express');
const router = express.Router();
const { getRecommendations } = require('../controllers/recommendationController');
const { protect } = require('../middleware/authMiddleware');
const { recommendationLimiter } = require('../middleware/rateLimiter');

router.get('/', protect, recommendationLimiter, getRecommendations);

module.exports = router;

