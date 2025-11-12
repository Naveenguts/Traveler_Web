import React from 'react';
import { useParams } from 'react-router-dom';

const destinationsData = [
  { id: 1, name: 'Paris', description: 'City of Lights', image: 'https://source.unsplash.com/600x400/?paris' },
  { id: 2, name: 'Tokyo', description: 'Land of the Rising Sun', image: 'https://source.unsplash.com/600x400/?tokyo' },
  { id: 3, name: 'New York', description: 'The Big Apple', image: 'https://source.unsplash.com/600x400/?newyork' },
];

const DestinationDetails = () => {
  const { id } = useParams();
  const destination = destinationsData.find(dest => dest.id === parseInt(id));

  if (!destination) return <p>Destination not found!</p>;

  return (
    <div className="destination-details">
      <h2>{destination.name}</h2>
      <img src={destination.image} alt={destination.name} />
      <p>{destination.description}</p>
    </div>
  );
};

export default DestinationDetails;
