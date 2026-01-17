import React, { useEffect, useRef, useState } from 'react';
import '../styles/MapExperience.css';

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
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('Explore places around you');
  const [userPos, setUserPos] = useState(null);
  const [searchLocation, setSearchLocation] = useState('');
  const [searchCenter, setSearchCenter] = useState(centerDefault);

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

    setStatus('Map ready. Click a category to explore.');
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
    setStatus(`Searching for ${categoryLabel.toLowerCase()}...`);
    clearOverlays();

    const lat = searchCenter.lat;
    const lng = searchCenter.lng;

    const userMarker = window.L.marker([lat, lng], {
      icon: window.L.icon({
        iconUrl: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiIgdmlld0JveD0iMCAwIDI0IDI0Ij48Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSI4IiBmaWxsPSIjNGE3YmE3Ii8+PC9zdmc+',
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
        places.forEach((place) => {
          const marker = window.L.marker([place.lat, place.lon])
            .addTo(mapInstance.current)
            .bindPopup(`<strong>${place.tags?.name || categoryLabel}</strong><br>${place.tags?.description || 'Place'}`);
          overlays.current.push(marker);
        });
        setStatus(`Found ${places.length} ${categoryLabel.toLowerCase()} around this location`);
      })
      .catch(() => setStatus('Failed to load places'))
      .finally(() => setLoading(false));
  };

  const handleUseMyLocation = () => {
    if (!navigator.geolocation) return;
    setStatus('Getting your location...');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setSearchCenter(loc);
        setUserPos(loc);
        mapInstance.current?.setView([loc.lat, loc.lng], 14);
        setStatus('Location updated. Click a category to explore.');
      },
      () => setStatus('Location permission denied')
    );
  };

  const handleSearchLocation = () => {
    if (!searchLocation.trim()) return;
    const parts = searchLocation.split(',').map((v) => parseFloat(v.trim()));
    if (parts.length === 2 && parts.every((n) => Number.isFinite(n))) {
      const loc = { lat: parts[0], lng: parts[1] };
      setSearchCenter(loc);
      mapInstance.current?.setView([loc.lat, loc.lng], 14);
      setSearchLocation('');
      setStatus('Location updated. Click a category to explore.');
    } else {
      setStatus('Invalid format. Use "latitude,longitude" (e.g., 12.97,77.59)');
    }
  };

  return (
    <div className="map-experience-container">
      <div className="map-experience-header">
        <h2>🌍 Explore</h2>
        <div className="map-nav-tabs" style={{ marginTop: '16px' }}>
          <button className="active">Nearby</button>
        </div>
      </div>

      <div className="map-content">
        <div className="explore-search-controls">
          <input
            type="text"
            placeholder="Search location (lat,lng)"
            value={searchLocation}
            onChange={(e) => setSearchLocation(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearchLocation()}
            className="explore-search-input"
          />
          <button onClick={handleSearchLocation} disabled={loading} className="explore-search-btn">
            Search
          </button>
          <button onClick={handleUseMyLocation} disabled={loading} className="explore-location-btn">
            📍 My Location
          </button>
        </div>

        <div className="explore-categories">
          {ExploreCategories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => exploreCategory(cat.value)}
              disabled={loading}
              className="explore-category-btn"
              title={cat.label}
            >
              <span className="cat-icon">{cat.icon}</span>
              <span className="cat-name">{cat.label.split(' ')[1]}</span>
            </button>
          ))}
        </div>

        <div id="map" className="map-container" ref={mapRef} />

        <div className="map-status">
          {loading ? '⏳ Loading...' : status}
        </div>

        <div className="map-info">
          💡 Enter a location as <code>latitude,longitude</code> (e.g., <code>12.97,77.59</code>) or click "My Location", then select a category to explore. Map shows places within 3km.
        </div>
      </div>
    </div>
  );
};

export default Explore;
