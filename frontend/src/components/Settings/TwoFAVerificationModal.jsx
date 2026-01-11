import React, { useState, useEffect } from 'react';
import '../../styles/TwoFAVerificationModal.css';

const TwoFAVerificationModal = ({
  isOpen,
  onVerify,
  onCancel,
  loading = false,
  actionName = 'this action'
}) => {
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setOtp('');
      setError('');
    }
  }, [isOpen]);

  const handleOTPChange = (e) => {
    const value = e.target.value.replace(/\D/g, ''); // Only allow digits
    if (value.length <= 6) {
      setOtp(value);
      setError('');
    }
  };

  const handleVerify = () => {
    if (otp.length !== 6) {
      setError('Please enter a 6-digit code');
      return;
    }
    onVerify(otp);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && otp.length === 6) {
      handleVerify();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="twofa-modal-overlay">
      <div className="twofa-modal">
        <div className="twofa-modal-header">
          <h3>Two-Factor Authentication</h3>
          <button
            className="twofa-modal-close"
            onClick={onCancel}
            disabled={loading}
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <div className="twofa-modal-content">
          <p className="twofa-modal-description">
            Enter the 6-digit code from your authenticator app to proceed with {actionName}.
          </p>

          <div className="twofa-input-group">
            <input
              type="text"
              className={`twofa-input ${error ? 'error' : ''}`}
              placeholder="000000"
              value={otp}
              onChange={handleOTPChange}
              onKeyPress={handleKeyPress}
              disabled={loading}
              maxLength="6"
              autoComplete="off"
              autoFocus
            />
            <div className="twofa-input-help">
              Enter the 6-digit code from your authenticator app
            </div>
          </div>

          {error && <div className="twofa-error-message">{error}</div>}

          <div className="twofa-modal-footer">
            <button
              className="btn btn-secondary"
              onClick={onCancel}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              className="btn btn-primary"
              onClick={handleVerify}
              disabled={loading || otp.length !== 6}
            >
              {loading ? 'Verifying...' : 'Verify'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TwoFAVerificationModal;
