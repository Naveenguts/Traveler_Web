import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { reviewAPI, destinationAPI } from '../services/reviewService';
import { externalAPI } from '../services/externalApiService';

const destinationsData = [
  { 
    id: 1, 
    name: 'Paris', 
    country: 'France',
    description: 'City of Lights', 
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&h=500&fit=crop',
    longDescription: 'Paris, the capital of France, is one of the most iconic cities in the world. Known for its art, fashion, gastronomy, and culture, Paris offers unforgettable experiences from the Eiffel Tower to the Louvre Museum.',
    price: 2500,
    duration: 7,
    famousPlaces: [
      { name: 'Eiffel Tower', description: 'Iconic iron tower and symbol of Paris', image: 'https://images.unsplash.com/photo-1511739001486-6bfe966ce51b?w=300&h=200&fit=crop' },
      { name: 'Louvre Museum', description: 'World\'s largest art museum', image: 'https://images.unsplash.com/photo-1499480098471-c6ff26a84fb4?w=300&h=200&fit=crop' },
      { name: 'Notre-Dame Cathedral', description: 'Historic Gothic cathedral with stunning architecture', image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=300&h=200&fit=crop' },
      { name: 'Champs-Élysées', description: 'Elegant avenue lined with shops and cafés', image: 'https://images.unsplash.com/photo-1520956305896-3a55c8340e74?w=300&h=200&fit=crop' },
      { name: 'Montmartre', description: 'Historic hilltop neighborhood with artistic charm', image: 'https://images.unsplash.com/photo-1493514789921-586cb221acd7?w=300&h=200&fit=crop' }
    ],
    hotels: [
      { name: 'Hotel Lutetia', stars: 5, price: 18000, description: 'Luxury hotel in central Paris with world-class amenities' },
      { name: 'Le Meurice', stars: 5, price: 20000, description: 'Ultra-luxurious palace hotel with Michelin-starred dining' },
      { name: 'Hotel de Crillon', stars: 5, price: 17000, description: 'Historic luxury hotel on the Champs-Élysées' },
      { name: 'Ibis Paris', stars: 3, price: 6000, description: 'Affordable & comfortable stay near metro stations' },
      { name: 'Generator Paris', stars: 2, price: 3000, description: 'Budget-friendly hostel with vibrant community atmosphere' }
    ],
    flights: {
      nearestAirport: 'Charles de Gaulle (CDG)',
      fromIndia: 'Delhi (DEL) → Paris (CDG)',
      duration: '9-10 hours (with 1 stop)',
      airlines: ['Air France', 'Emirates', 'Lufthansa', 'Turkish Airlines'],
      averagePrice: '₹45,000 - ₹70,000'
    }
  },
  { 
    id: 2, 
    name: 'Tokyo', 
    country: 'Japan',
    description: 'Land of the Rising Sun', 
    image: 'https://images.unsplash.com/photo-1540959375944-7049f642e9a4?w=800&h=500&fit=crop',
    longDescription: 'Tokyo is a bustling metropolis that seamlessly blends ancient traditions with modern technology. Experience incredible food, vibrant neighborhoods, and rich cultural heritage.',
    price: 3200,
    duration: 10,
    famousPlaces: [
      { name: 'Senso-ji Temple', description: 'Tokyo\'s oldest temple with historic charm', image: 'https://images.unsplash.com/photo-1540959375944-7049f642e9a4?w=300&h=200&fit=crop' },
      { name: 'Tokyo Skytree', description: 'Tallest structure in Japan with observation decks', image: 'https://images.unsplash.com/photo-1563629049957-78b5a4e4e5c7?w=300&h=200&fit=crop' },
      { name: 'Shibuya Crossing', description: 'World\'s busiest pedestrian crossing', image: 'https://images.unsplash.com/photo-1511739001486-6bfe966ce51b?w=300&h=200&fit=crop' },
      { name: 'Mount Fuji', description: 'Japan\'s iconic snow-capped mountain', image: 'https://images.unsplash.com/photo-1522383546121-2c5a00621cff?w=300&h=200&fit=crop' },
      { name: 'Meiji Shrine', description: 'Peaceful Shinto shrine in a forested area', image: 'https://images.unsplash.com/photo-1493514789921-586cb221acd7?w=300&h=200&fit=crop' }
    ],
    hotels: [
      { name: 'Park Hyatt Tokyo', stars: 5, price: 22000, description: 'Luxury hotel with panoramic city views' },
      { name: 'The Peninsula Tokyo', stars: 5, price: 19000, description: 'Elegant hotel near Imperial Palace' },
      { name: 'Shinjuku Prince Hotel', stars: 4, price: 12000, description: 'Business hotel in vibrant Shinjuku area' },
      { name: 'Hotel Gracery Shinjuku', stars: 3, price: 8000, description: 'Modern affordable hotel near Shinjuku Station' },
      { name: 'Khaosan Tokyo Kabuki', stars: 2, price: 2500, description: 'Cozy budget hostel in Asakusa' }
    ],
    flights: {
      nearestAirport: 'Narita (NRT) / Haneda (HND)',
      fromIndia: 'Delhi (DEL) → Tokyo (HND)',
      duration: '7-8 hours (with 1 stop)',
      airlines: ['ANA', 'JAL', 'United Airlines', 'Emirates'],
      averagePrice: '₹40,000 - ₹65,000'
    }
  },
  { 
    id: 3, 
    name: 'New York', 
    country: 'USA',
    description: 'The Big Apple', 
    image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800&h=500&fit=crop',
    longDescription: 'New York City is the city that never sleeps. From Times Square to Central Park, Broadway shows to world-class museums, NYC offers endless excitement and cultural diversity.',
    price: 2800,
    duration: 5,
    famousPlaces: [
      { name: 'Statue of Liberty', description: 'Iconic symbol of freedom and democracy', image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=300&h=200&fit=crop' },
      { name: 'Central Park', description: 'Large urban park with scenic walks and activities', image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=200&fit=crop' },
      { name: 'Times Square', description: 'Bustling commercial and entertainment hub', image: 'https://images.unsplash.com/photo-1515288840272-e4ebe2b1b50e?w=300&h=200&fit=crop' },
      { name: 'Empire State Building', description: 'Art Deco skyscraper with observation deck', image: 'https://images.unsplash.com/photo-1520556881214-36ccdd98e2fb?w=300&h=200&fit=crop' },
      { name: 'Brooklyn Bridge', description: 'Historic bridge with stunning Manhattan views', image: 'https://images.unsplash.com/photo-1503235930437-8c6293ba41f3?w=300&h=200&fit=crop' }
    ],
    hotels: [
      { name: 'The Plaza Hotel', stars: 5, price: 25000, description: 'Iconic luxury hotel on Fifth Avenue' },
      { name: 'Waldorf Astoria', stars: 5, price: 23000, description: 'Historic luxury hotel with elegant suites' },
      { name: 'Marriott Marquis', stars: 4, price: 14000, description: 'Large hotel in Times Square with great views' },
      { name: 'Holiday Inn Express', stars: 3, price: 9000, description: 'Mid-range comfortable hotel' },
      { name: 'HI New York Hostel', stars: 2, price: 3500, description: 'Budget-friendly hostel on Upper West Side' }
    ],
    flights: {
      nearestAirport: 'JFK / LaGuardia (LGA)',
      fromIndia: 'Delhi (DEL) → New York (JFK)',
      duration: '15-16 hours (non-stop)',
      airlines: ['Air India', 'United Airlines', 'American Airlines', 'Emirates'],
      averagePrice: '₹50,000 - ₹80,000'
    }
  },
  { 
    id: 4, 
    name: 'London', 
    country: 'UK',
    description: 'The Capital of England', 
    image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&h=500&fit=crop',
    longDescription: 'London combines centuries of history with cutting-edge innovation. Visit Buckingham Palace, explore world-renowned museums, and enjoy the vibrant theater scene.',
    price: 2200,
    duration: 6,
    famousPlaces: [
      { name: 'Big Ben & Parliament', description: 'Gothic Revival architecture and iconic clock tower', image: 'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?w=300&h=200&fit=crop' },
      { name: 'Buckingham Palace', description: 'Official residence of the British Monarch', image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=300&h=200&fit=crop' },
      { name: 'Tower of London', description: 'Historic castle with Crown Jewels exhibition', image: 'https://images.unsplash.com/photo-1532619927891-a4d71312aabf?w=300&h=200&fit=crop' },
      { name: 'British Museum', description: 'World-renowned museum with ancient artifacts', image: 'https://images.unsplash.com/photo-1498199810021-b21ba212f0b0?w=300&h=200&fit=crop' },
      { name: 'Tower Bridge', description: 'Iconic bascule bridge with stunning views', image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=300&h=200&fit=crop' }
    ],
    hotels: [
      { name: 'Claridge\'s', stars: 5, price: 20000, description: 'Iconic luxury hotel in Mayfair' },
      { name: 'Savoy', stars: 5, price: 19000, description: 'Riverside luxury hotel with river views' },
      { name: 'Marriott Grosvenor Square', stars: 4, price: 13000, description: 'Upper-class hotel in central London' },
      { name: 'Premier Inn', stars: 3, price: 7000, description: 'Budget-friendly hotel chain' },
      { name: 'YHA London Central', stars: 2, price: 3000, description: 'Affordable hostel near British Museum' }
    ],
    flights: {
      nearestAirport: 'Heathrow (LHR) / Gatwick (LGW)',
      fromIndia: 'Delhi (DEL) → London (LHR)',
      duration: '8-9 hours (non-stop)',
      airlines: ['Air India', 'British Airways', 'Virgin Atlantic', 'Emirates'],
      averagePrice: '₹35,000 - ₹60,000'
    }
  },
  { 
    id: 5, 
    name: 'Dubai', 
    country: 'UAE',
    description: 'City of Gold', 
    image: 'https://images.unsplash.com/photo-1512453693020-ce7e46f9e4c9?w=800&h=500&fit=crop',
    longDescription: 'Dubai is a futuristic city in the desert, known for luxury shopping, ultramodern architecture, and a lively nightlife scene. Experience the Burj Khalifa and traditional souks.',
    price: 3500,
    duration: 8,
    famousPlaces: [
      { name: 'Burj Khalifa', description: 'World\'s tallest building with observation decks', image: 'https://images.unsplash.com/photo-1512453693020-ce7e46f9e4c9?w=300&h=200&fit=crop' },
      { name: 'Dubai Mall', description: 'One of the world\'s largest shopping malls', image: 'https://images.unsplash.com/photo-1520444196009-9efc8c1d50f5?w=300&h=200&fit=crop' },
      { name: 'Palm Jumeirah', description: 'Artificial palm-shaped island with luxury resorts', image: 'https://images.unsplash.com/photo-1512453693020-ce7e46f9e4c9?w=300&h=200&fit=crop' },
      { name: 'Gold Souk', description: 'Traditional market selling gold and jewelry', image: 'https://images.unsplash.com/photo-1505228395891-9a51e7e86e81?w=300&h=200&fit=crop' },
      { name: 'Dubai Marina', description: 'Modern waterfront with luxury yachts and dining', image: 'https://images.unsplash.com/photo-1520444196009-9efc8c1d50f5?w=300&h=200&fit=crop' }
    ],
    hotels: [
      { name: 'Burj Al Arab', stars: 5, price: 28000, description: 'Ultra-luxury 7-star hotel shaped like a sail' },
      { name: 'Atlantis The Palm', stars: 5, price: 22000, description: 'Resort with aquarium and water park' },
      { name: 'Emirates Palace', stars: 5, price: 20000, description: 'Opulent palace-style luxury hotel' },
      { name: 'Holiday Inn Dubai Marina', stars: 3, price: 8000, description: 'Modern 3-star hotel with marina views' },
      { name: 'Gold Coast Hotel', stars: 2, price: 4000, description: 'Budget beach hotel' }
    ],
    flights: {
      nearestAirport: 'Dubai International (DXB)',
      fromIndia: 'Delhi (DEL) → Dubai (DXB)',
      duration: '3.5 hours (non-stop)',
      airlines: ['Emirates', 'FlyDubai', 'Air India', 'Flydubai'],
      averagePrice: '₹15,000 - ₹35,000'
    }
  },
  { 
    id: 6, 
    name: 'Barcelona', 
    country: 'Spain',
    description: 'City by the Sea', 
    image: 'https://images.unsplash.com/photo-1562883676-8c6fbdf495c0?w=800&h=500&fit=crop',
    longDescription: 'Barcelona offers stunning architecture by Gaudí, beautiful beaches, delicious cuisine, and a vibrant cultural scene. The perfect blend of urban excitement and Mediterranean relaxation.',
    price: 1800,
    duration: 5,
    famousPlaces: [
      { name: 'Sagrada Familia', description: 'Iconic basilica designed by Antoni Gaudí', image: 'https://images.unsplash.com/photo-1562883676-8c6fbdf495c0?w=300&h=200&fit=crop' },
      { name: 'Park Güell', description: 'Colorful mosaic park with panoramic city views', image: 'https://images.unsplash.com/photo-1469022563149-aa64dbd37dae?w=300&h=200&fit=crop' },
      { name: 'Las Ramblas', description: 'Tree-lined pedestrian street with street performers', image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=300&h=200&fit=crop' },
      { name: 'Gothic Quarter', description: 'Medieval neighborhood with narrow winding streets', image: 'https://images.unsplash.com/photo-1562883676-8c6fbdf495c0?w=300&h=200&fit=crop' },
      { name: 'Barcelona Beach', description: 'Beautiful Mediterranean beach for relaxation', image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=300&h=200&fit=crop' }
    ],
    hotels: [
      { name: 'Hotel Arts Barcelona', stars: 5, price: 18000, description: 'Modern luxury hotel with beach views' },
      { name: 'Mandarin Oriental Barcelona', stars: 5, price: 17000, description: 'Elegant luxury hotel with rooftop pool' },
      { name: 'Paseo de Gracia Hotel', stars: 4, price: 11000, description: 'Boutique hotel on famous avenue' },
      { name: 'Hotel Continental', stars: 3, price: 5500, description: 'Budget-friendly hotel in Gothic Quarter' },
      { name: 'Generator Barcelona', stars: 2, price: 2500, description: 'Budget hostel with social atmosphere' }
    ],
    flights: {
      nearestAirport: 'Barcelona-El Prat (BCN)',
      fromIndia: 'Delhi (DEL) → Barcelona (BCN)',
      duration: '10-11 hours (1 stop)',
      airlines: ['Air India', 'Lufthansa', 'Turkish Airlines', 'Ryanair'],
      averagePrice: '₹38,000 - ₹62,000'
    }
  },
];



const StarRating = ({ rating, onRatingChange, readonly = false }) => {
  const [hoveredRating, setHoveredRating] = useState(0);

  return (
    <div className="star-rating">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={`star ${readonly ? 'readonly' : ''} ${star <= (hoveredRating || rating) ? 'filled' : ''}`}
          onClick={() => !readonly && onRatingChange(star)}
          onMouseEnter={() => !readonly && setHoveredRating(star)}
          onMouseLeave={() => !readonly && setHoveredRating(0)}
        >
          ★
        </span>
      ))}
    </div>
  );
};

const DestinationDetails = () => {
  const { id } = useParams();
  const { user, addTrip, trips, token } = useAuth();
  const destination = destinationsData.find(dest => dest.id === parseInt(id));
  
  const [apiDestination, setApiDestination] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [reviewsError, setReviewsError] = useState(null);
  const [submittingReview, setSubmittingReview] = useState(false);
  const [newReview, setNewReview] = useState({ rating: 0, comment: '' });
  const [showReviewForm, setShowReviewForm] = useState(false);
  // Real API data
  const [realFlights, setRealFlights] = useState(null);
  const [realHotels, setRealHotels] = useState(null);
  const [realWeather, setRealWeather] = useState(null);
  const [countryInfo, setCountryInfo] = useState(null);
  const [flightsLoading, setFlightsLoading] = useState(false);
  const [hotelsLoading, setHotelsLoading] = useState(false);
  const [weatherLoading, setWeatherLoading] = useState(false);
  const [flightsError, setFlightsError] = useState(null);
  const [hotelsError, setHotelsError] = useState(null);
  const [weatherError, setWeatherError] = useState(null);
  const [weatherRetryCount, setWeatherRetryCount] = useState(0);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showUpiPinModal, setShowUpiPinModal] = useState(false);
  const [showOverlapWarning, setShowOverlapWarning] = useState(false);
  const [overlappingTrips, setOverlappingTrips] = useState([]);
  const [dateConflicts, setDateConflicts] = useState([]);
  const [locationConflicts, setLocationConflicts] = useState([]);
  const [bookingData, setBookingData] = useState({
    startDate: '',
    endDate: '',
    description: ''
  });
  const [showConflictDetails, setShowConflictDetails] = useState(false);
  const [lastBookingAttempt, setLastBookingAttempt] = useState(null);
  const [previewDateConflicts, setPreviewDateConflicts] = useState(0);
  const [previewLocationConflicts, setPreviewLocationConflicts] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('card'); // 'card', 'upi', 'netbanking'
  const [upiApp, setUpiApp] = useState(''); // 'googlepay', 'phonepe', 'paytm', 'bhim'
  const [bankDetails, setBankDetails] = useState({
    accountNumber: '',
    confirmAccountNumber: '',
    ifscCode: '',
    accountHolder: ''
  });
  const [paymentData, setPaymentData] = useState({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
    upiId: '',
    upiPin: '',
    bankName: ''
  });
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpValue, setOtpValue] = useState('');

  // UPI app details and PIN requirements
  const upiApps = {
    googlepay: { name: 'Google Pay', pinLength: 5, logo: '/assets/google-pay-logo.svg' },
    phonepe: { name: 'PhonePe', pinLength: 6, logo: '/assets/phonepe-logo.svg' },
    paytm: { name: 'Paytm', pinLength: 4, logo: '/assets/paytm-1.svg' },
    bhim: { name: 'BHIM UPI', pinLength: 6 }
  };

  const renderUpiLogo = (appKey, variant = 'md') => {
    const app = upiApps[appKey];
    if (!app) return null;

    const sizeClass = variant === 'lg' ? 'app-logo-lg' : '';
    const fallbackLabel = (app.name || 'UPI').split(' ')[0];

    return (
      <div className={`app-logo ${sizeClass}`}>
        {app.logo ? (
          <img src={app.logo} alt={`${app.name} logo`} />
        ) : (
          <span className="app-logo-fallback">{fallbackLabel}</span>
        )}
      </div>
    );
  };

  const getPinLength = () => {
    if (!upiApp) return 6;
    return upiApps[upiApp]?.pinLength || 6;
  };

  const formatAccountNumber = (value) => {
    const cleaned = value.replace(/\s/g, '');
    const chunks = cleaned.match(/.{1,4}/g);
    return chunks ? chunks.join(' ') : cleaned;
  };

  const validateIfsc = (ifsc) => /^[A-Z]{4}0[A-Z0-9]{6}$/.test(ifsc);

  const validateAccountNumber = (account) => /^\d{9,18}$/.test(account.replace(/\s/g, ''));

  if (!destination) return <p>Destination not found!</p>;

  // Hydrate last booking attempt from localStorage once
  useEffect(() => {
    try {
      const saved = localStorage.getItem('lastBookingAttempt');
      if (saved) {
        const parsed = JSON.parse(saved);
        setLastBookingAttempt(parsed);
        if (!bookingData.startDate && !bookingData.endDate && !bookingData.description) {
          setBookingData(parsed);
        }
      }
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Persist booking data as user fills it
  useEffect(() => {
    try {
      if (bookingData.startDate || bookingData.endDate || bookingData.description) {
        localStorage.setItem('lastBookingAttempt', JSON.stringify(bookingData));
        setLastBookingAttempt(bookingData);
      }
    } catch {}
  }, [bookingData]);

  // Live conflict preview under date fields
  useEffect(() => {
    try {
      if (!bookingData.startDate || !bookingData.endDate || !Array.isArray(trips)) {
        setPreviewDateConflicts(0);
        setPreviewLocationConflicts(0);
        return;
      }
      const newStart = new Date(bookingData.startDate);
      const newEnd = new Date(bookingData.endDate);
      const overlapping = trips.filter(trip => {
        const isActive = !trip.status || trip.status === 'upcoming';
        if (!isActive) return false;
        const tripStart = new Date(trip.startDate);
        const tripEnd = new Date(trip.endDate);
        return (newStart <= tripEnd && newEnd >= tripStart);
      });
      let dc = 0, lc = 0;
      overlapping.forEach(trip => {
        const sameDestination = (trip.destinationName || '').toLowerCase() === destination.name.toLowerCase();
        const exactSameDates = new Date(trip.startDate).toDateString() === newStart.toDateString() && new Date(trip.endDate).toDateString() === newEnd.toDateString();
        if (sameDestination || exactSameDates) dc += 1; else lc += 1;
      });
      setPreviewDateConflicts(dc);
      setPreviewLocationConflicts(lc);
    } catch {
      setPreviewDateConflicts(0);
      setPreviewLocationConflicts(0);
    }
  }, [bookingData.startDate, bookingData.endDate, trips, destination.name]);

  // Fetch destination from API and then reviews
  useEffect(() => {
    const fetchDestinationAndReviews = async () => {
      if (!destination) return;
      
      try {
        setReviewsLoading(true);
        setReviewsError(null);
        
        console.log('Fetching destination and reviews for:', destination.name);
        
        // First, try to get all destinations from API to find the matching one
        try {
          const destData = await destinationAPI.getAllDestinations();
          console.log('Destinations from API:', destData);
          
          const apiDest = destData.destinations?.find(
            d => d.name.toLowerCase() === destination.name.toLowerCase()
          );
          
          if (apiDest) {
            console.log('Found matching destination:', apiDest);
            setApiDestination(apiDest);
            // Now fetch reviews using the real MongoDB ID
            const reviewData = await reviewAPI.getDestinationReviews(apiDest._id);
            console.log('Reviews fetched:', reviewData);
            setReviews(reviewData.reviews || []);
          } else {
            // Destination not found in API, show message
            console.error('Destination not found in API');
            setReviewsError('Destination not found in database. Please seed destinations first.');
            setReviews([]);
          }
        } catch (apiError) {
          // API might not be available or destinations not seeded
          console.error('API Error:', apiError);
          setReviewsError('Unable to connect to server. Reviews are unavailable.');
          setReviews([]);
        }
      } catch (error) {
        console.error('Failed to fetch reviews:', error);
        setReviewsError(error.message);
        setReviews([]);
      } finally {
        setReviewsLoading(false);
      }
    };

    fetchDestinationAndReviews();
  }, [destination]);

  // Fetch real-time flights and hotels data
  useEffect(() => {
    const fetchExternalData = async () => {
      if (!destination) return;

      try {
        // Map destination names to airport codes
        const airportCodes = {
          'Paris': { flight: 'CDG', city: 'Paris' },
          'Tokyo': { flight: 'HND', city: 'Tokyo' },
          'New York': { flight: 'JFK', city: 'New York' },
          'Barcelona': { flight: 'BCN', city: 'Barcelona' },
          'Bangkok': { flight: 'BKK', city: 'Bangkok' }
        };

        const airports = airportCodes[destination.name] || { flight: 'CDG', city: destination.name };

        // Fetch flights
        try {
          setFlightsLoading(true);
          const tomorrow = new Date();
          tomorrow.setDate(tomorrow.getDate() + 1);
          const dateStr = tomorrow.toISOString().split('T')[0];

          const flightData = await externalAPI.searchFlights('DEL', airports.flight, dateStr, 1);
          setRealFlights(flightData);
          setFlightsError(null);
        } catch (err) {
          console.error('Error fetching flights:', err);
          setFlightsError('Unable to load real flights. Using static data.');
          setRealFlights(null);
        } finally {
          setFlightsLoading(false);
        }

        // Fetch hotels
        try {
          setHotelsLoading(true);
          const checkIn = new Date();
          checkIn.setDate(checkIn.getDate() + 1);
          const checkOut = new Date(checkIn);
          checkOut.setDate(checkOut.getDate() + 3);

          console.log('🏨 Fetching hotels for:', airports.city, 'from', checkIn.toISOString().split('T')[0], 'to', checkOut.toISOString().split('T')[0]);
          
          const hotelData = await externalAPI.getHotels(
            airports.city,
            checkIn.toISOString().split('T')[0],
            checkOut.toISOString().split('T')[0],
            1
          );
          
          console.log('🏨 Hotels API Response:', hotelData);
          console.log('🏨 Hotels count:', hotelData?.hotels?.length || 0);
          
          if (hotelData && hotelData.success) {
            if (hotelData.isEmpty || hotelData.hotels.length === 0) {
              setHotelsError('Hotels unavailable for selected location');
              setRealHotels(null);
            } else {
              setRealHotels(hotelData);
              setHotelsError(null);
            }
          } else {
            setHotelsError('Live data unavailable. Showing recommendations.');
            setRealHotels(null);
          }
        } catch (err) {
          console.error('❌ Error fetching hotels:', err);
          console.error('❌ Error details:', err.message);
          setHotelsError('Live data unavailable. Showing recommendations.');
          setRealHotels(null);
        } finally {
          setHotelsLoading(false);
        }

        // Fetch weather
        try {
          setWeatherLoading(true);
          const weatherData = await externalAPI.getWeather(airports.city);
          console.log('🌤️ Weather data:', weatherData);
          
          // Validate weather response structure
          if (weatherData && weatherData.success && weatherData.data && weatherData.data.temperature !== undefined) {
            setRealWeather(weatherData);
            setWeatherError(null);
            setWeatherRetryCount(0);
            console.log('✅ Weather fetched successfully for:', airports.city);
          } else {
            console.warn('⚠️ Weather API returned incomplete data for:', airports.city);
            setWeatherError(`Weather data unavailable for "${airports.city}". This location may not be in the weather database.`);
            setRealWeather(null);
          }
        } catch (err) {
          console.error('❌ Error fetching weather:', err.message);
          let errorMessage = 'Unable to fetch weather data';
          
          if (err.response?.status === 404) {
            errorMessage = `Weather not available for "${airports.city}" - location not found in database`;
          } else if (err.response?.status === 401) {
            errorMessage = 'Weather API authentication failed - check API key configuration';
          } else if (err.message.includes('Network')) {
            errorMessage = 'Network error - unable to reach weather service. Check your connection.';
          }
          
          setWeatherError(errorMessage);
          setRealWeather(null);
        } finally {
          setWeatherLoading(false);
        }

        // Fetch country info
        try {
          const countryData = await externalAPI.getCountryInfo(destination.country);
          console.log('🌍 Country info:', countryData);
          setCountryInfo(countryData);
        } catch (err) {
          console.error('❌ Error fetching country info:', err);
          setCountryInfo(null);
        }
      } catch (error) {
        console.error('Error in external API fetch:', error);
      }
    };

    fetchExternalData();
  }, [destination]);

  // Retry weather fetch with alternative city names
  const retryWeatherFetch = async () => {
    if (!destination) return;
    
    try {
      setWeatherRetryCount(prev => prev + 1);
      setWeatherLoading(true);
      setWeatherError(null);
      
      // Try with destination country as fallback
      const cityToTry = destination.name;
      console.log('🔄 Retrying weather fetch for:', cityToTry, '(Attempt:', weatherRetryCount + 1, ')');
      
      const weatherData = await externalAPI.getWeather(cityToTry);
      console.log('🌤️ Weather retry data:', weatherData);
      
      if (weatherData && weatherData.success && weatherData.data && weatherData.data.temperature !== undefined) {
        setRealWeather(weatherData);
        setWeatherError(null);
        setWeatherRetryCount(0);
        console.log('✅ Weather fetched successfully on retry');
      } else {
        const errorMsg = weatherRetryCount >= 2 
          ? `Weather not available for "${cityToTry}". Please try another destination.`
          : `Weather data unavailable for "${cityToTry}". Please try again.`;
        setWeatherError(errorMsg);
        setRealWeather(null);
      }
    } catch (err) {
      console.error('❌ Weather retry failed:', err.message);
      const errorMsg = weatherRetryCount >= 2
        ? 'Unable to fetch weather after multiple attempts. Please check your connection.'
        : 'Failed to fetch weather. Please try again.';
      setWeatherError(errorMsg);
      setRealWeather(null);
    } finally {
      setWeatherLoading(false);
    }
  };

  // Calculate average rating
  const averageRating = reviews.length > 0 
    ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)
    : 0;

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    
    if (!user) {
      alert('Please login to submit a review');
      return;
    }

    if (newReview.rating === 0) {
      alert('Please select a rating');
      return;
    }

    if (newReview.comment.trim() === '') {
      alert('Please write a review comment');
      return;
    }

    if (newReview.comment.trim().length < 10) {
      alert('Review must be at least 10 characters long');
      return;
    }

    try {
      setSubmittingReview(true);
      
      if (!apiDestination) {
        alert('Destination not found in database. Please ensure destinations are seeded.');
        setSubmittingReview(false);
        return;
      }
      
      const response = await reviewAPI.createReview(
        apiDestination._id,
        destination.name,
        newReview.rating,
        newReview.comment.trim(),
        token
      );

      // Add new review to the top of the list
      const reviewWithAvatar = {
        ...response.review,
        userAvatar: user.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase() : 'U'
      };
      setReviews([reviewWithAvatar, ...reviews]);
      setNewReview({ rating: 0, comment: '' });
      setShowReviewForm(false);
      alert('Review submitted successfully!');
    } catch (error) {
      console.error('Failed to submit review:', error);
      alert(error.message || 'Failed to submit review. Please try again.');
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleBookTrip = (e) => {
    e.preventDefault();
    
    if (!user) {
      alert('Please login to book a trip');
      return;
    }

    if (!bookingData.startDate || !bookingData.endDate) {
      alert('Please select travel dates');
      return;
    }

    // Check for overlapping trips
    const newStart = new Date(bookingData.startDate);
    const newEnd = new Date(bookingData.endDate);
    
    const overlapping = trips.filter(trip => {
      const isActive = !trip.status || trip.status === 'upcoming';
      if (!isActive) return false;
      const tripStart = new Date(trip.startDate);
      const tripEnd = new Date(trip.endDate);
      
      // Check if dates overlap
      return (newStart <= tripEnd && newEnd >= tripStart);
    });

    if (overlapping.length > 0) {
      setOverlappingTrips(overlapping);
      // Group conflicts: blocking date conflicts vs location conflicts
      const dc = [];
      const lc = [];
      overlapping.forEach(trip => {
        const sameDestination = (trip.destinationName || '').toLowerCase() === destination.name.toLowerCase();
        const exactSameDates = new Date(trip.startDate).toDateString() === newStart.toDateString() && new Date(trip.endDate).toDateString() === newEnd.toDateString();
        if (sameDestination || exactSameDates) {
          dc.push(trip);
        } else {
          lc.push(trip);
        }
      });
      setDateConflicts(dc);
      setLocationConflicts(lc);
      setShowConflictDetails(false);
      setShowBookingModal(false);
      setShowOverlapWarning(true);
      return;
    }

    // Move to payment modal if no overlap
    setShowBookingModal(false);
    setShowPaymentModal(true);
  };

  const handleConfirmOverlap = () => {
    setShowOverlapWarning(false);
    setShowPaymentModal(true);
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    
    // Validate payment based on method
    if (paymentMethod === 'card') {
      if (!paymentData.cardNumber || !paymentData.cardName || !paymentData.expiryDate || !paymentData.cvv) {
        alert('Please fill in all card details');
        return;
      }
      // Validate card number (basic check for 16 digits)
      if (!/^\d{16}$/.test(paymentData.cardNumber.replace(/\s/g, ''))) {
        alert('Please enter a valid 16-digit card number');
        return;
      }
      // Validate CVV
      if (!/^\d{3,4}$/.test(paymentData.cvv)) {
        alert('Please enter a valid CVV');
        return;
      }
      // Show confirmation modal
      setShowConfirmationModal(true);
    } else if (paymentMethod === 'upi') {
      if (!upiApp) {
        alert('Please select a UPI app');
        return;
      }
      if (!paymentData.upiId) {
        alert('Please enter your UPI ID');
        return;
      }
      // Basic UPI ID validation
      if (!/^[\w.-]+@[\w.-]+$/.test(paymentData.upiId)) {
        alert('Please enter a valid UPI ID (e.g., username@bank)');
        return;
      }
      // Show confirmation modal
      setShowConfirmationModal(true);
    } else if (paymentMethod === 'netbanking') {
      if (!paymentData.bankName) {
        alert('Please select a bank');
        return;
      }
      if (!bankDetails.accountNumber || !bankDetails.confirmAccountNumber || !bankDetails.ifscCode || !bankDetails.accountHolder) {
        alert('Please fill in all bank details');
        return;
      }
      if (!validateAccountNumber(bankDetails.accountNumber)) {
        alert('Please enter a valid account number (9-18 digits)');
        return;
      }
      if (bankDetails.accountNumber.replace(/\s/g, '') !== bankDetails.confirmAccountNumber.replace(/\s/g, '')) {
        alert('Account numbers do not match');
        return;
      }
      if (!validateIfsc(bankDetails.ifscCode.toUpperCase())) {
        alert('Please enter a valid IFSC code (e.g., SBIN0001234)');
        return;
      }
      // Show confirmation modal
      setShowConfirmationModal(true);
    }
  };

  const handleUpiPinSubmit = async (e) => {
    e.preventDefault();
    
    const pinLength = getPinLength();
    if (!paymentData.upiPin || paymentData.upiPin.length !== pinLength) {
      alert(`Please enter a valid ${pinLength}-digit UPI PIN`);
      return;
    }

    // Show confirmation modal
    setShowUpiPinModal(false);
    setShowConfirmationModal(true);
  };

  const processPayment = async () => {
    setIsProcessingPayment(true);

    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));

    const trip = addTrip({
      destinationName: destination.name,
      country: `${destination.country}`,
      startDate: bookingData.startDate,
      endDate: bookingData.endDate,
      description: bookingData.description || `Trip to ${destination.name}`,
      coverImage: destination.image,
      price: destination.price,
      duration: destination.duration,
      paymentMethod: paymentMethod,
      paymentStatus: 'Paid'
    });

    setIsProcessingPayment(false);
    setShowPaymentModal(false);
    setShowConfirmationModal(false);
    setShowOtpModal(false);
    setShowUpiPinModal(false);
    setBookingData({ startDate: '', endDate: '', description: '' });
    setPaymentData({
      cardNumber: '',
      cardName: '',
      expiryDate: '',
      cvv: '',
      upiId: '',
      upiPin: '',
      bankName: ''
    });
    setBankDetails({
      accountNumber: '',
      confirmAccountNumber: '',
      ifscCode: '',
      accountHolder: ''
    });
    setOtpValue('');
    setUpiApp('');
    
    alert(`Payment successful! Your trip to ${destination.name} has been booked.`);
  };

  const handleConfirmPayment = () => {
    // For net banking, show OTP modal
    if (paymentMethod === 'netbanking') {
      setShowConfirmationModal(false);
      setShowOtpModal(true);
    } else {
      // For card and UPI, process directly
      processPayment();
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    
    if (!otpValue || otpValue.length !== 6) {
      alert('Please enter a valid 6-digit OTP');
      return;
    }

    // Simulate OTP validation
    if (otpValue === '123456') {
      setShowOtpModal(false);
      await processPayment();
    } else {
      alert('Invalid OTP. Please try again. (Hint: use 123456)');
      setOtpValue('');
    }
  };

  const formatCardNumber = (value) => {
    const cleaned = value.replace(/\s/g, '');
    const chunks = cleaned.match(/.{1,4}/g);
    return chunks ? chunks.join(' ') : cleaned;
  };

  const formatExpiryDate = (value) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length >= 2) {
      return cleaned.slice(0, 2) + '/' + cleaned.slice(2, 4);
    }
    return cleaned;
  };

  return (
    <div className="destination-details">
      <div className="destination-hero">
        <img src={destination.image} alt={destination.name} className="destination-hero-image" />
        <div className="destination-hero-overlay">
          <h1>{destination.name}</h1>
          <p className="destination-country">📍 {destination.country}</p>
        </div>
      </div>

      <div className="destination-content">
        <div className="destination-info-section">
          <div className="destination-main-info">
            <h2>About {destination.name}</h2>
            <p className="destination-long-description">{destination.longDescription}</p>
            
            <div className="destination-quick-info">
              <div className="info-item">
                <span className="info-icon">💵</span>
                <div>
                  <strong>Price</strong>
                  <p>${destination.price}</p>
                </div>
              </div>
              <div className="info-item">
                <span className="info-icon">⏱️</span>
                <div>
                  <strong>Duration</strong>
                  <p>{destination.duration} days</p>
                </div>
              </div>
              <div className="info-item">
                <span className="info-icon">⭐</span>
                <div>
                  <strong>Rating</strong>
                  <p>{averageRating} ({reviews.length} reviews)</p>
                </div>
              </div>
            </div>

            <button 
              className="btn btn-book-trip"
              onClick={() => setShowBookingModal(true)}
            >
              ✈️ Book This Trip
            </button>
          </div>

          {/* Weather & Country Info Section */}
          <div className="weather-country-section">
            {/* Weather Card */}
            {weatherLoading ? (
              <div className="weather-card loading">
                <h3>🌤️ Weather</h3>
                <p>Loading weather data...</p>
              </div>
            ) : realWeather && realWeather.success && realWeather.data ? (
              <div className="weather-card">
                <h3>🌤️ Current Weather in {realWeather.data.city}</h3>
                <div className="weather-content">
                  <div className="weather-main">
                    <div className="weather-temp">{Math.round(realWeather.data.temperature)}°</div>
                    <div className="weather-desc">{realWeather.data.description}</div>
                  </div>
                  <div className="weather-details">
                    <div className="weather-detail-item">
                      <span className="detail-label">💧 Humidity:</span>
                      <span className="detail-value">{realWeather.data.humidity}%</span>
                    </div>
                    <div className="weather-detail-item">
                      <span className="detail-label">💨 Wind:</span>
                      <span className="detail-value">{realWeather.data.windSpeed.toFixed(1)} m/s</span>
                    </div>
                    <div className="weather-detail-item">
                      <span className="detail-label">🌡️ Feels Like:</span>
                      <span className="detail-value">{Math.round(realWeather.data.feelsLike)}°C</span>
                    </div>
                    <div className="weather-detail-item">
                      <span className="detail-label">🔽 Pressure:</span>
                      <span className="detail-value">{realWeather.data.pressure} hPa</span>
                    </div>
                  </div>
                </div>
                <p className="api-credit">⚡ Real-time data from OpenWeather API</p>
              </div>
            ) : (
              <div className="weather-card error">
                <h3>🌤️ Weather</h3>
                <p className="error-title">{weatherError || 'Weather data unavailable for this location'}</p>
                <p className="error-detail">
                  {weatherError?.includes('not found') 
                    ? 'This location may not be available in the weather database. Try another destination.'
                    : 'Check your internet connection and try again.'}
                </p>
                <button 
                  className="weather-retry-btn"
                  onClick={retryWeatherFetch}
                  disabled={weatherLoading}
                >
                  🔄 {weatherRetryCount > 0 ? `Retry (Attempt ${weatherRetryCount + 1})` : 'Try Again'}
                </button>
              </div>
            )}

            {/* Country Info Card */}
            {countryInfo && countryInfo.data ? (
              <div className="country-info-card">
                <h3>🌍 Country Information - {countryInfo.data.official}</h3>
                <div className="country-content">
                  <div className="country-flag">{countryInfo.data.flag}</div>
                  <div className="country-details">
                    <div className="country-detail-item">
                      <span className="detail-label">🏛️ Capital:</span>
                      <span className="detail-value">{countryInfo.data.capital}</span>
                    </div>
                    <div className="country-detail-item">
                      <span className="detail-label">💰 Currency:</span>
                      <span className="detail-value">{countryInfo.data.currencyName} ({countryInfo.data.currency})</span>
                    </div>
                    <div className="country-detail-item">
                      <span className="detail-label">👥 Population:</span>
                      <span className="detail-value">{(countryInfo.data.population / 1000000).toFixed(1)}M people</span>
                    </div>
                    <div className="country-detail-item">
                      <span className="detail-label">🗺️ Region:</span>
                      <span className="detail-value">{countryInfo.data.region}</span>
                    </div>
                    <div className="country-detail-item">
                      <span className="detail-label">🕐 Timezone:</span>
                      <span className="detail-value">{countryInfo.data.timezone}</span>
                    </div>
                  </div>
                </div>
                <p className="api-credit">⚡ Real-time data from REST Countries API</p>
              </div>
            ) : null}
          </div>

          {/* Famous Places Section */}
          {destination.famousPlaces && (
            <section className="places-section">
              <h2>Famous Places in {destination.name}</h2>
              <div className="places-grid">
                {destination.famousPlaces.map((place, index) => (
                  <div key={index} className="place-card">
                    <img src={place.image} alt={place.name} />
                    <div className="place-card-content">
                      <h4>{place.name}</h4>
                      <p>{place.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Hotels Section */}
          {destination.hotels && (
            <section className="hotels-section">
              <h2>Recommended Hotels</h2>
              
              {hotelsLoading && (
                <div className="loading-indicator">
                  <p>✈️ Loading real hotels from Amadeus...</p>
                </div>
              )}
              
              {realHotels && realHotels.hotels && Array.isArray(realHotels.hotels) && realHotels.hotels.length > 0 ? (
                <div className="real-hotels-container">
                  <h3>✨ Real-Time Hotel Options (from Amadeus)</h3>
                  <div className="hotels-grid">
                    {realHotels.hotels.slice(0, 6).map((hotel, index) => (
                      <div key={index} className="hotel-card">
                        <div className="hotel-card-header">
                          <h4>{hotel.name || `Hotel ${index + 1}`}</h4>
                          <div className="hotel-rating">
                            {'⭐'.repeat(Math.ceil(hotel.rating || 4))}
                          </div>
                        </div>
                        <p className="hotel-description">{hotel.address?.city || 'Premium accommodation'}</p>
                        <div className="hotel-details">
                          <p><strong>Location:</strong> {hotel.address?.city || 'City'}, {hotel.address?.country || 'Country'}</p>
                          <p><strong>Check-in:</strong> {hotel.checkInDate || 'TBD'}</p>
                          <p><strong>Check-out:</strong> {hotel.checkOutDate || 'TBD'}</p>
                          <p><strong>Rooms:</strong> {hotel.rooms || 1}</p>
                        </div>
                        <div className="hotel-footer">
                          <span className="hotel-price">{hotel.currency || '€'}{hotel.price || 'Contact'}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <p style={{fontSize: '12px', color: '#888', marginTop: '10px', textAlign: 'center'}}>💡 Real-time data from Amadeus API • Prices shown for selected dates</p>
                </div>
              ) : (
                <div className="static-hotels-info">
                  <div className="hotels-grid">
                    {destination.hotels.map((hotel, index) => (
                      <div key={index} className="hotel-card">
                        <div className="hotel-card-header">
                          <h4>{hotel.name}</h4>
                          <div className="hotel-rating">
                            {'⭐'.repeat(hotel.stars)}
                          </div>
                        </div>
                        <p className="hotel-description">{hotel.description}</p>
                        <div className="hotel-footer">
                          <span className="hotel-price">₹{hotel.price.toLocaleString()} / night</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  {hotelsError && <p style={{color: '#d32f2f', marginTop: '10px'}}>ℹ️ {hotelsError}</p>}
                </div>
              )}
            </section>
          )}

          {/* Flights / How to Reach Section */}
          {destination.flights && (
            <section className="flights-section">
              <h2>✈️ How to Reach {destination.name}</h2>
              
              {/* Real Flights from API */}
              {flightsLoading && (
                <div className="loading-indicator">
                  <p>✈️ Loading real flights from Amadeus...</p>
                </div>
              )}
              
              {realFlights && realFlights.flights && Array.isArray(realFlights.flights) && realFlights.flights.length > 0 ? (
                <div className="real-flights-container">
                  <h3>✨ Real-Time Flight Options from Delhi</h3>
                  <div className="flights-grid">
                    {realFlights.flights.slice(0, 4).map((flight, index) => (
                      <div key={index} className="flight-card">
                        <div className="flight-header">
                          <div className="flight-route">
                            <span className="from-to">{flight.itineraries?.[0]?.segments?.[0]?.departure?.iataCode || 'DEL'}</span>
                            <span className="arrow">→</span>
                            <span className="from-to">{flight.itineraries?.[0]?.segments?.[flight.itineraries?.[0]?.segments?.length - 1]?.arrival?.iataCode || 'CDG'}</span>
                          </div>
                          <div className="flight-price">
                            <span className="price-value">€{flight.price?.total || 'N/A'}</span>
                          </div>
                        </div>
                        
                        <div className="flight-details">
                          <div className="detail-row">
                            <span className="label">Duration:</span>
                            <span className="value">{flight.itineraries?.[0]?.duration?.replace('PT', '').replace('H', 'h ').replace('M', 'm') || 'N/A'}</span>
                          </div>
                          <div className="detail-row">
                            <span className="label">Airline:</span>
                            <span className="value">{flight.validatingAirlineCodes?.[0] || 'Multiple'}</span>
                          </div>
                          <div className="detail-row">
                            <span className="label">Stops:</span>
                            <span className="value">{(flight.itineraries?.[0]?.segments?.length || 1) - 1} stop(s)</span>
                          </div>
                          <div className="detail-row">
                            <span className="label">Seats:</span>
                            <span className="value">{flight.numberOfBookableSeats || 'Available'}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <p style={{fontSize: '12px', color: '#888', marginTop: '10px', textAlign: 'center'}}>💡 Real-time data from Amadeus API • Prices in EUR</p>
                </div>
              ) : (
                <div className="static-flights-info">
                  {flightsError && <p style={{color: '#d32f2f', marginBottom: '10px'}}>ℹ️ {flightsError}</p>}
                  <div className="flights-info">
                    <div className="flight-info-item">
                      <span className="info-label">Nearest Airport:</span>
                      <span className="info-value">{destination.flights.nearestAirport}</span>
                    </div>
                    <div className="flight-info-item">
                      <span className="info-label">Route from India:</span>
                      <span className="info-value">{destination.flights.fromIndia}</span>
                    </div>
                    <div className="flight-info-item">
                      <span className="info-label">Flight Duration:</span>
                      <span className="info-value">{destination.flights.duration}</span>
                    </div>
                    <div className="flight-info-item">
                      <span className="info-label">Popular Airlines:</span>
                      <span className="info-value">{destination.flights.airlines.join(', ')}</span>
                    </div>
                    <div className="flight-info-item highlight">
                      <span className="info-label">Average Price:</span>
                      <span className="info-value">{destination.flights.averagePrice}</span>
                    </div>
                  </div>
                  {flightsError && <p style={{color: '#d32f2f', marginTop: '10px'}}>ℹ️ {flightsError}</p>}
                </div>
              )}
            </section>
          )}

          {/* Reviews Section */}
          <div className="reviews-section">
            <div className="reviews-header">
              <h2>Reviews & Ratings</h2>
              {user && (
                <button 
                  className="btn btn-primary"
                  onClick={() => setShowReviewForm(!showReviewForm)}
                >
                  {showReviewForm ? 'Cancel' : 'Write a Review'}
                </button>
              )}
            </div>

            {/* Average Rating Display */}
            <div className="average-rating-display">
              <div className="rating-score">
                <span className="rating-number">{averageRating}</span>
                <StarRating rating={parseFloat(averageRating)} readonly={true} />
                <span className="rating-count">Based on {reviews.length} review{reviews.length !== 1 ? 's' : ''}</span>
              </div>
            </div>

            {/* Review Form */}
            {showReviewForm && (
              <form className="review-form" onSubmit={handleSubmitReview}>
                <h3>Share Your Experience</h3>
                <div className="form-group">
                  <label>Your Rating</label>
                  <StarRating 
                    rating={newReview.rating} 
                    onRatingChange={(rating) => setNewReview({ ...newReview, rating })}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="review-comment">Your Review</label>
                  <textarea
                    id="review-comment"
                    rows="5"
                    placeholder="Share your thoughts about this destination..."
                    value={newReview.comment}
                    onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                    required
                  />
                </div>
                <button type="submit" className="btn btn-primary" disabled={submittingReview}>
                  {submittingReview ? 'Submitting...' : 'Submit Review'}
                </button>
              </form>
            )}

            {/* Reviews List */}
            <div className="reviews-list">
              {reviewsLoading ? (
                <div className="reviews-loading">
                  <p>Loading reviews...</p>
                </div>
              ) : reviewsError ? (
                <div className="reviews-error">
                  <p>{reviewsError}</p>
                  {reviewsError.includes('seed') && (
                    <div style={{ marginTop: '16px' }}>
                      <p style={{ fontSize: '14px', color: '#666' }}>
                        To fix this, run the following command in your backend terminal:
                      </p>
                      <code style={{ display: 'block', padding: '12px', background: '#f5f5f5', borderRadius: '4px', marginTop: '8px' }}>
                        POST http://localhost:5000/api/destinations/seed
                      </code>
                      <p style={{ fontSize: '14px', color: '#666', marginTop: '8px' }}>
                        Or use this curl command:
                      </p>
                      <code style={{ display: 'block', padding: '12px', background: '#f5f5f5', borderRadius: '4px', marginTop: '8px' }}>
                        curl -X POST http://localhost:5000/api/destinations/seed
                      </code>
                    </div>
                  )}
                </div>
              ) : reviews.length === 0 ? (
                <p className="no-reviews">No reviews yet. Be the first to review this destination!</p>
              ) : (
                reviews.map((review) => {
                  const reviewDate = review.createdAt || review.date;
                  const userAvatar = review.userAvatar || (review.userName ? review.userName.split(' ').map(n => n[0]).join('').toUpperCase() : 'U');
                  return (
                    <div key={review._id || review.id} className="review-card">
                      <div className="review-header">
                        <div className="reviewer-info">
                          <div className="reviewer-avatar">{userAvatar}</div>
                          <div>
                            <h4 className="reviewer-name">{review.userName}</h4>
                            <p className="review-date">{new Date(reviewDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                          </div>
                        </div>
                        <StarRating rating={review.rating} readonly={true} />
                      </div>
                      <p className="review-comment">{review.comment}</p>
                      {review.helpful > 0 && (
                        <div className="review-helpful">
                          <span>👍 {review.helpful} {review.helpful === 1 ? 'person' : 'people'} found this helpful</span>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {showBookingModal && (
        <div className="modal-overlay" onClick={() => setShowBookingModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Book Your Trip to {destination.name}</h2>
              <button className="modal-close" onClick={() => setShowBookingModal(false)}>×</button>
            </div>
            <form onSubmit={handleBookTrip} className="booking-form">
              <div className="form-group">
                <label htmlFor="start-date">Start Date</label>
                <input
                  type="date"
                  id="start-date"
                  value={bookingData.startDate}
                  onChange={(e) => setBookingData({ ...bookingData, startDate: e.target.value })}
                  min={new Date().toISOString().split('T')[0]}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="end-date">End Date</label>
                <input
                  type="date"
                  id="end-date"
                  value={bookingData.endDate}
                  onChange={(e) => setBookingData({ ...bookingData, endDate: e.target.value })}
                  min={bookingData.startDate || new Date().toISOString().split('T')[0]}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="trip-description">Trip Description (Optional)</label>
                <textarea
                  id="trip-description"
                  rows="3"
                  placeholder="Add notes about your trip..."
                  value={bookingData.description}
                  onChange={(e) => setBookingData({ ...bookingData, description: e.target.value })}
                />
              </div>
              <div className="booking-summary">
                <p><strong>Price:</strong> ${destination.price}</p>
                <p><strong>Duration:</strong> {destination.duration} days (suggested)</p>
              </div>
              {(previewDateConflicts > 0 || previewLocationConflicts > 0) && (
                <div className="date-conflict-hint">
                  {previewDateConflicts > 0 && (
                    <span className="hint-badge error">🚫 Date Conflicts ({previewDateConflicts})</span>
                  )}
                  {previewLocationConflicts > 0 && (
                    <span className="hint-badge warn">⚠ Location Conflicts ({previewLocationConflicts})</span>
                  )}
                </div>
              )}
              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowBookingModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Proceed to Payment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="modal-overlay" onClick={() => !isProcessingPayment && setShowPaymentModal(false)}>
          <div className="modal-content payment-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>💳 Complete Payment</h2>
              <button 
                className="modal-close" 
                onClick={() => !isProcessingPayment && setShowPaymentModal(false)}
                disabled={isProcessingPayment}
              >
                ×
              </button>
            </div>
            
            <div className="payment-content">
              <div className="payment-summary-box">
                <h4 className="summary-destination">{destination.name}, {destination.country} 🌍</h4>
                <p className="summary-dates">
                  📅 {new Date(bookingData.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} – {new Date(bookingData.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </p>
                <div className="summary-total">
                  <span className="summary-total-label">Total Amount</span>
                  <strong className="price-highlight">${destination.price}</strong>
                </div>
              </div>

              <div className="payment-methods">
                <h3>Select Payment Method</h3>
                <div className="payment-method-options">
                  <button
                    type="button"
                    className={`payment-method-btn ${paymentMethod === 'card' ? 'active' : ''}`}
                    onClick={() => setPaymentMethod('card')}
                    disabled={isProcessingPayment}
                  >
                    <span className="payment-icon">💳</span>
                    <span>Card</span>
                  </button>
                  <button
                    type="button"
                    className={`payment-method-btn ${paymentMethod === 'upi' ? 'active' : ''}`}
                    onClick={() => setPaymentMethod('upi')}
                    disabled={isProcessingPayment}
                  >
                    <span className="payment-icon">📱</span>
                    <span>UPI</span>
                  </button>
                  <button
                    type="button"
                    className={`payment-method-btn ${paymentMethod === 'netbanking' ? 'active' : ''}`}
                    onClick={() => setPaymentMethod('netbanking')}
                    disabled={isProcessingPayment}
                  >
                    <span className="payment-icon">🏦</span>
                    <span>Bank</span>
                  </button>
                </div>
              </div>

              <form onSubmit={handlePayment} className="payment-form">
                {/* Card Payment Form */}
                {paymentMethod === 'card' && (
                  <div className="payment-details">
                    <div className="form-group">
                      <label htmlFor="card-number">
                        Card Number
                        <span className="label-hint">(16 digits)</span>
                      </label>
                      <input
                        type="text"
                        id="card-number"
                        placeholder="1234 5678 9012 3456"
                        value={paymentData.cardNumber}
                        onChange={(e) => {
                          const formatted = formatCardNumber(e.target.value.replace(/\D/g, '').slice(0, 16));
                          setPaymentData({ ...paymentData, cardNumber: formatted });
                        }}
                        maxLength="19"
                        disabled={isProcessingPayment}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="card-name">Cardholder Name</label>
                      <input
                        type="text"
                        id="card-name"
                        placeholder="JOHN DOE"
                        value={paymentData.cardName}
                        onChange={(e) => setPaymentData({ ...paymentData, cardName: e.target.value.toUpperCase() })}
                        disabled={isProcessingPayment}
                        required
                      />
                    </div>
                    <div className="form-row">
                      <div className="form-group">
                        <label htmlFor="expiry-date">
                          Expiry Date
                          <span className="label-hint">(MM/YY)</span>
                        </label>
                        <input
                          type="text"
                          id="expiry-date"
                          placeholder="MM/YY"
                          value={paymentData.expiryDate}
                          onChange={(e) => {
                            const formatted = formatExpiryDate(e.target.value);
                            setPaymentData({ ...paymentData, expiryDate: formatted });
                          }}
                          maxLength="5"
                          disabled={isProcessingPayment}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="cvv">
                          CVV
                          <span className="label-hint">(3 digits)</span>
                        </label>
                        <input
                          type="text"
                          id="cvv"
                          placeholder="123"
                          value={paymentData.cvv}
                          onChange={(e) => setPaymentData({ ...paymentData, cvv: e.target.value.replace(/\D/g, '').slice(0, 4) })}
                          maxLength="4"
                          disabled={isProcessingPayment}
                          required
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* UPI Payment Form */}
                {paymentMethod === 'upi' && (
                  <div className="payment-details">
                    <div className="form-group">
                      <label>Select UPI App</label>
                      <div className="upi-apps-grid">
                        <button
                          type="button"
                          className={`upi-app-btn ${upiApp === 'googlepay' ? 'active' : ''}`}
                          onClick={() => {
                            setUpiApp('googlepay');
                            setPaymentData({ ...paymentData, upiPin: '' });
                          }}
                          disabled={isProcessingPayment}
                        >
                          {renderUpiLogo('googlepay')}
                          <span className="app-name">Google Pay</span>
                          <span className="pin-hint">5 digits</span>
                        </button>
                        
                        <button
                          type="button"
                          className={`upi-app-btn ${upiApp === 'phonepe' ? 'active' : ''}`}
                          onClick={() => {
                            setUpiApp('phonepe');
                            setPaymentData({ ...paymentData, upiPin: '' });
                          }}
                          disabled={isProcessingPayment}
                        >
                          {renderUpiLogo('phonepe')}
                          <span className="app-name">PhonePe</span>
                          <span className="pin-hint">6 digits</span>
                        </button>
                        
                        <button
                          type="button"
                          className={`upi-app-btn ${upiApp === 'paytm' ? 'active' : ''}`}
                          onClick={() => {
                            setUpiApp('paytm');
                            setPaymentData({ ...paymentData, upiPin: '' });
                          }}
                          disabled={isProcessingPayment}
                        >
                          {renderUpiLogo('paytm')}
                          <span className="app-name">Paytm</span>
                          <span className="pin-hint">4 digits</span>
                        </button>
                        
                        <button
                          type="button"
                          className={`upi-app-btn ${upiApp === 'bhim' ? 'active' : ''}`}
                          onClick={() => {
                            setUpiApp('bhim');
                            setPaymentData({ ...paymentData, upiPin: '' });
                          }}
                          disabled={isProcessingPayment}
                        >
                          {renderUpiLogo('bhim')}
                          <span className="app-name">BHIM UPI</span>
                          <span className="pin-hint">6 digits</span>
                        </button>
                      </div>
                    </div>

                    <div className="form-group">
                      <label htmlFor="upi-id">UPI ID</label>
                      <input
                        type="text"
                        id="upi-id"
                        placeholder="yourname@paytm"
                        value={paymentData.upiId}
                        onChange={(e) => setPaymentData({ ...paymentData, upiId: e.target.value.toLowerCase() })}
                        disabled={isProcessingPayment}
                        required
                      />
                      <small className="form-hint">Enter your UPI ID (e.g., username@paytm, username@googlepay)</small>
                    </div>
                  </div>
                )}

                {/* Net Banking Form */}
                {paymentMethod === 'netbanking' && (
                  <div className="payment-details">
                    <div className="form-group">
                      <label htmlFor="bank-name">Select Your Bank</label>
                      <select
                        id="bank-name"
                        value={paymentData.bankName}
                        onChange={(e) => {
                          setPaymentData({ ...paymentData, bankName: e.target.value });
                          setBankDetails({ accountNumber: '', confirmAccountNumber: '', ifscCode: '', accountHolder: '' });
                        }}
                        disabled={isProcessingPayment}
                        required
                      >
                        <option value="">-- Choose your bank --</option>
                        <option value="SBI">State Bank of India</option>
                        <option value="HDFC">HDFC Bank</option>
                        <option value="ICICI">ICICI Bank</option>
                        <option value="AXIS">Axis Bank</option>
                        <option value="PNB">Punjab National Bank</option>
                        <option value="BOB">Bank of Baroda</option>
                        <option value="Kotak">Kotak Mahindra Bank</option>
                        <option value="Yes">Yes Bank</option>
                        <option value="IDBI">IDBI Bank</option>
                        <option value="Other">Other Banks</option>
                      </select>
                    </div>

                    {paymentData.bankName && (
                      <div className="bank-details-section">
                        <h4 className="bank-details-title">Bank Account Details</h4>
                        <div className="bank-info-box">
                          <p className="bank-info"><strong>Bank:</strong> {paymentData.bankName}</p>
                          <p className="bank-info"><small>💡 Details will be securely transmitted to your bank</small></p>
                        </div>

                        <div className="form-group">
                          <label htmlFor="account-holder">Account Holder Name</label>
                          <input
                            type="text"
                            id="account-holder"
                            placeholder="Enter your full name"
                            value={bankDetails.accountHolder}
                            onChange={(e) => setBankDetails({ ...bankDetails, accountHolder: e.target.value.toUpperCase() })}
                            disabled={isProcessingPayment}
                            required
                          />
                        </div>

                        <div className="form-group">
                          <label htmlFor="account-number">Account Number</label>
                          <input
                            type="text"
                            id="account-number"
                            placeholder="1234 5678 9012 3456"
                            value={formatAccountNumber(bankDetails.accountNumber)}
                            onChange={(e) => setBankDetails({ ...bankDetails, accountNumber: e.target.value })}
                            maxLength="22"
                            disabled={isProcessingPayment}
                            required
                          />
                          <small className="form-hint">Enter your bank account number (9-18 digits)</small>
                        </div>

                        <div className="form-group">
                          <label htmlFor="confirm-account">Confirm Account Number</label>
                          <input
                            type="text"
                            id="confirm-account"
                            placeholder="Re-enter your account number"
                            value={formatAccountNumber(bankDetails.confirmAccountNumber)}
                            onChange={(e) => setBankDetails({ ...bankDetails, confirmAccountNumber: e.target.value })}
                            maxLength="22"
                            disabled={isProcessingPayment}
                            required
                          />
                        </div>

                        <div className="form-group">
                          <label htmlFor="ifsc-code">IFSC Code</label>
                          <input
                            type="text"
                            id="ifsc-code"
                            placeholder="SBIN0001234"
                            value={bankDetails.ifscCode.toUpperCase()}
                            onChange={(e) => setBankDetails({ ...bankDetails, ifscCode: e.target.value.toUpperCase() })}
                            maxLength="11"
                            disabled={isProcessingPayment}
                            required
                          />
                          <small className="form-hint">11-character IFSC code (e.g., SBIN0001234)</small>
                        </div>

                        <div className="security-note">
                          <p>🔒 Your bank details are encrypted and secured with 256-bit SSL encryption</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                <div className="payment-actions">
                  <button 
                    type="submit" 
                    className="btn btn-primary btn-pay" 
                    disabled={isProcessingPayment}
                  >
                    {isProcessingPayment ? (
                      <>
                        <span className="spinner"></span>
                        Processing Payment...
                      </>
                    ) : (
                      <>💳 Pay ${destination.price}</>
                    )}
                  </button>
                  <button 
                    type="button" 
                    className="btn btn-secondary" 
                    onClick={() => {
                      setShowPaymentModal(false);
                      setShowBookingModal(true);
                    }}
                    disabled={isProcessingPayment}
                  >
                    ← Back to Booking
                  </button>
                </div>
              </form>
            </div>

            <div className="payment-security">
              <p>🔒 100% Secure Payments · SSL Encrypted</p>
              <div className="trust-badges">
                <span className="trust-badge">✓ PCI-DSS Compliant</span>
                <span className="trust-badge">✓ Bank-Level Security</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* UPI PIN Modal */}
      {showUpiPinModal && (
        <div className="modal-overlay" onClick={() => setShowUpiPinModal(false)}>
          <div className="modal-content upi-pin-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>📱 {upiApps[upiApp]?.name || 'UPI'} - Enter PIN</h2>
              <button className="modal-close" onClick={() => setShowUpiPinModal(false)}>×</button>
            </div>
            
            <div className="upi-pin-content">
              <div className="upi-info-box">
                <div className="upi-app-display">
                  <div className="app-icon-large">
                    {renderUpiLogo(upiApp, 'lg')}
                  </div>
                  <div className="upi-details">
                    <span className="upi-label">{upiApps[upiApp]?.name}</span>
                    <strong className="upi-id">{paymentData.upiId}</strong>
                  </div>
                </div>
                <div className="upi-amount">
                  <span>Transaction Amount</span>
                  <strong className="amount-value">₹{destination.price}</strong>
                </div>
              </div>

              <form onSubmit={handleUpiPinSubmit} className="upi-pin-form">
                <div className="form-group">
                  <label htmlFor="upi-pin">Enter your {getPinLength()}-digit UPI PIN</label>
                  <input
                    type="password"
                    id="upi-pin"
                    placeholder={Array(getPinLength() + 1).join('•')}
                    value={paymentData.upiPin}
                    onChange={(e) => setPaymentData({ ...paymentData, upiPin: e.target.value.replace(/\D/g, '').slice(0, getPinLength()) })}
                    maxLength={getPinLength()}
                    autoFocus
                    required
                    className="upi-pin-input"
                  />
                  <small className="form-hint">Your UPI PIN is encrypted and never shared with merchants</small>
                </div>

                <div className="upi-pin-actions">
                  <button type="submit" className="btn btn-primary btn-pay">
                    {isProcessingPayment ? (
                      <>
                        <span className="spinner"></span>
                        Processing...
                      </>
                    ) : (
                      <>✓ Pay ₹{destination.price}</>
                    )}
                  </button>
                  <button 
                    type="button" 
                    className="btn btn-secondary" 
                    onClick={() => {
                      setShowUpiPinModal(false);
                      setShowPaymentModal(true);
                      setPaymentData({ ...paymentData, upiPin: '' });
                    }}
                  >
                    ← Back
                  </button>
                </div>

                <div className="upi-security-badge">
                  <p>🔒 Protected by {upiApps[upiApp]?.name} 2FA · All transactions are 100% secure</p>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Payment Confirmation Modal */}
      {showConfirmationModal && (
        <div className="modal-overlay" onClick={() => setShowConfirmationModal(false)}>
          <div className="modal-content confirmation-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header confirmation-header">
              <h2>✓ Confirm Your Payment</h2>
              <button className="modal-close" onClick={() => setShowConfirmationModal(false)}>×</button>
            </div>

            <div className="confirmation-content">
              {/* Trip Image Preview */}
              <div className="trip-image-preview">
                <img src={destination.image} alt={destination.name} />
              </div>

              {/* Trip Summary Card */}
              <div className="trip-summary-card official">
                <div className="trip-header">
                  <h3>{destination.name}</h3>
                  <span className="country-badge">{destination.country}</span>
                </div>
                
                <div className="trip-dates-row">
                  <div className="date-item">
                    <span className="date-label">Check-in</span>
                    <span className="date-value">{new Date(bookingData.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  </div>
                  <span className="date-separator">→</span>
                  <div className="date-item">
                    <span className="date-label">Check-out</span>
                    <span className="date-value">{new Date(bookingData.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  </div>
                </div>

                <div className="trip-meta">
                  <span className="meta-item">📅 {destination.duration} days</span>
                </div>
              </div>

              {/* Payment Method Card */}
              <div className="payment-method-card official">
                <h4 className="card-title">Payment Method</h4>
                
                <div className="payment-method-display">
                  {paymentMethod === 'card' && (
                    <div className="method-box card-method">
                      <div className="method-icon card-icon">💳</div>
                      <div className="method-info">
                        <p className="method-name">Credit/Debit Card</p>
                        <p className="method-detail">•••• {paymentData.cardNumber.slice(-4)}</p>
                      </div>
                    </div>
                  )}
                  {paymentMethod === 'upi' && (
                    <div className="method-box upi-method">
                      <div className={`method-icon upi-icon ${upiApp}`}>
                        {renderUpiLogo(upiApp)}
                      </div>
                      <div className="method-info">
                        <p className="method-name">{upiApps[upiApp]?.name || 'UPI'}</p>
                        <p className="method-detail">{paymentData.upiId}</p>
                      </div>
                    </div>
                  )}
                  {paymentMethod === 'netbanking' && (
                    <div className="method-box netbanking-method">
                      <div className="method-icon netbanking-icon">🏦</div>
                      <div className="method-info">
                        <p className="method-name">{paymentData.bankName}</p>
                        <p className="method-detail">Account ending in •••• {bankDetails.accountNumber.slice(-4).replace(/\s/g, '')}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Amount Section */}
              <div className="amount-section official">
                <div className="amount-breakdown">
                  <div className="breakdown-item">
                    <span className="breakdown-label">Trip Cost</span>
                    <span className="breakdown-value">₹{destination.price}</span>
                  </div>
                  <div className="breakdown-item">
                    <span className="breakdown-label">Taxes & Fees</span>
                    <span className="breakdown-value">₹0</span>
                  </div>
                  <div className="breakdown-divider"></div>
                  <div className="breakdown-item total-amount">
                    <span className="breakdown-label">Total Amount</span>
                    <span className="breakdown-value amount-highlight">₹{destination.price}</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="confirmation-actions official">
                <button 
                  className="btn btn-confirm-primary" 
                  onClick={handleConfirmPayment}
                  disabled={isProcessingPayment}
                >
                  {isProcessingPayment ? (
                    <>
                      <span className="spinner"></span>
                      Processing Payment...
                    </>
                  ) : (
                    <>✓ Confirm & Pay ₹{destination.price}</>
                  )}
                </button>
                <button 
                  className="btn btn-confirm-secondary" 
                  onClick={() => setShowConfirmationModal(false)}
                  disabled={isProcessingPayment}
                >
                  Cancel Payment
                </button>
              </div>

              {/* Security Note */}
              <div className="security-footer">
                <p>🔒 Your payment is secured with 256-bit SSL encryption • Verified by your bank</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Net Banking OTP Modal */}
      {showOtpModal && (
        <div className="modal-overlay" onClick={() => setShowOtpModal(false)}>
          <div className="modal-content otp-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header otp-header">
              <h2>🔐 Enter OTP</h2>
              <button className="modal-close" onClick={() => setShowOtpModal(false)}>×</button>
            </div>

            <div className="otp-content">
              <div className="otp-info-box">
                <p className="otp-message">
                  An OTP has been sent to your registered email and mobile number
                </p>
                <p className="otp-bank">
                  <strong>Bank:</strong> {paymentData.bankName}
                </p>
                <p className="otp-amount">
                  <strong>Amount:</strong> ₹{destination.price}
                </p>
              </div>

              <form onSubmit={handleOtpSubmit} className="otp-form">
                <div className="form-group">
                  <label htmlFor="otp-input">Enter 6-digit OTP</label>
                  <input
                    type="text"
                    id="otp-input"
                    placeholder="000000"
                    value={otpValue}
                    onChange={(e) => setOtpValue(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    maxLength="6"
                    autoFocus
                    required
                    className="otp-input"
                  />
                  <small className="form-hint">Enter the OTP sent to your registered contact (Use: 123456)</small>
                </div>

                <div className="otp-actions">
                  <button type="submit" className="btn btn-primary btn-verify">
                    {isProcessingPayment ? (
                      <>
                        <span className="spinner"></span>
                        Verifying...
                      </>
                    ) : (
                      <>✓ Verify & Pay</>
                    )}
                  </button>
                  <button 
                    type="button" 
                    className="btn btn-secondary" 
                    onClick={() => {
                      setShowOtpModal(false);
                      setShowConfirmationModal(true);
                    }}
                    disabled={isProcessingPayment}
                  >
                    ← Back
                  </button>
                </div>

                <p className="otp-resend">
                  Didn't receive OTP? <button type="button" className="resend-link">Resend OTP</button>
                </p>

                <div className="otp-security">
                  <p>🔒 OTP is valid for 10 minutes · Never share your OTP with anyone</p>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Overlap Warning Modal */}
      {showOverlapWarning && (
        <div className="modal-overlay" onClick={() => setShowOverlapWarning(false)}>
          <div className="modal-content overlap-warning-modal" onClick={(e) => e.stopPropagation()}>
            <div className={`modal-header ${dateConflicts.length > 0 ? 'error-header' : 'warning-header'}`}>
              <h2>{dateConflicts.length > 0 ? '🚫 Date Conflicts Detected' : '⚠️ Location Conflict Detected'}</h2>
              <button className="modal-close" onClick={() => setShowOverlapWarning(false)}>×</button>
            </div>
            
            <div className="overlap-warning-content">
              <div className="warning-message">
                {(() => {
                  const total = dateConflicts.length + locationConflicts.length;
                  if (total === 1 && !showConflictDetails) {
                    const single = dateConflicts[0] || locationConflicts[0];
                    const isDate = !!dateConflicts[0];
                    return (
                      <div className="compact-warning">
                        <p className="warning-title">
                          {isDate ? '🚫 Date Conflict' : '⚠ Location Conflict'}
                        </p>
                        <p className="compact-line">
                          {single.destinationName}, {single.country} • 📅 {new Date(single.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} – {new Date(single.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </p>
                        <button type="button" className="toggle-details" onClick={() => setShowConflictDetails(true)}>Show details</button>
                      </div>
                    );
                  }
                  return (
                    <div className="grouped-conflicts">
                      {dateConflicts.length > 0 && (
                        <div className="conflict-group">
                          <h4 className="group-title">🚫 Date Conflicts <span className="group-count">({dateConflicts.length})</span></h4>
                          <div className="overlapping-trips-list">
                            {dateConflicts.map((trip, index) => (
                              <div key={`dc-${index}`} className="overlap-trip-card">
                                <div className="overlap-trip-info">
                                  <h4>{trip.destinationName}, {trip.country}</h4>
                                  <p className="overlap-dates">📅 {new Date(trip.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} – {new Date(trip.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      {locationConflicts.length > 0 && (
                        <div className="conflict-group">
                          <h4 className="group-title">⚠ Location Conflicts <span className="group-count">({locationConflicts.length})</span></h4>
                          <div className="overlapping-trips-list">
                            {locationConflicts.map((trip, index) => (
                              <div key={`lc-${index}`} className="location-trip-card">
                                <div className="overlap-trip-info">
                                  <h4>{trip.destinationName}, {trip.country}</h4>
                                  <p className="overlap-dates">📅 {new Date(trip.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} – {new Date(trip.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      {total === 1 && showConflictDetails && (
                        <div className="details-toggle-row">
                          <button type="button" className="toggle-details" onClick={() => setShowConflictDetails(false)}>Hide details</button>
                        </div>
                      )}
                    </div>
                  );
                })()}

                <div className="new-trip-info">
                  <p className="new-trip-label">New booking:</p>
                  <div className="new-trip-details">
                    <h4>{destination.name}, {destination.country}</h4>
                    <p className="new-dates">
                      📅 {new Date(bookingData.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {new Date(bookingData.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                  </div>
                </div>

                {dateConflicts.length === 0 && (
                  <p className="warning-question">Do you want to proceed with this booking anyway?</p>
                )}
              </div>

              <div className="overlap-actions">
                {dateConflicts.length > 0 ? (
                  <>
                    <button 
                      className="btn btn-secondary" 
                      onClick={() => {
                        setShowOverlapWarning(false);
                        setShowBookingModal(true);
                      }}
                    >
                      Adjust Dates
                    </button>
                    <button 
                      className="btn btn-secondary" 
                      onClick={() => {
                        setShowOverlapWarning(false);
                        // Keep booking data so the user can resume later
                        if (lastBookingAttempt) {
                          setBookingData(lastBookingAttempt);
                        }
                      }}
                    >
                      Cancel New Booking
                    </button>
                  </>
                ) : (
                  <>
                    <button 
                      className="btn btn-primary" 
                      onClick={handleConfirmOverlap}
                    >
                      ✓ Proceed Anyway
                    </button>
                    <button 
                      className="btn btn-secondary" 
                      onClick={() => {
                        setShowOverlapWarning(false);
                        setShowBookingModal(true);
                      }}
                    >
                      Adjust Dates
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DestinationDetails;

