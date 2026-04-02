import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const PaymentSuccess = () => {
  const location = useLocation();
  const bookingRef = location.state?.bookingRef;

  return (
    <div className="payment-result">
      <div className="payment-result-card">
        <div className="payment-result-icon success">✓</div>
        <h2>Payment Successful</h2>
        <p>Your booking has been confirmed.</p>
        {bookingRef && <p className="payment-result-ref">Booking ID: {bookingRef}</p>}
        <div className="payment-result-actions">
          <Link to="/my-trips" className="btn btn-primary">View My Trips</Link>
          <Link to="/destinations" className="btn btn-secondary">Explore More</Link>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;