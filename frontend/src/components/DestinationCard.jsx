import React from 'react';
import { Link } from 'react-router-dom';

const DestinationCard = ({ destination }) => {
  return (
    <div className="destination-card">
      <img src={destination.image} alt={destination.name} />
      <div className="destination-card-content">
        <h3>{destination.name}</h3>
        {destination.country && <p className="destination-country">📍 {destination.country}</p>}
        <p className="destination-description">{destination.description}</p>
        
        {destination.price && (
          <div className="destination-info">
            <span className="destination-price">💵 ${destination.price}</span>
            {destination.duration && (
              <span className="destination-duration">⏱️ {destination.duration} days</span>
            )}
          </div>
        )}
        
        {destination.type && (
          <span className="destination-type">{destination.type}</span>
        )}
        
        <Link to={`/destinations/${destination.id}`} className="view-details-link">
          View Details →
        </Link>
      </div>
    </div>
  );
};

export default DestinationCard;
