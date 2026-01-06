const jwt = require('jsonwebtoken');
const User = require('../models/User');

// JWT Secret Key (should match the one in authController)
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this-in-production';

// Middleware to verify JWT token
const auth = async (req, res, next) => {
  try {
    // Get token from header
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No authentication token, access denied'
      });
    }

    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Check if token version is still valid (for password changes)
    if (decoded.tokenVersion !== undefined) {
      const user = await User.findById(decoded.id).select('tokenVersion');
      if (!user || user.tokenVersion !== decoded.tokenVersion) {
        return res.status(401).json({
          success: false,
          message: 'Token invalid. Please login again.',
          requiresRelogin: true
        });
      }
    }
    
    // Add user info to request
    req.user = decoded;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token'
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expired'
      });
    }
    
    res.status(401).json({
      success: false,
      message: 'Authentication failed'
    });
  }
};

module.exports = auth;
