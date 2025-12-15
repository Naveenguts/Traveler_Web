import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../styles/MyTrips.css';

const MyTrips = () => {
  const { user, trips, tripsLoading, cancelTrip: cancelTripContext, deleteTrip } = useAuth();
  const navigate = useNavigate();
  const [filter, setFilter] = useState('all'); // all, upcoming, completed, cancelled

  // Filter trips based on selected filter
  const filteredTrips = trips.filter(trip => {
    if (filter === 'all') return true;
    return trip.status === filter;
  });

  // Separate upcoming and completed trips for organized display
  const upcomingTrips = filteredTrips.filter(trip => trip.status === 'upcoming');
  const completedTrips = filteredTrips.filter(trip => trip.status === 'completed');
  const cancelledTrips = filteredTrips.filter(trip => trip.status === 'cancelled');

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
  };

  const handleViewDetails = (tripId) => {
    // Navigate to trip details page
    console.log('View details for trip:', tripId);
    // navigate(`/trips/${tripId}`);
  };

  const handleDownloadItinerary = (tripId) => {
    console.log('Download itinerary for trip:', tripId);
    alert('Itinerary download feature - Coming soon!');
  };

  const handleCancelTrip = (tripId) => {
    const confirmed = window.confirm('Are you sure you want to cancel this trip?');
    if (confirmed) {
      cancelTripContext(tripId);
    }
  };

  const handleWriteReview = (tripId) => {
    console.log('Write review for trip:', tripId);
    alert('Write Review feature - Coming soon!');
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'upcoming': return 'status-upcoming';
      case 'completed': return 'status-completed';
      case 'cancelled': return 'status-cancelled';
      default: return '';
    }
  };

  const renderTripCard = (trip) => (
    <div key={trip._id} className="trip-card">
      <div className="trip-card-image">
        <img src={trip.coverImage} alt={trip.destinationName} />
        <span className={`trip-status ${getStatusClass(trip.status)}`}>
          {trip.status.charAt(0).toUpperCase() + trip.status.slice(1)}
        </span>
      </div>
      <div className="trip-card-content">
        <div className="trip-header">
          <h3>{trip.destinationName}</h3>
          <span className="trip-country">{trip.country}</span>
        </div>
        <p className="trip-dates">
          {formatDate(trip.startDate)} – {formatDate(trip.endDate)}
        </p>
        <p className="trip-description">{trip.description}</p>
        <div className="trip-actions">
          <button className="btn-primary" onClick={() => handleViewDetails(trip._id)}>
            View Details
          </button>
          {trip.status === 'upcoming' && (
            <>
              <button className="btn-secondary" onClick={() => handleDownloadItinerary(trip._id)}>
                Download Itinerary
              </button>
              <button className="btn-danger" onClick={() => handleCancelTrip(trip._id)}>
                Cancel Trip
              </button>
            </>
          )}
          {trip.status === 'completed' && (
            <button className="btn-secondary" onClick={() => handleWriteReview(trip._id)}>
              Write Review
            </button>
          )}
        </div>
      </div>
    </div>
  );

  // Loading state
  if (tripsLoading) {
    return (
      <div className="my-trips-page">
        <div className="trips-header">
          <h1>My Trips</h1>
        </div>
        <div className="empty-state">
          <div className="loading-spinner">Loading your trips...</div>
        </div>
      </div>
    );
  }

  // Empty state
  if (trips.length === 0 || filteredTrips.length === 0) {
    return (
      <div className="my-trips-page">
        <div className="trips-header">
          <h1>My Trips</h1>
        </div>
        <div className="empty-state">
          <div className="empty-icon">✈️</div>
          <h2>You have no trips yet</h2>
          <p>Start exploring amazing destinations!</p>
          <button className="btn-explore" onClick={() => navigate('/destinations')}>
            Explore Destinations
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="my-trips-page">
      <div className="trips-header">
        <h1>My Trips</h1>
        <div className="trip-filters">
          <button 
            className={filter === 'all' ? 'filter-btn active' : 'filter-btn'}
            onClick={() => setFilter('all')}
          >
            All Trips
          </button>
          <button 
            className={filter === 'upcoming' ? 'filter-btn active' : 'filter-btn'}
            onClick={() => setFilter('upcoming')}
          >
            Upcoming
          </button>
          <button 
            className={filter === 'completed' ? 'filter-btn active' : 'filter-btn'}
            onClick={() => setFilter('completed')}
          >
            Completed
          </button>
          <button 
            className={filter === 'cancelled' ? 'filter-btn active' : 'filter-btn'}
            onClick={() => setFilter('cancelled')}
          >
            Cancelled
          </button>
        </div>
      </div>

      <div className="trips-container">
        {(filter === 'all' || filter === 'upcoming') && upcomingTrips.length > 0 && (
          <div className="trips-section">
            <h2 className="section-title">Upcoming Trips</h2>
            <div className="trips-grid">
              {upcomingTrips.map(trip => renderTripCard(trip))}
            </div>
          </div>
        )}

        {(filter === 'all' || filter === 'completed') && completedTrips.length > 0 && (
          <div className="trips-section">
            <h2 className="section-title">Completed Trips</h2>
            <div className="trips-grid">
              {completedTrips.map(trip => renderTripCard(trip))}
            </div>
          </div>
        )}

        {(filter === 'all' || filter === 'cancelled') && cancelledTrips.length > 0 && (
          <div className="trips-section">
            <h2 className="section-title">Cancelled Trips</h2>
            <div className="trips-grid">
              {cancelledTrips.map(trip => renderTripCard(trip))}
            </div>
          </div>
        )}

        {filteredTrips.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon">🔍</div>
            <h2>No {filter} trips found</h2>
            <p>Try adjusting your filters</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyTrips;
