const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  changePassword,
  setup2FA,
  verify2FA,
  disable2FA,
  getTrustedDevices,
  removeTrustedDevice,
  toggleLoginAlerts,
  getSecuritySettings
} = require('../controllers/securityController');

// All routes require authentication
router.use(auth);

// Password Management
router.post('/change-password', changePassword);

// Two-Factor Authentication
router.get('/2fa/status', getSecuritySettings);
router.post('/2fa/setup', setup2FA);
router.post('/2fa/verify', verify2FA);
router.post('/2fa/disable', disable2FA);

// Trusted Devices
router.get('/devices', getTrustedDevices);
router.delete('/devices/:deviceId', removeTrustedDevice);

// Login Alerts
router.put('/login-alerts', toggleLoginAlerts);

// Get all security settings
router.get('/settings', getSecuritySettings);

module.exports = router;
