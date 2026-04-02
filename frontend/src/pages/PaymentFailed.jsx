import React from 'react';
import { Link } from 'react-router-dom';

const PaymentFailed = () => {
  return (
    <div className="payment-result">
      <div className="payment-result-card">
        <div className="payment-result-icon error">✕</div>
        <h2>Payment Failed</h2>
        <p>Please try again or use a different payment method.</p>
        <div className="payment-result-actions">
          <Link to="/destinations" className="btn btn-primary">Try Again</Link>
          <Link to="/support" className="btn btn-secondary">Contact Support</Link>
        </div>
      </div>
    </div>
  );
};

export default PaymentFailed;