import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const destinationsData = [
  { 
    id: 1, 
    name: 'Paris', 
    country: 'France',
    description: 'City of Lights', 
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&h=500&fit=crop',
    longDescription: 'Paris, the capital of France, is one of the most iconic cities in the world. Known for its art, fashion, gastronomy, and culture, Paris offers unforgettable experiences from the Eiffel Tower to the Louvre Museum.',
    price: 2500,
    duration: 7
  },
  { 
    id: 2, 
    name: 'Tokyo', 
    country: 'Japan',
    description: 'Land of the Rising Sun', 
    image: 'https://images.unsplash.com/photo-1540959375944-7049f642e9a4?w=800&h=500&fit=crop',
    longDescription: 'Tokyo is a bustling metropolis that seamlessly blends ancient traditions with modern technology. Experience incredible food, vibrant neighborhoods, and rich cultural heritage.',
    price: 3200,
    duration: 10
  },
  { 
    id: 3, 
    name: 'New York', 
    country: 'USA',
    description: 'The Big Apple', 
    image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800&h=500&fit=crop',
    longDescription: 'New York City is the city that never sleeps. From Times Square to Central Park, Broadway shows to world-class museums, NYC offers endless excitement and cultural diversity.',
    price: 2800,
    duration: 5
  },
  { 
    id: 4, 
    name: 'London', 
    country: 'UK',
    description: 'The Capital of England', 
    image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&h=500&fit=crop',
    longDescription: 'London combines centuries of history with cutting-edge innovation. Visit Buckingham Palace, explore world-renowned museums, and enjoy the vibrant theater scene.',
    price: 2200,
    duration: 6
  },
  { 
    id: 5, 
    name: 'Dubai', 
    country: 'UAE',
    description: 'City of Gold', 
    image: 'https://images.unsplash.com/photo-1512453693020-ce7e46f9e4c9?w=800&h=500&fit=crop',
    longDescription: 'Dubai is a futuristic city in the desert, known for luxury shopping, ultramodern architecture, and a lively nightlife scene. Experience the Burj Khalifa and traditional souks.',
    price: 3500,
    duration: 8
  },
  { 
    id: 6, 
    name: 'Barcelona', 
    country: 'Spain',
    description: 'City by the Sea', 
    image: 'https://images.unsplash.com/photo-1562883676-8c6fbdf495c0?w=800&h=500&fit=crop',
    longDescription: 'Barcelona offers stunning architecture by Gaudí, beautiful beaches, delicious cuisine, and a vibrant cultural scene. The perfect blend of urban excitement and Mediterranean relaxation.',
    price: 1800,
    duration: 5
  },
];

// Sample initial reviews
const initialReviews = {
  1: [
    { id: 1, userName: 'Sarah Johnson', rating: 5, comment: 'Absolutely amazing! Paris exceeded all my expectations. The Eiffel Tower at night is breathtaking.', date: '2024-11-20', userAvatar: 'SJ' },
    { id: 2, userName: 'Michael Chen', rating: 4, comment: 'Great city with so much to see. Food was incredible but quite expensive.', date: '2024-11-15', userAvatar: 'MC' }
  ],
  2: [
    { id: 1, userName: 'Emma Wilson', rating: 5, comment: 'Tokyo is a dream! The culture, food, and people are wonderful. Can\'t wait to go back!', date: '2024-10-28', userAvatar: 'EW' }
  ],
  3: [
    { id: 1, userName: 'David Martinez', rating: 4, comment: 'NYC is incredible but very crowded. Loved the museums and Broadway shows.', date: '2024-11-05', userAvatar: 'DM' }
  ]
};

const StarRating = ({ rating, onRatingChange, readonly = false }) => {
  const [hoveredRating, setHoveredRating] = useState(0);

  return (
    <div className="star-rating">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={`star ${readonly ? 'readonly' : ''} ${star <= (hoveredRating || rating) ? 'filled' : ''}`}
          onClick={() => !readonly && onRatingChange(star)}
          onMouseEnter={() => !readonly && setHoveredRating(star)}
          onMouseLeave={() => !readonly && setHoveredRating(0)}
        >
          ★
        </span>
      ))}
    </div>
  );
};

const DestinationDetails = () => {
  const { id } = useParams();
  const { user, addTrip, trips } = useAuth();
  const destination = destinationsData.find(dest => dest.id === parseInt(id));
  
  const [reviews, setReviews] = useState(initialReviews[parseInt(id)] || []);
  const [newReview, setNewReview] = useState({ rating: 0, comment: '' });
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showUpiPinModal, setShowUpiPinModal] = useState(false);
  const [showOverlapWarning, setShowOverlapWarning] = useState(false);
  const [overlappingTrips, setOverlappingTrips] = useState([]);
  const [dateConflicts, setDateConflicts] = useState([]);
  const [locationConflicts, setLocationConflicts] = useState([]);
  const [bookingData, setBookingData] = useState({
    startDate: '',
    endDate: '',
    description: ''
  });
  const [showConflictDetails, setShowConflictDetails] = useState(false);
  const [lastBookingAttempt, setLastBookingAttempt] = useState(null);
  const [previewDateConflicts, setPreviewDateConflicts] = useState(0);
  const [previewLocationConflicts, setPreviewLocationConflicts] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('card'); // 'card', 'upi', 'netbanking'
  const [upiApp, setUpiApp] = useState(''); // 'googlepay', 'phonepe', 'paytm', 'bhim'
  const [bankDetails, setBankDetails] = useState({
    accountNumber: '',
    confirmAccountNumber: '',
    ifscCode: '',
    accountHolder: ''
  });
  const [paymentData, setPaymentData] = useState({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
    upiId: '',
    upiPin: '',
    bankName: ''
  });
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpValue, setOtpValue] = useState('');

  // UPI app details and PIN requirements
  const upiApps = {
    googlepay: { name: 'Google Pay', pinLength: 5, logo: '/assets/google-pay-logo.svg' },
    phonepe: { name: 'PhonePe', pinLength: 6, logo: '/assets/phonepe-logo.svg' },
    paytm: { name: 'Paytm', pinLength: 4, logo: '/assets/paytm-1.svg' },
    bhim: { name: 'BHIM UPI', pinLength: 6 }
  };

  const renderUpiLogo = (appKey, variant = 'md') => {
    const app = upiApps[appKey];
    if (!app) return null;

    const sizeClass = variant === 'lg' ? 'app-logo-lg' : '';
    const fallbackLabel = (app.name || 'UPI').split(' ')[0];

    return (
      <div className={`app-logo ${sizeClass}`}>
        {app.logo ? (
          <img src={app.logo} alt={`${app.name} logo`} />
        ) : (
          <span className="app-logo-fallback">{fallbackLabel}</span>
        )}
      </div>
    );
  };

  const getPinLength = () => {
    if (!upiApp) return 6;
    return upiApps[upiApp]?.pinLength || 6;
  };

  const formatAccountNumber = (value) => {
    const cleaned = value.replace(/\s/g, '');
    const chunks = cleaned.match(/.{1,4}/g);
    return chunks ? chunks.join(' ') : cleaned;
  };

  const validateIfsc = (ifsc) => /^[A-Z]{4}0[A-Z0-9]{6}$/.test(ifsc);

  const validateAccountNumber = (account) => /^\d{9,18}$/.test(account.replace(/\s/g, ''));

  if (!destination) return <p>Destination not found!</p>;

  // Hydrate last booking attempt from localStorage once
  useEffect(() => {
    try {
      const saved = localStorage.getItem('lastBookingAttempt');
      if (saved) {
        const parsed = JSON.parse(saved);
        setLastBookingAttempt(parsed);
        if (!bookingData.startDate && !bookingData.endDate && !bookingData.description) {
          setBookingData(parsed);
        }
      }
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Persist booking data as user fills it
  useEffect(() => {
    try {
      if (bookingData.startDate || bookingData.endDate || bookingData.description) {
        localStorage.setItem('lastBookingAttempt', JSON.stringify(bookingData));
        setLastBookingAttempt(bookingData);
      }
    } catch {}
  }, [bookingData]);

  // Live conflict preview under date fields
  useEffect(() => {
    try {
      if (!bookingData.startDate || !bookingData.endDate || !Array.isArray(trips)) {
        setPreviewDateConflicts(0);
        setPreviewLocationConflicts(0);
        return;
      }
      const newStart = new Date(bookingData.startDate);
      const newEnd = new Date(bookingData.endDate);
      const overlapping = trips.filter(trip => {
        const isActive = !trip.status || trip.status === 'upcoming';
        if (!isActive) return false;
        const tripStart = new Date(trip.startDate);
        const tripEnd = new Date(trip.endDate);
        return (newStart <= tripEnd && newEnd >= tripStart);
      });
      let dc = 0, lc = 0;
      overlapping.forEach(trip => {
        const sameDestination = (trip.destinationName || '').toLowerCase() === destination.name.toLowerCase();
        const exactSameDates = new Date(trip.startDate).toDateString() === newStart.toDateString() && new Date(trip.endDate).toDateString() === newEnd.toDateString();
        if (sameDestination || exactSameDates) dc += 1; else lc += 1;
      });
      setPreviewDateConflicts(dc);
      setPreviewLocationConflicts(lc);
    } catch {
      setPreviewDateConflicts(0);
      setPreviewLocationConflicts(0);
    }
  }, [bookingData.startDate, bookingData.endDate, trips, destination.name]);

  // Calculate average rating
  const averageRating = reviews.length > 0 
    ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)
    : 0;

  const handleSubmitReview = (e) => {
    e.preventDefault();
    
    if (!user) {
      alert('Please login to submit a review');
      return;
    }

    if (newReview.rating === 0) {
      alert('Please select a rating');
      return;
    }

    if (newReview.comment.trim() === '') {
      alert('Please write a review comment');
      return;
    }

    const review = {
      id: reviews.length + 1,
      userName: user.name || 'Anonymous User',
      rating: newReview.rating,
      comment: newReview.comment,
      date: new Date().toISOString().split('T')[0],
      userAvatar: user.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase() : 'U'
    };

    setReviews([review, ...reviews]);
    setNewReview({ rating: 0, comment: '' });
    setShowReviewForm(false);
  };

  const handleBookTrip = (e) => {
    e.preventDefault();
    
    if (!user) {
      alert('Please login to book a trip');
      return;
    }

    if (!bookingData.startDate || !bookingData.endDate) {
      alert('Please select travel dates');
      return;
    }

    // Check for overlapping trips
    const newStart = new Date(bookingData.startDate);
    const newEnd = new Date(bookingData.endDate);
    
    const overlapping = trips.filter(trip => {
      const isActive = !trip.status || trip.status === 'upcoming';
      if (!isActive) return false;
      const tripStart = new Date(trip.startDate);
      const tripEnd = new Date(trip.endDate);
      
      // Check if dates overlap
      return (newStart <= tripEnd && newEnd >= tripStart);
    });

    if (overlapping.length > 0) {
      setOverlappingTrips(overlapping);
      // Group conflicts: blocking date conflicts vs location conflicts
      const dc = [];
      const lc = [];
      overlapping.forEach(trip => {
        const sameDestination = (trip.destinationName || '').toLowerCase() === destination.name.toLowerCase();
        const exactSameDates = new Date(trip.startDate).toDateString() === newStart.toDateString() && new Date(trip.endDate).toDateString() === newEnd.toDateString();
        if (sameDestination || exactSameDates) {
          dc.push(trip);
        } else {
          lc.push(trip);
        }
      });
      setDateConflicts(dc);
      setLocationConflicts(lc);
      setShowConflictDetails(false);
      setShowBookingModal(false);
      setShowOverlapWarning(true);
      return;
    }

    // Move to payment modal if no overlap
    setShowBookingModal(false);
    setShowPaymentModal(true);
  };

  const handleConfirmOverlap = () => {
    setShowOverlapWarning(false);
    setShowPaymentModal(true);
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    
    // Validate payment based on method
    if (paymentMethod === 'card') {
      if (!paymentData.cardNumber || !paymentData.cardName || !paymentData.expiryDate || !paymentData.cvv) {
        alert('Please fill in all card details');
        return;
      }
      // Validate card number (basic check for 16 digits)
      if (!/^\d{16}$/.test(paymentData.cardNumber.replace(/\s/g, ''))) {
        alert('Please enter a valid 16-digit card number');
        return;
      }
      // Validate CVV
      if (!/^\d{3,4}$/.test(paymentData.cvv)) {
        alert('Please enter a valid CVV');
        return;
      }
      // Show confirmation modal
      setShowConfirmationModal(true);
    } else if (paymentMethod === 'upi') {
      if (!upiApp) {
        alert('Please select a UPI app');
        return;
      }
      if (!paymentData.upiId) {
        alert('Please enter your UPI ID');
        return;
      }
      // Basic UPI ID validation
      if (!/^[\w.-]+@[\w.-]+$/.test(paymentData.upiId)) {
        alert('Please enter a valid UPI ID (e.g., username@bank)');
        return;
      }
      // Show confirmation modal
      setShowConfirmationModal(true);
    } else if (paymentMethod === 'netbanking') {
      if (!paymentData.bankName) {
        alert('Please select a bank');
        return;
      }
      if (!bankDetails.accountNumber || !bankDetails.confirmAccountNumber || !bankDetails.ifscCode || !bankDetails.accountHolder) {
        alert('Please fill in all bank details');
        return;
      }
      if (!validateAccountNumber(bankDetails.accountNumber)) {
        alert('Please enter a valid account number (9-18 digits)');
        return;
      }
      if (bankDetails.accountNumber.replace(/\s/g, '') !== bankDetails.confirmAccountNumber.replace(/\s/g, '')) {
        alert('Account numbers do not match');
        return;
      }
      if (!validateIfsc(bankDetails.ifscCode.toUpperCase())) {
        alert('Please enter a valid IFSC code (e.g., SBIN0001234)');
        return;
      }
      // Show confirmation modal
      setShowConfirmationModal(true);
    }
  };

  const handleUpiPinSubmit = async (e) => {
    e.preventDefault();
    
    const pinLength = getPinLength();
    if (!paymentData.upiPin || paymentData.upiPin.length !== pinLength) {
      alert(`Please enter a valid ${pinLength}-digit UPI PIN`);
      return;
    }

    // Show confirmation modal
    setShowUpiPinModal(false);
    setShowConfirmationModal(true);
  };

  const processPayment = async () => {
    setIsProcessingPayment(true);

    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));

    const trip = addTrip({
      destinationName: destination.name,
      country: `${destination.country}`,
      startDate: bookingData.startDate,
      endDate: bookingData.endDate,
      description: bookingData.description || `Trip to ${destination.name}`,
      coverImage: destination.image,
      price: destination.price,
      duration: destination.duration,
      paymentMethod: paymentMethod,
      paymentStatus: 'Paid'
    });

    setIsProcessingPayment(false);
    setShowPaymentModal(false);
    setShowConfirmationModal(false);
    setShowOtpModal(false);
    setShowUpiPinModal(false);
    setBookingData({ startDate: '', endDate: '', description: '' });
    setPaymentData({
      cardNumber: '',
      cardName: '',
      expiryDate: '',
      cvv: '',
      upiId: '',
      upiPin: '',
      bankName: ''
    });
    setBankDetails({
      accountNumber: '',
      confirmAccountNumber: '',
      ifscCode: '',
      accountHolder: ''
    });
    setOtpValue('');
    setUpiApp('');
    
    alert(`Payment successful! Your trip to ${destination.name} has been booked.`);
  };

  const handleConfirmPayment = () => {
    // For net banking, show OTP modal
    if (paymentMethod === 'netbanking') {
      setShowConfirmationModal(false);
      setShowOtpModal(true);
    } else {
      // For card and UPI, process directly
      processPayment();
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    
    if (!otpValue || otpValue.length !== 6) {
      alert('Please enter a valid 6-digit OTP');
      return;
    }

    // Simulate OTP validation
    if (otpValue === '123456') {
      setShowOtpModal(false);
      await processPayment();
    } else {
      alert('Invalid OTP. Please try again. (Hint: use 123456)');
      setOtpValue('');
    }
  };

  const formatCardNumber = (value) => {
    const cleaned = value.replace(/\s/g, '');
    const chunks = cleaned.match(/.{1,4}/g);
    return chunks ? chunks.join(' ') : cleaned;
  };

  const formatExpiryDate = (value) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length >= 2) {
      return cleaned.slice(0, 2) + '/' + cleaned.slice(2, 4);
    }
    return cleaned;
  };

  return (
    <div className="destination-details">
      <div className="destination-hero">
        <img src={destination.image} alt={destination.name} className="destination-hero-image" />
        <div className="destination-hero-overlay">
          <h1>{destination.name}</h1>
          <p className="destination-country">📍 {destination.country}</p>
        </div>
      </div>

      <div className="destination-content">
        <div className="destination-info-section">
          <div className="destination-main-info">
            <h2>About {destination.name}</h2>
            <p className="destination-long-description">{destination.longDescription}</p>
            
            <div className="destination-quick-info">
              <div className="info-item">
                <span className="info-icon">💵</span>
                <div>
                  <strong>Price</strong>
                  <p>${destination.price}</p>
                </div>
              </div>
              <div className="info-item">
                <span className="info-icon">⏱️</span>
                <div>
                  <strong>Duration</strong>
                  <p>{destination.duration} days</p>
                </div>
              </div>
              <div className="info-item">
                <span className="info-icon">⭐</span>
                <div>
                  <strong>Rating</strong>
                  <p>{averageRating} ({reviews.length} reviews)</p>
                </div>
              </div>
            </div>

            <button 
              className="btn btn-book-trip"
              onClick={() => setShowBookingModal(true)}
            >
              ✈️ Book This Trip
            </button>
          </div>

          {/* Reviews Section */}
          <div className="reviews-section">
            <div className="reviews-header">
              <h2>Reviews & Ratings</h2>
              {user && (
                <button 
                  className="btn btn-primary"
                  onClick={() => setShowReviewForm(!showReviewForm)}
                >
                  {showReviewForm ? 'Cancel' : 'Write a Review'}
                </button>
              )}
            </div>

            {/* Average Rating Display */}
            <div className="average-rating-display">
              <div className="rating-score">
                <span className="rating-number">{averageRating}</span>
                <StarRating rating={parseFloat(averageRating)} readonly={true} />
                <span className="rating-count">Based on {reviews.length} review{reviews.length !== 1 ? 's' : ''}</span>
              </div>
            </div>

            {/* Review Form */}
            {showReviewForm && (
              <form className="review-form" onSubmit={handleSubmitReview}>
                <h3>Share Your Experience</h3>
                <div className="form-group">
                  <label>Your Rating</label>
                  <StarRating 
                    rating={newReview.rating} 
                    onRatingChange={(rating) => setNewReview({ ...newReview, rating })}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="review-comment">Your Review</label>
                  <textarea
                    id="review-comment"
                    rows="5"
                    placeholder="Share your thoughts about this destination..."
                    value={newReview.comment}
                    onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                    required
                  />
                </div>
                <button type="submit" className="btn btn-primary">Submit Review</button>
              </form>
            )}

            {/* Reviews List */}
            <div className="reviews-list">
              {reviews.length === 0 ? (
                <p className="no-reviews">No reviews yet. Be the first to review this destination!</p>
              ) : (
                reviews.map((review) => (
                  <div key={review.id} className="review-card">
                    <div className="review-header">
                      <div className="reviewer-info">
                        <div className="reviewer-avatar">{review.userAvatar}</div>
                        <div>
                          <h4 className="reviewer-name">{review.userName}</h4>
                          <p className="review-date">{new Date(review.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                        </div>
                      </div>
                      <StarRating rating={review.rating} readonly={true} />
                    </div>
                    <p className="review-comment">{review.comment}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {showBookingModal && (
        <div className="modal-overlay" onClick={() => setShowBookingModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Book Your Trip to {destination.name}</h2>
              <button className="modal-close" onClick={() => setShowBookingModal(false)}>×</button>
            </div>
            <form onSubmit={handleBookTrip} className="booking-form">
              <div className="form-group">
                <label htmlFor="start-date">Start Date</label>
                <input
                  type="date"
                  id="start-date"
                  value={bookingData.startDate}
                  onChange={(e) => setBookingData({ ...bookingData, startDate: e.target.value })}
                  min={new Date().toISOString().split('T')[0]}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="end-date">End Date</label>
                <input
                  type="date"
                  id="end-date"
                  value={bookingData.endDate}
                  onChange={(e) => setBookingData({ ...bookingData, endDate: e.target.value })}
                  min={bookingData.startDate || new Date().toISOString().split('T')[0]}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="trip-description">Trip Description (Optional)</label>
                <textarea
                  id="trip-description"
                  rows="3"
                  placeholder="Add notes about your trip..."
                  value={bookingData.description}
                  onChange={(e) => setBookingData({ ...bookingData, description: e.target.value })}
                />
              </div>
              <div className="booking-summary">
                <p><strong>Price:</strong> ${destination.price}</p>
                <p><strong>Duration:</strong> {destination.duration} days (suggested)</p>
              </div>
              {(previewDateConflicts > 0 || previewLocationConflicts > 0) && (
                <div className="date-conflict-hint">
                  {previewDateConflicts > 0 && (
                    <span className="hint-badge error">🚫 Date Conflicts ({previewDateConflicts})</span>
                  )}
                  {previewLocationConflicts > 0 && (
                    <span className="hint-badge warn">⚠ Location Conflicts ({previewLocationConflicts})</span>
                  )}
                </div>
              )}
              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowBookingModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Proceed to Payment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="modal-overlay" onClick={() => !isProcessingPayment && setShowPaymentModal(false)}>
          <div className="modal-content payment-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>💳 Complete Payment</h2>
              <button 
                className="modal-close" 
                onClick={() => !isProcessingPayment && setShowPaymentModal(false)}
                disabled={isProcessingPayment}
              >
                ×
              </button>
            </div>
            
            <div className="payment-content">
              <div className="payment-summary-box">
                <h4 className="summary-destination">{destination.name}, {destination.country} 🌍</h4>
                <p className="summary-dates">
                  📅 {new Date(bookingData.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} – {new Date(bookingData.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </p>
                <div className="summary-total">
                  <span className="summary-total-label">Total Amount</span>
                  <strong className="price-highlight">${destination.price}</strong>
                </div>
              </div>

              <div className="payment-methods">
                <h3>Select Payment Method</h3>
                <div className="payment-method-options">
                  <button
                    type="button"
                    className={`payment-method-btn ${paymentMethod === 'card' ? 'active' : ''}`}
                    onClick={() => setPaymentMethod('card')}
                    disabled={isProcessingPayment}
                  >
                    <span className="payment-icon">💳</span>
                    <span>Card</span>
                  </button>
                  <button
                    type="button"
                    className={`payment-method-btn ${paymentMethod === 'upi' ? 'active' : ''}`}
                    onClick={() => setPaymentMethod('upi')}
                    disabled={isProcessingPayment}
                  >
                    <span className="payment-icon">📱</span>
                    <span>UPI</span>
                  </button>
                  <button
                    type="button"
                    className={`payment-method-btn ${paymentMethod === 'netbanking' ? 'active' : ''}`}
                    onClick={() => setPaymentMethod('netbanking')}
                    disabled={isProcessingPayment}
                  >
                    <span className="payment-icon">🏦</span>
                    <span>Bank</span>
                  </button>
                </div>
              </div>

              <form onSubmit={handlePayment} className="payment-form">
                {/* Card Payment Form */}
                {paymentMethod === 'card' && (
                  <div className="payment-details">
                    <div className="form-group">
                      <label htmlFor="card-number">
                        Card Number
                        <span className="label-hint">(16 digits)</span>
                      </label>
                      <input
                        type="text"
                        id="card-number"
                        placeholder="1234 5678 9012 3456"
                        value={paymentData.cardNumber}
                        onChange={(e) => {
                          const formatted = formatCardNumber(e.target.value.replace(/\D/g, '').slice(0, 16));
                          setPaymentData({ ...paymentData, cardNumber: formatted });
                        }}
                        maxLength="19"
                        disabled={isProcessingPayment}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="card-name">Cardholder Name</label>
                      <input
                        type="text"
                        id="card-name"
                        placeholder="JOHN DOE"
                        value={paymentData.cardName}
                        onChange={(e) => setPaymentData({ ...paymentData, cardName: e.target.value.toUpperCase() })}
                        disabled={isProcessingPayment}
                        required
                      />
                    </div>
                    <div className="form-row">
                      <div className="form-group">
                        <label htmlFor="expiry-date">
                          Expiry Date
                          <span className="label-hint">(MM/YY)</span>
                        </label>
                        <input
                          type="text"
                          id="expiry-date"
                          placeholder="MM/YY"
                          value={paymentData.expiryDate}
                          onChange={(e) => {
                            const formatted = formatExpiryDate(e.target.value);
                            setPaymentData({ ...paymentData, expiryDate: formatted });
                          }}
                          maxLength="5"
                          disabled={isProcessingPayment}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="cvv">
                          CVV
                          <span className="label-hint">(3 digits)</span>
                        </label>
                        <input
                          type="text"
                          id="cvv"
                          placeholder="123"
                          value={paymentData.cvv}
                          onChange={(e) => setPaymentData({ ...paymentData, cvv: e.target.value.replace(/\D/g, '').slice(0, 4) })}
                          maxLength="4"
                          disabled={isProcessingPayment}
                          required
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* UPI Payment Form */}
                {paymentMethod === 'upi' && (
                  <div className="payment-details">
                    <div className="form-group">
                      <label>Select UPI App</label>
                      <div className="upi-apps-grid">
                        <button
                          type="button"
                          className={`upi-app-btn ${upiApp === 'googlepay' ? 'active' : ''}`}
                          onClick={() => {
                            setUpiApp('googlepay');
                            setPaymentData({ ...paymentData, upiPin: '' });
                          }}
                          disabled={isProcessingPayment}
                        >
                          {renderUpiLogo('googlepay')}
                          <span className="app-name">Google Pay</span>
                          <span className="pin-hint">5 digits</span>
                        </button>
                        
                        <button
                          type="button"
                          className={`upi-app-btn ${upiApp === 'phonepe' ? 'active' : ''}`}
                          onClick={() => {
                            setUpiApp('phonepe');
                            setPaymentData({ ...paymentData, upiPin: '' });
                          }}
                          disabled={isProcessingPayment}
                        >
                          {renderUpiLogo('phonepe')}
                          <span className="app-name">PhonePe</span>
                          <span className="pin-hint">6 digits</span>
                        </button>
                        
                        <button
                          type="button"
                          className={`upi-app-btn ${upiApp === 'paytm' ? 'active' : ''}`}
                          onClick={() => {
                            setUpiApp('paytm');
                            setPaymentData({ ...paymentData, upiPin: '' });
                          }}
                          disabled={isProcessingPayment}
                        >
                          {renderUpiLogo('paytm')}
                          <span className="app-name">Paytm</span>
                          <span className="pin-hint">4 digits</span>
                        </button>
                        
                        <button
                          type="button"
                          className={`upi-app-btn ${upiApp === 'bhim' ? 'active' : ''}`}
                          onClick={() => {
                            setUpiApp('bhim');
                            setPaymentData({ ...paymentData, upiPin: '' });
                          }}
                          disabled={isProcessingPayment}
                        >
                          {renderUpiLogo('bhim')}
                          <span className="app-name">BHIM UPI</span>
                          <span className="pin-hint">6 digits</span>
                        </button>
                      </div>
                    </div>

                    <div className="form-group">
                      <label htmlFor="upi-id">UPI ID</label>
                      <input
                        type="text"
                        id="upi-id"
                        placeholder="yourname@paytm"
                        value={paymentData.upiId}
                        onChange={(e) => setPaymentData({ ...paymentData, upiId: e.target.value.toLowerCase() })}
                        disabled={isProcessingPayment}
                        required
                      />
                      <small className="form-hint">Enter your UPI ID (e.g., username@paytm, username@googlepay)</small>
                    </div>
                  </div>
                )}

                {/* Net Banking Form */}
                {paymentMethod === 'netbanking' && (
                  <div className="payment-details">
                    <div className="form-group">
                      <label htmlFor="bank-name">Select Your Bank</label>
                      <select
                        id="bank-name"
                        value={paymentData.bankName}
                        onChange={(e) => {
                          setPaymentData({ ...paymentData, bankName: e.target.value });
                          setBankDetails({ accountNumber: '', confirmAccountNumber: '', ifscCode: '', accountHolder: '' });
                        }}
                        disabled={isProcessingPayment}
                        required
                      >
                        <option value="">-- Choose your bank --</option>
                        <option value="SBI">State Bank of India</option>
                        <option value="HDFC">HDFC Bank</option>
                        <option value="ICICI">ICICI Bank</option>
                        <option value="AXIS">Axis Bank</option>
                        <option value="PNB">Punjab National Bank</option>
                        <option value="BOB">Bank of Baroda</option>
                        <option value="Kotak">Kotak Mahindra Bank</option>
                        <option value="Yes">Yes Bank</option>
                        <option value="IDBI">IDBI Bank</option>
                        <option value="Other">Other Banks</option>
                      </select>
                    </div>

                    {paymentData.bankName && (
                      <div className="bank-details-section">
                        <h4 className="bank-details-title">Bank Account Details</h4>
                        <div className="bank-info-box">
                          <p className="bank-info"><strong>Bank:</strong> {paymentData.bankName}</p>
                          <p className="bank-info"><small>💡 Details will be securely transmitted to your bank</small></p>
                        </div>

                        <div className="form-group">
                          <label htmlFor="account-holder">Account Holder Name</label>
                          <input
                            type="text"
                            id="account-holder"
                            placeholder="Enter your full name"
                            value={bankDetails.accountHolder}
                            onChange={(e) => setBankDetails({ ...bankDetails, accountHolder: e.target.value.toUpperCase() })}
                            disabled={isProcessingPayment}
                            required
                          />
                        </div>

                        <div className="form-group">
                          <label htmlFor="account-number">Account Number</label>
                          <input
                            type="text"
                            id="account-number"
                            placeholder="1234 5678 9012 3456"
                            value={formatAccountNumber(bankDetails.accountNumber)}
                            onChange={(e) => setBankDetails({ ...bankDetails, accountNumber: e.target.value })}
                            maxLength="22"
                            disabled={isProcessingPayment}
                            required
                          />
                          <small className="form-hint">Enter your bank account number (9-18 digits)</small>
                        </div>

                        <div className="form-group">
                          <label htmlFor="confirm-account">Confirm Account Number</label>
                          <input
                            type="text"
                            id="confirm-account"
                            placeholder="Re-enter your account number"
                            value={formatAccountNumber(bankDetails.confirmAccountNumber)}
                            onChange={(e) => setBankDetails({ ...bankDetails, confirmAccountNumber: e.target.value })}
                            maxLength="22"
                            disabled={isProcessingPayment}
                            required
                          />
                        </div>

                        <div className="form-group">
                          <label htmlFor="ifsc-code">IFSC Code</label>
                          <input
                            type="text"
                            id="ifsc-code"
                            placeholder="SBIN0001234"
                            value={bankDetails.ifscCode.toUpperCase()}
                            onChange={(e) => setBankDetails({ ...bankDetails, ifscCode: e.target.value.toUpperCase() })}
                            maxLength="11"
                            disabled={isProcessingPayment}
                            required
                          />
                          <small className="form-hint">11-character IFSC code (e.g., SBIN0001234)</small>
                        </div>

                        <div className="security-note">
                          <p>🔒 Your bank details are encrypted and secured with 256-bit SSL encryption</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                <div className="payment-actions">
                  <button 
                    type="submit" 
                    className="btn btn-primary btn-pay" 
                    disabled={isProcessingPayment}
                  >
                    {isProcessingPayment ? (
                      <>
                        <span className="spinner"></span>
                        Processing Payment...
                      </>
                    ) : (
                      <>💳 Pay ${destination.price}</>
                    )}
                  </button>
                  <button 
                    type="button" 
                    className="btn btn-secondary" 
                    onClick={() => {
                      setShowPaymentModal(false);
                      setShowBookingModal(true);
                    }}
                    disabled={isProcessingPayment}
                  >
                    ← Back to Booking
                  </button>
                </div>
              </form>
            </div>

            <div className="payment-security">
              <p>🔒 100% Secure Payments · SSL Encrypted</p>
              <div className="trust-badges">
                <span className="trust-badge">✓ PCI-DSS Compliant</span>
                <span className="trust-badge">✓ Bank-Level Security</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* UPI PIN Modal */}
      {showUpiPinModal && (
        <div className="modal-overlay" onClick={() => setShowUpiPinModal(false)}>
          <div className="modal-content upi-pin-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>📱 {upiApps[upiApp]?.name || 'UPI'} - Enter PIN</h2>
              <button className="modal-close" onClick={() => setShowUpiPinModal(false)}>×</button>
            </div>
            
            <div className="upi-pin-content">
              <div className="upi-info-box">
                <div className="upi-app-display">
                  <div className="app-icon-large">
                    {renderUpiLogo(upiApp, 'lg')}
                  </div>
                  <div className="upi-details">
                    <span className="upi-label">{upiApps[upiApp]?.name}</span>
                    <strong className="upi-id">{paymentData.upiId}</strong>
                  </div>
                </div>
                <div className="upi-amount">
                  <span>Transaction Amount</span>
                  <strong className="amount-value">₹{destination.price}</strong>
                </div>
              </div>

              <form onSubmit={handleUpiPinSubmit} className="upi-pin-form">
                <div className="form-group">
                  <label htmlFor="upi-pin">Enter your {getPinLength()}-digit UPI PIN</label>
                  <input
                    type="password"
                    id="upi-pin"
                    placeholder={Array(getPinLength() + 1).join('•')}
                    value={paymentData.upiPin}
                    onChange={(e) => setPaymentData({ ...paymentData, upiPin: e.target.value.replace(/\D/g, '').slice(0, getPinLength()) })}
                    maxLength={getPinLength()}
                    autoFocus
                    required
                    className="upi-pin-input"
                  />
                  <small className="form-hint">Your UPI PIN is encrypted and never shared with merchants</small>
                </div>

                <div className="upi-pin-actions">
                  <button type="submit" className="btn btn-primary btn-pay">
                    {isProcessingPayment ? (
                      <>
                        <span className="spinner"></span>
                        Processing...
                      </>
                    ) : (
                      <>✓ Pay ₹{destination.price}</>
                    )}
                  </button>
                  <button 
                    type="button" 
                    className="btn btn-secondary" 
                    onClick={() => {
                      setShowUpiPinModal(false);
                      setShowPaymentModal(true);
                      setPaymentData({ ...paymentData, upiPin: '' });
                    }}
                  >
                    ← Back
                  </button>
                </div>

                <div className="upi-security-badge">
                  <p>🔒 Protected by {upiApps[upiApp]?.name} 2FA · All transactions are 100% secure</p>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Payment Confirmation Modal */}
      {showConfirmationModal && (
        <div className="modal-overlay" onClick={() => setShowConfirmationModal(false)}>
          <div className="modal-content confirmation-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header confirmation-header">
              <h2>✓ Confirm Your Payment</h2>
              <button className="modal-close" onClick={() => setShowConfirmationModal(false)}>×</button>
            </div>

            <div className="confirmation-content">
              {/* Trip Image Preview */}
              <div className="trip-image-preview">
                <img src={destination.image} alt={destination.name} />
              </div>

              {/* Trip Summary Card */}
              <div className="trip-summary-card official">
                <div className="trip-header">
                  <h3>{destination.name}</h3>
                  <span className="country-badge">{destination.country}</span>
                </div>
                
                <div className="trip-dates-row">
                  <div className="date-item">
                    <span className="date-label">Check-in</span>
                    <span className="date-value">{new Date(bookingData.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  </div>
                  <span className="date-separator">→</span>
                  <div className="date-item">
                    <span className="date-label">Check-out</span>
                    <span className="date-value">{new Date(bookingData.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  </div>
                </div>

                <div className="trip-meta">
                  <span className="meta-item">📅 {destination.duration} days</span>
                </div>
              </div>

              {/* Payment Method Card */}
              <div className="payment-method-card official">
                <h4 className="card-title">Payment Method</h4>
                
                <div className="payment-method-display">
                  {paymentMethod === 'card' && (
                    <div className="method-box card-method">
                      <div className="method-icon card-icon">💳</div>
                      <div className="method-info">
                        <p className="method-name">Credit/Debit Card</p>
                        <p className="method-detail">•••• {paymentData.cardNumber.slice(-4)}</p>
                      </div>
                    </div>
                  )}
                  {paymentMethod === 'upi' && (
                    <div className="method-box upi-method">
                      <div className={`method-icon upi-icon ${upiApp}`}>
                        {renderUpiLogo(upiApp)}
                      </div>
                      <div className="method-info">
                        <p className="method-name">{upiApps[upiApp]?.name || 'UPI'}</p>
                        <p className="method-detail">{paymentData.upiId}</p>
                      </div>
                    </div>
                  )}
                  {paymentMethod === 'netbanking' && (
                    <div className="method-box netbanking-method">
                      <div className="method-icon netbanking-icon">🏦</div>
                      <div className="method-info">
                        <p className="method-name">{paymentData.bankName}</p>
                        <p className="method-detail">Account ending in •••• {bankDetails.accountNumber.slice(-4).replace(/\s/g, '')}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Amount Section */}
              <div className="amount-section official">
                <div className="amount-breakdown">
                  <div className="breakdown-item">
                    <span className="breakdown-label">Trip Cost</span>
                    <span className="breakdown-value">₹{destination.price}</span>
                  </div>
                  <div className="breakdown-item">
                    <span className="breakdown-label">Taxes & Fees</span>
                    <span className="breakdown-value">₹0</span>
                  </div>
                  <div className="breakdown-divider"></div>
                  <div className="breakdown-item total-amount">
                    <span className="breakdown-label">Total Amount</span>
                    <span className="breakdown-value amount-highlight">₹{destination.price}</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="confirmation-actions official">
                <button 
                  className="btn btn-confirm-primary" 
                  onClick={handleConfirmPayment}
                  disabled={isProcessingPayment}
                >
                  {isProcessingPayment ? (
                    <>
                      <span className="spinner"></span>
                      Processing Payment...
                    </>
                  ) : (
                    <>✓ Confirm & Pay ₹{destination.price}</>
                  )}
                </button>
                <button 
                  className="btn btn-confirm-secondary" 
                  onClick={() => setShowConfirmationModal(false)}
                  disabled={isProcessingPayment}
                >
                  Cancel Payment
                </button>
              </div>

              {/* Security Note */}
              <div className="security-footer">
                <p>🔒 Your payment is secured with 256-bit SSL encryption • Verified by your bank</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Net Banking OTP Modal */}
      {showOtpModal && (
        <div className="modal-overlay" onClick={() => setShowOtpModal(false)}>
          <div className="modal-content otp-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header otp-header">
              <h2>🔐 Enter OTP</h2>
              <button className="modal-close" onClick={() => setShowOtpModal(false)}>×</button>
            </div>

            <div className="otp-content">
              <div className="otp-info-box">
                <p className="otp-message">
                  An OTP has been sent to your registered email and mobile number
                </p>
                <p className="otp-bank">
                  <strong>Bank:</strong> {paymentData.bankName}
                </p>
                <p className="otp-amount">
                  <strong>Amount:</strong> ₹{destination.price}
                </p>
              </div>

              <form onSubmit={handleOtpSubmit} className="otp-form">
                <div className="form-group">
                  <label htmlFor="otp-input">Enter 6-digit OTP</label>
                  <input
                    type="text"
                    id="otp-input"
                    placeholder="000000"
                    value={otpValue}
                    onChange={(e) => setOtpValue(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    maxLength="6"
                    autoFocus
                    required
                    className="otp-input"
                  />
                  <small className="form-hint">Enter the OTP sent to your registered contact (Use: 123456)</small>
                </div>

                <div className="otp-actions">
                  <button type="submit" className="btn btn-primary btn-verify">
                    {isProcessingPayment ? (
                      <>
                        <span className="spinner"></span>
                        Verifying...
                      </>
                    ) : (
                      <>✓ Verify & Pay</>
                    )}
                  </button>
                  <button 
                    type="button" 
                    className="btn btn-secondary" 
                    onClick={() => {
                      setShowOtpModal(false);
                      setShowConfirmationModal(true);
                    }}
                    disabled={isProcessingPayment}
                  >
                    ← Back
                  </button>
                </div>

                <p className="otp-resend">
                  Didn't receive OTP? <button type="button" className="resend-link">Resend OTP</button>
                </p>

                <div className="otp-security">
                  <p>🔒 OTP is valid for 10 minutes · Never share your OTP with anyone</p>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Overlap Warning Modal */}
      {showOverlapWarning && (
        <div className="modal-overlay" onClick={() => setShowOverlapWarning(false)}>
          <div className="modal-content overlap-warning-modal" onClick={(e) => e.stopPropagation()}>
            <div className={`modal-header ${dateConflicts.length > 0 ? 'error-header' : 'warning-header'}`}>
              <h2>{dateConflicts.length > 0 ? '🚫 Date Conflicts Detected' : '⚠️ Location Conflict Detected'}</h2>
              <button className="modal-close" onClick={() => setShowOverlapWarning(false)}>×</button>
            </div>
            
            <div className="overlap-warning-content">
              <div className="warning-message">
                {(() => {
                  const total = dateConflicts.length + locationConflicts.length;
                  if (total === 1 && !showConflictDetails) {
                    const single = dateConflicts[0] || locationConflicts[0];
                    const isDate = !!dateConflicts[0];
                    return (
                      <div className="compact-warning">
                        <p className="warning-title">
                          {isDate ? '🚫 Date Conflict' : '⚠ Location Conflict'}
                        </p>
                        <p className="compact-line">
                          {single.destinationName}, {single.country} • 📅 {new Date(single.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} – {new Date(single.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </p>
                        <button type="button" className="toggle-details" onClick={() => setShowConflictDetails(true)}>Show details</button>
                      </div>
                    );
                  }
                  return (
                    <div className="grouped-conflicts">
                      {dateConflicts.length > 0 && (
                        <div className="conflict-group">
                          <h4 className="group-title">🚫 Date Conflicts <span className="group-count">({dateConflicts.length})</span></h4>
                          <div className="overlapping-trips-list">
                            {dateConflicts.map((trip, index) => (
                              <div key={`dc-${index}`} className="overlap-trip-card">
                                <div className="overlap-trip-info">
                                  <h4>{trip.destinationName}, {trip.country}</h4>
                                  <p className="overlap-dates">📅 {new Date(trip.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} – {new Date(trip.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      {locationConflicts.length > 0 && (
                        <div className="conflict-group">
                          <h4 className="group-title">⚠ Location Conflicts <span className="group-count">({locationConflicts.length})</span></h4>
                          <div className="overlapping-trips-list">
                            {locationConflicts.map((trip, index) => (
                              <div key={`lc-${index}`} className="location-trip-card">
                                <div className="overlap-trip-info">
                                  <h4>{trip.destinationName}, {trip.country}</h4>
                                  <p className="overlap-dates">📅 {new Date(trip.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} – {new Date(trip.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      {total === 1 && showConflictDetails && (
                        <div className="details-toggle-row">
                          <button type="button" className="toggle-details" onClick={() => setShowConflictDetails(false)}>Hide details</button>
                        </div>
                      )}
                    </div>
                  );
                })()}

                <div className="new-trip-info">
                  <p className="new-trip-label">New booking:</p>
                  <div className="new-trip-details">
                    <h4>{destination.name}, {destination.country}</h4>
                    <p className="new-dates">
                      📅 {new Date(bookingData.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {new Date(bookingData.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                  </div>
                </div>

                {dateConflicts.length === 0 && (
                  <p className="warning-question">Do you want to proceed with this booking anyway?</p>
                )}
              </div>

              <div className="overlap-actions">
                {dateConflicts.length > 0 ? (
                  <>
                    <button 
                      className="btn btn-secondary" 
                      onClick={() => {
                        setShowOverlapWarning(false);
                        setShowBookingModal(true);
                      }}
                    >
                      Adjust Dates
                    </button>
                    <button 
                      className="btn btn-secondary" 
                      onClick={() => {
                        setShowOverlapWarning(false);
                        // Keep booking data so the user can resume later
                        if (lastBookingAttempt) {
                          setBookingData(lastBookingAttempt);
                        }
                      }}
                    >
                      Cancel New Booking
                    </button>
                  </>
                ) : (
                  <>
                    <button 
                      className="btn btn-primary" 
                      onClick={handleConfirmOverlap}
                    >
                      ✓ Proceed Anyway
                    </button>
                    <button 
                      className="btn btn-secondary" 
                      onClick={() => {
                        setShowOverlapWarning(false);
                        setShowBookingModal(true);
                      }}
                    >
                      Adjust Dates
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DestinationDetails;

