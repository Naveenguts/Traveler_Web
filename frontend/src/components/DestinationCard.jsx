import React from 'react';
import { Link } from 'react-router-dom';

const DestinationCard = ({ destination }) => {
  return (
    <div className="destination-card">
      <img src={destination.image} alt={destination.name} />
      <h3>{destination.name}</h3>
      <p>{destination.description}</p>
      <Link to={`/destinations/${destination.id}`}>View Details</Link>
    </div>
  );
};

export default DestinationCard;
