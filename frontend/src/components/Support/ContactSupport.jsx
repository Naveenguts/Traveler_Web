import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

const ContactSupport = () => {
  const { user, pushAlert } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');

  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = 'Name is required';
    if (!formData.email.trim()) errors.email = 'Email is required';
    if (!/^\S+@\S+\.\S+$/.test(formData.email)) errors.email = 'Enter a valid email';
    if (!formData.subject.trim()) errors.subject = 'Subject is required';
    if (!formData.message.trim()) errors.message = 'Message is required';
    if (formData.message.trim().length < 10) errors.message = 'Message must be at least 10 characters';
    return errors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateForm();
    
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setSuccessMessage('✅ Support request sent! We\'ll respond within 24 hours.');
      pushAlert && pushAlert('Support request sent! We\'ll respond within 24 hours.');
      setFormData({ ...formData, subject: '', message: '' });
      
      setTimeout(() => setSuccessMessage(''), 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="support-section contact-support-section">
      <h2>Contact Support</h2>
      <p className="section-subtitle">Send us a message and we'll get back to you soon</p>

      <div className="contact-grid">
        <div className="contact-info">
          <div className="info-card premium-info">
            <span className="info-icon">📧</span>
            <div className="info-content">
              <h4>Email</h4>
              <p>support@travelerapp.com</p>
              <small>Response time: &lt; 24 hours</small>
            </div>
          </div>

          <div className="info-card premium-info">
            <span className="info-icon">📞</span>
            <div className="info-content">
              <h4>Phone</h4>
              <p>1-800-TRAVEL (1-800-872-8835)</p>
              <small>Available 24/7</small>
            </div>
          </div>

          <div className="info-card premium-info">
            <span className="info-icon">💬</span>
            <div className="info-content">
              <h4>Live Chat</h4>
              <p>Available Mon-Fri, 9am-6pm</p>
              <small>Instant responses</small>
            </div>
          </div>

          <div className="info-card premium-info emergency-info">
            <span className="info-icon">🚨</span>
            <div className="info-content">
              <h4>Emergency</h4>
              <p>1-800-HELP-NOW (1-800-435-7669)</p>
              <small>24/7 emergency support</small>
            </div>
          </div>
        </div>

        <div className="contact-form-wrapper">
          {successMessage && (
            <div className="success-message" role="alert">
              {successMessage}
            </div>
          )}
          
          <form className="contact-form premium-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Name *</label>
              <input
                id="name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={formErrors.name ? 'error' : ''}
                placeholder="Your full name"
                required
                aria-describedby={formErrors.name ? 'name-error' : undefined}
              />
              {formErrors.name && (
                <span id="name-error" className="error-message">{formErrors.name}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="email">Email *</label>
              <input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={formErrors.email ? 'error' : ''}
                placeholder="your@email.com"
                required
                aria-describedby={formErrors.email ? 'email-error' : undefined}
              />
              {formErrors.email && (
                <span id="email-error" className="error-message">{formErrors.email}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="subject">Subject *</label>
              <input
                id="subject"
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                className={formErrors.subject ? 'error' : ''}
                placeholder="What can we help you with?"
                required
                aria-describedby={formErrors.subject ? 'subject-error' : undefined}
              />
              {formErrors.subject && (
                <span id="subject-error" className="error-message">{formErrors.subject}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="message">Message *</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                className={formErrors.message ? 'error' : ''}
                rows={6}
                placeholder="Describe your issue or question in detail..."
                required
                aria-describedby={formErrors.message ? 'message-error' : undefined}
              />
              {formErrors.message && (
                <span id="message-error" className="error-message">{formErrors.message}</span>
              )}
              <small className="char-count">{formData.message.length} characters</small>
            </div>

            <button
              type="submit"
              className="btn btn-primary premium-btn"
              disabled={isSubmitting}
              aria-busy={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="loading-spinner"></span>
                  Sending...
                </>
              ) : (
                '✉️ Send Message'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactSupport;
