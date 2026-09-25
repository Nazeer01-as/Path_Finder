const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.toLowerCase().startsWith('bearer')
  ) {
    const parts = req.headers.authorization.split(' ');
    if (parts.length === 2 && parts[1] && parts[1] !== 'null' && parts[1] !== 'undefined') {
      token = parts[1].trim();
    }
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Access denied. No authentication token provided.'
    });
  }

  try {
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET environment variable is missing.');
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'The user belonging to this token no longer exists.'
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: error.name === 'TokenExpiredError'
        ? 'Authentication token expired, please log in again.'
        : 'Not authorized, token validation failed.'
    });
  }
};

/**
 * Optional Auth middleware - detects user if token provided, but doesn't block if absent
 */
const optionalAuth = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.toLowerCase().startsWith('bearer')
  ) {
    const parts = req.headers.authorization.split(' ');
    if (parts.length === 2 && parts[1] && parts[1] !== 'null' && parts[1] !== 'undefined') {
      token = parts[1].trim();
    }
  }

  if (!token || !process.env.JWT_SECRET) {
    return next();
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    if (user) {
      req.user = user;
    }
  } catch {
    // Silently continue for unauthenticated/expired guests
  }
  next();
};

const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    return next();
  }
  return res.status(403).json({
    success: false,
    message: 'Access denied: Administrator privileges required.'
  });
};

module.exports = {
  protect,
  optionalAuth,
  adminOnly
};

