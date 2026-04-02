import React from 'react';
import '../styles/ActivityCard.css';

const ActivityCard = ({ activity }) => {
  if (!activity) return null;

  // Format duration - handle both object and string formats
  const formatDuration = (duration) => {
    if (!duration) return '';
    if (typeof duration === 'string') return duration;
    if (typeof duration === 'object' && (duration.hours || duration.minutes)) {
      const parts = [];
      if (duration.hours) parts.push(`${duration.hours}h`);
      if (duration.minutes) parts.push(`${duration.minutes}m`);
      return parts.join(' ');
    }
    return '';
  };

  const discountPercent = activity.originalPrice
    ? Math.round(((activity.originalPrice - activity.basePrice) / activity.originalPrice) * 100)
    : 0;

  return (
    <div className="activity-card">
      {/* Image Container */}
      <div className="activity-card-image">
        {activity.images && activity.images.length > 0 && (
          <img
            src={typeof activity.images[0] === 'string' ? activity.images[0] : activity.images[0].url}
            alt={activity.name}
            className="activity-image"
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/300x200?text=Activity';
            }}
          />
        )}

        {/* Discount Badge */}
        {discountPercent > 0 && (
          <div className="discount-badge">-{discountPercent}%</div>
        )}

        {/* Rating Badge */}
        {activity.averageRating && (
          <div className="rating-badge-card">
            <span className="stars">★ {activity.averageRating.toFixed(1)}</span>
            <span className="reviews">({activity.totalReviews || 0})</span>
          </div>
        )}

        {/* Free Cancellation Badge */}
        {activity.freeCancel && (
          <div className="free-cancel-badge">Free Cancellation</div>
        )}
      </div>

      {/* Card Content */}
      <div className="activity-card-content">
        {/* Category */}
        {activity.category && (
          <span className="activity-category">{activity.category}</span>
        )}

        {/* Title */}
        <h3 className="activity-card-title">{activity.name}</h3>

        {/* Location */}
        <div className="activity-location">
          📍 {activity.destination || activity.location}
        </div>

        {/* Duration & Group */}
        <div className="activity-meta-info">
          {formatDuration(activity.duration) && (
            <span className="meta-item">
              ⏱️ {formatDuration(activity.duration)}
            </span>
          )}
          {activity.maxGroupSize && (
            <span className="meta-item">👥 Up to {activity.maxGroupSize}</span>
          )}
        </div>

        {/* Description */}
        {activity.shortDescription && (
          <p className="activity-description">{activity.shortDescription}</p>
        )}

        {/* Features */}
        <div className="activity-features">
          {activity.freeCancel && (
            <div className="feature-item">
              <span className="feature-icon">✓</span>
              <span>Free Cancellation</span>
            </div>
          )}
          {activity.reserveNowPayLater && (
            <div className="feature-item">
              <span className="feature-icon">💳</span>
              <span>Pay Later</span>
            </div>
          )}
        </div>

        {/* Pricing */}
        <div className="activity-footer">
          <div className="activity-price">
            <span className="price-current">
              ${activity.basePrice.toFixed(0)}
            </span>
            {activity.originalPrice && activity.originalPrice > activity.basePrice && (
              <span className="price-original">
                ${activity.originalPrice.toFixed(0)}
              </span>
            )}
            <span className="price-per-person">/person</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityCard;
