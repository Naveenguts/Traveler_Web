import React from 'react';
import { Link } from 'react-router-dom';
import DestinationCard from '../components/DestinationCard';

const popularDestinations = [
  { id: 1, name: 'Paris', description: 'City of Lights', image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=1200&auto=format&fit=crop' },
  { id: 2, name: 'Bali', description: 'Island of the Gods', image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1200&auto=format&fit=crop' },
  { id: 3, name: 'London', description: 'Historic and Modern', image: 'https://images.unsplash.com/photo-1462804993656-fac4ff489837?q=80&w=1200&auto=format&fit=crop' },
  { id: 4, name: 'Dubai', description: 'City of Gold', image: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?q=80&w=1200&auto=format&fit=crop' },
];

const Home = () => {
  return (
    <div className="home-page">
      {/* Hero Section */}
      <section
        className="home-hero"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1600&auto=format&fit=crop')",
        }}
      >
        <div className="hero-overlay">
          <h1>Discover Your Next Adventure</h1>
          <p>Explore amazing destinations around the world! 🌎</p>
          <Link to="/destinations" className="btn btn-hero">
            Explore Destinations
          </Link>
        </div>
      </section>

      {/* Popular Destinations */}
      <section className="popular-section">
        <div className="section-header">
          <h2>Popular Destinations</h2>
        </div>

        <div className="destination-list">
          {popularDestinations.map((dest) => (
            <DestinationCard key={dest.id} destination={dest} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
