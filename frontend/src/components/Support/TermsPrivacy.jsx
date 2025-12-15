import React from 'react';

const TermsPrivacy = () => {
  return (
    <div className="support-section">
      <h2>Terms & Privacy</h2>
      <p className="section-subtitle">Last updated: December 13, 2025</p>

      <div className="terms-content">
        <section className="terms-section">
          <h3>Terms of Service</h3>
          <p>
            By using Traveler App, you agree to these terms. Please read them carefully before making any bookings.
          </p>
          
          <h4>1. Booking & Cancellation</h4>
          <p>
            All bookings are subject to availability. Cancellation policies vary by destination and provider. 
            Refunds are processed according to the specific cancellation policy of your booking.
          </p>

          <h4>2. User Responsibilities</h4>
          <p>
            You are responsible for maintaining the security of your account credentials and for all activities 
            that occur under your account. Notify us immediately of any unauthorized use.
          </p>

          <h4>3. Payment Terms</h4>
          <p>
            All prices are in USD unless otherwise specified. Payment is required at the time of booking. 
            We accept major credit cards and secure payment methods.
          </p>

          <h4>4. Limitation of Liability</h4>
          <p>
            Traveler App acts as an intermediary between travelers and service providers. We are not liable 
            for the quality or availability of services provided by third parties.
          </p>
        </section>

        <section className="terms-section">
          <h3>Privacy Policy</h3>
          
          <h4>Information We Collect</h4>
          <p>
            We collect personal information such as your name, email, payment details, and travel preferences 
            to provide our services and improve your experience.
          </p>

          <h4>How We Use Your Information</h4>
          <ul>
            <li>Process bookings and payments</li>
            <li>Send booking confirmations and updates</li>
            <li>Personalize your travel recommendations</li>
            <li>Improve our services and user experience</li>
            <li>Comply with legal requirements</li>
          </ul>

          <h4>Data Security</h4>
          <p>
            We use industry-standard encryption and security measures to protect your personal information. 
            Your payment data is processed through secure, PCI-compliant payment gateways.
          </p>

          <h4>Data Sharing</h4>
          <p>
            We do not sell your personal information to third parties. We share data only with trusted partners 
            necessary to complete your bookings and comply with legal obligations.
          </p>

          <h4>Your Rights</h4>
          <p>
            You have the right to access, update, or delete your personal information at any time. 
            Contact our support team to exercise these rights.
          </p>
        </section>

        <section className="terms-section">
          <h3>Cookie Policy</h3>
          <p>
            We use cookies to enhance your browsing experience, analyze site traffic, and personalize content. 
            You can manage cookie preferences in your browser settings.
          </p>
        </section>

        <div className="help-card" style={{ marginTop: '2rem' }}>
          <h3>Questions about our Terms or Privacy?</h3>
          <p>Contact our legal team at legal@travelerapp.com</p>
        </div>
      </div>
    </div>
  );
};

export default TermsPrivacy;
