const rateLimit = require('express-rate-limit');

/**
 * Rate Limiter for Authentication endpoints (login, register)
 * 50 requests per 15 minutes per IP — protects against brute-force attacks
 * while remaining developer & testing friendly.
 */
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many authentication attempts from this IP. Please try again after 15 minutes.'
  }
});

/**
 * Rate Limiter for Recommendation generation
 * 60 requests per minute per IP — prevents expensive multi-collection scoring overload.
 */
const recommendationLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 60,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many recommendation requests. Please slow down.'
  }
});

module.exports = {
  authLimiter,
  recommendationLimiter
};
