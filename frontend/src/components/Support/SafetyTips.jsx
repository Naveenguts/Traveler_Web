import React from 'react';

const SafetyTips = () => {
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

  return (
    <div className="support-section">
      <h2>Safety Tips</h2>
      <p className="section-subtitle">Stay safe and secure while traveling</p>

      <div className="tips-grid">
        {tips.map((tip, index) => (
          <div key={index} className="tip-card">
            <span className="tip-icon">{tip.icon}</span>
            <h3>{tip.title}</h3>
            <p>{tip.content}</p>
          </div>
        ))}
      </div>

      <div className="help-card" style={{ marginTop: '2rem' }}>
        <h3>Emergency Support</h3>
        <p>If you're in an emergency situation while traveling, contact local authorities first, then reach out to our 24/7 emergency hotline.</p>
        <button className="btn btn-primary">Emergency Hotline: 1-800-HELP-NOW</button>
      </div>
    </div>
  );
};

export default SafetyTips;
