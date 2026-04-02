import React from 'react';
import { Link, useParams } from 'react-router-dom';
import '../styles/FAQs.css';
import { findFaqArticle } from '../utils/faqData';

const FAQArticle = () => {
  const { slug } = useParams();
  const article = findFaqArticle(slug || '');

  if (!article) {
    return (
      <div className="faqs-page faq-article-page">
        <div className="faq-breadcrumb-wrap">
          <nav className="faq-breadcrumb" aria-label="Breadcrumb">
            <Link to="/">Home</Link>
            <span>/</span>
            <Link to="/help">Help</Link>
            <span>/</span>
            <Link to="/faqs">FAQs</Link>
            <span>/</span>
            <span className="current">Article</span>
          </nav>
        </div>

        <div className="faq-article-card">
          <h1>Article not found</h1>
          <p>The requested FAQ article could not be found.</p>
          <Link to="/faqs" className="faq-button">Back to FAQs</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="faqs-page faq-article-page">
      <div className="faq-breadcrumb-wrap">
        <nav className="faq-breadcrumb" aria-label="Breadcrumb">
          <Link to="/">Home</Link>
          <span>/</span>
          <Link to="/help">Help</Link>
          <span>/</span>
          <Link to="/faqs">FAQs</Link>
          <span>/</span>
          <span className="current">Article</span>
        </nav>
      </div>

      <article className="faq-article-card">
        <p className="faq-article-category">{article.category}</p>
        <h1>{article.question}</h1>
        <p>{article.answer}</p>
        <div className="faq-article-actions">
          <Link to="/faqs" className="faq-button faq-button-secondary">Back to FAQs</Link>
          <Link to="/contact" className="faq-button">Contact Support</Link>
        </div>
      </article>
    </div>
  );
};

export default FAQArticle;
