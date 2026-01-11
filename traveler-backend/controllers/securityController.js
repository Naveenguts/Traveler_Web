const bcrypt = require('bcryptjs');
const speakeasy = require('speakeasy');
const QRCode = require('qrcode');
const User = require('../models/User');
const TrustedDevice = require('../models/TrustedDevice');
const { sendPasswordChangeEmail, send2FAEnabledEmail } = require('../services/emailService');

// Change Password
const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword, otp } = req.body;
    
    // Validate input
    if (!oldPassword || !newPassword) {
      return res.status(400).json({ message: 'Old password and new password are required' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'New password must be at least 6 characters long' });
    }

    // Get user from database
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // If 2FA is enabled, verify OTP
    if (user.twoFAEnabled) {
      if (!otp) {
        return res.status(403).json({ 
          message: '2FA verification required',
          requires2FA: true,
          twoFAEnabled: true 
        });
      }

      const verified = speakeasy.totp.verify({
        secret: user.twoFASecret,
        encoding: 'base32',
        token: otp,
        window: 2
      });

      if (!verified) {
        return res.status(401).json({ 
          message: 'Invalid 2FA code',
          requires2FA: true 
        });
      }
    }

    // Verify old password
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(12);
    user.password = await bcrypt.hash(newPassword, salt);
    
    // Invalidate all existing tokens by incrementing tokenVersion
    user.tokenVersion += 1;
    
    await user.save();

    // Send email notification
    await sendPasswordChangeEmail(user.email, user.name);

    res.json({ 
      message: 'Password updated successfully. Please login again with your new password.',
      requiresRelogin: true 
    });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ message: 'Server error while changing password' });
  }
};

// Setup Two-Factor Authentication
const setup2FA = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Generate secret key
    const secret = speakeasy.generateSecret({
      name: `Traveler App (${user.email})`,
      length: 32
    });

    // Temporarily store secret (not yet enabled)
    user.twoFASecret = secret.base32;
    await user.save();

    // Generate QR code
    const qrCodeUrl = await QRCode.toDataURL(secret.otpauth_url);

    res.json({
      message: 'Scan this QR code with Google Authenticator or Authy',
      qrCode: qrCodeUrl,
      secret: secret.base32,
      manualEntry: secret.otpauth_url
    });
  } catch (error) {
    console.error('2FA setup error:', error);
    res.status(500).json({ message: 'Server error while setting up 2FA' });
  }
};

// Verify and Enable 2FA
const verify2FA = async (req, res) => {
  try {
    const { otp } = req.body;

    if (!otp) {
      return res.status(400).json({ message: 'OTP is required' });
    }

    const user = await User.findById(req.user.id);
    if (!user || !user.twoFASecret) {
      return res.status(400).json({ message: 'Please setup 2FA first' });
    }

    // Verify OTP
    const verified = speakeasy.totp.verify({
      secret: user.twoFASecret,
      encoding: 'base32',
      token: otp,
      window: 2 // Allow 2 time steps (60 seconds) tolerance
    });

    if (!verified) {
      return res.status(401).json({ message: 'Invalid OTP code' });
    }

    // Enable 2FA
    user.twoFAEnabled = true;
    await user.save();

    // Send confirmation email
    await send2FAEnabledEmail(user.email, user.name);

    res.json({ 
      message: 'Two-factor authentication enabled successfully',
      twoFAEnabled: true 
    });
  } catch (error) {
    console.error('2FA verification error:', error);
    res.status(500).json({ message: 'Server error while verifying 2FA' });
  }
};

// Disable 2FA
const disable2FA = async (req, res) => {
  try {
    const { password, otp } = req.body;

    if (!password) {
      return res.status(400).json({ message: 'Password is required to disable 2FA' });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Incorrect password' });
    }

    // If 2FA is enabled, verify OTP
    if (user.twoFAEnabled) {
      if (!otp) {
        return res.status(403).json({ 
          message: '2FA verification required',
          requires2FA: true,
          twoFAEnabled: true 
        });
      }

      const verified = speakeasy.totp.verify({
        secret: user.twoFASecret,
        encoding: 'base32',
        token: otp,
        window: 2
      });

      if (!verified) {
        return res.status(401).json({ 
          message: 'Invalid 2FA code',
          requires2FA: true 
        });
      }
    }

    // Disable 2FA
    user.twoFAEnabled = false;
    user.twoFASecret = '';
    await user.save();

    res.json({ 
      message: 'Two-factor authentication disabled successfully',
      twoFAEnabled: false 
    });
  } catch (error) {
    console.error('Disable 2FA error:', error);
    res.status(500).json({ message: 'Server error while disabling 2FA' });
  }
};

// Get Trusted Devices
const getTrustedDevices = async (req, res) => {
  try {
    const devices = await TrustedDevice.find({ userId: req.user.id })
      .sort({ lastLogin: -1 })
      .limit(20);

    res.json({ devices });
  } catch (error) {
    console.error('Get devices error:', error);
    res.status(500).json({ message: 'Server error while fetching devices' });
  }
};

// Remove Trusted Device
const removeTrustedDevice = async (req, res) => {
  try {
    const { deviceId } = req.params;

    const device = await TrustedDevice.findOne({
      _id: deviceId,
      userId: req.user.id
    });

    if (!device) {
      return res.status(404).json({ message: 'Device not found' });
    }

    await TrustedDevice.deleteOne({ _id: deviceId });

    res.json({ message: 'Device removed successfully' });
  } catch (error) {
    console.error('Remove device error:', error);
    res.status(500).json({ message: 'Server error while removing device' });
  }
};

// Toggle Login Alerts
const toggleLoginAlerts = async (req, res) => {
  try {
    const { enabled } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.loginAlerts = enabled;
    await user.save();

    res.json({ 
      message: `Login alerts ${enabled ? 'enabled' : 'disabled'} successfully`,
      loginAlerts: enabled 
    });
  } catch (error) {
    console.error('Toggle login alerts error:', error);
    res.status(500).json({ message: 'Server error while updating login alerts' });
  }
};

// Get Security Settings
const getSecuritySettings = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('twoFAEnabled loginAlerts');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      twoFAEnabled: user.twoFAEnabled,
      loginAlerts: user.loginAlerts
    });
  } catch (error) {
    console.error('Get security settings error:', error);
    res.status(500).json({ message: 'Server error while fetching security settings' });
  }
};

module.exports = {
  changePassword,
  setup2FA,
  verify2FA,
  disable2FA,
  getTrustedDevices,
  removeTrustedDevice,
  toggleLoginAlerts,
  getSecuritySettings
};
