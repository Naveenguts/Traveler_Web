import React, { useState } from 'react';
import AccountSettings from '../components/Settings/AccountSettings';
import PaymentMethods from '../components/Settings/PaymentMethods';
import Preferences from '../components/Settings/Preferences';
import Security from '../components/Settings/Security';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('account');

  const renderContent = () => {
    switch (activeTab) {
      case 'account':
        return <AccountSettings />;
      case 'payment':
        return <PaymentMethods />;
      case 'preferences':
        return <Preferences />;
      case 'security':
        return <Security />;
      default:
        return <AccountSettings />;
    }
  };

  return (
    <div className="settings-page account-security-page">
      <div className="settings-header-main">
        <h1>Account & Settings</h1>
        <p>Manage your account, payment methods, preferences, and security</p>
      </div>

      <div className="settings-content">
        <div className="settings-sidebar">
          <button
            className={`sidebar-item ${activeTab === 'account' ? 'active' : ''}`}
            onClick={() => setActiveTab('account')}
          >
            <span className="icon">👤</span>
            <span>Account Settings</span>
          </button>

          <button
            className={`sidebar-item ${activeTab === 'payment' ? 'active' : ''}`}
            onClick={() => setActiveTab('payment')}
          >
            <span className="icon">💳</span>
            <span>Payment Methods</span>
          </button>

          <button
            className={`sidebar-item ${activeTab === 'preferences' ? 'active' : ''}`}
            onClick={() => setActiveTab('preferences')}
          >
            <span className="icon">⚙️</span>
            <span>Preferences</span>
          </button>

          <button
            className={`sidebar-item ${activeTab === 'security' ? 'active' : ''}`}
            onClick={() => setActiveTab('security')}
          >
            <span className="icon">🔒</span>
            <span>Security & Password</span>
          </button>
        </div>

        <div className="settings-main page-content" key={activeTab}>
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default Settings;
