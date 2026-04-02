import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import activityService from '../services/activityService';
import '../styles/ActivityDetail.css';

const ActivityDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activity, setActivity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [guests, setGuests] = useState(1);
  const [showBookingForm, setShowBookingForm] = useState(false);

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        setLoading(true);
        const data = await activityService.getActivityDetail(id);
        setActivity(data.activity);
        setError(null);
      } catch (err) {
        console.error('Error fetching activity:', err);
        setError('Failed to load activity details. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchActivity();
  }, [id]);

  if (loading) {
    return (
      <div className="activity-detail-container">
        <div className="loading">Loading activity details...</div>
      </div>
    );
  }

  if (error || !activity) {
    return (
      <div className="activity-detail-container">
        <div className="error-message">
          {error || 'Activity not found'}
          <button onClick={() => navigate(-1)} className="btn-back">
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const totalPrice = activity.basePrice * guests;
  const savings = activity.originalPrice ? (activity.originalPrice - activity.basePrice) * guests : 0;

  const handlePreviousImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? activity.images.length - 1 : prev - 1
    );
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === activity.images.length - 1 ? 0 : prev + 1
    );
  };

  return (
    <div className="activity-detail-container">
      {/* Image Gallery */}
      <div className="gallery-section">
        <div className="main-image-wrapper">
          {activity.images && activity.images.length > 0 && (
            <>
              <img
                src={activity.images[currentImageIndex]}
                alt={activity.name}
                className="main-image"
              />
              {activity.images.length > 1 && (
                <>
                  <button className="gallery-btn prev-btn" onClick={handlePreviousImage}>
                    ‹
                  </button>
                  <button className="gallery-btn next-btn" onClick={handleNextImage}>
                    ›
                  </button>
                  <div className="image-counter">
                    {currentImageIndex + 1} / {activity.images.length}
                  </div>
                </>
              )}
            </>
          )}
        </div>

        {/* Thumbnail strip */}
        {activity.images && activity.images.length > 1 && (
          <div className="thumbnails">
            {activity.images.map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt={`${activity.name} ${idx + 1}`}
                className={`thumbnail ${idx === currentImageIndex ? 'active' : ''}`}
                onClick={() => setCurrentImageIndex(idx)}
              />
            ))}
          </div>
        )}
      </div>

      <div className="activity-content">
        {/* Header */}
        <div className="activity-header">
          <div>
            <h1 className="activity-title">{activity.name}</h1>
            <div className="activity-meta">
              <span className="location">📍 {activity.destination}, {activity.country}</span>
              {activity.category && <span className="category">{activity.category}</span>}
            </div>
          </div>

          {/* Rating */}
          {activity.averageRating && (
            <div className="rating-section">
              <div className="rating-badge">
                <span className="stars">★ {activity.averageRating.toFixed(1)}</span>
                <span className="review-count">({activity.reviewCount || 0} reviews)</span>
              </div>
            </div>
          )}
        </div>

        {/* Quick Info */}
        <div className="quick-info">
          {activity.duration && (
            <div className="info-item">
              <span className="info-icon">⏱️</span>
              <span>
                {activity.duration.hours}h {activity.duration.minutes}m
              </span>
            </div>
          )}
          {activity.maxGroupSize && (
            <div className="info-item">
              <span className="info-icon">👥</span>
              <span>Up to {activity.maxGroupSize} guests</span>
            </div>
          )}
          {activity.freeCancel && (
            <div className="info-item free-cancel">
              <span className="info-icon">✓</span>
              <span>Free cancellation</span>
            </div>
          )}
          {activity.reserveNowPayLater && (
            <div className="info-item pay-later">
              <span className="info-icon">💳</span>
              <span>Reserve now, pay later</span>
            </div>
          )}
        </div>

        {/* Main Content Grid */}
        <div className="content-grid">
          {/* Left Column - Description & Details */}
          <div className="left-column">
            {/* Short Description */}
            {activity.shortDescription && (
              <div className="description-section">
                <h3>About This Activity</h3>
                <p className="short-description">{activity.shortDescription}</p>
              </div>
            )}

            {/* Full Description */}
            {activity.fullDescription && (
              <div className="description-section">
                <h3>Full Description</h3>
                <p className="full-description">{activity.fullDescription}</p>
              </div>
            )}

            {/* Highlights */}
            {activity.highlights && activity.highlights.length > 0 && (
              <div className="section-box">
                <h3>✨ Highlights</h3>
                <ul className="highlights-list">
                  {activity.highlights.map((highlight, idx) => (
                    <li key={idx}>{highlight}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* What's Included */}
            {activity.includes && activity.includes.length > 0 && (
              <div className="section-box included">
                <h3>✓ What's Included</h3>
                <ul className="includes-list">
                  {activity.includes.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* What's Not Included */}
            {activity.excludes && activity.excludes.length > 0 && (
              <div className="section-box excluded">
                <h3>✗ Not Included</h3>
                <ul className="excludes-list">
                  {activity.excludes.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* What to Bring */}
            {activity.whatToBring && activity.whatToBring.length > 0 && (
              <div className="section-box">
                <h3>🎒 What to Bring</h3>
                <ul className="items-list">
                  {activity.whatToBring.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Not Allowed */}
            {activity.notAllowed && activity.notAllowed.length > 0 && (
              <div className="section-box">
                <h3>⛔ Not Allowed</h3>
                <ul className="items-list">
                  {activity.notAllowed.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Know Before You Go */}
            {activity.knowBeforeYouGo && activity.knowBeforeYouGo.length > 0 && (
              <div className="section-box">
                <h3>ℹ️ Know Before You Go</h3>
                <ul className="items-list">
                  {activity.knowBeforeYouGo.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Provider Info */}
            {activity.provider && (
              <div className="section-box provider-section">
                <h3>👤 Operated By</h3>
                <div className="provider-info">
                  <h4>{activity.provider.name}</h4>
                  {activity.provider.rating && (
                    <p>
                      ⭐ {activity.provider.rating} ({activity.provider.reviewCount} reviews)
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Booking & Pricing */}
          <aside className="right-column">
            {/* Pricing Card */}
            <div className="pricing-card">
              <div className="price-display">
                <div className="price-main">
                  <span className="currency">$</span>
                  <span className="amount">{activity.basePrice.toFixed(0)}</span>
                  <span className="per-person">/person</span>
                </div>
                {activity.originalPrice && activity.originalPrice > activity.basePrice && (
                  <div className="price-original">
                    <span className="strikethrough">${activity.originalPrice.toFixed(0)}</span>
                    <span className="saving">
                      Save ${(activity.originalPrice - activity.basePrice).toFixed(0)}
                    </span>
                  </div>
                )}
              </div>

              {/* Booking Form */}
              <div className="booking-form">
                <div className="form-group">
                  <label htmlFor="date">Select Date</label>
                  <input
                    type="date"
                    id="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="guests">Number of Guests</label>
                  <div className="guest-selector">
                    <button
                      className="btn-adjust"
                      onClick={() => setGuests(Math.max(1, guests - 1))}
                    >
                      −
                    </button>
                    <input
                      type="number"
                      id="guests"
                      min="1"
                      max={activity.maxGroupSize || 20}
                      value={guests}
                      onChange={(e) => setGuests(Math.min(activity.maxGroupSize || 20, parseInt(e.target.value) || 1))}
                    />
                    <button
                      className="btn-adjust"
                      onClick={() =>
                        setGuests(Math.min(activity.maxGroupSize || 20, guests + 1))
                      }
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="price-summary">
                  <div className="summary-row">
                    <span>Price per person:</span>
                    <span>${activity.basePrice.toFixed(2)}</span>
                  </div>
                  <div className="summary-row">
                    <span>Number of guests:</span>
                    <span>{guests}</span>
                  </div>
                  {savings > 0 && (
                    <div className="summary-row savings">
                      <span>Total savings:</span>
                      <span>-${savings.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="summary-row total">
                    <span>Total:</span>
                    <span>${totalPrice.toFixed(2)}</span>
                  </div>
                </div>

                <button className="btn-reserve">Reserve Now</button>
                {activity.reserveNowPayLater && (
                  <button className="btn-pay-later">Reserve & Pay Later</button>
                )}
              </div>

              {/* Trust Badges */}
              <div className="trust-badges">
                {activity.freeCancel && (
                  <div className="badge">
                    <span>🔙</span>
                    <span>Free cancellation up to {activity.freeCancelHours || 24} hours</span>
                  </div>
                )}
                {activity.reserveNowPayLater && (
                  <div className="badge">
                    <span>💳</span>
                    <span>Reserve now, pay later</span>
                  </div>
                )}
                <div className="badge">
                  <span>✓</span>
                  <span>Instant confirmation</span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default ActivityDetail;
