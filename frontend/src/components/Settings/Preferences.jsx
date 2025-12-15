import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

const Preferences = () => {
  const { preferences: ctxPrefs, updatePreferences, pushAlert } = useAuth();
  const [preferences, setPreferences] = useState({ ...ctxPrefs, privacyLevel: 'public', newsletter: true });

  useEffect(() => {
    setPreferences((prev) => ({ ...prev, ...ctxPrefs }));
  }, [ctxPrefs]);

  const handleNotificationChange = (type) => {
    setPreferences(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [type]: !prev.notifications[type]
      }
    }));
  };

  const handlePreferenceChange = (field, value) => {
    setPreferences(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    updatePreferences({
      language: preferences.language,
      currency: preferences.currency,
      notifications: preferences.notifications,
      privacyLevel: preferences.privacyLevel,
      newsletter: preferences.newsletter,
      travelType: preferences.travelType
    });
    pushAlert('Preferences saved. Your feed will reflect your interests.');
  };

  return (
    <div className="settings-container">
      <div className="settings-header">
        <h2>Preferences</h2>
      </div>

      <div className="preferences-grid">
        <div className="preference-section">
          <h3>Language & Region</h3>
          
          <div className="form-group">
            <label>Language</label>
            <select 
              value={preferences.language}
              onChange={(e) => handlePreferenceChange('language', e.target.value)}
            >
              <option>English</option>
              <option>Spanish</option>
              <option>French</option>
              <option>German</option>
              <option>Chinese</option>
            </select>
          </div>

          <div className="form-group">
            <label>Currency</label>
            <select 
              value={preferences.currency}
              onChange={(e) => handlePreferenceChange('currency', e.target.value)}
            >
              <option>USD - US Dollar</option>
              <option>EUR - Euro</option>
              <option>GBP - British Pound</option>
              <option>JPY - Japanese Yen</option>
              <option>AUD - Australian Dollar</option>
            </select>
          </div>
        </div>

        <div className="preference-section">
          <h3>Notifications</h3>
          
          <div className="checkbox-group">
            <label className="checkbox-label">
              <input 
                type="checkbox"
                checked={preferences.notifications.email}
                onChange={() => handleNotificationChange('email')}
              />
              <span>Email Notifications</span>
            </label>
            <p className="checkbox-desc">Receive updates about your bookings and deals via email</p>
          </div>

          <div className="checkbox-group">
            <label className="checkbox-label">
              <input 
                type="checkbox"
                checked={preferences.notifications.sms}
                onChange={() => handleNotificationChange('sms')}
              />
              <span>SMS Notifications</span>
            </label>
            <p className="checkbox-desc">Receive important updates via text message</p>
          </div>

          <div className="checkbox-group">
            <label className="checkbox-label">
              <input 
                type="checkbox"
                checked={preferences.notifications.push}
                onChange={() => handleNotificationChange('push')}
              />
              <span>Push Notifications</span>
            </label>
            <p className="checkbox-desc">Receive notifications on your mobile device</p>
          </div>
        </div>

        <div className="preference-section">
          <h3>Privacy & Communications</h3>
          
          <div className="form-group">
            <label>Privacy Level</label>
            <select 
              value={preferences.privacyLevel}
              onChange={(e) => handlePreferenceChange('privacyLevel', e.target.value)}
            >
              <option value="private">Private - Only visible to me</option>
              <option value="friends">Friends - Visible to my friends</option>
              <option value="public">Public - Visible to everyone</option>
            </select>
          </div>

          <div className="checkbox-group">
            <label className="checkbox-label">
              <input 
                type="checkbox"
                checked={preferences.newsletter}
                onChange={() => handlePreferenceChange('newsletter', !preferences.newsletter)}
              />
              <span>Subscribe to Newsletter</span>
            </label>
            <p className="checkbox-desc">Get our weekly travel tips and exclusive deals</p>
          </div>
        </div>

        <div className="preference-section">
          <h3>Travel Preferences</h3>
          
          <div className="form-group">
            <label>Preferred Travel Type</label>
            <select 
              value={preferences.travelType}
              onChange={(e) => handlePreferenceChange('travelType', e.target.value)}
            >
              <option>Adventure</option>
              <option>Relaxation</option>
              <option>Cultural</option>
              <option>Beach</option>
              <option>Mountain</option>
              <option>Urban Exploration</option>
            </select>
          </div>
        </div>
      </div>

      <button className="btn btn-primary" onClick={handleSave}>
        Save Preferences
      </button>
    </div>
  );
};

export default Preferences;
