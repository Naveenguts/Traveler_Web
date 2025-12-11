import React, { useState } from 'react';
import DestinationCard from '../components/DestinationCard';

const destinationsData = [
  { id: 1, name: 'Paris', description: 'City of Lights', image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400&h=300&fit=crop' },
  { id: 2, name: 'Tokyo', description: 'Land of the Rising Sun', image: 'https://images.unsplash.com/photo-1540959375944-7049f642e9a4?w=400&h=300&fit=crop' },
  { id: 3, name: 'New York', description: 'The Big Apple', image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=400&h=300&fit=crop' },
  { id: 4, name: 'London', description: 'The Capital of England', image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=400&h=300&fit=crop' },
  { id: 5, name: 'Dubai', description: 'City of Gold', image: 'https://images.unsplash.com/photo-1512453693020-ce7e46f9e4c9?w=400&h=300&fit=crop' },
  { id: 6, name: 'Barcelona', description: 'City by the Sea', image: 'https://images.unsplash.com/photo-1562883676-8c6fbdf495c0?w=400&h=300&fit=crop' },
];

const Destinations = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredDestinations = destinationsData.filter(dest =>
    dest.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="destinations">
      <h2>Destinations</h2>
      
      <div className="search-container">
        <input
          type="text"
          className="search-bar"
          placeholder="Search destinations by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {searchTerm && (
          <button
            className="search-clear-btn"
            onClick={() => setSearchTerm('')}
          >
            ✕
          </button>
        )}
      </div>

      <div className="destination-list">
        {filteredDestinations.length > 0 ? (
          filteredDestinations.map(dest => (
            <DestinationCard key={dest.id} destination={dest} />
          ))
        ) : (
          <div className="no-results">
            <p>No destinations found matching "{searchTerm}"</p>
            <p className="suggestion">Try searching for: Paris, Tokyo, New York, London, Dubai, or Barcelona</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Destinations;

