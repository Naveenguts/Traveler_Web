# External APIs - Quick Start Guide

## Quick Setup (5 minutes)

### 1. Free API Signup (Get Your Keys!)

```
📌 Google Places API (5 min)
   → https://console.cloud.google.com
   → Create project → Enable "Places API" → Copy API Key

📌 Amadeus API (5 min)  
   → https://developers.amadeus.com
   → Sign up → Create app → Copy Client ID & Secret

📌 OpenWeather API (3 min)
   → https://openweathermap.org/api
   → Sign up → Copy API Key

📌 Google Maps (Same as above - reuse key)
```

---

## 2. Add Keys to Backend

Edit `traveler-backend/.env`:

```env
GOOGLE_PLACES_API_KEY=pk_XXXXXXXXXXXXX
AMADEUS_CLIENT_ID=YOUR_ID_HERE
AMADEUS_CLIENT_SECRET=YOUR_SECRET_HERE
OPENWEATHER_API_KEY=YOUR_KEY_HERE
GOOGLE_MAPS_API_KEY=YOUR_KEY_HERE
```

**Restart backend**: Kill terminal and run `node server.js` again

---

## 3. Test APIs (Without Frontend Code!)

### Test in Browser Console:

```javascript
// ✅ Works without key (REST Countries)
fetch('http://localhost:5000/api/external/country-info/France')
  .then(r => r.json())
  .then(d => console.log(d))

// ✅ Works if GOOGLE_PLACES_API_KEY is set
fetch('http://localhost:5000/api/external/places/Paris')
  .then(r => r.json())
  .then(d => console.log(d))

// ✅ Works if Amadeus keys are set
fetch('http://localhost:5000/api/external/location-codes/Paris')
  .then(r => r.json())
  .then(d => console.log(d))
```

---

## 4. Real Data Response Examples

### Country Info (No Key Needed)
```json
{
  "success": true,
  "data": {
    "name": "France",
    "capital": "Paris",
    "currency": "EUR",
    "timezone": "Europe/Paris",
    "population": 67750000,
    "languages": { "fr": "French" }
  }
}
```

### Famous Places (Google Places)
```json
{
  "success": true,
  "places": [
    {
      "name": "Eiffel Tower",
      "address": "5 Avenue Anatole France",
      "rating": 4.7,
      "reviews": 8942,
      "location": { "lat": 48.858370, "lng": 2.294481 },
      "photo": "reference_id_for_image"
    }
  ]
}
```

### Hotels (Amadeus)
```json
{
  "success": true,
  "hotels": [
    {
      "name": "Hotel Lutetia",
      "rating": 5,
      "price": "1850.00",
      "currency": "EUR",
      "checkInDate": "2026-02-15",
      "checkOutDate": "2026-02-20",
      "rooms": 3
    }
  ]
}
```

### Flights (Amadeus)
```json
{
  "success": true,
  "flights": [
    {
      "price": { "total": "25000", "currency": "INR", "base": "22500" },
      "itineraries": [
        {
          "duration": "PT11H30M",
          "segments": [
            {
              "departure": { "iataCode": "DEL", "at": "2026-02-15T10:00:00" },
              "arrival": { "iataCode": "PAR", "at": "2026-02-15T17:30:00" },
              "carrierCode": "AF",
              "number": "118",
              "aircraft": "A359",
              "stops": 0
            }
          ]
        }
      ]
    }
  ]
}
```

---

## 5. Integration Checklist

- [x] Backend routes created (`routes/external-apis.js`)
- [x] Frontend service created (`services/externalApiService.js`)
- [x] Environment variables added (`.env`)
- [ ] API keys obtained from services
- [ ] API keys added to `.env`
- [ ] Backend restarted
- [ ] Test routes in browser console
- [ ] Integrate into DestinationDetails page

---

## 6. Integrate Into DestinationDetails

Edit `frontend/src/pages/DestinationDetails.jsx`:

```javascript
import externalAPI from '../services/externalApiService';

// In useEffect hook:
const fetchData = async () => {
  try {
    // Get famous places
    const places = await externalAPI.getPlaces(destination.name);
    console.log('Places:', places);

    // Get hotels
    const hotels = await externalAPI.getHotels(destination.name);
    console.log('Hotels:', hotels);

    // Get country info
    const country = await externalAPI.getCountryInfo(destination.country);
    console.log('Country:', country);
  } catch (error) {
    console.error('API Error:', error);
  }
};
```

---

## 7. Troubleshooting

| Error | Fix |
|-------|-----|
| "API key not valid" | Check `.env`, restart backend |
| "Missing API key" | Get key from service, add to `.env` |
| "Quota exceeded" | Upgrade API tier or wait for reset |
| "CORS error" | Routes are already CORS-enabled |
| "Invalid location code" | Use IATA codes (DEL, PAR, LHR) |

---

## 8. Cost Optimization

- **Google Places**: 25,000 free/month (plenty for hobby projects)
- **Amadeus**: Free sandbox, ~$0.01/request production
- **OpenWeather**: 1,000 free/day
- **Total Cost**: $0-50/month for small projects

---

## Next: Integrate Real Data UI

Once APIs work, update DestinationDetails to show:
- ✨ Real famous places with photos
- 🏨 Real hotel prices & availability
- ✈️ Real flight options
- 🌦️ Real weather
- 💱 Real currency & timezone

**Questions?** Check browser console and backend console for detailed error messages.
