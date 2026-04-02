import React, { useState } from 'react';

const HelpCenter = ({ onContactClick }) => {
  const [openFaq, setOpenFaq] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [copied, setCopied] = useState(null);

  const faqs = [
    {
      id: 1,
      question: 'How do I book a destination?',
      answer: 'Browse destinations, click on one you like, and use the booking button. You\'ll need to be logged in to complete the booking.',
    },
    {
      id: 2,
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit cards (Visa, Mastercard, Amex), PayPal, and bank transfers. You can manage your payment methods in Settings.',
    },
    {
      id: 3,
      question: 'Can I cancel or modify my booking?',
      answer: 'Yes! Go to My Trips, select your booking, and choose cancel or modify. Cancellation policies vary by destination.',
    },
    {
      id: 4,
      question: 'How do I contact customer support?',
      answer: 'You can reach us via the Contact Support section, email us at support@travelerapp.com, or call our 24/7 hotline at 1-800-TRAVEL.',
    },
    {
      id: 5,
      question: 'Is my personal information secure?',
      answer: 'Absolutely. We use industry-standard encryption and never share your data with third parties. See our Terms & Privacy for details.',
    },
  ];

  const filteredFaqs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleFaq = (id) => {
    setOpenFaq(openFaq === id ? null : id);
  };

  const handleCopyEmail = () => {
    navigator.clipboard.writeText('support@travelerapp.com');
    setCopied('email');
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="support-section">
      <h2>FAQs</h2>
      <p className="section-subtitle">Find quick answers to common questions</p>

      <div className="faq-search-wrapper">
        <input
          type="text"
          placeholder="Search FAQs..."
          className="faq-search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          aria-label="Search FAQ questions"
        />
        {searchTerm && (
          <button
            className="faq-search-clear"
            onClick={() => setSearchTerm('')}
            aria-label="Clear search"
          >
            ✕
          </button>
        )}
      </div>

      <div className="faq-list">
        {filteredFaqs.length > 0 ? (
          filteredFaqs.map((faq) => (
            <div key={faq.id} className={`faq-item ${openFaq === faq.id ? 'active' : ''}`}>
              <button
                className={`faq-question ${openFaq === faq.id ? 'active' : ''}`}
                onClick={() => toggleFaq(faq.id)}
                aria-expanded={openFaq === faq.id}
              >
                <span>{faq.question}</span>
                <span className="faq-icon">{openFaq === faq.id ? '−' : '+'}</span>
              </button>
              {openFaq === faq.id && (
                <div className="faq-answer" role="region">
                  {faq.answer}
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="faq-no-results">
            <p>No FAQs found matching your search.</p>
            <p className="faq-no-results-hint">Try different keywords or contact us for help.</p>
          </div>
        )}
      </div>

      <div className="help-card premium-card">
        <div className="help-card-content">
          <h3>💬 Still need help?</h3>
          <p>Our support team is available 24/7 to assist you with any questions or concerns.</p>
          <div className="help-card-actions">
            <button
              className="btn btn-primary premium-btn"
              onClick={onContactClick}
              aria-label="Contact Support"
            >
              Contact Support
            </button>
            <div className="quick-contact">
              <a
                href="mailto:support@travelerapp.com"
                className="email-link"
                title="Email us"
              >
                📧 Email
              </a>
              <a href="tel:+18008732835" className="phone-link" title="Call us">
                📞 Call 1-800-TRAVEL
              </a>
            </div>
          </div>
        </div>
        <div className="help-card-icon">🎯</div>
      </div>

      <div className="quick-stats">
        <div className="stat-card">
          <span className="stat-number">24/7</span>
          <span className="stat-label">Support</span>
        </div>
        <div className="stat-card">
          <span className="stat-number">1min</span>
          <span className="stat-label">Avg Response</span>
        </div>
        <div className="stat-card">
          <span className="stat-number">4.9★</span>
          <span className="stat-label">Customer Rating</span>
        </div>
      </div>
    </div>
  );
};

export default HelpCenter;
