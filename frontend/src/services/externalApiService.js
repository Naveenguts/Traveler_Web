const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const externalAPI = {
  // Get famous places/attractions for a destination
  getPlaces: async (destination) => {
    try {
      const response = await fetch(`${API_URL}/external/places/${destination}`);
      if (!response.ok) throw new Error('Failed to fetch places');
      return await response.json();
    } catch (error) {
      console.error('Error fetching places:', error);
      throw error;
    }
  },

  // Get hotels for a destination
  getHotels: async (destination, checkInDate, checkOutDate, adults = 1) => {
    try {
      const params = new URLSearchParams({
        checkInDate: checkInDate || new Date(Date.now() + 86400000).toISOString().split('T')[0],
        checkOutDate: checkOutDate || new Date(Date.now() + 172800000).toISOString().split('T')[0],
        adults: adults
      });
      
      const response = await fetch(`${API_URL}/external/hotels/${destination}?${params}`);
      if (!response.ok) throw new Error('Failed to fetch hotels');
      return await response.json();
    } catch (error) {
      console.error('Error fetching hotels:', error);
      throw error;
    }
  },

  // Search for flights
  searchFlights: async (from, to, departureDate, adults = 1) => {
    try {
      const params = new URLSearchParams({
        from: from,
        to: to,
        departureDate: departureDate,
        adults: adults
      });
      
      const response = await fetch(`${API_URL}/external/flights?${params}`);
      if (!response.ok) throw new Error('Failed to fetch flights');
      return await response.json();
    } catch (error) {
      console.error('Error fetching flights:', error);
      throw error;
    }
  },

  // Get airport/city codes for flight search
  getLocationCodes: async (keyword) => {
    try {
      const response = await fetch(`${API_URL}/external/location-codes/${keyword}`);
      if (!response.ok) throw new Error('Failed to fetch location codes');
      return await response.json();
    } catch (error) {
      console.error('Error fetching location codes:', error);
      throw error;
    }
  },

  // Get country information
  getCountryInfo: async (countryName) => {
    try {
      const response = await fetch(`${API_URL}/external/country-info/${countryName}`);
      if (!response.ok) throw new Error('Failed to fetch country info');
      return await response.json();
    } catch (error) {
      console.error('Error fetching country info:', error);
      throw error;
    }
  },

  // Get weather for a city
  getWeather: async (city) => {
    try {
      const response = await fetch(`${API_URL}/external/weather/${city}`);
      if (!response.ok) throw new Error('Failed to fetch weather');
      return await response.json();
    } catch (error) {
      console.error('Error fetching weather:', error);
      throw error;
    }
  }
};

export default externalAPI;
