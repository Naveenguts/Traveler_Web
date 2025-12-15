import React, { useState } from 'react';

const HelpCenter = () => {
  const [openFaq, setOpenFaq] = useState(null);

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

  const toggleFaq = (id) => {
    setOpenFaq(openFaq === id ? null : id);
  };

  return (
    <div className="support-section">
      <h2>FAQs</h2>
      <p className="section-subtitle">Find quick answers to common questions</p>

      <div className="faq-list">
        {faqs.map((faq) => (
          <div key={faq.id} className="faq-item">
            <button
              className={`faq-question ${openFaq === faq.id ? 'active' : ''}`}
              onClick={() => toggleFaq(faq.id)}
            >
              <span>{faq.question}</span>
              <span className="faq-icon">{openFaq === faq.id ? '−' : '+'}</span>
            </button>
            {openFaq === faq.id && (
              <div className="faq-answer">
                {faq.answer}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="help-card">
        <h3>Still need help?</h3>
        <p>Our support team is available 24/7 to assist you.</p>
        <button className="btn btn-primary">Contact Support</button>
      </div>
    </div>
  );
};

export default HelpCenter;
