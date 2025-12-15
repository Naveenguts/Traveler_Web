import React, { useState } from 'react';
import HelpCenter from '../components/Support/HelpCenter';
import ContactSupport from '../components/Support/ContactSupport';
import SafetyTips from '../components/Support/SafetyTips';
import TermsPrivacy from '../components/Support/TermsPrivacy';

const SupportInfo = () => {
  const [activeTab, setActiveTab] = useState('help');

  const renderContent = () => {
    switch (activeTab) {
      case 'help':
        return <HelpCenter />;
      case 'contact':
        return <ContactSupport />;
      case 'safety':
        return <SafetyTips />;
      case 'terms':
        return <TermsPrivacy />;
      default:
        return <HelpCenter />;
    }
  };

  return (
    <div className="settings-page">
      <div className="settings-header-main">
        <h1>Support & Info</h1>
        <p>Get help, contact support, and learn about safety and policies</p>
      </div>

      <div className="settings-content">
        <div className="settings-sidebar">
          <button
            className={`sidebar-item ${activeTab === 'help' ? 'active' : ''}`}
            onClick={() => setActiveTab('help')}
          >
            <span className="icon">❓</span>
            <span>Help Center</span>
          </button>

          <button
            className={`sidebar-item ${activeTab === 'contact' ? 'active' : ''}`}
            onClick={() => setActiveTab('contact')}
          >
            <span className="icon">📧</span>
            <span>Contact Support</span>
          </button>

          <button
            className={`sidebar-item ${activeTab === 'safety' ? 'active' : ''}`}
            onClick={() => setActiveTab('safety')}
          >
            <span className="icon">🛡️</span>
            <span>Safety Tips</span>
          </button>

          <button
            className={`sidebar-item ${activeTab === 'terms' ? 'active' : ''}`}
            onClick={() => setActiveTab('terms')}
          >
            <span className="icon">📄</span>
            <span>Terms & Privacy</span>
          </button>
        </div>

        <div className="settings-main">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default SupportInfo;
