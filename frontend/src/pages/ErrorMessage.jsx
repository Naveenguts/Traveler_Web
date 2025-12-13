import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ErrorMessage = () => {
  const navigate = useNavigate();
  const [showToast, setShowToast] = useState(false);

  const handleGoHome = () => {
    setShowToast(true);
    setTimeout(() => {
      navigate('/');
    }, 500);
  };

  return (
    <div className="error-page">
      {showToast && (
        <div className="toast-notification">
          Redirecting to Home Page...
        </div>
      )}
      <div className="error-header">
        <h1 className="page-title">Page Not Found</h1>
      </div>

      <div className="error-content">
        <div className="error-left">
          <div className="error-code-container">
            <h1 className="error-code">404</h1>
          </div>
          <h2 className="error-main-title">We're sorry – we can't find the page you requested.</h2>
          <p className="error-subtitle">
            We have recently made some changes to our site, and the page you are looking for can no longer be found.
          </p>

          <p className="error-hint">
            Please check the URL and enter the correct path to continue browsing.
          </p>

          <button 
            className="error-btn" 
            onClick={handleGoHome}
          >
            Back to Home
          </button>
        </div>

        <div className="error-right">
          <div className="error-image-container">
            <img 
              src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=600&fit=crop"
              alt="Beautiful travel destination"
              className="error-image"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErrorMessage;
