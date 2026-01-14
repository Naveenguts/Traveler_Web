import React, { useState } from 'react';
import '../styles/ContactUs.css';

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    category: 'general',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the form data to your backend
    console.log('Form submitted:', formData);
    setSubmitted(true);
    setTimeout(() => {
      setFormData({
        name: '',
        email: '',
        subject: '',
        category: 'general',
        message: ''
      });
      setSubmitted(false);
    }, 3000);
  };

  const contactMethods = [
    {
      icon: '✉️',
      title: 'Email Support',
      description: 'Get a response within 24 hours',
      details: 'support@traveler.com'
    },
    {
      icon: '📞',
      title: 'Phone Support',
      description: 'Available 24/7',
      details: '+91 1234567890'
    },
    {
      icon: '💬',
      title: 'Live Chat',
      description: 'Chat with us instantly',
      details: 'Available on website'
    },
    {
      icon: '🏢',
      title: 'Office Address',
      description: 'Visit us in person',
      details: '123 Travel Street, New Delhi, India'
    }
  ];

  return (
    <div className="contact-page">
      <div className="contact-hero">
        <h1>Get in Touch</h1>
        <p>We're here to help! Reach out with any questions or feedback</p>
      </div>

      <div className="contact-container">
        {/* Contact Methods */}
        <div className="contact-methods">
          {contactMethods.map((method, index) => (
            <div key={index} className="contact-method-card">
              <div className="method-icon">{method.icon}</div>
              <h3>{method.title}</h3>
              <p className="method-description">{method.description}</p>
              <p className="method-details">{method.details}</p>
            </div>
          ))}
        </div>

        {/* Contact Form */}
        <div className="contact-form-section">
          <h2>Send us a Message</h2>
          {submitted && (
            <div className="success-message">
              ✓ Thank you! Your message has been sent. We'll get back to you soon.
            </div>
          )}
          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Full Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="John Doe"
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email Address *</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="john@example.com"
              />
            </div>

            <div className="form-group">
              <label htmlFor="category">Category *</label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
              >
                <option value="general">General Inquiry</option>
                <option value="booking">Booking Issues</option>
                <option value="payment">Payment Issues</option>
                <option value="account">Account Issues</option>
                <option value="bug">Report a Bug</option>
                <option value="feedback">Feedback</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="subject">Subject *</label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
                placeholder="What is this about?"
              />
            </div>

            <div className="form-group">
              <label htmlFor="message">Message *</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                placeholder="Please describe your issue or feedback..."
                rows="6"
              ></textarea>
            </div>

            <button type="submit" className="submit-button">Send Message</button>
          </form>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="contact-faq-section">
        <h2>Need faster answers?</h2>
        <p>Check our FAQs or Help Center for instant solutions</p>
        <div className="contact-faq-buttons">
          <a href="/faqs" className="contact-button">Browse FAQs</a>
          <a href="/help" className="contact-button contact-button-secondary">Go to Help</a>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
