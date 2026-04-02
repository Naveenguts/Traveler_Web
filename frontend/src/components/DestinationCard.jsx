import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import WishlistButton from './WishlistButton';
import { externalAPI } from '../services/externalApiService';

const DestinationCard = ({ destination, imageUrl, index = 0 }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Use image URL from props, fallback to destination.image, then placeholder
  const photoFallback = externalAPI.getPhotoFallback(destination.name, 1200, 800);
  const inlineFallback = externalAPI.getInlineFallback(destination.name, 1200, 800);
  const image = imageUrl || destination.image || photoFallback;

  // Format rating
  const rating = destination.averageRating || 0;
  const reviews = destination.totalReviews || 0;
  const displayRating = rating.toFixed(1);

  // Determine popularity badge
  const isPopular = rating >= 4.5 || reviews >= 50;
  const foodTeaser = Array.isArray(destination.famousFoods) && destination.famousFoods.length > 0
    ? destination.famousFoods.slice(0, 3).map((item) => item.name || item).join(', ')
    : 'Local specialty tasting experiences';

  return (
    <div className="destination-card" style={{ animationDelay: `${index * 0.1}s` }}>
      {/* Image Wrapper with gradient overlay */}
      <div className="destination-card-image">

        {/* Skeleton loader */}
        {!imageLoaded && !imageError && (
          <div className="card-skeleton" />
        )}

        {/* Image */}
        <img
          src={image}
          alt={destination.name}
          loading="lazy"
          onLoad={() => setImageLoaded(true)}
          onError={(e) => {
            const stage = Number(e.currentTarget.dataset.fallbackStage || '0');
            if (stage === 0) {
              e.currentTarget.dataset.fallbackStage = '1';
              e.currentTarget.src = photoFallback;
              return;
            }
            if (stage === 1) {
              e.currentTarget.dataset.fallbackStage = '2';
              e.currentTarget.src = inlineFallback;
              return;
            }
            setImageError(true);
            setImageLoaded(true);
          }}
          className={imageLoaded || imageError ? 'loaded' : ''}
        />

        {/* Gradient overlay */}
        <div className="card-image-overlay" />

        {/* City name on image */}
        <div className="card-image-title">
          <h3>{destination.name}</h3>
          {destination.country && (
            <span className="card-image-country">{destination.country}</span>
          )}
        </div>

        {/* Popular badge */}
        {isPopular && (
          <div className="card-badge">Popular</div>
        )}

        {/* Wishlist button */}
        <div className="wishlist-overlay">
          <WishlistButton destination={destination} />
        </div>

        {/* Rating Badge */}
        {rating > 0 && (
          <div className="rating-badge">
            <span className="rating-stars">★ {displayRating}</span>
            <span className="rating-count">({reviews.toLocaleString()})</span>
          </div>
        )}
      </div>

      {/* Card content */}
      <div className="destination-card-content">
        <p className="destination-description">{destination.description}</p>
        <p className="destination-food-teaser">Famous for: {foodTeaser}</p>

        {destination.price && (
          <div className="destination-info">
            <div className="price-section">
              <span className="price-label">From</span>
              <span className="destination-price">${destination.price.toLocaleString()}</span>
              <span className="price-per">/ person</span>
            </div>
            {destination.duration && (
              <span className="destination-duration">{destination.duration} days</span>
            )}
          </div>
        )}

        {destination.type && (
          <span className="destination-type">{destination.type}</span>
        )}

        <Link to={`/destinations/${destination.id}`} className="explore-btn">
          Explore Now
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </Link>
      </div>
    </div>
  );
};

export default DestinationCard;

