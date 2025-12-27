import React from 'react';


const Contacts = () => {
  return (
    <div className="contacts-page">
      <div className="contacts-hero">
        <img
          src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=1600&auto=format&fit=crop"
          alt="Mountain landscape"
          className="contacts-hero-image"
        />

        <div className="contacts-hero-overlay">
          <div className="contacts-overlay-content">
            <h1>Contact Our Team</h1>
            <p className="contact-subtitle">
              Experience world-class travel solutions. Reach out to us today.
            </p>

            <div className="contact-intro">
              <p>
                At our platform, we redefine travel by combining innovation, expertise, and personalized service. Whether you're exploring exotic destinations or planning business travel, our team delivers seamless experiences tailored to your unique requirements.
              </p>
            </div>

            {/* Trust & Business Info Section */}
            <div className="trust-section">
              <div className="trust-item">
                <span className="trust-icon">🕒</span>
                <div>
                  <strong>Support Hours</strong>
                  <p>Mon–Sat, 9 AM – 6 PM</p>
                </div>
              </div>
              <div className="trust-item">
                <span className="trust-icon">⏱</span>
                <div>
                  <strong>Response Time</strong>
                  <p>Within 24 hours</p>
                </div>
              </div>
              <div className="trust-item">
                <span className="trust-icon">🔒</span>
                <div>
                  <strong>Privacy</strong>
                  <p>Your data is safe with us</p>
                </div>
              </div>
            </div>

            {/* Primary Contact Methods */}
            <h2 className="contact-section-title">Reach Us Now</h2>
            <div className="contact-grid primary-contact">
              <div className="contact-card primary-card">
                <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" alt="WhatsApp" className="contact-card-image" />
                <h3>WhatsApp Business</h3>
                <p className="contact-desc">Quick messaging & support</p>
                <a href="https://wa.me/919025148850" target="_blank" rel="noopener noreferrer" className="contact-link">+91 9025148850</a>
              </div>

              <div className="contact-card primary-card">
                <img src="https://cdn-icons-png.flaticon.com/512/732/732200.png" alt="Email" className="contact-card-image" />
                <h3>Email Support</h3>
                <p className="contact-desc">For detailed inquiries & bookings</p>
                <a href="mailto:127003027@sastra.ac.in" className="contact-link">username@gmail.com</a>
              </div>

              <div className="contact-card primary-card">
                <img src="https://cdn-icons-png.flaticon.com/512/455/455705.png" alt="Phone" className="contact-card-image" />
                <h3>Phone Support</h3>
                <p className="contact-desc">Mon-Sat, 9:00 AM - 6:00 PM</p>
                <a href="tel:+919025148850" className="contact-link">+91 9025148850</a>
              </div>
            </div>

            {/* Secondary Contact Methods - Social Media */}
            <h2 className="contact-section-title">Follow Our Journey</h2>
            <div className="contact-grid">
              <div className="contact-card">
                <img src="https://upload.wikimedia.org/wikipedia/commons/a/a5/Instagram_icon.png" alt="Instagram" className="contact-card-image" />
                <h3>Instagram</h3>
                <p className="contact-desc">Travel inspiration & updates</p>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">Follow Us</a>
              </div>

              <div className="contact-card">
                <img src="https://upload.wikimedia.org/wikipedia/commons/b/b9/2023_Facebook_icon.svg" alt="Facebook" className="contact-card-image" />
                <h3>Facebook</h3>
                <p className="contact-desc">News & community updates</p>
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">Follow Us</a>
              </div>

              <div className="contact-card">
                <img src="https://upload.wikimedia.org/wikipedia/commons/0/09/YouTube_full-color_icon_%282017%29.svg" alt="YouTube" className="contact-card-image" />
                <h3>YouTube</h3>
                <p className="contact-desc">Travel guides & tutorials</p>
                <a href="https://youtube.com" target="_blank" rel="noopener noreferrer">Subscribe</a>
              </div>

              <div className="contact-card">
                <img src="https://assets-global.website-files.com/6257adef93867e50d84d30e2/636e0a6a49cf127bf92de1e2_icon_clyde_blurple_RGB.png" alt="Discord" className="contact-card-image" />
                <h3>Community</h3>
                <p className="contact-desc">Join our travel community</p>
                <a href="https://discord.com" target="_blank" rel="noopener noreferrer">Join Now</a>
              </div>

              <div className="contact-card">
                <img src="https://upload.wikimedia.org/wikipedia/commons/8/82/Telegram_logo.svg" alt="Telegram" className="contact-card-image" />
                <h3>Telegram</h3>
                <p className="contact-desc">Instant updates & support</p>
                <a href="https://t.me/traveler" target="_blank" rel="noopener noreferrer">Join Channel</a>
              </div>

              <div className="contact-card">
                <img src="https://cdn-icons-png.flaticon.com/512/3046/3046121.png" alt="TikTok" className="contact-card-image" />
                <h3>TikTok</h3>
                <p className="contact-desc">Short travel content</p>
                <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer">Follow Us</a>
              </div>
            </div>

            {/* Terms & Policies Section */}
            <div className="terms-section">
              <h2 className="contact-section-title">Important Links</h2>
              <div className="terms-grid">
                <a href="/terms" className="terms-card">
                  <span className="terms-icon">📜</span>
                  <h4>Terms & Conditions</h4>
                  <p>Read our terms of service</p>
                </a>
                <a href="/privacy" className="terms-card">
                  <span className="terms-icon">🔐</span>
                  <h4>Privacy Policy</h4>
                  <p>How we protect your data</p>
                </a>
                <a href="/refund" className="terms-card">
                  <span className="terms-icon">💳</span>
                  <h4>Refund Policy</h4>
                  <p>Cancellation & refund terms</p>
                </a>
                <a href="/faq" className="terms-card">
                  <span className="terms-icon">❓</span>
                  <h4>FAQ</h4>
                  <p>Frequently asked questions</p>
                </a>
              </div>
            </div>
           
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contacts;
