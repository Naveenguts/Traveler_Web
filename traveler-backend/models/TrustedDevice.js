const mongoose = require('mongoose');

const trustedDeviceSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  deviceName: {
    type: String,
    required: true
  },
  browser: {
    type: String,
    required: true
  },
  os: {
    type: String,
    required: true
  },
  ip: {
    type: String,
    required: true
  },
  location: {
    city: String,
    region: String,
    country: String,
    timezone: String
  },
  userAgent: {
    type: String,
    required: true
  },
  lastLogin: {
    type: Date,
    default: Date.now
  },
  isTrusted: {
    type: Boolean,
    default: true
  },
  deviceFingerprint: {
    type: String,
    // Combination of userAgent + ip for quick matching
    required: true,
    index: true
  }
}, {
  timestamps: true
});

// Index for faster queries
trustedDeviceSchema.index({ userId: 1, lastLogin: -1 });
trustedDeviceSchema.index({ userId: 1, deviceFingerprint: 1 });

module.exports = mongoose.model('TrustedDevice', trustedDeviceSchema);
