# Quick Reference Card - Real-Time APIs

## 🚀 One-Page Cheat Sheet

### Get API Keys (5 Minutes)
```
1. Google Places: https://console.cloud.google.com
   • Create Project
   • Enable "Places API"
   • Create API Key
   
2. Amadeus: https://developers.amadeus.com
   • Sign up free
   • Create app
   • Copy Client ID & Secret
   
3. OpenWeather: https://openweathermap.org/api
   • Sign up free
   • Copy API Key
```

### Add to .env (2 Minutes)
```env
# traveler-backend/.env
GOOGLE_PLACES_API_KEY=pk_xxxxx
AMADEUS_CLIENT_ID=xxxxx
AMADEUS_CLIENT_SECRET=xxxxx
OPENWEATHER_API_KEY=xxxxx
GOOGLE_MAPS_API_KEY=xxxxx
```

### Restart Backend (1 Minute)
```bash
cd traveler-backend
node server.js
# Should see: ✅ Server is running on port 5000
```

### Test in Browser Console (2 Minutes)
```javascript
// Test (no key needed)
fetch('http://localhost:5000/api/external/country-info/France')
  .then(r => r.json()).then(console.log)

// Test Places (needs GOOGLE_PLACES_API_KEY)
fetch('http://localhost:5000/api/external/places/Paris')
  .then(r => r.json()).then(console.log)
```

---

## 📚 API Endpoints Quick Reference

| Endpoint | Method | Parameters | Returns |
|----------|--------|------------|---------|
| `/api/external/places/:destination` | GET | destination | Famous places |
| `/api/external/hotels/:destination` | GET | checkIn, checkOut, adults | Hotels |
| `/api/external/flights` | GET | from, to, date, adults | Flights |
| `/api/external/location-codes/:keyword` | GET | keyword | Airport codes |
| `/api/external/country-info/:country` | GET | country | Country data |
| `/api/external/weather/:city` | GET | city | Weather data |

---

## 💻 Frontend Usage (Copy & Paste)

```javascript
import externalAPI from '../services/externalApiService';

// Get places
const places = await externalAPI.getPlaces('Paris');
console.log(places.places); // Array of attractions

// Get hotels
const hotels = await externalAPI.getHotels('Paris', '2026-02-15', '2026-02-20');
console.log(hotels.hotels); // Array of hotels

// Search flights
const flights = await externalAPI.searchFlights('DEL', 'PAR', '2026-02-15');
console.log(flights.flights); // Array of flights

// Get weather
const weather = await externalAPI.getWeather('Paris');
console.log(weather.data); // Temperature, description, etc.

// Get country info
const country = await externalAPI.getCountryInfo('France');
console.log(country.data); // Capital, currency, timezone, etc.
```

---

## 🔧 Integration in React Component

```javascript
import { useState, useEffect } from 'react';
import externalAPI from '../services/externalApiService';

function MyComponent({ destination }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const result = await externalAPI.getPlaces(destination);
        setData(result);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    })();
  }, [destination]);

  if (loading) return <p>Loading...</p>;
  if (!data?.success) return <p>Error loading data</p>;

  return (
    <div>
      {data.places.map(place => (
        <div key={place.placeId}>
          <h3>{place.name}</h3>
          <p>{place.address}</p>
          <p>⭐ {place.rating}</p>
        </div>
      ))}
    </div>
  );
}
```

---

## 🚨 Common Errors & Fixes

| Error | Fix |
|-------|-----|
| `Cannot GET /api/external/places` | Restart: `node server.js` |
| `API key not valid` | Add correct key to `.env` |
| `Missing API credentials` | Add AMADEUS_CLIENT_ID/SECRET to `.env` |
| `CORS error` | Already handled - check backend console |
| `No data returned` | API key might be missing (no error shown) |
| `401 Unauthorized` | Invalid API key or credentials |
| `429 Too Many Requests` | Hit API rate limit - upgrade tier |

---

## 📊 File Locations

```
✅ Created:
  traveler-backend/routes/external-apis.js
  frontend/src/services/externalApiService.js
  EXTERNAL_APIS_SETUP.md
  EXTERNAL_APIS_QUICKSTART.md
  INTEGRATION_EXAMPLE.js
  REAL_TIME_APIS_SUMMARY.md
  ARCHITECTURE_AND_IMPLEMENTATION.md

✏️ Modified:
  traveler-backend/server.js (added route)
  traveler-backend/.env (added keys)
```

---

## 💰 Pricing at a Glance

```
Google Places:    25,000/month FREE → $7/1000
Amadeus:          Unlimited FREE (sandbox) → $0.01/req (production)
OpenWeather:      1000/day FREE → $50/month (premium)
REST Countries:   ∞ FOREVER FREE
Total:            $0/month for hobby projects
```

---

## 📋 Integration Checklist

- [ ] Got API keys from all services
- [ ] Added keys to `.env`
- [ ] Restarted backend
- [ ] Tested country-info endpoint
- [ ] Tested places endpoint
- [ ] Tested hotels endpoint
- [ ] Imported externalAPI in component
- [ ] Added useEffect to fetch data
- [ ] Added state for loading/error
- [ ] Rendered real data in UI
- [ ] Tested on all pages

---

## 🎓 What Each API Does

### Google Places API
```
Input: "famous places in Paris"
Output: [
  {
    name: "Eiffel Tower",
    rating: 4.7,
    reviews: 8942,
    address: "5 Avenue Anatole France",
    photo: "reference_id"
  }
]
```

### Amadeus Hotel API
```
Input: destination="Paris", checkIn="2026-02-15"
Output: [
  {
    name: "Hotel Lutetia",
    price: 1850,
    currency: "EUR",
    rating: 5,
    rooms: 3
  }
]
```

### Amadeus Flight API
```
Input: from="DEL", to="PAR", date="2026-02-15"
Output: [
  {
    price: { total: 25000, currency: "INR" },
    airline: "Air France",
    duration: "11h 30m",
    stops: 0,
    departure: "2026-02-15T10:00",
    arrival: "2026-02-15T17:30"
  }
]
```

### OpenWeather API
```
Input: city="Paris"
Output: {
  temperature: 8,
  description: "Partly cloudy",
  humidity: 72,
  windSpeed: 3.5
}
```

### REST Countries API
```
Input: country="France"
Output: {
  name: "France",
  capital: "Paris",
  currency: "EUR",
  timezone: "Europe/Paris",
  languages: { fr: "French" }
}
```

---

## 🔐 Security Checklist

✅ API keys in `.env` (not in code)
✅ Keys not exposed to frontend
✅ CORS enabled on backend
✅ Error messages don't leak secrets
✅ Rate limiting ready for production
✅ No API keys in git history

---

## 📞 Support Resources

**Official Docs:**
- Google Places: https://developers.google.com/maps/documentation/places
- Amadeus: https://developers.amadeus.com/documentation
- OpenWeather: https://openweathermap.org/api
- REST Countries: https://restcountries.com/

**Your Local Files:**
- Setup Guide: EXTERNAL_APIS_SETUP.md
- Quick Start: EXTERNAL_APIS_QUICKSTART.md
- Code Samples: INTEGRATION_EXAMPLE.js
- Architecture: ARCHITECTURE_AND_IMPLEMENTATION.md

---

## ⚡ Performance Tips

```javascript
// Cache results (example for 1 hour)
const cacheData = {};
const cacheTTL = 3600000; // 1 hour

async function getCachedPlaces(destination) {
  if (cacheData[destination] && 
      Date.now() - cacheData[destination].time < cacheTTL) {
    return cacheData[destination].data;
  }
  
  const data = await externalAPI.getPlaces(destination);
  cacheData[destination] = { data, time: Date.now() };
  return data;
}
```

---

## 🎯 Next Steps

1. **RIGHT NOW** (5 min): Get API keys
2. **NEXT** (2 min): Add to .env
3. **THEN** (1 min): Restart backend
4. **FINALLY** (5 min): Test endpoints
5. **READY** (30 min): Integrate into UI

**Total Time: 43 minutes to real live data!**

---

**Questions? Check the detailed docs or backend console errors** 🚀
