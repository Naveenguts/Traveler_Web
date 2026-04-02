import React, { useMemo, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DestinationCard from '../components/DestinationCard';
import { useAuth } from '../context/AuthContext';
import { externalAPI } from '../services/externalApiService';

const popularDestinationsBase = [
  { id: 1, name: 'Paris', description: 'City of Lights' },
  { id: 21, name: 'Bali', description: 'Island of the Gods' },
  { id: 5, name: 'Dubai', description: 'City of Gold' },
  { id: 2, name: 'Tokyo', description: 'Land of the Rising Sun' },
  { id: 3, name: 'New York', description: 'The Big Apple' },
  { id: 4, name: 'London', description: 'The Capital of England' },
  { id: 6, name: 'Barcelona', description: 'City by the Sea' },
  { id: 7, name: 'Rome', description: 'Eternal City' },
  { id: 9, name: 'Sydney', description: 'Harbor City' },
];

// Simple catalog tagged by travel type for recommendations
const catalog = [
  { id: 101, name: 'Patagonia Trek', description: 'Epic trails and glaciers', type: 'Adventure', country: 'Argentina', image: externalAPI.getPhotoFallback('Patagonia Trek') },
  { id: 102, name: 'Maldives Escape', description: 'Overwater villas & reefs', type: 'Relaxation', country: 'Maldives', image: externalAPI.getPhotoFallback('Maldives Escape') },
  { id: 103, name: 'Tokyo Food Tour', description: 'Culinary streets & sushi', type: 'Cultural', country: 'Japan', image: externalAPI.getPhotoFallback('Tokyo Food Tour') },
  { id: 104, name: 'Swiss Alps Skiing', description: 'Powder slopes & chalets', type: 'Adventure', country: 'Switzerland', image: externalAPI.getPhotoFallback('Swiss Alps Skiing') },
  { id: 105, name: 'Bali Wellness Retreat', description: 'Yoga, spa, and beaches', type: 'Relaxation', country: 'Indonesia', image: externalAPI.getPhotoFallback('Bali Wellness Retreat') },
];

const Home = () => {
  const { preferences, alerts } = useAuth();
  const [popularDestinations, setPopularDestinations] = useState(popularDestinationsBase);
  const heroPrimaryImage = '/assets/hero.jpg';
  const heroInlineFallback = externalAPI.getInlineFallback('Discover Your Next Adventure', 1600, 900);

  // Load destination images from deterministic city resolver.
  useEffect(() => {
    let isActive = true;

    const loadImages = async () => {
      const withFallbacks = popularDestinationsBase.map((dest) => ({
        ...dest,
        image: externalAPI.getUnsplashFallback(dest.name),
      }));
      setPopularDestinations(withFallbacks);

      const resolved = await Promise.all(
        popularDestinationsBase.map(async (dest) => ({
          ...dest,
          image: await externalAPI.getCityImage(dest.name, 800),
        }))
      );

      if (isActive) {
        setPopularDestinations(resolved);
      }
    };

    loadImages();

    return () => {
      isActive = false;
    };
  }, []);

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
          backgroundImage: `url("${heroPrimaryImage}"), url("${heroInlineFallback}")`,
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

      {/* Statistics Section */}
      <section className="stats-section">
        <div className="stats-grid">
          <div className="stat-item">
            <div className="stat-number">10M+</div>
            <div className="stat-label">Happy Travelers</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">120+</div>
            <div className="stat-label">Countries</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">24/7</div>
            <div className="stat-label">Support</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">4.9</div>
            <div className="stat-label">Rating</div>
          </div>
        </div>
      </section>

      {/* Popular Destinations */}
      <section className="popular-section">
        <div className="section-header">
          <h2>Popular Destinations</h2>
        </div>

        <div className="destination-list">
          {popularDestinations.map((dest, index) => (
            <DestinationCard key={dest.id} destination={dest} index={index} />
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
          {recommended.map((dest, index) => (
            <DestinationCard key={dest.id} destination={dest} index={index} />
          ))}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section">
        <div className="section-header">
          <h2>What Travelers Say</h2>
          <p className="section-subtitle">Join thousands of satisfied explorers</p>
        </div>
        <div className="testimonials-grid">
          <div className="testimonial-card">
            <div className="testimonial-stars">⭐⭐⭐⭐⭐</div>
            <p className="testimonial-text">
              "Best travel platform I've ever used! The personalized recommendations were spot-on and saved us hours of planning."
            </p>
            <div className="testimonial-author">
              <div className="author-name">Sarah Johnson</div>
              <div className="author-location">New York, USA</div>
            </div>
          </div>
          <div className="testimonial-card">
            <div className="testimonial-stars">⭐⭐⭐⭐⭐</div>
            <p className="testimonial-text">
              "Amazing experience from start to finish. The support team was incredibly helpful and responsive throughout our trip."
            </p>
            <div className="testimonial-author">
              <div className="author-name">Michael Chen</div>
              <div className="author-location">Singapore</div>
            </div>
          </div>
          <div className="testimonial-card">
            <div className="testimonial-stars">⭐⭐⭐⭐⭐</div>
            <p className="testimonial-text">
              "User-friendly interface and great destination guides. Made planning our honeymoon so much easier!"
            </p>
            <div className="testimonial-author">
              <div className="author-name">Emma & James</div>
              <div className="author-location">London, UK</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
