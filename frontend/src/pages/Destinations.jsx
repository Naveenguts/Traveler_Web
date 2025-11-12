import React from 'react';
import DestinationCard from '../components/DestinationCard';

const destinationsData = [
  { id: 1, name: 'Paris', description: 'City of Lights', image: 'https://source.unsplash.com/300x200/?paris' },
  { id: 2, name: 'Tokyo', description: 'Land of the Rising Sun', image: 'https://source.unsplash.com/300x200/?tokyo' },
  { id: 3, name: 'New York', description: 'The Big Apple', image: 'https://source.unsplash.com/300x200/?newyork' },
];

const Destinations = () => {
  return (
    <div className="destinations">
      <h2>Popular Destinations</h2>
      <div className="destination-list">
        {destinationsData.map(dest => (
          <DestinationCard key={dest.id} destination={dest} />
        ))}
      </div>
    </div>
  );
};

export default Destinations;

