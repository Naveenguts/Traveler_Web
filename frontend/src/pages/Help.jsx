import React from 'react';
import '../styles/Help.css';

const Help = () => {
  const helpCategories = [
    {
      title: 'Getting Started',
      icon: '🚀',
      items: [
        'How do I create an account?',
        'How do I reset my password?',
        'How do I update my profile?',
        'How do I enable two-factor authentication?'
      ]
    },
    {
      title: 'Bookings & Trips',
      icon: '✈️',
      items: [
        'How do I book a destination?',
        'Can I modify my booking?',
        'How do I cancel a booking?',
        'What is your cancellation policy?'
      ]
    },
    {
      title: 'Payments',
      icon: '💳',
      items: [
        'What payment methods do you accept?',
        'Is my payment information secure?',
        'Can I use multiple payment methods?',
        'How do I add a payment method?'
      ]
    },
    {
      title: 'Blogs & Reviews',
      icon: '📝',
      items: [
        'How do I write a blog post?',
        'Can I edit my blog posts?',
        'How do I delete my blog post?',
        'Can I post reviews for destinations?'
      ]
    },
    {
      title: 'Account & Security',
      icon: '🔒',
      items: [
        'How do I change my password?',
        'How do I manage trusted devices?',
        'How do I deactivate my account?',
        'Is my data private?'
      ]
    },
    {
      title: 'Technical Issues',
      icon: '⚙️',
      items: [
        'The website is loading slowly',
        'I\'m having trouble logging in',
        'Features are not working properly',
        'How do I clear my browser cache?'
      ]
    }
  ];

  return (
    <div className="help-page">
      <div className="help-hero">
        <div className="help-hero-content">
          <h1>How Can We Help?</h1>
          <p>Find answers to common questions and get support</p>
        </div>
      </div>

      <div className="help-container">
        <div className="help-grid">
          {helpCategories.map((category, index) => (
            <div key={index} className="help-card">
              <div className="card-icon">{category.icon}</div>
              <h3 className="help-card-title">{category.title}</h3>
              <ul className="help-items">
                {category.items.map((item, itemIndex) => (
                  <li key={itemIndex}>
                    <a href="/faqs">{item}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="help-sidebar">
          <div className="help-widget contact-widget">
            <h3>Still need help?</h3>
            <p>Can't find what you're looking for?</p>
            <a href="/contact" className="help-button">Contact Support</a>
          </div>

          <div className="help-widget info-widget">
            <h3>Contact Support</h3>
            <div className="contact-info">
              <p><strong>Email:</strong><br/>support@traveler.com</p>
              <p><strong>Phone:</strong><br/>+91 1234567890</p>
              <p><strong>Hours:</strong><br/>24/7</p>
            </div>
          </div>

          <div className="help-widget resources-widget">
            <h3>Resources</h3>
            <ul>
              <li><a href="#docs">Documentation</a></li>
              <li><a href="#guide">Getting Started Guide</a></li>
              <li><a href="#video">Video Tutorials</a></li>
              <li><a href="#blog">Blog</a></li>
            </ul>
          </div>
        </div>
      </div>

      <div className="help-cta-section">
        <div className="cta-content">
          <h2>Explore More Resources</h2>
          <p>Browse our comprehensive guides and documentation</p>
          <div className="cta-buttons">
            <a href="/faqs" className="cta-button">Browse FAQs</a>
            <a href="/contact" className="cta-button cta-secondary">Get in Touch</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Help;
