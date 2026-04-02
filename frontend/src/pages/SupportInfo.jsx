import React, { useState, useEffect } from 'react';
import HelpCenter from '../components/Support/HelpCenter';
import ContactSupport from '../components/Support/ContactSupport';
import SafetyTips from '../components/Support/SafetyTips';
import TermsPrivacy from '../components/Support/TermsPrivacy';

const SupportInfo = () => {
  const [activeTab, setActiveTab] = useState('help');

  const renderContent = () => {
    switch (activeTab) {
      case 'help':
        return <HelpCenter onContactClick={() => setActiveTab('contact')} />;
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

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="settings-page support-page">
      <div className="settings-header-main">
        <div className="header-top">
          <div>
            <h1>Support & Info</h1>
            <p>Get help, contact support, and learn about safety and policies</p>
          </div>
        </div>
      </div>

      <div className="settings-content">
        <nav className="settings-sidebar" role="navigation" aria-label="Support sections">
          <button
            className={`sidebar-item ${activeTab === 'help' ? 'active' : ''}`}
            onClick={() => handleTabChange('help')}
            aria-current={activeTab === 'help' ? 'page' : undefined}
          >
            <span className="icon">❓</span>
            <span>Help Center</span>
          </button>

          <button
            className={`sidebar-item ${activeTab === 'contact' ? 'active' : ''}`}
            onClick={() => handleTabChange('contact')}
            aria-current={activeTab === 'contact' ? 'page' : undefined}
          >
            <span className="icon">📧</span>
            <span>Contact Support</span>
          </button>

          <button
            className={`sidebar-item ${activeTab === 'safety' ? 'active' : ''}`}
            onClick={() => handleTabChange('safety')}
            aria-current={activeTab === 'safety' ? 'page' : undefined}
          >
            <span className="icon">🛡️</span>
            <span>Safety Tips</span>
          </button>

          <button
            className={`sidebar-item ${activeTab === 'terms' ? 'active' : ''}`}
            onClick={() => handleTabChange('terms')}
            aria-current={activeTab === 'terms' ? 'page' : undefined}
          >
            <span className="icon">📄</span>
            <span>Terms & Privacy</span>
          </button>
        </nav>

        <div className="settings-main page-transition">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default SupportInfo;
