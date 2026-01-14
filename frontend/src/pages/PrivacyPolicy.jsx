import React from 'react';
import '../styles/PrivacyPolicy.css';

const PrivacyPolicy = () => {
  return (
    <div className="privacy-policy-page">
      <div className="privacy-hero">
        <h1>Privacy Policy</h1>
        <p>Your privacy is important to us</p>
        <p className="last-updated">Last updated: January 14, 2026</p>
      </div>

      <div className="privacy-container">
        <div className="privacy-content">
          <section className="privacy-section">
            <h2>1. Introduction</h2>
            <p>
              Welcome to Traveler ("we," "us," "our," or "Company"). Traveler is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our services.
            </p>
          </section>

          <section className="privacy-section">
            <h2>2. Information We Collect</h2>
            <h3>2.1 Information You Provide Directly</h3>
            <ul>
              <li><strong>Account Information:</strong> Name, email address, phone number, password</li>
              <li><strong>Profile Information:</strong> Profile picture, bio, preferences, travel interests</li>
              <li><strong>Payment Information:</strong> Credit card details, billing address (processed securely)</li>
              <li><strong>Content:</strong> Blog posts, reviews, comments, messages you create</li>
              <li><strong>Communication:</strong> Messages sent through contact forms or support channels</li>
            </ul>

            <h3>2.2 Information Collected Automatically</h3>
            <ul>
              <li><strong>Device Information:</strong> IP address, browser type, operating system</li>
              <li><strong>Usage Data:</strong> Pages visited, time spent, clicks, search queries</li>
              <li><strong>Cookies:</strong> Session information, preferences, tracking data</li>
              <li><strong>Location Data:</strong> Approximate location based on IP address (with permission)</li>
            </ul>
          </section>

          <section className="privacy-section">
            <h2>3. How We Use Your Information</h2>
            <p>We use collected information for the following purposes:</p>
            <ul>
              <li>Creating and managing your account</li>
              <li>Processing bookings and payments</li>
              <li>Providing customer support</li>
              <li>Sending transactional emails (confirmations, receipts)</li>
              <li>Sending promotional emails (with your consent)</li>
              <li>Improving our services and user experience</li>
              <li>Detecting and preventing fraud</li>
              <li>Complying with legal obligations</li>
              <li>Personalizing content and recommendations</li>
            </ul>
          </section>

          <section className="privacy-section">
            <h2>4. Data Security</h2>
            <p>
              We implement industry-leading security measures to protect your information:
            </p>
            <ul>
              <li>SSL/TLS encryption for data in transit</li>
              <li>Password hashing and salting</li>
              <li>Secure payment processing (PCI-DSS compliant)</li>
              <li>Regular security audits and updates</li>
              <li>Access controls and authentication</li>
              <li>Data encryption at rest</li>
            </ul>
            <p>
              However, no method of transmission over the Internet is 100% secure. We cannot guarantee absolute security.
            </p>
          </section>

          <section className="privacy-section">
            <h2>5. Sharing Your Information</h2>
            <p>We may share your information with:</p>
            <ul>
              <li><strong>Service Providers:</strong> Payment processors, email services, analytics providers</li>
              <li><strong>Business Partners:</strong> Hotels, tour operators (with your consent)</li>
              <li><strong>Legal Requirements:</strong> When required by law or court orders</li>
              <li><strong>Business Transfers:</strong> In case of merger, acquisition, or sale</li>
            </ul>
            <p>
              We do NOT sell your personal information to third parties without your explicit consent.
            </p>
          </section>

          <section className="privacy-section">
            <h2>6. Your Rights</h2>
            <p>You have the right to:</p>
            <ul>
              <li>Access your personal information</li>
              <li>Correct inaccurate data</li>
              <li>Request deletion of your data</li>
              <li>Opt-out of marketing communications</li>
              <li>Request data portability</li>
              <li>Withdraw consent at any time</li>
            </ul>
            <p>
              To exercise these rights, please contact us at <strong>privacy@traveler.com</strong>
            </p>
          </section>

          <section className="privacy-section">
            <h2>7. Cookies and Tracking</h2>
            <p>
              We use cookies for:
            </p>
            <ul>
              <li>Maintaining your session</li>
              <li>Remembering your preferences</li>
              <li>Analytics and performance monitoring</li>
              <li>Personalizing your experience</li>
            </ul>
            <p>
              You can control cookies through your browser settings. Disabling cookies may affect website functionality.
            </p>
          </section>

          <section className="privacy-section">
            <h2>8. Third-Party Links</h2>
            <p>
              Our website may contain links to third-party sites. We are not responsible for their privacy practices. Please review their privacy policies before providing personal information.
            </p>
          </section>

          <section className="privacy-section">
            <h2>9. Children's Privacy</h2>
            <p>
              Traveler does not knowingly collect information from children under 13. If we become aware that a child has provided us with personal information, we will delete such information promptly.
            </p>
          </section>

          <section className="privacy-section">
            <h2>10. International Data Transfers</h2>
            <p>
              Your information may be transferred to, stored in, and processed in countries other than India. By using Traveler, you consent to such transfers. We ensure appropriate safeguards are in place.
            </p>
          </section>

          <section className="privacy-section">
            <h2>11. Retention of Information</h2>
            <p>
              We retain your information for as long as necessary to provide services and comply with legal obligations. You can request deletion, except where retention is required by law.
            </p>
          </section>

          <section className="privacy-section">
            <h2>12. Changes to This Policy</h2>
            <p>
              We may update this privacy policy periodically. We will notify you of significant changes via email or prominent notice on our website. Continued use constitutes acceptance of changes.
            </p>
          </section>

          <section className="privacy-section">
            <h2>13. Contact Us</h2>
            <p>
              If you have questions about this privacy policy or our privacy practices:
            </p>
            <div className="contact-info-box">
              <p><strong>Email:</strong> privacy@traveler.com</p>
              <p><strong>Phone:</strong> +91 1234567890</p>
              <p><strong>Address:</strong> 123 Travel Street, New Delhi, India</p>
              <p><strong>Support Hours:</strong> 24/7</p>
            </div>
          </section>
        </div>

        {/* Table of Contents Sidebar */}
        <div className="privacy-sidebar">
          <div className="toc-box">
            <h3>Table of Contents</h3>
            <ul>
              <li><a href="#intro">Introduction</a></li>
              <li><a href="#collect">Information We Collect</a></li>
              <li><a href="#use">How We Use It</a></li>
              <li><a href="#security">Data Security</a></li>
              <li><a href="#sharing">Sharing Information</a></li>
              <li><a href="#rights">Your Rights</a></li>
              <li><a href="#cookies">Cookies & Tracking</a></li>
              <li><a href="#children">Children's Privacy</a></li>
              <li><a href="#contact">Contact Us</a></li>
            </ul>
          </div>

          <div className="help-box">
            <h3>Need Help?</h3>
            <p>Have questions about how we handle your data?</p>
            <a href="/contact" className="help-link">Contact Us</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
