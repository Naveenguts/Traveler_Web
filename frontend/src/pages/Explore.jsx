import React, { useEffect, useRef, useState } from 'react';
import '../styles/Explore.css';

const centerDefault = { lat: 12.9716, lng: 77.5946 };
const overpassUrl = 'https://overpass-api.de/api/interpreter';

const ExploreCategories = [
  { value: 'restaurant', label: '🍴 Restaurants', icon: '🍴' },
  { value: 'hotel', label: '🏨 Hotels', icon: '🏨' },
  { value: 'tourism', label: '🏞️ Tourist Spots', icon: '🏞️' },
  { value: 'shop', label: '🛍️ Shopping', icon: '🛍️' },
  { value: 'hospital', label: '🏥 Hospitals', icon: '🏥' },
  { value: 'museum', label: '🎨 Museums', icon: '🎨' },
  { value: 'cafe', label: '☕ Cafes', icon: '☕' },
  { value: 'park', label: '🌳 Parks', icon: '🌳' }
];

const Explore = () => {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const overlays = useRef([]);
  const markerData = useRef([]);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('Ready to explore');
  const [userPos, setUserPos] = useState(null);
  const [searchLocation, setSearchLocation] = useState('');
  const [searchCenter, setSearchCenter] = useState(centerDefault);
  const [results, setResults] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);

  useEffect(() => {
    const ensureLeafletLoaded = () => {
      if (window.L && mapRef.current && !mapInstance.current) {
        initMap();
      }
    };

    if (!document.querySelector('link[data-leaflet]')) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet/dist/leaflet.css';
      link.setAttribute('data-leaflet', 'true');
      document.head.appendChild(link);
    }

    if (!document.querySelector('script[data-leaflet]')) {
      const script = document.createElement('script');
      script.src = 'https://unpkg.com/leaflet/dist/leaflet.js';
      script.async = true;
      script.setAttribute('data-leaflet', 'true');
      script.onload = ensureLeafletLoaded;
      document.body.appendChild(script);
    } else {
      ensureLeafletLoaded();
    }
  }, []);

  const initMap = () => {
    const L = window.L;
    if (!L || !mapRef.current) return;

    mapInstance.current = L.map(mapRef.current).setView([centerDefault.lat, centerDefault.lng], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap'
    }).addTo(mapInstance.current);

    setStatus('✅ Map ready - Select a category to explore');
  };

  const clearOverlays = () => {
    overlays.current.forEach((layer) => layer.remove());
    overlays.current = [];
  };

  const exploreCategory = (category) => {
    if (!mapInstance.current) return;

    const categoryLabel = ExploreCategories.find((c) => c.value === category)?.label || category;
    const categoryConfig = {
      restaurant: { key: 'amenity', tag: 'restaurant' },
      hotel: { key: 'tourism', tag: 'hotel' },
      tourism: { key: 'tourism', tag: 'attraction' },
      shop: { key: 'shop', tag: 'mall' },
      hospital: { key: 'amenity', tag: 'hospital' },
      museum: { key: 'tourism', tag: 'museum' },
      cafe: { key: 'amenity', tag: 'cafe' },
      park: { key: 'leisure', tag: 'park' },
    }[category];

    if (!categoryConfig) {
      setStatus('Unsupported category');
      return;
    }

    setLoading(true);
    setActiveCategory(category);
    setStatus(`🔍 Searching for ${categoryLabel.toLowerCase()}...`);
    clearOverlays();
    setResults([]);
    markerData.current = [];

    const lat = searchCenter.lat;
    const lng = searchCenter.lng;

    const userMarker = window.L.marker([lat, lng], {
      icon: window.L.icon({
        iconUrl: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiIgdmlld0JveD0iMCAwIDI0IDI0Ij48Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSI4IiBmaWxsPSIjMjU2M2ViIi8+PC9zdmc+',
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      })
    })
      .addTo(mapInstance.current)
      .bindPopup('📍 Search Center')
      .openPopup();
    overlays.current.push(userMarker);

    mapInstance.current.setView([lat, lng], 14);

    const query = `
      [out:json];
      node["${categoryConfig.key}"="${categoryConfig.tag}"](around:3000, ${lat}, ${lng});
      out 100;
    `;

    fetch(overpassUrl, {
      method: 'POST',
      body: query,
    })
      .then((res) => res.json())
      .then((data) => {
        const places = data.elements || [];
        const placesData = places.slice(0, 15).map((place) => {
          const marker = window.L.marker([place.lat, place.lon])
            .addTo(mapInstance.current)
            .bindPopup(`<strong>${place.tags?.name || categoryLabel}</strong><br>${place.tags?.description || 'Place'}`);
          overlays.current.push(marker);
          return {
            id: place.id,
            name: place.tags?.name || 'Unnamed',
            lat: place.lat,
            lon: place.lon,
            description: place.tags?.description || 'Place',
            rating: place.tags?.rating || 4.5,
            distance: ((Math.random() * 2.8) + 0.1).toFixed(1)
          };
        });
        markerData.current = placesData;
        setResults(placesData);
        setStatus(`✅ Found ${places.length} ${categoryLabel.toLowerCase()} around this location`);
      })
      .catch(() => setStatus('❌ Failed to load places'))
      .finally(() => setLoading(false));
  };

  const handleUseMyLocation = () => {
    if (!navigator.geolocation) return;
    setLoading(true);
    setStatus('📍 Getting your location...');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setSearchCenter(loc);
        setUserPos(loc);
        mapInstance.current?.setView([loc.lat, loc.lng], 14);
        setStatus('✅ Location updated - Select a category to explore');
        setLoading(false);
      },
      () => {
        setStatus('❌ Location permission denied');
        setLoading(false);
      }
    );
  };

  const handleSearchLocation = () => {
    if (!searchLocation.trim()) {
      setStatus('❌ Please enter a location');
      return;
    }
    const parts = searchLocation.split(',').map((v) => parseFloat(v.trim()));
    if (parts.length === 2 && parts.every((n) => Number.isFinite(n))) {
      const loc = { lat: parts[0], lng: parts[1] };
      setSearchCenter(loc);
      mapInstance.current?.setView([loc.lat, loc.lng], 14);
      setSearchLocation('');
      setStatus('✅ Location updated - Select a category to explore');
    } else {
      setStatus('❌ Invalid format. Use "latitude,longitude" (e.g., 12.97,77.59)');
    }
  };

  const handleGetDirections = (lat, lon, name) => {
    // Option 1: Open Google Maps in a new tab
    const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lon}&dir_action=navigate`;
    window.open(googleMapsUrl, '_blank');
    
    // Option 2: Also highlight the marker on the map
    if (mapInstance.current) {
      mapInstance.current.setView([lat, lon], 16);
    }
  };

  return (
    <div className="explore-page-container">
      {/* 🏠 HERO SECTION */}
      <div className="explore-header">
        <h1 className="explore-title">🌍 Explore</h1>
        <p className="explore-subtitle">Discover restaurants, hotels, shops, and attractions around you instantly</p>
      </div>

      {/* 📐 MAIN LAYOUT */}
      <div className="explore-main-layout">
        {/* 🗺️ MAP SECTION (Left Column) */}
        <div className="explore-map-section">
          {/* 🔍 GOOGLE-STYLE SEARCH BAR */}
          <div className="search-wrapper">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              className="search-input"
              placeholder="Search location (lat,lng) e.g., 12.97,77.59"
              value={searchLocation}
              onChange={(e) => setSearchLocation(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearchLocation()}
            />
            <button onClick={handleSearchLocation} disabled={loading} className="btn-search">
              Search
            </button>
            <button onClick={handleUseMyLocation} disabled={loading} className="btn-my-location">
              📍 My Location
            </button>
          </div>

          {/* 🎯 CATEGORY CARDS */}
          <div className="category-container">
            {ExploreCategories.map((cat) => (
              <button
                key={cat.value}
                onClick={() => exploreCategory(cat.value)}
                disabled={loading}
                className={`category-card ${activeCategory === cat.value ? 'active' : ''} ${loading ? 'loading' : ''}`}
                title={cat.label}
              >
                <span className="cat-icon">{cat.icon}</span>
                <span className="cat-name">{cat.label.split(' ')[1]}</span>
              </button>
            ))}
          </div>

          {/* 🗺️ MAP CONTAINER */}
          <div className="map-container-wrapper">
            <div className="explore-map-container" ref={mapRef}>
              {loading && (
                <div className="map-loading-overlay">
                  <div className="spinner-small"></div>
                  <span className="loading-text-small">Loading places...</span>
                </div>
              )}
            </div>
          </div>

          {/* 📊 STATUS MESSAGE */}
          <div className={`status-message ${status.includes('Failed') || status.includes('Invalid') || status.includes('denied') ? 'error' : status.includes('Searching') ? 'loading' : 'success'}`}>
            <span>{status}</span>
          </div>

          {/* 💡 INFO BOX */}
          <div className="info-box">
            <span className="info-icon">💡</span>
            <div>
              <strong>How to use:</strong> Enter a location as <code>latitude,longitude</code> (e.g., <code>12.97,77.59</code>) or click "My Location", then select a category. Results show places within 3km.
            </div>
          </div>
        </div>

        {/* 📋 RESULTS PANEL (Right Column) */}
        <div className="explore-results-panel">
          <div className="results-header">
            🎯 Results
            {results.length > 0 && <span className="result-count">{results.length}</span>}
          </div>

          {results.length > 0 ? (
            <div className="results-list">
              {results.map((result) => (
                <div key={result.id} className="result-item fade-in">
                  <div className="result-name">{result.name}</div>
                  <div className="result-rating">
                    <span>⭐ {result.rating}</span>
                  </div>
                  <div className="result-distance">
                    <span>📍 {result.distance} km away</span>
                  </div>
                  <button 
                    className="get-directions-btn"
                    onClick={() => handleGetDirections(result.lat, result.lon, result.name)}
                  >
                    🗺️ Get Directions
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-results">
              <div className="empty-icon">🔍</div>
              <div className="empty-text">
                {loading ? 'Searching...' : 'Select a category to see results'}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Explore;
