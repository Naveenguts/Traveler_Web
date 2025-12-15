import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import '../styles/Wishlist.css';

const Wishlist = () => {
  const { wishlist, removeFromWishlist, clearWishlist } = useAuth();
  const [sortBy, setSortBy] = useState('recent');

  const getSortedWishlist = () => {
    const items = [...wishlist];
    
    switch (sortBy) {
      case 'name':
        return items.sort((a, b) => a.name.localeCompare(b.name));
      case 'rating':
        return items.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      case 'recent':
      default:
        return items.sort((a, b) => new Date(b.addedAt) - new Date(a.addedAt));
    }
  };

  const sortedWishlist = getSortedWishlist();

  const handleRemove = (id) => {
    removeFromWishlist(id);
  };

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to clear all items from your wishlist?')) {
      clearWishlist();
    }
  };

  return (
    <div className="wishlist-page">
      <div className="wishlist-container">
        {/* Wishlist Header */}
        <div className="wishlist-header">
          <div className="header-content">
            <h1>❤️ My Wishlist</h1>
            <p className="header-subtitle">
              {wishlist.length === 0 
                ? 'Your wishlist is empty. Start adding your dream destinations!' 
                : `You have ${wishlist.length} destination${wishlist.length !== 1 ? 's' : ''} in your wishlist`}
            </p>
          </div>
          {wishlist.length > 0 && (
            <button onClick={handleClearAll} className="btn btn-danger">
              Clear All
            </button>
          )}
        </div>

        {/* Wishlist Controls */}
        {wishlist.length > 0 && (
          <div className="wishlist-controls">
            <div className="sort-controls">
              <label htmlFor="sort-by">Sort by:</label>
              <select 
                id="sort-by"
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)}
                className="sort-select"
              >
                <option value="recent">Recently Added</option>
                <option value="name">Name (A-Z)</option>
                <option value="rating">Rating (High to Low)</option>
              </select>
            </div>
            <div className="wishlist-stats">
              <span className="stat-item">
                <strong>{wishlist.length}</strong> Destination{wishlist.length !== 1 ? 's' : ''}
              </span>
            </div>
          </div>
        )}

        {/* Wishlist Items */}
        {wishlist.length > 0 ? (
          <div className="wishlist-grid">
            {sortedWishlist.map((destination) => (
              <div key={destination.id} className="wishlist-card">
                <div className="wishlist-card-image">
                  <img 
                    src={destination.image || 'https://via.placeholder.com/300x200?text=Destination'} 
                    alt={destination.name}
                  />
                  <button 
                    onClick={() => handleRemove(destination.id)}
                    className="remove-btn"
                    title="Remove from wishlist"
                  >
                    ✕
                  </button>
                </div>
                
                <div className="wishlist-card-content">
                  <h3 className="destination-name">{destination.name}</h3>
                  
                  {destination.country && (
                    <p className="destination-country">
                      📍 {destination.country}
                    </p>
                  )}

                  {destination.description && (
                    <p className="destination-description">
                      {destination.description.substring(0, 100)}...
                    </p>
                  )}

                  <div className="destination-info">
                    {destination.rating && (
                      <div className="rating-section">
                        <span className="rating-star">⭐</span>
                        <span className="rating-value">{destination.rating.toFixed(1)}</span>
                      </div>
                    )}
                    
                    {destination.price && (
                      <div className="price-section">
                        <span className="price">${destination.price}</span>
                        <span className="price-label">/ person</span>
                      </div>
                    )}
                  </div>

                  {destination.addedAt && (
                    <p className="added-date">
                      Added: {new Date(destination.addedAt).toLocaleDateString()}
                    </p>
                  )}

                  <Link 
                    to={`/destinations/${destination.id}`}
                    className="view-btn"
                  >
                    View Details →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-wishlist">
            <div className="empty-icon">🎒</div>
            <h2>Your Wishlist is Empty</h2>
            <p>Start exploring and add your favorite destinations to your wishlist!</p>
            <Link to="/destinations" className="btn btn-primary">
              Browse Destinations
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
