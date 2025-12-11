import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ErrorMessage = () => {
  const navigate = useNavigate();
  const [showToast, setShowToast] = useState(false);

  const handleGoHome = () => {
    setShowToast(true);
    setTimeout(() => {
      navigate('/');
    }, 1500);
  };

  return (
    <div className="error-page">
      {showToast && (
        <div className="toast-notification">
          Redirecting to Home Page...
        </div>
      )}
      <div className="error-container">
        <h1 className="error-code">404</h1>
        <h2 className="error-title">Page Not Found</h2>
        <p className="error-message">
          Oops! The page you're looking for doesn't exist or the URL is incorrect.
        </p>
        <button 
          className="error-btn" 
          onClick={handleGoHome}
        >
          Go Back Home
        </button>
      </div>
    </div>
  );
};

export default ErrorMessage;
