import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/FAQs.css';
import { faqData, slugifyFaq } from '../utils/faqData';

const FAQs = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="faqs-page">
      <div className="faq-breadcrumb-wrap">
        <nav className="faq-breadcrumb" aria-label="Breadcrumb">
          <Link to="/">Home</Link>
          <span>/</span>
          <Link to="/help">Help</Link>
          <span>/</span>
          <span className="current">FAQs</span>
        </nav>
      </div>

      <div className="faqs-hero">
        <h1>Frequently Asked Questions</h1>
        <p>Find quick answers to your questions</p>
      </div>

      <div className="faqs-container">
        {faqData.map((category, categoryIndex) => (
          <div key={categoryIndex} className="faq-category">
            <h2 className="category-title">{category.category}</h2>
            <div className="faq-items">
              {category.questions.map((item, itemIndex) => {
                const globalIndex = `${categoryIndex}-${itemIndex}`;
                const isActive = activeIndex === globalIndex;
                return (
                  <div key={itemIndex} className={`faq-item ${isActive ? 'active' : ''}`}>
                    <button 
                      className="faq-question"
                      onClick={() => toggleFAQ(globalIndex)}
                    >
                      <span>{item.q}</span>
                      <span className="faq-icon">{isActive ? '−' : '+'}</span>
                    </button>
                    {isActive && (
                      <div className="faq-answer">
                        <p>{item.a}</p>
                        <Link to={`/faqs/article/${slugifyFaq(item.q)}`} className="faq-article-link">
                          Read full article
                        </Link>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="faq-footer-section">
        <h3>Didn't find what you're looking for?</h3>
        <p>Check our Help Center or Contact our Support Team</p>
        <div className="faq-footer-buttons">
          <a href="/help" className="faq-button">Go to Help Center</a>
          <a href="/contact" className="faq-button faq-button-secondary">Contact Us</a>
        </div>
      </div>
    </div>
  );
};

export default FAQs;
