// Sample Integration - Add this to DestinationDetails.jsx
// This file shows how to fetch and display real API data

import externalAPI from '../services/externalApiService';

// Add these state variables to DestinationDetails component:
const [realPlaces, setRealPlaces] = useState([]);
const [realHotels, setRealHotels] = useState([]);
const [countryInfo, setCountryInfo] = useState(null);
const [weather, setWeather] = useState(null);
const [apiLoading, setApiLoading] = useState({
  places: false,
  hotels: false,
  country: false,
  weather: false
});
const [apiErrors, setApiErrors] = useState({
  places: null,
  hotels: null,
  country: null,
  weather: null
});

// Add this useEffect hook to fetch external API data:
useEffect(() => {
  const fetchExternalData = async () => {
    // Fetch Famous Places
    try {
      setApiLoading(prev => ({ ...prev, places: true }));
      const placesData = await externalAPI.getPlaces(destination.name);
      if (placesData.success) {
        setRealPlaces(placesData.places.slice(0, 5)); // Top 5 places
      }
    } catch (error) {
      console.error('Error fetching places:', error);
      setApiErrors(prev => ({ ...prev, places: error.message }));
    } finally {
      setApiLoading(prev => ({ ...prev, places: false }));
    }

    // Fetch Hotels
    try {
      setApiLoading(prev => ({ ...prev, hotels: true }));
      const hotelsData = await externalAPI.getHotels(destination.name);
      if (hotelsData.success) {
        setRealHotels(hotelsData.hotels.slice(0, 5)); // Top 5 hotels
      }
    } catch (error) {
      console.error('Error fetching hotels:', error);
      setApiErrors(prev => ({ ...prev, hotels: error.message }));
    } finally {
      setApiLoading(prev => ({ ...prev, hotels: false }));
    }

    // Fetch Country Information
    try {
      setApiLoading(prev => ({ ...prev, country: true }));
      const countryData = await externalAPI.getCountryInfo(destination.country);
      if (countryData.success) {
        setCountryInfo(countryData.data);
      }
    } catch (error) {
      console.error('Error fetching country info:', error);
      setApiErrors(prev => ({ ...prev, country: error.message }));
    } finally {
      setApiLoading(prev => ({ ...prev, country: false }));
    }

    // Fetch Weather
    try {
      setApiLoading(prev => ({ ...prev, weather: true }));
      const weatherData = await externalAPI.getWeather(destination.name);
      if (weatherData.success) {
        setWeather(weatherData.data);
      }
    } catch (error) {
      console.error('Error fetching weather:', error);
      setApiErrors(prev => ({ ...prev, weather: error.message }));
    } finally {
      setApiLoading(prev => ({ ...prev, weather: false }));
    }
  };

  fetchExternalData();
}, [destination.name, destination.country]);

// Add these JSX sections to render real data:

// Real Famous Places Section (Replace static data)
{realPlaces && realPlaces.length > 0 && (
  <section className="places-section">
    <h2>🌟 Real Attractions in {destination.name}</h2>
    {apiLoading.places ? (
      <p style={{ textAlign: 'center', color: '#666' }}>Finding attractions...</p>
    ) : apiErrors.places ? (
      <p style={{ color: '#d32f2f' }}>Could not load attractions: {apiErrors.places}</p>
    ) : (
      <div className="places-grid">
        {realPlaces.map((place, index) => (
          <div key={index} className="place-card">
            {place.photo && (
              <img 
                src={`https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${place.photo}&key=${import.meta.env.VITE_GOOGLE_API_KEY}`}
                alt={place.name}
                onError={(e) => e.target.style.display = 'none'}
              />
            )}
            <div className="place-card-content">
              <h4>{place.name}</h4>
              <p>{place.address}</p>
              {place.rating > 0 && (
                <div style={{ marginTop: '0.5rem', color: '#fbbf24' }}>
                  ⭐ {place.rating} ({place.reviews} reviews)
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    )}
  </section>
)}

// Real Hotels Section (Replace static data)
{realHotels && realHotels.length > 0 && (
  <section className="hotels-section">
    <h2>🏨 Real Available Hotels</h2>
    {apiLoading.hotels ? (
      <p style={{ textAlign: 'center', color: '#666' }}>Checking availability...</p>
    ) : apiErrors.hotels ? (
      <p style={{ color: '#d32f2f' }}>Could not load hotels: {apiErrors.hotels}</p>
    ) : (
      <div className="hotels-grid">
        {realHotels.map((hotel, index) => (
          <div key={index} className="hotel-card">
            <div className="hotel-card-header">
              <h4>{hotel.name}</h4>
              {hotel.rating && <div className="hotel-rating">{'⭐'.repeat(hotel.rating)}</div>}
            </div>
            <p className="hotel-description">
              {hotel.address?.city}, {hotel.address?.country}
            </p>
            <div style={{ marginTop: '0.5rem', fontSize: '0.9rem', color: '#666' }}>
              {hotel.checkInDate} → {hotel.checkOutDate}
            </div>
            <div className="hotel-footer">
              <span className="hotel-price">
                {hotel.price} {hotel.currency}
              </span>
            </div>
          </div>
        ))}
      </div>
    )}
  </section>
)}

// Country Information Section (NEW - Real Data!)
{countryInfo && (
  <section className="country-info-section" style={{
    background: 'linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%)',
    padding: '2rem',
    borderRadius: '12px',
    margin: '2rem 0'
  }}>
    <h2>📍 About {countryInfo.name}</h2>
    {apiLoading.country ? (
      <p>Loading country info...</p>
    ) : (
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1.5rem'
      }}>
        <div>
          <strong>Capital:</strong> {countryInfo.capital}
        </div>
        <div>
          <strong>Currency:</strong> {countryInfo.currencyName} ({countryInfo.currency})
        </div>
        <div>
          <strong>Timezone:</strong> {countryInfo.timezone}
        </div>
        <div>
          <strong>Languages:</strong> {Object.values(countryInfo.languages || {}).join(', ')}
        </div>
        <div>
          <strong>Region:</strong> {countryInfo.region}
        </div>
        <div>
          <strong>Population:</strong> {(countryInfo.population / 1000000).toFixed(1)}M
        </div>
      </div>
    )}
  </section>
)}

// Current Weather Section (NEW!)
{weather && (
  <section className="weather-section" style={{
    background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
    padding: '2rem',
    borderRadius: '12px',
    margin: '2rem 0',
    borderLeft: '4px solid #fbbf24'
  }}>
    <h2>🌤️ Current Weather in {weather.city}</h2>
    {apiLoading.weather ? (
      <p>Loading weather...</p>
    ) : (
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
        gap: '1.5rem'
      }}>
        <div style={{ fontSize: '2rem' }}>
          {weather.temperature}°C
          <div style={{ fontSize: '0.9rem', color: '#666', textTransform: 'capitalize' }}>
            {weather.description}
          </div>
        </div>
        <div>
          <strong>Feels Like:</strong> {weather.feelsLike}°C
        </div>
        <div>
          <strong>Humidity:</strong> {weather.humidity}%
        </div>
        <div>
          <strong>Wind Speed:</strong> {weather.windSpeed} m/s
        </div>
      </div>
    )}
  </section>
)}

// Flight Search Component (Bonus!)
// Add a flight search form:
{false && ( // Set to true to show flight search
  <section className="flight-search-section" style={{
    background: 'white',
    padding: '2rem',
    borderRadius: '12px',
    margin: '2rem 0',
    boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
  }}>
    <h2>✈️ Search Real Flights</h2>
    <div style={{ marginTop: '1rem' }}>
      <p style={{ color: '#666', marginBottom: '1rem' }}>
        💡 Tip: To search flights, you need to implement a flight search form with:
      </p>
      <ul style={{ color: '#666' }}>
        <li>From: Delhi (DEL) or your current location</li>
        <li>To: {destination.name} (city code)</li>
        <li>Departure Date: Your trip start date</li>
        <li>Adults: Number of travelers</li>
      </ul>
      <p style={{ color: '#666', fontSize: '0.9rem', marginTop: '1rem' }}>
        Implementation example in documentation
      </p>
    </div>
  </section>
)}

// Example flight search implementation:
// const handleFlightSearch = async () => {
//   try {
//     const flights = await externalAPI.searchFlights('DEL', 'PAR', '2026-02-15', 1);
//     console.log('Real flights found:', flights);
//     // Display in UI
//   } catch (error) {
//     console.error('Flight search failed:', error);
//   }
// };
