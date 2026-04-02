import React, { useEffect, useMemo, useRef, useState } from 'react';
import '../styles/Help.css';

const Help = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [openFaqKey, setOpenFaqKey] = useState(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const [isCtaVisible, setIsCtaVisible] = useState(false);
  const ctaRef = useRef(null);

  const helpCategories = [
    {
      title: 'Getting Started',
      icon: '🚀',
      iconClass: 'icon-getting-started',
      items: [
        {
          question: 'How do I create an account?',
          answer: 'Open the Sign Up page, enter your email, create a password, and verify your account from the confirmation email.'
        },
        {
          question: 'How do I reset my password?',
          answer: 'Use the Forgot Password option on the login screen and follow the reset link sent to your registered email.'
        },
        {
          question: 'How do I update my profile?',
          answer: 'Go to Profile settings, edit your details, and click Save Changes to update your account information.'
        },
        {
          question: 'How do I enable two-factor authentication?',
          answer: 'Open Security settings, enable 2FA, and complete verification using your authentication code.'
        }
      ]
    },
    {
      title: 'Bookings & Trips',
      icon: '✈️',
      iconClass: 'icon-bookings',
      items: [
        {
          question: 'How do I book a destination?',
          answer: 'Browse destinations, choose your preferred package, review details, and complete checkout.'
        },
        {
          question: 'Can I modify my booking?',
          answer: 'Yes, eligible bookings can be updated from My Trips depending on provider and date constraints.'
        },
        {
          question: 'How do I cancel a booking?',
          answer: 'Open My Trips, select the booking, and use the Cancel option to submit the cancellation request.'
        },
        {
          question: 'What is your cancellation policy?',
          answer: 'Refund eligibility is based on cancellation timing and partner policy shown during checkout.'
        }
      ]
    },
    {
      title: 'Payments',
      icon: '💳',
      iconClass: 'icon-payments',
      items: [
        {
          question: 'What payment methods do you accept?',
          answer: 'We support cards, wallet-based options, and other methods shown at checkout by your region.'
        },
        {
          question: 'Is my payment information secure?',
          answer: 'Yes, payment processing uses secure encryption and compliant third-party gateways.'
        },
        {
          question: 'Can I use multiple payment methods?',
          answer: 'Split payments depend on the selected provider and are shown when available at checkout.'
        },
        {
          question: 'How do I add a payment method?',
          answer: 'Visit Settings > Payments and add a method to save it for faster future checkouts.'
        }
      ]
    },
    {
      title: 'Blogs & Reviews',
      icon: '📝',
      iconClass: 'icon-blogs',
      items: [
        {
          question: 'How do I write a blog post?',
          answer: 'Go to Blogs and select Write Blog to draft, preview, and publish your post.'
        },
        {
          question: 'Can I edit my blog posts?',
          answer: 'Yes, open your published post from your profile and choose Edit to update content.'
        },
        {
          question: 'How do I delete my blog post?',
          answer: 'From your blog dashboard, choose the post and click Delete to remove it permanently.'
        },
        {
          question: 'Can I post reviews for destinations?',
          answer: 'Yes, review submission is available from destination pages after you sign in.'
        }
      ]
    },
    {
      title: 'Account & Security',
      icon: '🔒',
      iconClass: 'icon-security',
      items: [
        {
          question: 'How do I change my password?',
          answer: 'Open Profile settings, choose Change Password, and confirm your new credentials.'
        },
        {
          question: 'How do I manage trusted devices?',
          answer: 'Use the Security page to review and remove trusted devices you no longer use.'
        },
        {
          question: 'How do I deactivate my account?',
          answer: 'Account deactivation is available in account settings under the privacy and account section.'
        },
        {
          question: 'Is my data private?',
          answer: 'Your data is protected under our privacy policy and security controls across the platform.'
        }
      ]
    },
    {
      title: 'Technical Issues',
      icon: '⚙️',
      iconClass: 'icon-technical',
      items: [
        {
          question: 'The website is loading slowly',
          answer: 'Try refreshing, checking your network, and disabling heavy browser extensions.'
        },
        {
          question: 'I\'m having trouble logging in',
          answer: 'Confirm your credentials, reset your password if needed, and ensure 2FA code is valid.'
        },
        {
          question: 'Features are not working properly',
          answer: 'Clear your cache and use the latest browser version to resolve most UI issues.'
        },
        {
          question: 'How do I clear my browser cache?',
          answer: 'Open browser settings, clear cached files, then reload Traveler to refresh resources.'
        }
      ]
    }
  ];

  const popularArticles = [
    'How to reset password',
    'How to cancel booking',
    'Payment failed solutions'
  ];

  const allQuestions = useMemo(
    () => helpCategories.flatMap((category) => category.items.map((item) => item.question)),
    [helpCategories]
  );

  const suggestions = useMemo(() => {
    if (!searchTerm.trim()) {
      return [];
    }

    const normalizedSearch = searchTerm.toLowerCase();
    return allQuestions
      .filter((question) => question.toLowerCase().includes(normalizedSearch))
      .slice(0, 6);
  }, [allQuestions, searchTerm]);

  const filteredCategories = useMemo(() => {
    if (!searchTerm.trim()) {
      return helpCategories;
    }

    const normalizedSearch = searchTerm.toLowerCase();
    return helpCategories
      .map((category) => ({
        ...category,
        items: category.items.filter((item) => item.question.toLowerCase().includes(normalizedSearch))
      }))
      .filter((category) => category.items.length > 0);
  }, [helpCategories, searchTerm]);

  useEffect(() => {
    const savedRecentlyViewed = JSON.parse(localStorage.getItem('helpRecentlyViewed') || '[]');
    setRecentlyViewed(savedRecentlyViewed.slice(0, 5));
  }, []);

  useEffect(() => {
    const ctaElement = ctaRef.current;
    if (!ctaElement) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsCtaVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.25 }
    );

    observer.observe(ctaElement);

    return () => observer.disconnect();
  }, []);

  const saveRecentlyViewed = (question) => {
    setRecentlyViewed((previous) => {
      const updated = [question, ...previous.filter((entry) => entry !== question)].slice(0, 5);
      localStorage.setItem('helpRecentlyViewed', JSON.stringify(updated));
      return updated;
    });
  };

  const handleToggleFaq = (faqKey, question) => {
    setOpenFaqKey((previous) => (previous === faqKey ? null : faqKey));
    saveRecentlyViewed(question);
  };

  const handleSuggestionSelect = (question) => {
    setSearchTerm(question);
    setShowSuggestions(false);
  };

  return (
    <div className="help-page">
      <div className="help-hero">
        <div className="help-hero-content">
          <h1>How Can We Help?</h1>
          <p>Find answers to common questions and get support</p>
          <div className="help-search">
            <input
              type="text"
              value={searchTerm}
              onChange={(event) => {
                setSearchTerm(event.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
              placeholder="Search for help articles..."
              aria-label="Search help articles"
            />
            {showSuggestions && suggestions.length > 0 && (
              <ul className="search-suggestions">
                {suggestions.map((question, index) => (
                  <li key={`${question}-${index}`}>
                    <button type="button" onClick={() => handleSuggestionSelect(question)}>
                      {question}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      <div className="help-container">
        <div className="help-main-content">
          <section className="popular-topics">
            <h2>Popular Articles</h2>
            <div className="popular-topics-row">
              {popularArticles.map((article, index) => (
                <a href="/faqs" key={`${article}-${index}`} className="popular-topic-chip">
                  {article}
                </a>
              ))}
            </div>
          </section>

        <div className="help-grid">
          {filteredCategories.map((category, index) => (
            <div key={index} className="help-card">
              <div className={`card-icon ${category.iconClass}`}>{category.icon}</div>
              <h3 className="help-card-title">{category.title}</h3>
              <ul className="help-items">
                {category.items.map((item, itemIndex) => {
                  const faqKey = `${category.title}-${itemIndex}`;
                  const isOpen = openFaqKey === faqKey;

                  return (
                    <li key={itemIndex} className={`faq-item ${isOpen ? 'open' : ''}`}>
                      <button
                        type="button"
                        className="faq-question"
                        onClick={() => handleToggleFaq(faqKey, item.question)}
                        aria-expanded={isOpen}
                      >
                        {item.question}
                      </button>
                      <div className="faq-answer-wrapper">
                        <div className="faq-answer">{item.answer}</div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}

          {filteredCategories.length === 0 && (
            <div className="help-card help-no-results">
              <h3 className="help-card-title">No matching articles found</h3>
              <p>Try a different keyword or contact support for direct assistance.</p>
            </div>
          )}
        </div>
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
              <p>📧 support@traveler.com</p>
              <p>📞 +91 1234567890</p>
              <p>🕒 24/7</p>
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

          {recentlyViewed.length > 0 && (
            <div className="help-widget recently-viewed-widget">
              <h3>Recently Viewed</h3>
              <ul>
                {recentlyViewed.map((article, index) => (
                  <li key={`${article}-${index}`}>{article}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      <div ref={ctaRef} className={`help-cta-section ${isCtaVisible ? 'visible' : ''}`}>
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
