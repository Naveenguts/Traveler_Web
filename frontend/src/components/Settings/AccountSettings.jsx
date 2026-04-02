import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const AccountSettings = () => {
  const { user, token, apiUrl, updateUser, logout } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const DRAFT_KEY = 'traveler_profile_draft';
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    dateOfBirth: user?.dateOfBirth ? user.dateOfBirth.substring(0, 10) : ''
  });
  const [status, setStatus] = useState('');
  const [statusType, setStatusType] = useState('success');
  const [saving, setSaving] = useState(false);

  // Check token validity on component mount
  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setStatus('Please log in to access account settings.');
        setStatusType('error');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
        return;
      }

      try {
        const res = await fetch(`${apiUrl}/auth/verify-token`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (res.status === 401) {
          const data = await res.json();
          setStatus(data?.message || 'Session expired. Please log in again.');
          setStatusType('error');
          setTimeout(() => {
            logout();
            navigate('/login', { state: { message: 'Session expired. Please log in again.' } });
          }, 2000);
        }
      } catch (error) {
        console.error('Token verification error:', error);
        // Don't logout on network errors, only on auth failures
      }
    };

    verifyToken();
  }, [token, apiUrl, logout, navigate]);

  useEffect(() => {
    // Initialize from user (server/localStorage persisted)
    const base = {
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      dateOfBirth: user?.dateOfBirth ? user.dateOfBirth.substring(0, 10) : ''
    };

    // If a local draft exists, prefer it for in-progress edits
    try {
      const raw = localStorage.getItem(DRAFT_KEY);
      if (raw) {
        const draft = JSON.parse(raw);
        setFormData({ ...base, ...draft });
        return;
      }
    } catch (e) {}

    setFormData(base);
  }, [user?.name, user?.email, user?.phone, user?.dateOfBirth]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Persist draft locally so edits survive refresh/restarts
    try {
      const nextDraft = { ...JSON.parse(localStorage.getItem(DRAFT_KEY) || '{}'), [name]: value };
      localStorage.setItem(DRAFT_KEY, JSON.stringify(nextDraft));
    } catch (e) {}
  };

  const handleSave = async () => {
    if (!token) {
      setStatus('Please log in again to update your profile.');
      setStatusType('error');
      return;
    }
    setSaving(true);
    setStatus('');
    try {
      const res = await fetch(`${apiUrl}/auth/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          name: formData.name,
          preferences: user?.preferences,
          phone: formData.phone,
          dateOfBirth: formData.dateOfBirth || null
        })
      });
      const data = await res.json();
      
      // Handle token expiration
      if (res.status === 401 && data?.message?.toLowerCase().includes('token expired')) {
        setStatus('Your session has expired. Redirecting to login...');
        setStatusType('error');
        setTimeout(() => {
          logout();
          navigate('/login', { state: { message: 'Session expired. Please log in again.' } });
        }, 1500);
        return;
      }
      
      if (!res.ok || !data?.success) {
        throw new Error(data?.message || 'Unable to update profile');
      }
      updateUser({
        name: data.user.name,
        email: data.user.email,
        preferences: data.user.preferences,
        phone: data.user.phone,
        dateOfBirth: data.user.dateOfBirth
      });
      // Clear local draft after successful save
      try { localStorage.removeItem(DRAFT_KEY); } catch (e) {}
      setIsEditing(false);
      setStatus('Profile updated and saved.');
      setStatusType('success');
    } catch (err) {
      setStatus(err.message);
      setStatusType('error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="settings-container">
      <div className="settings-header">
        <h2>Account Settings</h2>
        <button 
          className="btn-edit micro-btn"
          onClick={() => setIsEditing(!isEditing)}
        >
          {isEditing ? 'Cancel' : 'Edit'}
        </button>
      </div>

      {status && (
        <div className={`toast-notification inline-toast ${statusType === 'error' ? 'toast-error' : 'toast-success'}`}>
          <span className="toast-icon" aria-hidden="true">{statusType === 'error' ? '⚠️' : '✅'}</span>
          <span>{status}</span>
        </div>
      )}

      <div className="section-divider"></div>

      <div className="settings-form">
        <div className="form-group">
          <label>Full Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            disabled={!isEditing}
            className={!isEditing ? 'disabled' : ''}
          />
        </div>

        <div className="form-group">
          <label>Email Address</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            disabled
            readOnly
            className={'disabled'}
          />
        </div>

        <div className="form-group">
          <label>Phone Number</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            disabled={!isEditing}
            className={!isEditing ? 'disabled' : ''}
          />
        </div>

        <div className="form-group">
          <label>Date of Birth</label>
          <input
            type="date"
            name="dateOfBirth"
            value={formData.dateOfBirth}
            onChange={handleChange}
            disabled={!isEditing}
            className={!isEditing ? 'disabled' : ''}
          />
        </div>

        {isEditing && (
          <button className="btn btn-primary micro-btn" onClick={handleSave} disabled={saving}>
            {saving ? (
              <>
                <span className="spinner" aria-hidden="true"></span>
                Saving...
              </>
            ) : (
              'Save Changes'
            )}
          </button>
        )}
      </div>
    </div>
  );
};

export default AccountSettings;
