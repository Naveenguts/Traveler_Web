const User = require('../models/User');
const TrustedDevice = require('../models/TrustedDevice');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const speakeasy = require('speakeasy');
const useragent = require('useragent');
const geoip = require('geoip-lite');
const { sendLoginAlert } = require('../services/emailService');

// JWT Secret Key (should be in .env file in production)
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this-in-production';

// Register new user
exports.register = async (req, res) => {
  try {
    const { name, email, password, phone, dateOfBirth } = req.body;

    // Validate input
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, and password'
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      phone: phone || '',
      dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined
    });

    // Generate JWT token with tokenVersion
    const token = jwt.sign(
      { 
        id: user._id, 
        email: user.email,
        name: user.name,
        tokenVersion: user.tokenVersion || 0
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        preferences: user.preferences,
        phone: user.phone,
        dateOfBirth: user.dateOfBirth,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({
      success: false,
      message: 'Error registering user',
      error: error.message
    });
  }
};

// Login user
exports.login = async (req, res) => {
  try {
    const { email, password, otp } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // If 2FA is enabled, verify OTP
    if (user.twoFAEnabled) {
      if (!otp) {
        return res.status(200).json({
          success: false,
          requires2FA: true,
          message: 'Please provide OTP from your authenticator app'
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
          success: false,
          message: 'Invalid OTP code'
        });
      }
    }

    // Extract device information
    const userAgent = req.headers['user-agent'] || 'Unknown';
    const ip = req.ip || req.connection.remoteAddress || 'Unknown';
    const agent = useragent.parse(userAgent);
    const geo = geoip.lookup(ip) || {};
    
    const deviceInfo = {
      browser: `${agent.family} ${agent.major || ''}`.trim(),
      os: `${agent.os.family} ${agent.os.major || ''}`.trim(),
      ip: ip,
      location: geo.city || geo.country || 'Unknown',
      userAgent: userAgent
    };

    const deviceFingerprint = `${userAgent}-${ip}`;

    // Check if this is a new device
    const existingDevice = await TrustedDevice.findOne({
      userId: user._id,
      deviceFingerprint: deviceFingerprint
    });

    if (!existingDevice) {
      // New device - send alert if enabled
      if (user.loginAlerts) {
        const timestamp = new Date().toLocaleString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          timeZoneName: 'short'
        });

        await sendLoginAlert(user.email, user.name, {
          ...deviceInfo,
          timestamp
        });
      }

      // Save new trusted device
      await TrustedDevice.create({
        userId: user._id,
        deviceName: `${deviceInfo.browser} on ${deviceInfo.os}`,
        browser: deviceInfo.browser,
        os: deviceInfo.os,
        ip: deviceInfo.ip,
        location: {
          city: geo.city || '',
          region: geo.region || '',
          country: geo.country || '',
          timezone: geo.timezone || ''
        },
        userAgent: userAgent,
        lastLogin: new Date(),
        deviceFingerprint: deviceFingerprint
      });
    } else {
      // Update last login time
      existingDevice.lastLogin = new Date();
      await existingDevice.save();
    }

    // Generate JWT token with tokenVersion
    const token = jwt.sign(
      { 
        id: user._id, 
        email: user.email,
        name: user.name,
        tokenVersion: user.tokenVersion
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        preferences: user.preferences,
        phone: user.phone,
        dateOfBirth: user.dateOfBirth,
        twoFAEnabled: user.twoFAEnabled,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Error logging in',
      error: error.message
    });
  }
};

// Get current user profile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        preferences: user.preferences,
        phone: user.phone,
        dateOfBirth: user.dateOfBirth,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching profile',
      error: error.message
    });
  }
};

// Update user profile
exports.updateProfile = async (req, res) => {
  try {
    const { name, preferences, phone, dateOfBirth } = req.body;
    const updates = {};

    if (name) updates.name = name;
    if (preferences) updates.preferences = preferences;
    if (typeof phone !== 'undefined') updates.phone = phone;
    if (typeof dateOfBirth !== 'undefined') updates.dateOfBirth = dateOfBirth ? new Date(dateOfBirth) : null;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: updates },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        preferences: user.preferences,
        phone: user.phone,
        dateOfBirth: user.dateOfBirth,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating profile',
      error: error.message
    });
  }
};
