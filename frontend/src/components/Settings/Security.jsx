import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import TwoFAVerificationModal from './TwoFAVerificationModal';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const Security = () => {
  const { token: authToken } = useAuth();
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [show2FASetup, setShow2FASetup] = useState(false);
  const [qrCode, setQrCode] = useState('');
  const [otp, setOtp] = useState('');
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [securitySettings, setSecuritySettings] = useState({
    twoFAEnabled: false,
    loginAlerts: true,
    trustedDevices: []
  });
  const [loading, setLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState('');
  const [message, setMessage] = useState({ text: '', type: '' });
  const [show2FAVerification, setShow2FAVerification] = useState(false);
  const [pendingSensitiveAction, setPendingSensitiveAction] = useState(null);
  const [pendingActionData, setPendingActionData] = useState(null);

  useEffect(() => {
    fetchSecuritySettings();
    fetchTrustedDevices();
  }, []);

  const getAuthToken = () => authToken || localStorage.getItem('traveler_token') || localStorage.getItem('token');

  const showMessage = (text, type = 'success') => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: '', type: '' }), 5000);
  };

  const fetchSecuritySettings = async () => {
    try {
      const token = getAuthToken();
      const response = await axios.get(`${API_URL}/security/settings`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSecuritySettings(prev => ({
        ...prev,
        twoFAEnabled: response.data.twoFAEnabled,
        loginAlerts: response.data.loginAlerts
      }));
    } catch (error) {
      console.error('Error fetching security settings:', error);
    }
  };

  const fetchTrustedDevices = async () => {
    try {
      const token = getAuthToken();
      const response = await axios.get(`${API_URL}/security/devices`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSecuritySettings(prev => ({
        ...prev,
        trustedDevices: response.data.devices
      }));
    } catch (error) {
      console.error('Error fetching trusted devices:', error);
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));

    // Check password strength
    if (name === 'newPassword') {
      if (value.length < 6) {
        setPasswordStrength('Weak');
      } else if (value.length < 10) {
        setPasswordStrength('Fair');
      } else if (value.match(/[A-Z]/) && value.match(/[0-9]/) && value.match(/[!@#$%^&*]/)) {
        setPasswordStrength('Strong');
      } else {
        setPasswordStrength('Good');
      }
    }
  };

  const handleChangePassword = async (otp = null) => {
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      showMessage('Please fill in all password fields', 'error');
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showMessage('New passwords do not match', 'error');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      showMessage('Password must be at least 6 characters long', 'error');
      return;
    }

    // If 2FA is enabled and OTP is not provided, show verification modal
    if (securitySettings.twoFAEnabled && !otp) {
      setPendingSensitiveAction('changePassword');
      setPendingActionData(passwordData);
      setShow2FAVerification(true);
      return;
    }

    setLoading(true);
    try {
      const token = getAuthToken();
      const requestData = {
        oldPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      };

      // Include OTP if 2FA is enabled
      if (otp) {
        requestData.otp = otp;
      }

      const response = await axios.post(
        `${API_URL}/security/change-password`,
        requestData,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      showMessage(response.data.message, 'success');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setShowPasswordForm(false);
      setShow2FAVerification(false);
      setPendingSensitiveAction(null);

      // If requires relogin, logout user
      if (response.data.requiresRelogin) {
        setTimeout(() => {
          localStorage.removeItem('token');
          window.location.href = '/login';
        }, 2000);
      }
    } catch (error) {
      if (error.response?.data?.requires2FA) {
        setPendingSensitiveAction('changePassword');
        setPendingActionData(passwordData);
        setShow2FAVerification(true);
      } else {
        showMessage(error.response?.data?.message || 'Failed to change password', 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSetup2FA = async () => {
    const token = getAuthToken();
    if (!token) {
      showMessage('Please login again to setup 2FA', 'error');
      return;
    }

    // If 2FA is already enabled, require verification first
    if (securitySettings.twoFAEnabled) {
      setPendingSensitiveAction('setup2FA');
      setShow2FAVerification(true);
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        `${API_URL}/security/2fa/setup`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setQrCode(response.data.qrCode);
      setShow2FASetup(true);
      showMessage('Scan the QR code with your authenticator app', 'success');
    } catch (error) {
      showMessage(error.response?.data?.message || 'Failed to setup 2FA', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify2FA = async (otp = null) => {
    if (!otp || otp.length !== 6) {
      showMessage('Please enter a valid 6-digit OTP', 'error');
      return;
    }

    setLoading(true);
    try {
      const token = getAuthToken();
      const response = await axios.post(
        `${API_URL}/security/2fa/verify`,
        { otp },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      showMessage(response.data.message, 'success');
      setSecuritySettings(prev => ({ ...prev, twoFAEnabled: true }));
      setShow2FASetup(false);
      setQrCode('');
      setOtp('');
    } catch (error) {
      showMessage(error.response?.data?.message || 'Invalid OTP', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDisable2FA = async (otp = null) => {
    // If 2FA is enabled, require verification first
    if (securitySettings.twoFAEnabled && !otp) {
      setPendingSensitiveAction('disable2FA');
      setShow2FAVerification(true);
      return;
    }

    const password = prompt('Enter your password to disable 2FA:');
    if (!password) return;

    setLoading(true);
    try {
      const token = getAuthToken();
      const requestData = { password };

      // Include OTP if provided (from 2FA verification)
      if (otp) {
        requestData.otp = otp;
      }

      const response = await axios.post(
        `${API_URL}/security/2fa/disable`,
        requestData,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      showMessage(response.data.message, 'success');
      setSecuritySettings(prev => ({ ...prev, twoFAEnabled: false }));
      setShow2FAVerification(false);
      setPendingSensitiveAction(null);
    } catch (error) {
      if (error.response?.data?.requires2FA) {
        setPendingSensitiveAction('disable2FA');
        setShow2FAVerification(true);
      } else {
        showMessage(error.response?.data?.message || 'Failed to disable 2FA', 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleToggleLoginAlerts = async () => {
    setLoading(true);
    try {
      const token = getAuthToken();
      const newState = !securitySettings.loginAlerts;
      await axios.put(
        `${API_URL}/security/login-alerts`,
        { enabled: newState },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setSecuritySettings(prev => ({
        ...prev,
        loginAlerts: newState
      }));
      showMessage(`Login alerts ${newState ? 'enabled' : 'disabled'}`, 'success');
    } catch (error) {
      showMessage('Failed to update login alerts', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveDevice = async (deviceId) => {
    if (!confirm('Are you sure you want to remove this device?')) return;

    setLoading(true);
    try {
      const token = getAuthToken();
      await axios.delete(`${API_URL}/security/devices/${deviceId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setSecuritySettings(prev => ({
        ...prev,
        trustedDevices: prev.trustedDevices.filter(device => device._id !== deviceId)
      }));
      showMessage('Device removed successfully', 'success');
    } catch (error) {
      showMessage('Failed to remove device', 'error');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleTwoFAVerification = async (otp) => {
    setLoading(true);
    try {
      switch (pendingSensitiveAction) {
        case 'changePassword':
          await handleChangePassword(otp);
          break;
        case 'disable2FA':
          await handleDisable2FA(otp);
          break;
        case 'setup2FA':
          // For setup 2FA when already enabled, just proceed with OTP verification
          setShow2FAVerification(false);
          setPendingSensitiveAction(null);
          break;
        default:
          break;
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="settings-container">
      <TwoFAVerificationModal
        isOpen={show2FAVerification}
        onVerify={handleTwoFAVerification}
        onCancel={() => {
          setShow2FAVerification(false);
          setPendingSensitiveAction(null);
          setPendingActionData(null);
        }}
        loading={loading}
        actionName={
          pendingSensitiveAction === 'changePassword' ? 'changing your password' :
          pendingSensitiveAction === 'disable2FA' ? 'disabling 2FA' :
          pendingSensitiveAction === 'setup2FA' ? 'setting up 2FA' :
          'this action'
        }
      />

      <div className="settings-header">
        <h2>Security & Password</h2>
      </div>

      {/* Message Alert */}
      {message.text && (
        <div className={`alert alert-${message.type}`}>
          {message.text}
        </div>
      )}

      {/* Change Password Section */}
      <div className="security-section">
        <div className="section-header">
          <h3>Change Password</h3>
          <button 
            className="btn-edit"
            onClick={() => setShowPasswordForm(!showPasswordForm)}
            disabled={loading}
          >
            {showPasswordForm ? 'Cancel' : 'Change Password'}
          </button>
        </div>

        {showPasswordForm && (
          <div className="password-form">
            <div className="form-group">
              <label>Current Password</label>
              <input
                type="password"
                name="currentPassword"
                placeholder="Enter your current password"
                value={passwordData.currentPassword}
                onChange={handlePasswordChange}
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label>New Password</label>
              <input
                type="password"
                name="newPassword"
                placeholder="Enter new password (min 6 characters)"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                disabled={loading}
              />
              {passwordData.newPassword && (
                <div className={`password-strength ${passwordStrength.toLowerCase()}`}>
                  Strength: <strong>{passwordStrength}</strong>
                </div>
              )}
            </div>

            <div className="form-group">
              <label>Confirm New Password</label>
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm new password"
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange}
                disabled={loading}
              />
            </div>

            <button 
              className="btn btn-primary" 
              onClick={handleChangePassword}
              disabled={loading}
            >
              {loading ? 'Updating...' : 'Update Password'}
            </button>
          </div>
        )}
      </div>

      {/* Two-Factor Authentication */}
      <div className="security-section">
        <div className="section-header">
          <h3>Two-Factor Authentication</h3>
          <button 
            className={`btn ${securitySettings.twoFAEnabled ? 'btn-danger' : 'btn-success'}`}
            onClick={securitySettings.twoFAEnabled ? handleDisable2FA : handleSetup2FA}
            disabled={loading}
          >
            {securitySettings.twoFAEnabled ? 'Disable' : 'Enable'}
          </button>
        </div>
        <p className="section-desc">
          {securitySettings.twoFAEnabled 
            ? '✓ Two-factor authentication is enabled. Your account is protected with an extra layer of security.'
            : 'Two-factor authentication is disabled. Enable it for better security.'}
        </p>

        {/* 2FA Setup Modal */}
        {show2FASetup && (
          <div className="twofa-setup">
            <h4>Setup Two-Factor Authentication</h4>
            <p>Scan this QR code with Google Authenticator or Authy:</p>
            {qrCode && (
              <div className="qr-code-container">
                <img src={qrCode} alt="2FA QR Code" />
              </div>
            )}
            <div className="form-group">
              <label>Enter the 6-digit code from your app:</label>
              <input
                type="text"
                placeholder="000000"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                maxLength="6"
                disabled={loading}
                style={{ textAlign: 'center', fontSize: '24px', letterSpacing: '8px' }}
              />
            </div>
            <button 
              className="btn btn-primary" 
              onClick={handleVerify2FA}
              disabled={loading || otp.length !== 6}
            >
              {loading ? 'Verifying...' : 'Verify & Enable'}
            </button>
            <button 
              className="btn btn-secondary" 
              onClick={() => {
                setShow2FASetup(false);
                setQrCode('');
                setOtp('');
              }}
              disabled={loading}
              style={{ marginLeft: '10px' }}
            >
              Cancel
            </button>
          </div>
        )}
      </div>

      {/* Login Alerts */}
      <div className="security-section">
        <div className="section-header">
          <h3>Login Alerts</h3>
          <label className="toggle-switch">
            <input 
              type="checkbox"
              checked={securitySettings.loginAlerts}
              onChange={handleToggleLoginAlerts}
              disabled={loading}
            />
            <span className="slider"></span>
          </label>
        </div>
        <p className="section-desc">
          {securitySettings.loginAlerts 
            ? 'You will receive alerts when your account is accessed from a new location or device.'
            : 'Login alerts are disabled.'}
        </p>
      </div>

      {/* Trusted Devices */}
      <div className="security-section">
        <h3>Trusted Devices</h3>
        <div className="trusted-devices">
          {securitySettings.trustedDevices.length === 0 ? (
            <p className="no-devices">No trusted devices found. Login from a device to see it here.</p>
          ) : (
            securitySettings.trustedDevices.map(device => (
              <div key={device._id} className="device-card">
                <div className="device-info">
                  <h4>{device.deviceName}</h4>
                  <p className="device-location">
                    📍 {device.location?.city ? 
                      `${device.location.city}, ${device.location.country}` : 
                      device.location?.country || 'Unknown Location'}
                  </p>
                  <p className="device-lastlogin">
                    Last login: {formatDate(device.lastLogin)}
                  </p>
                  <p className="device-ip" style={{ fontSize: '12px', color: '#666' }}>
                    IP: {device.ip}
                  </p>
                </div>
                <button 
                  className="btn-delete"
                  onClick={() => handleRemoveDevice(device._id)}
                  disabled={loading}
                >
                  Remove
                </button>
              </div>
            ))
          )}
        </div>
        <p className="section-desc">
          These are devices where you've recently logged in. Remove any devices you don't recognize.
        </p>
      </div>
    </div>
  );
};

export default Security;
