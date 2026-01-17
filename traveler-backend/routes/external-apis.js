const express = require('express');
const router = express.Router();
const axios = require('axios');
const { URLSearchParams } = require('url');

// Google Places API - Get Famous Places/Attractions
router.get('/places/:destination', async (req, res) => {
  try {
    const { destination } = req.params;
    const { pageToken } = req.query;

    const response = await axios.get(
      'https://maps.googleapis.com/maps/api/place/textsearch/json',
      {
        params: {
          query: `famous places attractions ${destination}`,
          key: process.env.GOOGLE_PLACES_API_KEY,
          pageToken: pageToken || undefined
        }
      }
    );

    const places = response.data.results.map(place => ({
      name: place.name,
      address: place.formatted_address,
      rating: place.rating || 0,
      reviews: place.user_ratings_total || 0,
      placeId: place.place_id,
      location: place.geometry?.location,
      photo: place.photos?.[0]?.photo_reference || null
    }));

    res.json({
      success: true,
      places,
      nextPageToken: response.data.next_page_token || null,
      status: response.data.status
    });
  } catch (error) {
    console.error('Error fetching places:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch places',
      error: error.message
    });
  }
});

// Amadeus Hotel Search API
router.get('/hotels/:destination', async (req, res) => {
  try {
    const { destination } = req.params;
    const { checkInDate, checkOutDate, adults } = req.query;

    // First, get Amadeus access token
    const tokenParams = new URLSearchParams();
    tokenParams.append('grant_type', 'client_credentials');
    tokenParams.append('client_id', process.env.AMADEUS_CLIENT_ID);
    tokenParams.append('client_secret', process.env.AMADEUS_CLIENT_SECRET);

    const tokenResponse = await axios.post(
      'https://test.api.amadeus.com/v1/security/oauth2/token',
      tokenParams,
      {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      }
    );

    const token = tokenResponse.data.access_token;

    // Get city code from location API first
    let cityCode = destination;
    try {
      const locationResponse = await axios.get(
        'https://test.api.amadeus.com/v1/reference-data/locations',
        {
          params: {
            keyword: destination,
            subType: 'CITY'
          },
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      if (locationResponse.data.data && locationResponse.data.data.length > 0) {
        cityCode = locationResponse.data.data[0].iataCode;
        console.log(`Found city code for ${destination}: ${cityCode}`);
      }
    } catch (locError) {
      console.log('Location lookup failed, using destination name as-is');
    }

    // Search for hotels using city code (v2 API - CORRECT VERSION)
    const hotelResponse = await axios.get(
      'https://test.api.amadeus.com/v2/shopping/hotel-offers',
      {
        params: {
          cityCode: cityCode,
          adults: adults || 1,
          roomQuantity: 1,
          paymentPolicy: 'NONE',
          checkInDate: checkInDate || new Date(Date.now() + 86400000).toISOString().split('T')[0],
          checkOutDate: checkOutDate || new Date(Date.now() + 172800000).toISOString().split('T')[0]
        },
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    const hotels = hotelResponse.data.data?.map(hotel => ({
      name: hotel.name,
      hotelId: hotel.hotelId,
      rating: hotel.rating || null,
      address: {
        city: hotel.address?.city,
        country: hotel.address?.countryCode
      },
      price: hotel.offers?.[0]?.price?.total,
      currency: hotel.offers?.[0]?.price?.currency,
      checkInDate: hotel.offers?.[0]?.checkInDate,
      checkOutDate: hotel.offers?.[0]?.checkOutDate,
      rooms: hotel.offers?.[0]?.rooms?.length
    })) || [];

    console.log(`Hotels API returned ${hotels.length} hotels for ${destination} (${cityCode})`);

    res.json({
      success: true,
      hotels,
      total: hotels.length,
      cityCode: cityCode,
      isEmpty: hotels.length === 0
    });
  } catch (error) {
    console.error('Error fetching hotels:', error.message);
    console.error('Error response:', error.response?.data);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch hotels',
      error: error.message,
      hint: 'Make sure Amadeus API credentials are set in environment variables'
    });
  }
});

// Amadeus Flight Search API
router.get('/flights', async (req, res) => {
  try {
    const { from, to, departureDate, adults } = req.query;

    if (!from || !to || !departureDate) {
      return res.status(400).json({
        success: false,
        message: 'Missing required parameters: from, to, departureDate'
      });
    }

    // Get Amadeus access token
    const flightTokenParams = new URLSearchParams();
    flightTokenParams.append('grant_type', 'client_credentials');
    flightTokenParams.append('client_id', process.env.AMADEUS_CLIENT_ID);
    flightTokenParams.append('client_secret', process.env.AMADEUS_CLIENT_SECRET);

    const tokenResponse = await axios.post(
      'https://test.api.amadeus.com/v1/security/oauth2/token',
      flightTokenParams,
      {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      }
    );

    const token = tokenResponse.data.access_token;

    // Search for flights
    const flightResponse = await axios.get(
      'https://test.api.amadeus.com/v2/shopping/flight-offers',
      {
        params: {
          originLocationCode: from,
          destinationLocationCode: to,
          departureDate: departureDate,
          adults: adults || 1,
          max: 10
        },
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    const flights = flightResponse.data.data?.map(flight => ({
      id: flight.id,
      source: flight.source,
      instantTicketingRequired: flight.instantTicketingRequired,
      nonHomogeneous: flight.nonHomogeneous,
      oneWay: flight.oneWay,
      lastTicketingDate: flight.lastTicketingDate,
      numberOfBookableSeats: flight.numberOfBookableSeats,
      itineraries: flight.itineraries?.map(itinerary => ({
        duration: itinerary.duration,
        segments: itinerary.segments?.map(segment => ({
          departure: {
            iataCode: segment.departure?.iataCode,
            at: segment.departure?.at
          },
          arrival: {
            iataCode: segment.arrival?.iataCode,
            at: segment.arrival?.at
          },
          carrierCode: segment.carrierCode,
          number: segment.number,
          aircraft: segment.aircraft?.code,
          operating: segment.operating?.carrierCode,
          stops: segment.stops?.length || 0
        }))
      })),
      price: {
        currency: flight.price?.currency,
        total: flight.price?.total,
        base: flight.price?.base
      },
      pricingOptions: flight.pricingOptions,
      validatingAirlineCodes: flight.validatingAirlineCodes,
      travelerPricings: flight.travelerPricings
    })) || [];

    res.json({
      success: true,
      flights,
      total: flights.length
    });
  } catch (error) {
    console.error('Error fetching flights:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch flights',
      error: error.message,
      hint: 'Ensure Amadeus credentials and location codes are correct'
    });
  }
});

// Get Airport/City Codes (for flight search)
router.get('/location-codes/:keyword', async (req, res) => {
  try {
    const { keyword } = req.params;

    // Get Amadeus access token
    const tokenResponse = await axios.post(
      'https://test.api.amadeus.com/v1/security/oauth2/token',
      {
        grant_type: 'client_credentials',
        client_id: process.env.AMADEUS_CLIENT_ID,
        client_secret: process.env.AMADEUS_CLIENT_SECRET
      },
      {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      }
    );

    const token = tokenResponse.data.access_token;

    // Get location codes
    const locationResponse = await axios.get(
      'https://test.api.amadeus.com/v1/reference-data/locations',
      {
        params: {
          keyword: keyword,
          subType: 'AIRPORT,CITY'
        },
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    const locations = locationResponse.data.data?.map(location => ({
      iataCode: location.iataCode,
      name: location.name,
      type: location.type,
      subType: location.subType,
      countryCode: location.address?.countryCode
    })) || [];

    res.json({
      success: true,
      locations,
      total: locations.length
    });
  } catch (error) {
    console.error('Error fetching location codes:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch location codes',
      error: error.message
    });
  }
});

// Country Info API (REST Countries - No key needed)
router.get('/country-info/:country', async (req, res) => {
  try {
    const { country } = req.params;

    const response = await axios.get(
      `https://restcountries.com/v3.1/name/${country}`
    );

    const countryData = response.data[0];
    const info = {
      name: countryData.name?.common,
      official: countryData.name?.official,
      flag: countryData.flag,
      region: countryData.region,
      subregion: countryData.subregion,
      capital: countryData.capital?.[0],
      currency: countryData.currencies ? Object.keys(countryData.currencies)[0] : null,
      currencyName: countryData.currencies ? countryData.currencies[Object.keys(countryData.currencies)[0]].name : null,
      languages: countryData.languages,
      timezone: countryData.timezones?.[0],
      area: countryData.area,
      population: countryData.population
    };

    res.json({
      success: true,
      data: info
    });
  } catch (error) {
    console.error('Error fetching country info:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch country information',
      error: error.message
    });
  }
});

// Weather API (OpenWeather - Optional)
router.get('/weather/:city', async (req, res) => {
  try {
    const { city } = req.params;

    if (!process.env.OPENWEATHER_API_KEY) {
      return res.status(400).json({
        success: false,
        message: 'Weather API key not configured'
      });
    }

    const response = await axios.get(
      'https://api.openweathermap.org/data/2.5/weather',
      {
        params: {
          q: city,
          appid: process.env.OPENWEATHER_API_KEY,
          units: 'metric'
        }
      }
    );

    const weather = {
      city: response.data.name,
      country: response.data.sys?.country,
      temperature: response.data.main?.temp,
      feelsLike: response.data.main?.feels_like,
      humidity: response.data.main?.humidity,
      pressure: response.data.main?.pressure,
      description: response.data.weather?.[0]?.description,
      icon: response.data.weather?.[0]?.icon,
      windSpeed: response.data.wind?.speed,
      cloudiness: response.data.clouds?.all
    };

    res.json({
      success: true,
      data: weather
    });
  } catch (error) {
    console.error('Error fetching weather:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch weather information',
      error: error.message
    });
  }
});

module.exports = router;
