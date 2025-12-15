import React, { useState } from 'react';
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
  const { user, addTrip } = useAuth();
  const destination = destinationsData.find(dest => dest.id === parseInt(id));
  
  const [reviews, setReviews] = useState(initialReviews[parseInt(id)] || []);
  const [newReview, setNewReview] = useState({ rating: 0, comment: '' });
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingData, setBookingData] = useState({
    startDate: '',
    endDate: '',
    description: ''
  });

  if (!destination) return <p>Destination not found!</p>;

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

    const trip = addTrip({
      destinationName: destination.name,
      country: `${destination.country}`,
      startDate: bookingData.startDate,
      endDate: bookingData.endDate,
      description: bookingData.description || `Trip to ${destination.name}`,
      coverImage: destination.image,
      price: destination.price,
      duration: destination.duration
    });

    setShowBookingModal(false);
    setBookingData({ startDate: '', endDate: '', description: '' });
    
    // Optional: Navigate to my trips page
    // navigate('/my-trips');
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
              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowBookingModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Confirm Booking
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DestinationDetails;
