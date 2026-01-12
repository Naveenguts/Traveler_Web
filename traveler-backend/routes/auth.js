const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const auth = require('../middleware/auth');

// Public routes
// POST /api/auth/register
router.post('/register', authController.register);

// POST /api/auth/login
router.post('/login', authController.login);

// Protected routes (require authentication)
// GET /api/auth/profile
router.get('/profile', auth, authController.getProfile);

// PUT /api/auth/profile
router.put('/profile', auth, authController.updateProfile);

// GET /api/auth/verify-token - Verify if token is still valid
router.get('/verify-token', auth, (req, res) => {
  // If middleware passes, token is valid
  res.json({ success: true, valid: true, user: req.user });
});

module.exports = router;
