const speakeasy = require('speakeasy');
const User = require('../models/User');

/**
 * Middleware to verify 2FA for sensitive actions
 * Checks if user has 2FA enabled and verifies the provided OTP
 * If 2FA is not enabled, allows the action to proceed
 */
const verify2FAForSensitiveAction = async (req, res, next) => {
  try {
    const { otp } = req.body;
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // If 2FA is not enabled, allow the action to proceed
    if (!user.twoFAEnabled) {
      return next();
    }

    // If 2FA is enabled, OTP is required
    if (!otp) {
      return res.status(403).json({ 
        message: '2FA verification required',
        requires2FA: true,
        twoFAEnabled: true 
      });
    }

    // Verify OTP
    const verified = speakeasy.totp.verify({
      secret: user.twoFASecret,
      encoding: 'base32',
      token: otp,
      window: 2 // Allow 2 time steps (60 seconds) tolerance
    });

    if (!verified) {
      return res.status(401).json({ 
        message: 'Invalid 2FA code',
        requires2FA: true 
      });
    }

    // OTP is valid, proceed to next middleware
    next();
  } catch (error) {
    console.error('2FA verification error:', error);
    res.status(500).json({ message: 'Server error during 2FA verification' });
  }
};

module.exports = verify2FAForSensitiveAction;
