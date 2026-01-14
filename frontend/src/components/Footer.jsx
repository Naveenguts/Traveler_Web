import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Footer.css';

const Footer = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [subscriptionMessage, setSubscriptionMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email) {
      setSubscriptionMessage('Please enter your email');
      return;
    }

    setIsLoading(true);
    try {
      // You can add a newsletter subscription endpoint to your backend
      // For now, we'll just show a success message
      console.log('Subscribing email:', email);
      setSubscriptionMessage('Thank you for subscribing!');
      setEmail('');
      setTimeout(() => setSubscriptionMessage(''), 3000);
    } catch (error) {
      setSubscriptionMessage('Subscription failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleNavigation = (path) => {
    navigate(path);
    window.scrollTo(0, 0);
  };

  const socialLinks = [
    { icon: 'f', url: 'https://facebook.com', label: 'Facebook' },
    { icon: 'x', url: 'https://twitter.com', label: 'Twitter' },
    { icon: '≡', url: '#', label: 'Menu' },
    { icon: '▶', url: 'https://youtube.com', label: 'YouTube' },
    { icon: 'in', url: 'https://linkedin.com', label: 'LinkedIn' },
  ];

  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Left Section - Logo and Links */}
        <div className="footer-left">
          <h2 className="footer-logo">Traveler</h2>
          <nav className="footer-links">
            <button 
              className="footer-link" 
              onClick={() => handleNavigation('/help')}
            >
              Help
            </button>
            <button 
              className="footer-link" 
              onClick={() => handleNavigation('/about')}
            >
              About
            </button>
            <button 
              className="footer-link" 
              onClick={() => handleNavigation('/contact')}
            >
              Contact Us
            </button>
            <button 
              className="footer-link" 
              onClick={() => handleNavigation('/faqs')}
            >
              FAQs
            </button>
            <button 
              className="footer-link" 
              onClick={() => handleNavigation('/privacy')}
            >
              Privacy Policy
            </button>
          </nav>
        </div>

        {/* Right Section - Newsletter */}
        <div className="footer-right">
          <div className="newsletter-section">
            <h3 className="newsletter-title">Subscribe to our newsletter</h3>
            <p className="newsletter-subtitle">Get travel tips and exclusive offers</p>
            <form className="newsletter-form" onSubmit={handleSubscribe}>
              <input
                type="email"
                className="newsletter-input"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button 
                type="submit" 
                className="subscribe-button"
                disabled={isLoading}
              >
                {isLoading ? 'Subscribing...' : 'Subscribe'}
              </button>
            </form>
            {subscriptionMessage && (
              <p className="subscription-message">{subscriptionMessage}</p>
            )}
            
            {/* Social Links */}
            <div className="social-links">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.url}
                  className="social-link"
                  aria-label={social.label}
                  title={social.label}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section - Copyright */}
      <div className="footer-bottom">
        <p>&copy; 2026 Traveler. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
