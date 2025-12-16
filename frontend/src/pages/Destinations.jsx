import React, { useState } from 'react';
import '../styles/Destinations.css';
import DestinationCard from '../components/DestinationCard';

const destinationsData = [
  { id: 1, name: 'Paris', country: 'France', description: 'City of Lights', image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400&h=300&fit=crop', price: 2500, duration: 7, type: 'City', popularity: 95, date: '2024-01-15' },
  { id: 2, name: 'Tokyo', country: 'Japan', description: 'Land of the Rising Sun', image: 'https://images.unsplash.com/photo-1540959375944-7049f642e9a4?w=400&h=300&fit=crop', price: 3200, duration: 10, type: 'City', popularity: 92, date: '2024-02-20' },
  { id: 3, name: 'New York', country: 'USA', description: 'The Big Apple', image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=400&h=300&fit=crop', price: 2800, duration: 5, type: 'City', popularity: 88, date: '2024-03-10' },
  { id: 4, name: 'London', country: 'UK', description: 'The Capital of England', image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=400&h=300&fit=crop', price: 2200, duration: 6, type: 'City', popularity: 90, date: '2024-04-05' },
  { id: 5, name: 'Dubai', country: 'UAE', description: 'City of Gold', image: 'https://images.unsplash.com/photo-1512453693020-ce7e46f9e4c9?w=400&h=300&fit=crop', price: 3500, duration: 8, type: 'City', popularity: 85, date: '2024-05-12' },
  { id: 6, name: 'Barcelona', country: 'Spain', description: 'City by the Sea', image: 'https://images.unsplash.com/photo-1562883676-8c6fbdf495c0?w=400&h=300&fit=crop', price: 1800, duration: 5, type: 'Beach', popularity: 87, date: '2024-06-18' },
];

const Destinations = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    country: '',
    priceRange: '',
    duration: '',
    type: ''
  });
  const [sortBy, setSortBy] = useState('');

  // Get unique values for filter options
  const countries = [...new Set(destinationsData.map(dest => dest.country))].sort();
  const types = [...new Set(destinationsData.map(dest => dest.type))].sort();

  // Apply filters and search
  let filteredDestinations = destinationsData.filter(dest => {
    // Search filter
    const matchesSearch = dest.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          dest.country.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Country filter
    const matchesCountry = !filters.country || dest.country === filters.country;
    
    // Price range filter
    let matchesPrice = true;
    if (filters.priceRange) {
      const price = dest.price;
      switch (filters.priceRange) {
        case 'under2000':
          matchesPrice = price < 2000;
          break;
        case '2000-2500':
          matchesPrice = price >= 2000 && price <= 2500;
          break;
        case '2500-3000':
          matchesPrice = price >= 2500 && price <= 3000;
          break;
        case 'over3000':
          matchesPrice = price > 3000;
          break;
        default:
          matchesPrice = true;
      }
    }
    
    // Duration filter
    let matchesDuration = true;
    if (filters.duration) {
      const duration = dest.duration;
      switch (filters.duration) {
        case 'short':
          matchesDuration = duration <= 5;
          break;
        case 'medium':
          matchesDuration = duration > 5 && duration <= 8;
          break;
        case 'long':
          matchesDuration = duration > 8;
          break;
        default:
          matchesDuration = true;
      }
    }
    
    // Type filter
    const matchesType = !filters.type || dest.type === filters.type;
    
    return matchesSearch && matchesCountry && matchesPrice && matchesDuration && matchesType;
  });

  // Apply sorting
  if (sortBy) {
    filteredDestinations = [...filteredDestinations].sort((a, b) => {
      switch (sortBy) {
        case 'price-low-high':
          return a.price - b.price;
        case 'price-high-low':
          return b.price - a.price;
        case 'popular':
          return b.popularity - a.popularity;
        case 'newest':
          return new Date(b.date) - new Date(a.date);
        default:
          return 0;
      }
    });
  }

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      country: '',
      priceRange: '',
      duration: '',
      type: ''
    });
    setSortBy('');
    setSearchTerm('');
  };

  return (
    <div className="destinations">
      <div className="destinations-header">
        <h2>Travel Destinations</h2>
        <p className="destinations-subtitle">Explore amazing destinations around the world</p>
      </div>
      
      {/* Search Bar */}
      <div className="search-container">
        <input
          type="text"
          className="search-bar"
          placeholder="Search destinations by name or country..."
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

      {/* Filters and Sorting Section */}
      <div className="filters-section">
        <div className="filters-container">
          <h3 className="filters-title">Filters</h3>
          
          <div className="filter-group">
            <label htmlFor="country-filter">Country</label>
            <select
              id="country-filter"
              className="filter-select"
              value={filters.country}
              onChange={(e) => handleFilterChange('country', e.target.value)}
            >
              <option value="">All Countries</option>
              {countries.map(country => (
                <option key={country} value={country}>{country}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="price-filter">Price Range</label>
            <select
              id="price-filter"
              className="filter-select"
              value={filters.priceRange}
              onChange={(e) => handleFilterChange('priceRange', e.target.value)}
            >
              <option value="">All Prices</option>
              <option value="under2000">Under $2,000</option>
              <option value="2000-2500">$2,000 - $2,500</option>
              <option value="2500-3000">$2,500 - $3,000</option>
              <option value="over3000">Over $3,000</option>
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="duration-filter">Duration</label>
            <select
              id="duration-filter"
              className="filter-select"
              value={filters.duration}
              onChange={(e) => handleFilterChange('duration', e.target.value)}
            >
              <option value="">All Durations</option>
              <option value="short">Short (≤5 days)</option>
              <option value="medium">Medium (6-8 days)</option>
              <option value="long">Long (≥9 days)</option>
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="type-filter">Type</label>
            <select
              id="type-filter"
              className="filter-select"
              value={filters.type}
              onChange={(e) => handleFilterChange('type', e.target.value)}
            >
              <option value="">All Types</option>
              {types.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <button className="clear-filters-btn" onClick={clearFilters}>
            Clear All Filters
          </button>
        </div>

        {/* Sorting Section */}
        <div className="sorting-container">
          <label htmlFor="sort-select">Sort By:</label>
          <select
            id="sort-select"
            className="sort-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="">Default</option>
            <option value="price-low-high">Price: Low to High</option>
            <option value="price-high-low">Price: High to Low</option>
            <option value="popular">Most Popular</option>
            <option value="newest">Newest</option>
          </select>
        </div>
      </div>

      {/* Results Count */}
      <div className="results-info">
        <p>Showing {filteredDestinations.length} destination{filteredDestinations.length !== 1 ? 's' : ''}</p>
      </div>

      {/* Destination List */}
      <div className="destination-list">
        {filteredDestinations.length > 0 ? (
          filteredDestinations.map(dest => (
            <DestinationCard key={dest.id} destination={dest} />
          ))
        ) : (
          <div className="no-results-card" role="status" aria-live="polite">
            <div className="no-results-icon" aria-hidden="true">🧭</div>
            <h4 className="no-results-title">No destinations match your filters</h4>
            <p className="no-results-text">Try broadening the search or clearing filters to discover more places.</p>
            <div className="no-results-actions">
              <button className="btn-primary" onClick={clearFilters}>Reset Filters</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Destinations;

