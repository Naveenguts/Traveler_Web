  import React, { useState } from 'react';

const Security = () => {
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [securitySettings, setSecuritySettings] = useState({
    twoFactorEnabled: true,
    loginAlerts: true,
    trustedDevices: [
      { id: 1, device: 'Chrome on Windows', lastLogin: '2024-12-13', location: 'New York, USA' },
      { id: 2, device: 'Safari on iPhone', lastLogin: '2024-12-12', location: 'New York, USA' }
    ]
  });
  const [passwordStrength, setPasswordStrength] = useState('');

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

  const handleChangePassword = () => {
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      alert('Please fill in all password fields');
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('New passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 8) {
      alert('Password must be at least 8 characters long');
      return;
    }

    alert('Password changed successfully!');
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    setShowPasswordForm(false);
  };

  const handleToggle2FA = () => {
    setSecuritySettings(prev => ({
      ...prev,
      twoFactorEnabled: !prev.twoFactorEnabled
    }));
    alert('Two-factor authentication ' + (securitySettings.twoFactorEnabled ? 'disabled' : 'enabled'));
  };

  const handleRemoveDevice = (id) => {
    setSecuritySettings(prev => ({
      ...prev,
      trustedDevices: prev.trustedDevices.filter(device => device.id !== id)
    }));
    alert('Device removed from trusted devices');
  };

  return (
    <div className="settings-container">
      <div className="settings-header">
        <h2>Security & Password</h2>
      </div>

      {/* Change Password Section */}
      <div className="security-section">
        <div className="section-header">
          <h3>Change Password</h3>
          <button 
            className="btn-edit"
            onClick={() => setShowPasswordForm(!showPasswordForm)}
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
              />
            </div>

            <div className="form-group">
              <label>New Password</label>
              <input
                type="password"
                name="newPassword"
                placeholder="Enter new password"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
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
              />
            </div>

            <button className="btn btn-primary" onClick={handleChangePassword}>
              Update Password
            </button>
          </div>
        )}
      </div>

      {/* Two-Factor Authentication */}
      <div className="security-section">
        <div className="section-header">
          <h3>Two-Factor Authentication</h3>
          <button 
            className={`btn ${securitySettings.twoFactorEnabled ? 'btn-danger' : 'btn-success'}`}
            onClick={handleToggle2FA}
          >
            {securitySettings.twoFactorEnabled ? 'Disable' : 'Enable'}
          </button>
        </div>
        <p className="section-desc">
          {securitySettings.twoFactorEnabled 
            ? '✓ Two-factor authentication is enabled. Your account is protected with an extra layer of security.'
            : 'Two-factor authentication is disabled. Enable it for better security.'}
        </p>
      </div>

      {/* Login Alerts */}
      <div className="security-section">
        <div className="section-header">
          <h3>Login Alerts</h3>
          <label className="toggle-switch">
            <input 
              type="checkbox"
              checked={securitySettings.loginAlerts}
              onChange={() => setSecuritySettings(prev => ({
                ...prev,
                loginAlerts: !prev.loginAlerts
              }))}
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
          {securitySettings.trustedDevices.map(device => (
            <div key={device.id} className="device-card">
              <div className="device-info">
                <h4>{device.device}</h4>
                <p className="device-location">📍 {device.location}</p>
                <p className="device-lastlogin">Last login: {device.lastLogin}</p>
              </div>
              <button 
                className="btn-delete"
                onClick={() => handleRemoveDevice(device.id)}
              >
                Remove
              </button>
            </div>
          ))}
        </div>
        <p className="section-desc">
          These are devices where you've recently logged in. Remove any devices you don't recognize.
        </p>
      </div>
    </div>
  );
};

export default Security;
