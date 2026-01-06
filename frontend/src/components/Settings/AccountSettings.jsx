import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';

const AccountSettings = () => {
  const { user, token, apiUrl, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    dateOfBirth: user?.dateOfBirth ? user.dateOfBirth.substring(0, 10) : ''
  });
  const [status, setStatus] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      dateOfBirth: user?.dateOfBirth ? user.dateOfBirth.substring(0, 10) : ''
    });
  }, [user?.name, user?.email, user?.phone, user?.dateOfBirth]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    if (!token) {
      setStatus('Please log in again to update your profile.');
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
      setIsEditing(false);
      setStatus('Profile updated and saved.');
    } catch (err) {
      setStatus(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="settings-container">
      <div className="settings-header">
        <h2>Account Settings</h2>
        <button 
          className="btn-edit"
          onClick={() => setIsEditing(!isEditing)}
        >
          {isEditing ? 'Cancel' : 'Edit'}
        </button>
      </div>

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
            disabled={!isEditing}
            className={!isEditing ? 'disabled' : ''}
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
          <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        )}

        {status && <p className="settings-status">{status}</p>}
      </div>
    </div>
  );
};

export default AccountSettings;
