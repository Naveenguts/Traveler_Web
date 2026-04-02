import React, { useState } from 'react';

const SafetyTips = () => {
  const [copied, setCopied] = useState(null);

  const tips = [
    {
      icon: '🛡️',
      title: 'Verify Your Bookings',
      content: 'Always verify booking confirmations and check property reviews before traveling.',
    },
    {
      icon: '🔒',
      title: 'Secure Your Account',
      content: 'Enable two-factor authentication and use a strong, unique password for your account.',
    },
    {
      icon: '💳',
      title: 'Payment Safety',
      content: 'Only use secure payment methods. Never transfer money outside our platform.',
    },
    {
      icon: '📱',
      title: 'Stay Connected',
      content: 'Keep your phone charged and share your itinerary with family or friends.',
    },
    {
      icon: '🌍',
      title: 'Research Destinations',
      content: 'Check travel advisories and local laws before visiting new destinations.',
    },
    {
      icon: '🏥',
      title: 'Travel Insurance',
      content: 'Consider purchasing travel insurance to protect against unexpected events.',
    },
    {
      icon: '📋',
      title: 'Document Copies',
      content: 'Keep digital and physical copies of important documents like passports and IDs.',
    },
    {
      icon: '🚨',
      title: 'Emergency Contacts',
      content: 'Save local emergency numbers and the nearest embassy contact information.',
    },
  ];

  const handleCopy = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="support-section safety-section">
      <h2>Safety Tips</h2>
      <p className="section-subtitle">Stay safe and secure while traveling</p>

      <div className="tips-grid">
        {tips.map((tip, index) => (
          <div key={index} className="tip-card premium-tip-card">
            <div className="tip-header">
              <span className="tip-icon">{tip.icon}</span>
            </div>
            <h3>{tip.title}</h3>
            <p>{tip.content}</p>
          </div>
        ))}
      </div>

      <div className="emergency-section">
        <div className="emergency-box">
          <div className="emergency-content">
            <h3>🚨 In an Emergency?</h3>
            <p>If you're in an emergency situation while traveling:</p>
            <ol className="emergency-steps">
              <li>Contact local authorities immediately (police, ambulance, fire)</li>
              <li>Call our 24/7 emergency hotline for immediate assistance</li>
              <li>Contact your embassy or consulate if needed</li>
              <li>Update your trusted contacts with your location</li>
            </ol>
          </div>
          
          <div className="emergency-actions">
            <button
              className="emergency-btn hotline-btn"
              onClick={() => window.location.href = 'tel:+18004357669'}
              title="Call emergency hotline"
            >
              📞 Call Now: 1-800-HELP-NOW
            </button>
            <button
              className="emergency-btn email-btn"
              onClick={() => handleCopy('+1-800-435-7669', 'emergency')}
            >
              {copied === 'emergency' ? '✓ Copied!' : '📋 Copy Number'}
            </button>
          </div>
        </div>

        <div className="safety-checklist">
          <h4>Pre-Travel Safety Checklist</h4>
          <ul className="checklist">
            <li>✓ Inform family of travel plans and itinerary</li>
            <li>✓ Register with your embassy (Smart Traveler Enrollment Program)</li>
            <li>✓ Purchase comprehensive travel insurance</li>
            <li>✓ Make copies of important documents</li>
            <li>✓ Check passport validity (6+ months beyond trip)</li>
            <li>✓ Research destination laws and customs</li>
            <li>✓ Enable location sharing with trusted contacts</li>
            <li>✓ Download offline maps of the area</li>
          </ul>
        </div>
      </div>

      <div className="help-card premium-card">
        <div className="help-card-content">
          <h3>🛡️ Need Safety Advice?</h3>
          <p>Our safety specialists are available 24/7 to provide emergency support and safety guidance.</p>
          <a href="#contact-support" className="btn btn-primary premium-btn">Get Safety Support</a>
        </div>
        <div className="help-card-icon">🌐</div>
      </div>
    </div>
  );
};

export default SafetyTips;
