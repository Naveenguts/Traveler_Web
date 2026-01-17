# Real-Time External APIs Integration Guide

This guide covers how to integrate real-time travel APIs (Google Places, Amadeus, OpenWeather) into your travel website.

## Table of Contents
1. [API Overview](#api-overview)
2. [Setup Instructions](#setup-instructions)
3. [API Keys & Credentials](#api-keys--credentials)
4. [Backend Integration](#backend-integration)
5. [Frontend Integration](#frontend-integration)
6. [Testing](#testing)

---

## API Overview

Your travel website now uses industry-standard APIs used by Booking.com, Airbnb, TripAdvisor:

| Feature | API | Purpose |
|---------|-----|---------|
| 🏛️ Famous Places & Attractions | Google Places API | Get real tourist attractions with ratings & photos |
| 🏨 Hotel Search & Booking | Amadeus Travel API | Real hotel availability, prices, ratings |
| ✈️ Flight Search | Amadeus Flight Offers API | Real flights, prices, airlines, schedules |
| 🗺️ Airport/City Codes | Amadeus Location API | IATA codes for flight searches |
| 🌦️ Weather | OpenWeatherMap API | Real-time weather for destinations |
| 🌍 Country Info | REST Countries API | Currency, timezone, language, flags |

---

## Setup Instructions

### Step 1: Get API Keys

#### 1.1 Google Places API
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project
3. Enable these APIs:
   - Places API
   - Maps JavaScript API
   - Maps Embed API
4. Create API Key credentials
5. Copy the API key

#### 1.2 Amadeus API (Recommended)
1. Go to [Amadeus Developer Portal](https://developers.amadeus.com)
2. Sign up for free account
3. Create an app
4. You'll get:
   - Client ID
   - Client Secret
5. Keep these safe!

#### 1.3 OpenWeather API (Optional)
1. Go to [OpenWeatherMap](https://openweathermap.org/api)
2. Sign up for free tier
3. Get API Key from your account

---

## API Keys & Credentials

### Set Up Environment Variables

In your backend `.env` file, add:

```env
# Google Places & Maps
GOOGLE_PLACES_API_KEY=your_google_api_key_here
GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here

# Amadeus Travel APIs
AMADEUS_CLIENT_ID=your_amadeus_client_id_here
AMADEUS_CLIENT_SECRET=your_amadeus_client_secret_here

# OpenWeather
OPENWEATHER_API_KEY=your_openweather_api_key_here
```

⚠️ **IMPORTANT**: Never commit `.env` file to git! It contains secrets.

---

## Backend Integration

### Architecture
```
Frontend (React)
    ↓
Backend (Node.js/Express)
    ↓
External APIs (Google, Amadeus, OpenWeather)
```

### Available Routes

All external APIs are accessed through `/api/external/*` endpoints:

#### Get Famous Places/Attractions
```
GET /api/external/places/:destination
Example: /api/external/places/Paris
Response: {
  success: true,
  places: [
    {
      name: "Eiffel Tower",
      rating: 4.7,
      address: "5 Avenue Anatole France, Paris",
      photo: "photo_reference"
    }
  ]
}
```

#### Search Hotels
```
GET /api/external/hotels/:destination?checkInDate=2026-02-15&checkOutDate=2026-02-20&adults=1
Example: /api/external/hotels/Paris?checkInDate=2026-02-15&checkOutDate=2026-02-20
Response: {
  success: true,
  hotels: [
    {
      name: "Hotel Lutetia",
      price: "1850.00",
      currency: "EUR",
      rating: 5
    }
  ]
}
```

#### Search Flights
```
GET /api/external/flights?from=DEL&to=PAR&departureDate=2026-02-15&adults=1
Example: /api/external/flights?from=DEL&to=PAR&departureDate=2026-02-15
Response: {
  success: true,
  flights: [
    {
      price: { total: "25000", currency: "INR" },
      itineraries: [...],
      airline: "Air France"
    }
  ]
}
```

#### Get Location Codes (For Flights)
```
GET /api/external/location-codes/:keyword
Example: /api/external/location-codes/Paris
Response: {
  success: true,
  locations: [
    { iataCode: "PAR", name: "Paris", type: "CITY" },
    { iataCode: "CDG", name: "Paris Charles de Gaulle", type: "AIRPORT" }
  ]
}
```

#### Get Country Information
```
GET /api/external/country-info/:country
Example: /api/external/country-info/France
Response: {
  success: true,
  data: {
    name: "France",
    capital: "Paris",
    currency: "EUR",
    timezone: "Europe/Paris",
    languages: { fr: "French" }
  }
}
```

#### Get Weather
```
GET /api/external/weather/:city
Example: /api/external/weather/Paris
Response: {
  success: true,
  data: {
    temperature: 8,
    description: "Partly cloudy",
    windSpeed: 3.5,
    humidity: 72
  }
}
```

---

## Frontend Integration

### Using externalApiService

The frontend service is in `src/services/externalApiService.js`

```javascript
import externalAPI from '../services/externalApiService';

// Get famous places
const placesData = await externalAPI.getPlaces('Paris');

// Get hotels
const hotelsData = await externalAPI.getHotels('Paris', '2026-02-15', '2026-02-20', 1);

// Search flights
const flightsData = await externalAPI.searchFlights('DEL', 'PAR', '2026-02-15', 1);

// Get location codes
const locations = await externalAPI.getLocationCodes('Paris');

// Get country info
const countryData = await externalAPI.getCountryInfo('France');

// Get weather
const weatherData = await externalAPI.getWeather('Paris');
```

### Example: Using in React Component

```javascript
import { useState, useEffect } from 'react';
import externalAPI from '../services/externalApiService';

function DestinationDetails() {
  const [places, setPlaces] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get famous places
        const placesRes = await externalAPI.getPlaces('Paris');
        setPlaces(placesRes.places);

        // Get hotels
        const hotelsRes = await externalAPI.getHotels('Paris');
        setHotels(hotelsRes.hotels);

        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h2>Famous Places</h2>
      {places.map(place => (
        <div key={place.placeId}>
          <h4>{place.name}</h4>
          <p>Rating: {place.rating}</p>
          <p>{place.address}</p>
        </div>
      ))}

      <h2>Hotels</h2>
      {hotels.map(hotel => (
        <div key={hotel.hotelId}>
          <h4>{hotel.name}</h4>
          <p>{hotel.price} {hotel.currency}</p>
        </div>
      ))}
    </div>
  );
}
```

---

## Testing

### 1. Test Without API Keys (Mock Data)

You can test the structure first. The backend will return errors if keys are missing:

```bash
# In terminal, test a route:
curl http://localhost:5000/api/external/places/Paris
```

### 2. Add Real API Keys

Once you have API keys:

1. Add to `.env` file in `traveler-backend/`
2. Restart backend server: `node server.js`
3. Test again

### 3. Test from Frontend

In browser console:
```javascript
// Test country info (no key needed)
await fetch('http://localhost:5000/api/external/country-info/France')
  .then(r => r.json())
  .then(d => console.log(d))

// Test places (requires GOOGLE_PLACES_API_KEY)
await fetch('http://localhost:5000/api/external/places/Paris')
  .then(r => r.json())
  .then(d => console.log(d))
```

---

## Common Issues & Fixes

### Issue: "API key not valid"
- Ensure API keys are correct in `.env`
- Restart backend server after adding keys
- Check that APIs are enabled in Google Cloud Console

### Issue: "Quota exceeded"
- Google Places has free quota limits
- Upgrade to paid tier for production
- For Amadeus, check your sandbox/production limits

### Issue: "Invalid location code"
- Use IATA codes: DEL (Delhi), PAR (Paris), LHR (London)
- Get codes using `/api/external/location-codes/:keyword`

### Issue: CORS error
- Backend already has CORS enabled
- Ensure requests go through `/api/external/*` routes

---

## API Limits & Pricing

### Google Places API
- **Free Tier**: 25,000 requests/month
- **Paid**: $7 per 1000 requests after quota
- 🔗 [Pricing](https://developers.google.com/maps/billing-and-pricing/pricing)

### Amadeus API
- **Sandbox (Free)**: Full access for testing
- **Production**: Pay per request (~$0.01 per flight/hotel search)
- 🔗 [Pricing](https://developers.amadeus.com/pricing)

### OpenWeatherMap
- **Free Tier**: 1000 calls/day
- **Paid**: Scales from $50-500/month
- 🔗 [Pricing](https://openweathermap.org/price)

---

## Next Steps

1. ✅ Set up backend routes (DONE)
2. ✅ Create frontend service (DONE)
3. 🔲 Get API keys
4. 🔲 Add API keys to `.env`
5. 🔲 Integrate into DestinationDetails page
6. 🔲 Add loading/error states
7. 🔲 Deploy to production

---

## Resources

- [Google Places API Docs](https://developers.google.com/maps/documentation/places/web-service/overview)
- [Amadeus API Docs](https://developers.amadeus.com/documentation)
- [OpenWeatherMap Docs](https://openweathermap.org/api)
- [REST Countries API](https://restcountries.com/)

---

**Questions?** Check the error messages in backend console and browser console for debugging.
