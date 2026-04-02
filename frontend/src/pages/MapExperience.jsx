import React, { useEffect, useRef, useState } from 'react';
import '../styles/MapExperience.css';

// Free stack: OpenStreetMap tiles via Leaflet, routes via OpenRouteService (requires free key)
const centerDefault = { lat: 12.9716, lng: 77.5946 };
const orsKey = import.meta.env.VITE_ORS_API_KEY || 'YOUR_ORS_API_KEY';

const MapExperience = () => {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const overlays = useRef([]);
  const [mode, setMode] = useState('map');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');

  // Inject Leaflet CSS/JS from CDN once, then init map
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

    setStatus('Map ready');
    showCenterMarker();
  };

  const clearOverlays = () => {
    overlays.current.forEach((layer) => layer.remove());
    overlays.current = [];
  };

  const showCenterMarker = () => {
    if (!mapInstance.current) return;
    clearOverlays();
    const marker = window.L.marker([centerDefault.lat, centerDefault.lng])
      .addTo(mapInstance.current)
      .bindPopup('Center Location')
      .openPopup();
    overlays.current.push(marker);
    mapInstance.current.setView([centerDefault.lat, centerDefault.lng], 13);
    setStatus('Showing base map');
  };

  const handleLocate = () => {
    if (!mapInstance.current || !navigator.geolocation) return;
    setLoading(true);
    setStatus('Requesting location...');

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        const userMarker = window.L.marker([lat, lng])
          .addTo(mapInstance.current)
          .bindPopup('You are here')
          .openPopup();
        overlays.current.push(userMarker);
        mapInstance.current.setView([lat, lng], 14);
        setStatus('Showing your location');
        setLoading(false);
      },
      () => {
        setLoading(false);
        setStatus('Location permission denied');
      }
    );
  };

  const handleRoute = () => {
    if (!mapInstance.current) return;
    const startVal = document.getElementById('start')?.value;
    const endVal = document.getElementById('end')?.value;
    if (!startVal || !endVal) {
      setStatus('Enter start and destination');
      return;
    }

    const parseLatLng = (str) => {
      const parts = str.split(',').map((v) => parseFloat(v.trim()));
      return parts.length === 2 && parts.every((n) => Number.isFinite(n)) ? { lat: parts[0], lng: parts[1] } : null;
    };

    const start = parseLatLng(startVal);
    const end = parseLatLng(endVal);
    if (!start || !end) {
      setStatus('Use "lat,lng" format, e.g., 12.9716,77.5946');
      return;
    }

    setLoading(true);
    setStatus('Requesting route...');
    clearOverlays();

    fetch('https://api.openrouteservice.org/v2/directions/driving-car', {
      method: 'POST',
      headers: {
        Authorization: orsKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        coordinates: [
          [start.lng, start.lat],
          [end.lng, end.lat],
        ],
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        const coords = data?.features?.[0]?.geometry?.coordinates;
        if (!coords || !coords.length) {
          setStatus('No route found');
          return;
        }
        const latLngs = coords.map((c) => [c[1], c[0]]);
        const poly = window.L.polyline(latLngs, { weight: 5, color: '#4a7ba7' }).addTo(mapInstance.current);
        overlays.current.push(poly);
        mapInstance.current.fitBounds(poly.getBounds());
        setStatus('Route displayed');
      })
      .catch(() => setStatus('Route request failed'))
      .finally(() => setLoading(false));
  };

  return (
    <div className="map-experience-container">
      <div className="map-experience-header">
        <h2>🗺️ Map & Routes</h2>
        <p className="map-page-subtitle">Explore destinations and generate smart routes with real-time navigation</p>
      </div>

      <div className="map-content">
        <div className="map-nav-tabs">
          <button 
            onClick={() => { setMode('map'); showCenterMarker(); }}
            className={mode === 'map' ? 'active' : ''}
          >
            Map
          </button>
          <button 
            onClick={() => setMode('routes')}
            className={mode === 'routes' ? 'active' : ''}
          >
            Routes
          </button>
        </div>

        {mode === 'map' && (
          <div className="map-actions">
            <button onClick={handleLocate} disabled={loading}>Show My Location</button>
          </div>
        )}

        {mode === 'routes' && (
          <div className="map-controls">
            <input id="start" placeholder="Start location (lat,lng)" defaultValue={`${centerDefault.lat},${centerDefault.lng}`} />
            <input id="end" placeholder="Destination (lat,lng)" defaultValue="12.2958,76.6394" />
            <button onClick={handleRoute} disabled={loading}>Get Route</button>
          </div>
        )}

        <div className="map-status" style={{ display: loading ? 'flex' : 'none' }}>
          <div className="loading-spinner">
            <div className="spinner"></div>
            <span className="loading-text">Loading...</span>
          </div>
        </div>

        <div id="map" className="map-container" ref={mapRef} />

        <div className="map-status">
          {status || '✅ Ready to explore'}
        </div>

        <div className="map-info">
          💡 <strong>Routes</strong> uses OpenRouteService (free tier). Enter coordinates as <code>latitude,longitude</code> (e.g., 12.9716,77.5946).
        </div>
      </div>
    </div>
  );
};

export default MapExperience;
