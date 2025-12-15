import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import DestinationCard from '../components/DestinationCard';
import { useAuth } from '../context/AuthContext';

const popularDestinations = [
  { id: 1, name: 'Paris', description: 'City of Lights', image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=1200&auto=format&fit=crop' },
  { id: 2, name: 'Bali', description: 'Island of the Gods', image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1200&auto=format&fit=crop' },
  { id: 3, name: 'Dubai', description: 'City of Gold', image: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?q=80&w=1200&auto=format&fit=crop' },
];

// Simple catalog tagged by travel type for recommendations
const catalog = [
  { id: 101, name: 'Patagonia Trek', description: 'Epic trails and glaciers', type: 'Adventure', country: 'Argentina', image: 'https://images.unsplash.com/photo-1549880338-65ddcdfd017b?q=80&w=1200&auto=format&fit=crop' },
  { id: 102, name: 'Maldives Escape', description: 'Overwater villas & reefs', type: 'Relaxation', country: 'Maldives', image: 'https://images.unsplash.com/photo-1531168556467-84f7f3c98d2c?q=80&w=1200&auto=format&fit=crop' },
  { id: 103, name: 'Tokyo Food Tour', description: 'Culinary streets & sushi', type: 'Cultural', country: 'Japan', image: 'https://images.unsplash.com/photo-1552465011-9e20e3e9e5f3?q=80&w=1200&auto=format&fit=crop' },
  { id: 104, name: 'Swiss Alps Skiing', description: 'Powder slopes & chalets', type: 'Adventure', country: 'Switzerland', image: 'https://images.unsplash.com/photo-1518684079-3c830dcef090?q=80&w=1200&auto=format&fit=crop' },
  { id: 105, name: 'Bali Wellness Retreat', description: 'Yoga, spa, and beaches', type: 'Relaxation', country: 'Indonesia', image: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?q=80&w=1200&auto=format&fit=crop' },
];

const Home = () => {
  const { preferences, alerts } = useAuth();

  const recommended = useMemo(() => {
    if (!preferences?.travelType) return catalog.slice(0, 3);
    const primary = catalog.filter((c) => c.type === preferences.travelType);
    const fill = catalog.filter((c) => c.type !== preferences.travelType).slice(0, Math.max(0, 3 - primary.length));
    return [...primary.slice(0, 3), ...fill];
  }, [preferences]);

  return (
    <div className="home-page">
      {/* Alerts Banner */}
      {alerts && alerts.length > 0 && (
        <div className="alerts-banner">
          {alerts.map((a) => (
            <div key={a.id} className="alert-item">{a.message}</div>
          ))}
        </div>
      )}
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
          <p>Tailored for you: {preferences?.travelType || 'Adventure'} trips 🌎</p>
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

      {/* Recommended For You */}
      <section className="popular-section">
        <div className="section-header">
          <h2>Recommended For You</h2>
          <p className="section-subtitle">Based on your preference: {preferences?.travelType || 'Adventure'}</p>
        </div>

        <div className="destination-list">
          {recommended.map((dest) => (
            <DestinationCard key={dest.id} destination={dest} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
