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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate sending message
    pushAlert && pushAlert('Support request sent! We\'ll respond within 24 hours.');
    setFormData({ ...formData, subject: '', message: '' });
  };

  return (
    <div className="support-section">
      <h2>Contact Support</h2>
      <p className="section-subtitle">Send us a message and we'll get back to you soon</p>

      <div className="contact-grid">
        <div className="contact-info">
          <div className="info-card">
            <span className="info-icon">📧</span>
            <div>
              <h4>Email</h4>
              <p>support@travelerapp.com</p>
            </div>
          </div>

          <div className="info-card">
            <span className="info-icon">📞</span>
            <div>
              <h4>Phone</h4>
              <p>1-800-TRAVEL (24/7)</p>
            </div>
          </div>

          <div className="info-card">
            <span className="info-icon">💬</span>
            <div>
              <h4>Live Chat</h4>
              <p>Available Mon-Fri, 9am-6pm</p>
            </div>
          </div>
        </div>

        <form className="contact-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Subject</label>
            <input
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              placeholder="What can we help you with?"
              required
            />
          </div>

          <div className="form-group">
            <label>Message</label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows={6}
              placeholder="Describe your issue or question..."
              required
            />
          </div>

          <button type="submit" className="btn btn-primary">Send Message</button>
        </form>
      </div>
    </div>
  );
};

export default ContactSupport;
