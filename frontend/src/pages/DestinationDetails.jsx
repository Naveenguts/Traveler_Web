import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { CardElement, Elements, useElements, useStripe } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useAuth } from '../context/AuthContext';
import { reviewAPI, destinationAPI } from '../services/reviewService';
import { externalAPI } from '../services/externalApiService';
import { getImageUrlWithFallback, getPlaceholderColor, handleImageError } from '../utils/imageUtils';
import { isAuthenticationError, handleAuthenticationError } from '../utils/authErrorHandler';
import { destinationsDataBase } from './Destinations';

const destinationsData = [
  { 
    id: 1, 
    name: 'Paris', 
    country: 'France',
    description: 'City of Lights', 
    image: 'https://via.placeholder.com/800x500/FF6B6B/FFFFFF?text=Paris',
    galleryImages: [
      'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1200&h=800&fit=crop',
      'https://images.unsplash.com/photo-1508057198894-247b23fe5ade?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1500043357865-c6b8827edf8b?w=800&h=600&fit=crop'
    ],
    longDescription: 'Paris, the capital of France, is one of the most iconic cities in the world. Known for its art, fashion, gastronomy, and culture, Paris offers unforgettable experiences from the Eiffel Tower to the Louvre Museum.',
    fullDescription: 'Paris blends timeless elegance with modern energy. Wander through grand boulevards, discover art-filled museums, and enjoy bistro dining that defines French culture. From sunrise at the Seine to evening lights at the Eiffel Tower, every moment feels cinematic.',
    highlights: [
      'Sunrise views from the Eiffel Tower and the Seine River',
      'Guided walk through Montmartre and Sacre-Coeur',
      'Louvre Museum skip-the-line entry',
      'Evening cruise with city skyline views'
    ],
    includes: {
      included: ['4-star hotel stay', 'Airport transfers', 'Museum passes', 'Daily breakfast'],
      excluded: ['International flights', 'Personal expenses', 'Travel insurance']
    },
    importantInfo: {
      whatToBring: ['Comfortable walking shoes', 'Photo ID or passport', 'Light jacket'],
      notAllowed: ['Oversized luggage on tours', 'Pets', 'Drones at landmarks']
    },
    bookingInfo: {
      duration: '7 days / 6 nights',
      cancellationPolicy: 'Free cancellation up to 24 hours before departure',
      reserveNowPayLater: true,
      originalPrice: 2950,
      discountedPrice: 2500,
      mealsIncluded: ['Daily French breakfast', 'Seine dinner cruise (1 night)', 'Cheese tasting session']
    },
    famousFoods: [
      { name: 'Croissant', description: 'Buttery and flaky pastry best enjoyed fresh each morning.', bestPlace: 'Local bakeries in Le Marais' },
      { name: 'Coq au Vin', description: 'Classic French chicken braised in wine with herbs.', bestPlace: 'Traditional bistros near Saint-Germain' },
      { name: 'Macarons', description: 'Colorful almond meringue cookies with rich fillings.', bestPlace: 'Laduree and Pierre Herme' }
    ],
    topRestaurants: ['Le Jules Verne', 'Benoit Paris', 'Septime'],
    price: 2500,
    duration: 7,
    famousPlaces: [
      { name: 'Eiffel Tower', description: 'Iconic iron tower and symbol of Paris', image: 'https://via.placeholder.com/300x200/4ECDC4/FFFFFF?text=Eiffel+Tower' },
      { name: 'Louvre Museum', description: 'World\'s largest art museum', image: 'https://via.placeholder.com/300x200/45B7D1/FFFFFF?text=Louvre+Museum' },
      { name: 'Notre-Dame Cathedral', description: 'Historic Gothic cathedral with stunning architecture', image: 'https://via.placeholder.com/300x200/FFA07A/FFFFFF?text=Notre-Dame' },
      { name: 'Champs-Élysées', description: 'Elegant avenue lined with shops and cafés', image: 'https://via.placeholder.com/300x200/98D8C8/FFFFFF?text=Champs-Elysees' },
      { name: 'Montmartre', description: 'Historic hilltop neighborhood with artistic charm', image: 'https://via.placeholder.com/300x200/6C5CE7/FFFFFF?text=Montmartre' }
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
    image: 'https://via.placeholder.com/800x500/A29BFE/FFFFFF?text=Tokyo',
    galleryImages: [
      'https://images.unsplash.com/photo-1549693578-d683be217e58?w=1200&h=800&fit=crop',
      'https://images.unsplash.com/photo-1505060895960-2f3a55f7c12b?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&h=600&fit=crop'
    ],
    longDescription: 'Tokyo is a bustling metropolis that seamlessly blends ancient traditions with modern technology. Experience incredible food, vibrant neighborhoods, and rich cultural heritage.',
    fullDescription: 'Tokyo delivers a sensory rush of neon, temples, and world-class dining. Explore historic shrines, shop in Shibuya, and take a day trip to Fuji viewpoints. Every district offers a new rhythm, from the calm of gardens to the buzz of street markets.',
    highlights: [
      'Shibuya Crossing and nightlife walk',
      'Asakusa temple district and food stalls',
      'Day trip to Mount Fuji viewpoints',
      'Sushi-making experience with a local chef'
    ],
    includes: {
      included: ['Central hotel stay', 'Metro passes', 'Temple district tour', 'Welcome dinner'],
      excluded: ['International flights', 'Optional day trips', 'Personal shopping']
    },
    importantInfo: {
      whatToBring: ['Reusable transit card', 'Comfortable sneakers', 'Cash for markets'],
      notAllowed: ['Large luggage on metro tours', 'Smoking in public areas']
    },
    bookingInfo: {
      duration: '10 days / 9 nights',
      cancellationPolicy: 'Free cancellation up to 48 hours before departure',
      reserveNowPayLater: true,
      originalPrice: 3650,
      discountedPrice: 3200,
      mealsIncluded: ['Daily Japanese breakfast', 'Sushi workshop lunch', 'Ramen street-food tour']
    },
    famousFoods: [
      { name: 'Sushi', description: 'Fresh seasonal seafood prepared with precision and balance.', bestPlace: 'Tsukiji Outer Market' },
      { name: 'Ramen', description: 'Rich noodle broth bowls with regional flavor variations.', bestPlace: 'Shinjuku ramen alleys' },
      { name: 'Takoyaki', description: 'Crispy octopus snack balls served hot with sauce.', bestPlace: 'Asakusa food streets' }
    ],
    topRestaurants: ['Sukiyabashi Jiro', 'Narisawa', 'Ichiran Shibuya'],
    price: 3200,
    duration: 10,
    famousPlaces: [
      { name: 'Senso-ji Temple', description: 'Tokyo\'s oldest temple with historic charm', image: 'https://via.placeholder.com/300x200/FF7675/FFFFFF?text=Senso-ji+Temple' },
      { name: 'Tokyo Skytree', description: 'Tallest structure in Japan with observation decks', image: 'https://via.placeholder.com/300x200/74B9FF/FFFFFF?text=Tokyo+Skytree' },
      { name: 'Shibuya Crossing', description: 'World\'s busiest pedestrian crossing', image: 'https://via.placeholder.com/300x200/81ECEC/FFFFFF?text=Shibuya+Crossing' },
      { name: 'Mount Fuji', description: 'Japan\'s iconic snow-capped mountain', image: 'https://via.placeholder.com/300x200/FF6B6B/FFFFFF?text=Mount+Fuji' },
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
    galleryImages: [
      'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=1200&h=800&fit=crop',
      'https://images.unsplash.com/photo-1468436139062-f60a71c5c892?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1485871981521-5b1fd3805eee?w=800&h=600&fit=crop'
    ],
    longDescription: 'New York City is the city that never sleeps. From Times Square to Central Park, Broadway shows to world-class museums, NYC offers endless excitement and cultural diversity.',
    fullDescription: 'New York is a mosaic of neighborhoods, skyline views, and iconic culture. See the city from the top of a skyscraper, catch a Broadway show, and explore food scenes from Brooklyn to Harlem. The energy is relentless and unforgettable.',
    highlights: [
      'Statue of Liberty and Ellis Island tour',
      'Sunset views from the Top of the Rock',
      'Food crawl through Brooklyn neighborhoods',
      'Broadway show night experience'
    ],
    includes: {
      included: ['Hotel in Midtown', 'Ferry tickets', 'City pass attractions', 'Local guide'],
      excluded: ['International flights', 'Broadway tickets', 'Travel insurance']
    },
    importantInfo: {
      whatToBring: ['Comfortable shoes', 'Photo ID', 'Weather-ready layers'],
      notAllowed: ['Large backpacks on tours', 'Tripods in museums']
    },
    bookingInfo: {
      duration: '5 days / 4 nights',
      cancellationPolicy: 'Free cancellation up to 24 hours before departure',
      reserveNowPayLater: false,
      originalPrice: 3350,
      discountedPrice: 2800,
      mealsIncluded: ['Classic NYC breakfast', 'Brooklyn food crawl tasting', 'Street pretzel & hotdog combo']
    },
    famousFoods: [
      { name: 'New York Pizza', description: 'Foldable thin-crust slices with iconic city flavor.', bestPlace: 'Joe\'s Pizza, Greenwich Village' },
      { name: 'Bagel & Lox', description: 'Chewy bagel layered with cream cheese and smoked salmon.', bestPlace: 'Ess-a-Bagel' },
      { name: 'Cheesecake', description: 'Creamy dessert made famous by New York delis.', bestPlace: 'Junior\'s Restaurant' }
    ],
    topRestaurants: ['Katz\'s Delicatessen', 'Gramercy Tavern', 'Le Bernardin'],
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
    galleryImages: [
      'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1200&h=800&fit=crop',
      'https://images.unsplash.com/photo-1473959383413-c5d12c1db1f8?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1448906654166-444d494666b3?w=800&h=600&fit=crop'
    ],
    longDescription: 'London combines centuries of history with cutting-edge innovation. Visit Buckingham Palace, explore world-renowned museums, and enjoy the vibrant theater scene.',
    fullDescription: 'London is a city of royal landmarks, leafy parks, and creative neighborhoods. Cruise along the Thames, explore historic towers, and end the evening with theater or live music. Each district offers a blend of tradition and modern flair.',
    highlights: [
      'Changing of the Guard at Buckingham Palace',
      'Tower Bridge and Thames river cruise',
      'West End theater night',
      'Guided walk through Notting Hill'
    ],
    includes: {
      included: ['Hotel stay', 'Oyster card credits', 'Thames cruise', 'Guided walking tour'],
      excluded: ['International flights', 'Theater tickets', 'Personal expenses']
    },
    importantInfo: {
      whatToBring: ['Umbrella or raincoat', 'Contactless payment card', 'Comfortable shoes'],
      notAllowed: ['Large luggage on underground', 'Drones near landmarks']
    },
    bookingInfo: {
      duration: '6 days / 5 nights',
      cancellationPolicy: 'Free cancellation up to 24 hours before departure',
      reserveNowPayLater: true,
      originalPrice: 2700,
      discountedPrice: 2200,
      mealsIncluded: ['Full English breakfast', 'Afternoon tea set', 'Pub dinner experience']
    },
    famousFoods: [
      { name: 'Fish and Chips', description: 'Crispy battered fish served with thick-cut fries.', bestPlace: 'Poppies, Spitalfields' },
      { name: 'Sunday Roast', description: 'Traditional roasted meat meal with gravy and sides.', bestPlace: 'Historic pubs in Westminster' },
      { name: 'Sticky Toffee Pudding', description: 'Warm sponge dessert with rich toffee sauce.', bestPlace: 'Covent Garden dessert bars' }
    ],
    topRestaurants: ['Dishoom Covent Garden', 'The Ledbury', 'Sketch London'],
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
    galleryImages: [
      'https://images.unsplash.com/photo-1496417263034-38ec4f0b665a?w=1200&h=800&fit=crop',
      'https://images.unsplash.com/photo-1526481280695-3c687fd643ed?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1496560736447-4f4a3e00b27b?w=800&h=600&fit=crop'
    ],
    longDescription: 'Dubai is a futuristic city in the desert, known for luxury shopping, ultramodern architecture, and a lively nightlife scene. Experience the Burj Khalifa and traditional souks.',
    fullDescription: 'Dubai delivers ultra-modern architecture, desert adventures, and glamorous waterfronts. Visit the Burj Khalifa, explore souks, and take a sunset desert safari. It is a city built for bold experiences and memorable nights.',
    highlights: [
      'Burj Khalifa observation deck experience',
      'Desert safari with dune bashing',
      'Old Dubai souk and creek tour',
      'Dubai Marina dhow cruise'
    ],
    includes: {
      included: ['Hotel stay', 'Airport transfers', 'Desert safari', 'Daily breakfast'],
      excluded: ['International flights', 'Personal shopping', 'Travel insurance']
    },
    importantInfo: {
      whatToBring: ['Sunglasses and sunscreen', 'Light breathable clothing', 'Photo ID'],
      notAllowed: ['Drones in city center', 'Outside food on tours']
    },
    bookingInfo: {
      duration: '8 days / 7 nights',
      cancellationPolicy: 'Free cancellation up to 72 hours before departure',
      reserveNowPayLater: true,
      originalPrice: 4100,
      discountedPrice: 3500,
      mealsIncluded: ['Arabian breakfast buffet', 'Desert BBQ dinner', 'Traditional mezze tasting']
    },
    famousFoods: [
      { name: 'Shawarma', description: 'Marinated meat wraps with garlic sauce and pickles.', bestPlace: 'Al Mallah, Al Dhiyafah Road' },
      { name: 'Machboos', description: 'Spiced rice dish with meat or seafood and saffron.', bestPlace: 'Authentic Emirati restaurants in Deira' },
      { name: 'Luqaimat', description: 'Sweet dumplings drizzled with date syrup.', bestPlace: 'Global Village food stalls' }
    ],
    topRestaurants: ['Al Fanar Restaurant', 'Pierchic', 'Zuma Dubai'],
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
    galleryImages: [
      'https://images.unsplash.com/photo-1464790719320-516ecd75af6c?w=1200&h=800&fit=crop',
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=800&h=600&fit=crop'
    ],
    longDescription: 'Barcelona offers stunning architecture by Gaudí, beautiful beaches, delicious cuisine, and a vibrant cultural scene. The perfect blend of urban excitement and Mediterranean relaxation.',
    fullDescription: 'Barcelona pairs Gaudi masterpieces with golden beaches and buzzing tapas bars. Discover the Gothic Quarter, enjoy seaside afternoons, and admire Sagrada Familia at golden hour. It is equal parts art, food, and sea air.',
    highlights: [
      'Gaudi architecture walk with local guide',
      'Tapas tasting in the Gothic Quarter',
      'Sunset at Barceloneta Beach',
      'Park Guell skip-the-line entry'
    ],
    includes: {
      included: ['Boutique hotel stay', 'City walking tour', 'Tapas tasting', 'Museum entry'],
      excluded: ['International flights', 'Personal expenses', 'Beach equipment rental']
    },
    importantInfo: {
      whatToBring: ['Light layers', 'Comfortable shoes', 'Reusable water bottle'],
      notAllowed: ['Glass bottles on the beach', 'Drones near landmarks']
    },
    bookingInfo: {
      duration: '5 days / 4 nights',
      cancellationPolicy: 'Free cancellation up to 24 hours before departure',
      reserveNowPayLater: false,
      originalPrice: 2150,
      discountedPrice: 1800,
      mealsIncluded: ['Catalan breakfast', 'Tapas tasting evening', 'Seafood paella lunch']
    },
    famousFoods: [
      { name: 'Paella', description: 'Saffron rice dish with seafood and Mediterranean herbs.', bestPlace: 'Barceloneta beachfront taverns' },
      { name: 'Patatas Bravas', description: 'Crispy potatoes with spicy bravas sauce.', bestPlace: 'Tapas bars in El Born' },
      { name: 'Crema Catalana', description: 'Silky custard dessert with caramelized sugar top.', bestPlace: 'Traditional Catalan bakeries' }
    ],
    topRestaurants: ['Tickets Barcelona', 'Can Culleretes', 'Disfrutar'],
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



const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '');
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const StripePaymentForm = ({ amount, currency, onSuccess, onFailure }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!stripe || !elements) return;

    try {
      setSubmitting(true);
      setErrorMessage('');

      const response = await fetch(`${API_URL}/payments/intent`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount, currency })
      });

      if (!response.ok) {
        throw new Error('Failed to create payment intent');
      }

      const data = await response.json();
      const result = await stripe.confirmCardPayment(data.clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement)
        }
      });

      if (result.error) {
        setErrorMessage(result.error.message || 'Payment failed');
        onFailure();
      } else if (result.paymentIntent?.status === 'succeeded') {
        onSuccess(result.paymentIntent.id);
      }
    } catch (error) {
      setErrorMessage(error.message || 'Payment failed');
      onFailure();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="payment-form" onSubmit={handleSubmit}>
      <div className="payment-details">
        <div className="form-group">
          <label>Card Details</label>
          <div className="stripe-card-input">
            <CardElement options={{ hidePostalCode: true }} />
          </div>
        </div>
        {errorMessage && <p className="payment-error">{errorMessage}</p>}
      </div>
      <div className="payment-actions">
        <button type="submit" className="btn btn-primary btn-pay" disabled={submitting || !stripe}>
          {submitting ? 'Processing...' : 'Pay with Stripe'}
        </button>
      </div>
    </form>
  );
};

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
  const navigate = useNavigate();
  const { user, addTrip, trips, token, logout } = useAuth();
  const [currency, setCurrency] = useState('usd');
  
  // Map any destination ID to one of our 6 detailed destinations (1-6)
  // This allows all 130+ destinations to show proper details
  const getDestinationById = (requestedId) => {
    const numId = parseInt(requestedId);
    
    // Get the basic info from the main destinations list
    const basicInfo = destinationsDataBase.find(dest => dest.id === numId);
    
    // If ID is between 1-6, use it directly
    let detailedDest;
    if (numId >= 1 && numId <= 6) {
      detailedDest = destinationsData.find(dest => dest.id === numId);
    } else {
      // For IDs > 6, map them cyclically to 1-6
      // Example: ID 7->1, 8->2, 9->3, 10->4, 11->5, 12->6, 13->1, etc.
      const mappedId = ((numId - 1) % 6) + 1;
      detailedDest = destinationsData.find(dest => dest.id === mappedId);
    }
    
    // If we have basic info, merge it with detailed info
    if (basicInfo && detailedDest) {
      return {
        ...detailedDest,
        id: numId, // Keep the original ID
        name: basicInfo.name, // Use the actual name
        country: basicInfo.country, // Use the actual country
        description: basicInfo.description, // Use the actual description
        price: basicInfo.price || detailedDest.price,
        duration: basicInfo.duration || detailedDest.duration,
        type: basicInfo.type
      };
    }
    
    // Fallback to detailed destination if basic info not found
    return detailedDest;
  };
  
  const destination = getDestinationById(id);
  
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
  const [realRestaurants, setRealRestaurants] = useState(null);
  const [realWeather, setRealWeather] = useState(null);
  const [countryInfo, setCountryInfo] = useState(null);
  const [flightsLoading, setFlightsLoading] = useState(false);
  const [hotelsLoading, setHotelsLoading] = useState(false);
  const [restaurantsLoading, setRestaurantsLoading] = useState(false);
  const [weatherLoading, setWeatherLoading] = useState(false);
  const [flightsError, setFlightsError] = useState(null);
  const [hotelsError, setHotelsError] = useState(null);
  const [restaurantsError, setRestaurantsError] = useState(null);
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
  const [wikiSummary, setWikiSummary] = useState(null);
  const [wikiImage, setWikiImage] = useState(null);
  const [wikiError, setWikiError] = useState(null);
  const [placeImageMap, setPlaceImageMap] = useState({});
  const [foodImageMap, setFoodImageMap] = useState({});

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
  }, [destination?.id, destination?.name]); // ✅ FIXED: Only refetch when destination actually changes

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
          'London': { flight: 'LHR', city: 'London' },
          'Dubai': { flight: 'DXB', city: 'Dubai' },
          'Barcelona': { flight: 'BCN', city: 'Barcelona' },
          'Bangkok': { flight: 'BKK', city: 'Bangkok' }
        };

        const airports = airportCodes[destination.name] || { flight: destination.name, city: destination.name };

        // Fetch flights
        try {
          setFlightsLoading(true);
          const tomorrow = new Date();
          tomorrow.setDate(tomorrow.getDate() + 1);
          const dateStr = tomorrow.toISOString().split('T')[0];

          const flightData = await externalAPI.searchFlights('DEL', airports.flight, dateStr, 1);
          setRealFlights(flightData);
          
          // Show warning if using mock data
          if (flightData.isMocked) {
            setFlightsError('Showing sample flight prices. Live prices unavailable.');
          } else {
            setFlightsError(null);
          }
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
              // Show warning if using mock data
              if (hotelData.isMocked) {
                setHotelsError('Showing sample hotel prices. Live prices unavailable.');
              } else {
                setHotelsError(null);
              }
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
  }, [destination?.id, destination?.name]); // ✅ FIXED: Only refetch when destination actually changes, not on every render

  // Fetch restaurants from backend Tripadvisor proxy
  useEffect(() => {
    const fetchRestaurants = async () => {
      const targetName = apiDestination?.name || destination?.name;
      if (!targetName) return;

      const hasRichRestaurantData = (restaurants = []) =>
        restaurants.some((item) =>
          Boolean(item?.photo)
          || Boolean(item?.rating)
          || (Array.isArray(item?.cuisines) && item.cuisines.length > 0)
        );

      try {
        setRestaurantsLoading(true);
        setRestaurantsError(null);

        const restaurantData = await externalAPI.getRestaurants(targetName, 6);
        if (restaurantData?.success && Array.isArray(restaurantData.restaurants)) {
          setRealRestaurants(restaurantData.restaurants);
          if (restaurantData.isMocked && !hasRichRestaurantData(restaurantData.restaurants)) {
            setRestaurantsError('Showing curated fallback restaurants. Configure Tripadvisor key for live results.');
          }
        } else {
          setRealRestaurants(null);
          setRestaurantsError('Live restaurants unavailable. Showing destination recommendations.');
        }
      } catch (error) {
        setRealRestaurants(null);
        setRestaurantsError('Unable to fetch live restaurants right now. Showing destination recommendations.');
      } finally {
        setRestaurantsLoading(false);
      }
    };

    fetchRestaurants();
  }, [apiDestination?.name, destination?.name]);

  // Fetch Wikipedia summary for description and images
  useEffect(() => {
    const fetchWikipediaSummary = async () => {
      const targetName = apiDestination?.name || destination?.name;
      if (!targetName) return;

      try {
        setWikiError(null);
        const summary = await externalAPI.getWikipediaSummary(targetName);
        setWikiSummary(summary);
        const imageUrl = summary?.originalimage?.source || summary?.thumbnail?.source || null;
        setWikiImage(imageUrl);
      } catch (error) {
        setWikiError('Wikipedia summary unavailable.');
        setWikiSummary(null);
        setWikiImage(null);
      }
    };

    fetchWikipediaSummary();
  }, [apiDestination?.name, destination?.name]);

  // Fetch Wikipedia images for famous places
  useEffect(() => {
    const fetchPlaceImages = async () => {
      const places = destination?.famousPlaces || [];
      const destinationName = apiDestination?.name || destination?.name || '';
      if (!places.length || !destinationName) {
        setPlaceImageMap({});
        return;
      }

      try {
        const results = await Promise.all(
          places.map(async (place) => {
            const placeName = String(place?.name || '').trim();
            if (!placeName) return [null, null];

            const candidates = [
              `${placeName} ${destinationName}`.trim(),
              placeName,
              `${placeName} landmark`.trim()
            ].filter(Boolean);

            for (const wikiTitle of candidates) {
              const imageUrl = await externalAPI.getWikipediaPageImage(wikiTitle, 800);
              if (imageUrl) {
                return [placeName, imageUrl];
              }
            }

            return [placeName, null];
          })
        );

        const imageMap = results.reduce((acc, [name, url]) => {
          if (url) acc[name] = url;
          return acc;
        }, {});
        setPlaceImageMap(imageMap);
      } catch {
        setPlaceImageMap({});
      }
    };

    fetchPlaceImages();
  }, [apiDestination?.name, destination?.name, destination?.famousPlaces]);

  // Fetch API images for famous foods
  useEffect(() => {
    const fetchFoodImages = async () => {
      const cityName = apiDestination?.name || destination?.name || '';
      const foods = Array.isArray(apiDestination?.famousFoods) && apiDestination.famousFoods.length > 0
        ? apiDestination.famousFoods
        : (destination?.famousFoods || []);

      if (!foods.length) {
        setFoodImageMap({});
        return;
      }

      try {
        const entries = await Promise.all(
          foods.map(async (food) => {
            const foodName = food?.name || '';
            if (!foodName) return [null, null];

            const imageUrl = await externalAPI.getFoodImage(foodName, cityName, 900, 600);
            return [foodName, imageUrl];
          })
        );

        const nextMap = entries.reduce((acc, [name, url]) => {
          if (name && url) {
            acc[name] = url;
          }
          return acc;
        }, {});

        setFoodImageMap(nextMap);
      } catch {
        setFoodImageMap({});
      }
    };

    fetchFoodImages();
  }, [apiDestination?.name, apiDestination?.famousFoods, destination?.name, destination?.famousFoods]);

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

    // DEBUG: Check if token exists
    if (!token) {
      alert('Authentication error: No token found. Please refresh the page and login again.');
      console.error('No token available for review submission');
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
        alert('Destination not found in database. Please refresh the page.');
        setSubmittingReview(false);
        return;
      }

      console.log('Submitting review with:', {
        destinationId: apiDestination._id,
        destinationName: destination.name,
        rating: newReview.rating,
        commentLength: newReview.comment.trim().length,
        hasToken: !!token
      });
      
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
      console.error('Failed to submit review - Full error details:', {
        message: error.message,
        status: error.status,
        code: error.code,
        fullError: error.fullError,
        stack: error.stack
      });
      
      // Check if it's an authentication error
      if (isAuthenticationError(error)) {
        handleAuthenticationError(logout);
      } else {
        // Build a detailed error message for the user
        let errorMessage = error.message || 'Failed to submit review. Please try again.';
        
        // Add more details if available
        if (error.fullError?.details) {
          errorMessage += `\n\nDetails: ${error.fullError.details}`;
        }
        
        if (error.status === 400 && error.fullError?.message) {
          errorMessage = error.fullError.message;
        } else if (error.status === 400) {
          errorMessage = 'Invalid review data. Please check your input.';
        } else if (error.status >= 500) {
          errorMessage = 'Server error. Please try again later.';
        }
        
        alert(errorMessage);
      }
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

    const bookingDestination = apiDestination || destination;

    try {
      // Simulate realistic payment processing (2-4 seconds)
      await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 2000));

      // Simulate 95% success rate (5% failure for realistic demo)
      const paymentSuccessful = Math.random() > 0.05;

      if (paymentSuccessful) {
        // Generate transaction ID
        const transactionId = `TXN${Date.now()}${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
        
        const trip = addTrip({
          destinationName: bookingDestination.name,
          country: `${bookingDestination.country}`,
          startDate: bookingData.startDate,
          endDate: bookingData.endDate,
          description: bookingData.description || `Trip to ${bookingDestination.name}`,
          coverImage: bookingDestination.image,
          price: discountedPrice,
          duration: bookingDestination.duration,
          paymentMethod: getPaymentMethodName(paymentMethod),
          paymentStatus: 'Paid',
          transactionId: transactionId,
          bookingDate: new Date().toISOString()
        });

        setIsProcessingPayment(false);
        resetPaymentState();
        
        // Navigate to success page
        navigate('/payment-success', { 
          state: { 
            bookingRef: transactionId,
            destination: bookingDestination.name,
            amount: discountedPrice,
            paymentMethod: getPaymentMethodName(paymentMethod)
          } 
        });
      } else {
        // Payment failed
        setIsProcessingPayment(false);
        resetPaymentState();
        
        navigate('/payment-failed', {
          state: {
            destination: bookingDestination.name,
            amount: discountedPrice,
            paymentMethod: getPaymentMethodName(paymentMethod),
            reason: 'Payment declined by provider. Please try another payment method.'
          }
        });
      }
    } catch (error) {
      setIsProcessingPayment(false);
      resetPaymentState();
      
      navigate('/payment-failed', {
        state: {
          destination: bookingDestination.name,
          amount: discountedPrice,
          paymentMethod: getPaymentMethodName(paymentMethod),
          reason: 'An error occurred during payment processing.'
        }
      });
    }
  };

  const resetPaymentState = () => {
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
  };

  const getPaymentMethodName = (method) => {
    const methodNames = {
      'stripe': 'Stripe Card',
      'paypal': 'PayPal',
      'applepay': 'Apple Pay',
      'googlepay': 'Google Pay',
      'banktransfer': 'Bank Transfer',
      'sepa': 'SEPA Transfer',
      'ideal': 'iDEAL',
      'ach': 'ACH Transfer',
      'klarna': 'Klarna',
      'afterpay': 'Afterpay',
      'affirm': 'Affirm',
      'upi': 'UPI',
      'alipay': 'Alipay',
      'wechatpay': 'WeChat Pay',
      'grabpay': 'GrabPay',
      'crypto': 'Cryptocurrency',
      'card': 'Credit/Debit Card',
      'netbanking': 'Net Banking'
    };
    return methodNames[method] || method;
  };

  const handleDirectPayment = async () => {
    // For payment methods that don't need forms (PayPal, Google Pay, etc.)
    await processPayment();
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

  const displayDestination = apiDestination ? { ...destination, ...apiDestination } : destination;
  const currencyConfig = {
    usd: { code: 'USD', locale: 'en-US', rate: 1, symbol: '$', name: 'US Dollar' },
    eur: { code: 'EUR', locale: 'de-DE', rate: 0.92, symbol: '€', name: 'Euro' },
    gbp: { code: 'GBP', locale: 'en-GB', rate: 0.79, symbol: '£', name: 'British Pound' },
    inr: { code: 'INR', locale: 'en-IN', rate: 83, symbol: '₹', name: 'Indian Rupee' },
    aud: { code: 'AUD', locale: 'en-AU', rate: 1.52, symbol: 'A$', name: 'Australian Dollar' },
    cad: { code: 'CAD', locale: 'en-CA', rate: 1.35, symbol: 'C$', name: 'Canadian Dollar' },
    sgd: { code: 'SGD', locale: 'en-SG', rate: 1.34, symbol: 'S$', name: 'Singapore Dollar' },
    aed: { code: 'AED', locale: 'ar-AE', rate: 3.67, symbol: 'د.إ', name: 'UAE Dirham' },
    jpy: { code: 'JPY', locale: 'ja-JP', rate: 149, symbol: '¥', name: 'Japanese Yen' },
    cny: { code: 'CNY', locale: 'zh-CN', rate: 7.24, symbol: '¥', name: 'Chinese Yuan' },
    krw: { code: 'KRW', locale: 'ko-KR', rate: 1320, symbol: '₩', name: 'South Korean Won' }
  };
  const currencyMeta = currencyConfig[currency] || currencyConfig.usd;
  const formatAmount = (value) => {
    const converted = Math.round(value * currencyMeta.rate);
    return new Intl.NumberFormat(currencyMeta.locale, {
      style: 'currency',
      currency: currencyMeta.code,
      maximumFractionDigits: 0
    }).format(converted);
  };
  const toMinorUnits = (value) => Math.round(value * currencyMeta.rate * 100);

  const baseGalleryImages = Array.isArray(displayDestination.galleryImages) && displayDestination.galleryImages.length >= 3
    ? displayDestination.galleryImages
    : [displayDestination.image, displayDestination.image, displayDestination.image];
  const galleryImages = wikiImage
    ? [wikiImage, ...baseGalleryImages.filter((img) => img !== wikiImage)].slice(0, 3)
    : baseGalleryImages;
  const bookingInfo = displayDestination.bookingInfo || {};
  const originalPrice = bookingInfo.originalPrice || Math.round(displayDestination.price * 1.2);
  const discountedPrice = bookingInfo.discountedPrice || displayDestination.price;
  const bookingRef = `BOOK${Date.now()}`;
  const includesInfo = displayDestination.includes || { included: [], excluded: [] };
  const importantInfo = displayDestination.importantInfo || { whatToBring: [], notAllowed: [] };
  const highlights = Array.isArray(displayDestination.highlights) ? displayDestination.highlights : [];
  const famousFoods = Array.isArray(displayDestination.famousFoods) ? displayDestination.famousFoods : [];
  const topRestaurants = Array.isArray(displayDestination.topRestaurants) ? displayDestination.topRestaurants : [];
  const restaurantEntries = Array.isArray(realRestaurants) && realRestaurants.length > 0
    ? realRestaurants
    : topRestaurants.map((name) => ({ name, source: 'destination', cuisines: [] }));
  const getRestaurantImage = (restaurant) =>
    getImageUrlWithFallback(
      restaurant?.photo || externalAPI.getInlineFallback(restaurant?.name || 'Restaurant', 900, 600),
      { width: 900, height: 600, text: restaurant?.name || 'Restaurant' }
    );
  const mealsIncluded = Array.isArray(bookingInfo.mealsIncluded) ? bookingInfo.mealsIncluded : [];
  const aboutDescription = wikiSummary?.extract || displayDestination.longDescription;
  const fullDescription = wikiSummary?.extract || displayDestination.fullDescription || displayDestination.longDescription;

  return (
    <Elements stripe={stripePromise}>
      <div className="destination-details">
        <nav className="destination-breadcrumb" aria-label="Breadcrumb">
          <Link to="/">Home</Link>
          <span>›</span>
          <Link to="/destinations">Inspiration for your {displayDestination.country} trip</Link>
          <span>›</span>
          <span className="current">Why {displayDestination.name} is the best place to visit</span>
        </nav>

        <section className="destination-hero">
          <div className="destination-hero-header">
            <div>
              <h1>{displayDestination.name}</h1>
              <p className="destination-country">{displayDestination.country}</p>
              <p className="destination-hero-summary">{aboutDescription}</p>
            </div>
            <div className="destination-hero-tags">
              <span className="hero-tag">{displayDestination.duration} days</span>
              <span className="hero-tag">{averageRating} rating</span>
              <span className="hero-tag">From {formatAmount(discountedPrice)}</span>
            </div>
          </div>
        <div className="destination-gallery">
          <img
            src={galleryImages[0]}
            alt={`${displayDestination.name} main view`}
            className="gallery-main"
          />
          <div className="gallery-side">
            <img src={galleryImages[1]} alt={`${displayDestination.name} view 2`} />
            <img src={galleryImages[2]} alt={`${displayDestination.name} view 3`} />
          </div>
        </div>
      </section>

      <div className="destination-content">
        <div className="destination-layout">
          <div className="destination-primary">
            <div className="destination-main-info">
              <h2>About {displayDestination.name}</h2>
              <p className="destination-long-description">{aboutDescription}</p>
              
              <div className="destination-quick-info">
                <div className="info-item">
                  <span className="info-icon">💵</span>
                  <div>
                    <strong>Price</strong>
                    <p>${discountedPrice}</p>
                  </div>
                </div>
                <div className="info-item">
                  <span className="info-icon">⏱️</span>
                  <div>
                    <strong>Duration</strong>
                    <p>{displayDestination.duration} days</p>
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
            </div>

            <section className="tour-details-section">
              <div className="tour-details-header">
                <h2>Tour Details</h2>
                <p>Everything you need to know before booking.</p>
              </div>

              <div className="tour-details-grid">
                <div className="tour-details-card">
                  <h3>Includes</h3>
                  <div className="includes-grid">
                    <div>
                      <h4>Included</h4>
                      <ul className="includes-list">
                        {includesInfo.included.map((item, index) => (
                          <li key={`included-${index}`}>
                            <span className="includes-icon">+</span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4>Not Included</h4>
                      <ul className="includes-list excluded">
                        {includesInfo.excluded.map((item, index) => (
                          <li key={`excluded-${index}`}>
                            <span className="includes-icon">-</span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="tour-details-card">
                  <h3>Important Info</h3>
                  <div className="important-info-grid">
                    <div>
                      <h4>What to bring</h4>
                      <ul className="info-list">
                        {importantInfo.whatToBring.map((item, index) => (
                          <li key={`bring-${index}`}>{item}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4>Not allowed</h4>
                      <ul className="info-list">
                        {importantInfo.notAllowed.map((item, index) => (
                          <li key={`not-allowed-${index}`}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <div className="tour-details-card">
                <h3>Highlights</h3>
                <ul className="highlights-list">
                  {highlights.map((item, index) => (
                    <li key={`highlight-${index}`}>{item}</li>
                  ))}
                </ul>
              </div>

              <div className="tour-details-card">
                <h3>Full Description</h3>
                <p className="tour-full-description">{fullDescription}</p>
              </div>
            </section>

            {famousFoods.length > 0 && (
              <section className="foods-section">
                <div className="foods-header">
                  <h2>Famous Foods in {displayDestination.name}</h2>
                  <p>Try these local dishes for an authentic experience.</p>
                </div>
                <div className="foods-grid">
                  {famousFoods.map((food, index) => (
                    <article key={`food-${index}`} className="food-card">
                      <img
                        src={foodImageMap[food.name] || externalAPI.getInlineFallback(`${food.name} ${displayDestination.name}`, 900, 600)}
                        alt={food.name}
                        className="food-card-image"
                        loading="lazy"
                        onError={(event) => {
                          const imageEl = event.currentTarget;
                          if (imageEl.dataset.wikiFallbackTried === 'true') {
                            imageEl.src = externalAPI.getInlineFallback(food.name || 'Food', 900, 600);
                            return;
                          }

                          imageEl.dataset.wikiFallbackTried = 'true';
                          const foodName = food?.name || '';
                          const singularFood = foodName.endsWith('s') && foodName.length > 3
                            ? foodName.slice(0, -1)
                            : foodName;
                          const wikiCandidates = [
                            foodName,
                            singularFood,
                            `${foodName} (dish)`,
                            `${singularFood} (dish)`
                          ].filter(Boolean);

                          (async () => {
                            for (const wikiTitle of wikiCandidates) {
                              const wikiImage = await externalAPI.getWikipediaPageImage(wikiTitle, 900);
                              if (wikiImage) {
                                imageEl.src = wikiImage;
                                return;
                              }
                            }

                            imageEl.src = externalAPI.getInlineFallback(food.name || 'Food', 900, 600);
                          })();
                        }}
                      />
                      <h3>{food.name}</h3>
                      <p>{food.description}</p>
                      {food.bestPlace && (
                        <span className="food-best-place">Best place: {food.bestPlace}</span>
                      )}
                    </article>
                  ))}
                </div>
              </section>
            )}

            {restaurantEntries.length > 0 && (
              <section className="restaurants-section">
                <h2>Top Restaurants</h2>
                {restaurantsLoading && <p className="restaurants-meta">Loading live restaurant recommendations...</p>}
                {restaurantsError && <p className="restaurants-meta">{restaurantsError}</p>}
                <ul className="restaurants-list">
                  {restaurantEntries.map((restaurant, index) => (
                    <li key={`restaurant-${index}`} className="restaurant-card">
                      <img
                        src={getRestaurantImage(restaurant)}
                        alt={restaurant.name}
                        className="restaurant-photo"
                        loading="lazy"
                        onError={(event) => {
                          event.currentTarget.src = externalAPI.getInlineFallback(restaurant.name || 'Restaurant', 900, 600);
                        }}
                      />
                      <div className="restaurant-content">
                        <div className="restaurant-name-row">
                          <span className="restaurant-name">{restaurant.name}</span>
                          {restaurant.rating && (
                            <span className="restaurant-rating">⭐ {restaurant.rating}</span>
                          )}
                        </div>

                        <div className="restaurant-meta-row">
                          {restaurant.priceTag && (
                            <span className="restaurant-pill">{restaurant.priceTag}</span>
                          )}
                          {restaurant.reviewCount > 0 && (
                            <span className="restaurant-pill">{restaurant.reviewCount.toLocaleString()} reviews</span>
                          )}
                          {restaurant.openStatusText && (
                            <span className="restaurant-pill">{restaurant.openStatusText}</span>
                          )}
                          {restaurant.hasReservation && (
                            <span className="restaurant-pill reserve">Reservations</span>
                          )}
                          {restaurant.isPremium && (
                            <span className="restaurant-pill premium">Premium</span>
                          )}
                        </div>

                        {restaurant.address && (
                          <p className="restaurant-address">{restaurant.address}</p>
                        )}

                        {Array.isArray(restaurant.cuisines) && restaurant.cuisines.length > 0 && (
                          <p className="restaurant-cuisines">{restaurant.cuisines.join(' • ')}</p>
                        )}

                        {Array.isArray(restaurant.reviewSnippets) && restaurant.reviewSnippets.length > 0 && (
                          <div className="restaurant-snippets">
                            {restaurant.reviewSnippets.map((snippet, snippetIndex) => (
                              <p key={`snippet-${index}-${snippetIndex}`} className="restaurant-snippet">
                                "{snippet.text}"
                              </p>
                            ))}
                          </div>
                        )}

                        {restaurant.menuUrl && (
                          <a
                            href={restaurant.menuUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="restaurant-menu-link"
                          >
                            View Menu
                          </a>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </section>
            )}

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
              <h2>Famous Places in {displayDestination.name}</h2>
              <div className="places-grid">
                {destination.famousPlaces.map((place, index) => (
                  <div key={index} className="place-card">
                    <img
                      src={placeImageMap[place.name] || place.image || externalAPI.getInlineFallback(place.name, 300, 200)}
                      alt={place.name}
                      onError={(event) => {
                        const imageEl = event.currentTarget;
                        if (imageEl.dataset.wikiFallbackTried === 'true') {
                          handleImageError(event, place.name);
                          return;
                        }

                        imageEl.dataset.wikiFallbackTried = 'true';
                        const placeName = String(place?.name || '').trim();
                        const cityName = String(displayDestination?.name || '').trim();
                        const candidates = [
                          `${placeName} ${cityName}`.trim(),
                          placeName,
                          `${placeName} landmark`.trim()
                        ].filter(Boolean);

                        (async () => {
                          for (const wikiTitle of candidates) {
                            const wikiImage = await externalAPI.getWikipediaPageImage(wikiTitle, 800);
                            if (wikiImage) {
                              imageEl.src = wikiImage;
                              return;
                            }
                          }

                          handleImageError(event, place.name);
                        })();
                      }}
                    />
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
              <h2>✈️ How to Reach {displayDestination.name}</h2>
              
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
          <section className="reviews-section">
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
          </section>
        </div>

        <aside className="destination-sidebar">
          <div className="pricing-card">
            <div className="pricing-header">
              <p className="pricing-label">From</p>
              <div className="pricing-amount">
                {originalPrice > discountedPrice && (
                  <span className="price-old">{formatAmount(originalPrice)}</span>
                )}
                <span className="price-current">{formatAmount(discountedPrice)}</span>
                <span className="price-unit">/ person</span>
              </div>
              <div className="currency-selector">
                <label htmlFor="currency-select">Currency:</label>
                <select
                  id="currency-select"
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="currency-select"
                >
                  <option value="usd">🇺🇸 USD ($)</option>
                  <option value="eur">🇪🇺 EUR (€)</option>
                  <option value="gbp">🇬🇧 GBP (£)</option>
                  <option value="inr">🇮🇳 INR (₹)</option>
                  <option value="aud">🇦🇺 AUD (A$)</option>
                  <option value="cad">🇨🇦 CAD (C$)</option>
                  <option value="sgd">🇸🇬 SGD (S$)</option>
                  <option value="aed">🇦🇪 AED (د.إ)</option>
                  <option value="jpy">🇯🇵 JPY (¥)</option>
                  <option value="cny">🇨🇳 CNY (¥)</option>
                  <option value="krw">🇰🇷 KRW (₩)</option>
                </select>
              </div>
            </div>

            <div className="pricing-details">
              <div>
                <span className="detail-label">Duration</span>
                <span className="detail-value">{bookingInfo.duration || `${displayDestination.duration} days`}</span>
              </div>
              <div>
                <span className="detail-label">Cancellation</span>
                <span className="detail-value">{bookingInfo.cancellationPolicy || 'Flexible cancellation available'}</span>
              </div>
              <div>
                <span className="detail-label">Meals Included</span>
                <span className="detail-value">{mealsIncluded.length > 0 ? mealsIncluded.join(', ') : 'Breakfast included'}</span>
              </div>
            </div>

            <div className="pricing-form">
              <label htmlFor="sidebar-start-date">Start date</label>
              <input
                type="date"
                id="sidebar-start-date"
                value={bookingData.startDate}
                onChange={(e) => setBookingData({ ...bookingData, startDate: e.target.value })}
              />
              <label htmlFor="sidebar-end-date">End date</label>
              <input
                type="date"
                id="sidebar-end-date"
                value={bookingData.endDate}
                onChange={(e) => setBookingData({ ...bookingData, endDate: e.target.value })}
                min={bookingData.startDate || new Date().toISOString().split('T')[0]}
              />
              <button
                type="button"
                className="btn btn-book-trip pricing-cta"
                onClick={() => setShowBookingModal(true)}
              >
                Reserve now
              </button>
            </div>

            <div className="pricing-perks">
              <p>Free cancellation</p>
              {bookingInfo.reserveNowPayLater && <p>Reserve now, pay later</p>}
            </div>
          </div>

          {bookingInfo.reserveNowPayLater && (
            <div className="reserve-pay-later">
              <h3>Reserve & Pay Later</h3>
              <p>Lock in your spot today. Pay closer to departure with flexible terms.</p>
              <div className="reserve-badges">
                <span>Flexible plans</span>
                <span>No hidden fees</span>
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>

     {/* Booking Modal */}
      {showBookingModal && (
        <div className="modal-overlay" onClick={() => setShowBookingModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Book Your Trip to {displayDestination.name}</h2>
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
                <p><strong>Price:</strong> ${discountedPrice}</p>
                <p><strong>Duration:</strong> {displayDestination.duration} days (suggested)</p>
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
                <h4 className="summary-destination">{displayDestination.name}, {displayDestination.country} 🌍</h4>
                <p className="summary-dates">
                  📅 {new Date(bookingData.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} – {new Date(bookingData.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </p>
                <div className="summary-total">
                  <span className="summary-total-label">Total Amount</span>
                  <strong className="price-highlight">{formatAmount(discountedPrice)}</strong>
                </div>
              </div>

              <div className="payment-methods">
                <h3>Select Payment Method</h3>
                <p className="payment-subtitle">Choose your preferred payment option from worldwide methods</p>
                
                <div className="payment-category">
                  <h4 className="payment-category-title">💳 Card & Digital Wallets</h4>
                  <div className="payment-method-grid">
                    <button
                      type="button"
                      className={`payment-method-btn ${paymentMethod === 'stripe' ? 'active' : ''}`}
                      onClick={() => setPaymentMethod('stripe')}
                      disabled={isProcessingPayment}
                    >
                      <img src="/assets/stripe-v2-svgrepo-com.svg" alt="Stripe" className="payment-icon" />
                      <span>Stripe Card</span>
                    </button>
                    <button
                      type="button"
                      className={`payment-method-btn ${paymentMethod === 'paypal' ? 'active' : ''}`}
                      onClick={() => setPaymentMethod('paypal')}
                      disabled={isProcessingPayment}
                    >
                      <img src="/assets/paypal-svgrepo-com.svg" alt="PayPal" className="payment-icon" />
                      <span>PayPal</span>
                    </button>
                    <button
                      type="button"
                      className={`payment-method-btn ${paymentMethod === 'applepay' ? 'active' : ''}`}
                      onClick={() => setPaymentMethod('applepay')}
                      disabled={isProcessingPayment}
                    >
                      <img src="/assets/apple-pay-logo-svgrepo-com.svg" alt="Apple Pay" className="payment-icon" />
                      <span>Apple Pay</span>
                    </button>
                    <button
                      type="button"
                      className={`payment-method-btn ${paymentMethod === 'googlepay' ? 'active' : ''}`}
                      onClick={() => setPaymentMethod('googlepay')}
                      disabled={isProcessingPayment}
                    >
                      <img src="/assets/google-pay-logo.svg" alt="Google Pay" className="payment-icon" />
                      <span>Google Pay</span>
                    </button>
                  </div>
                </div>

                <div className="payment-category">
                  <h4 className="payment-category-title">🏦 Bank Transfers (No Card Needed)</h4>
                  <div className="payment-method-grid">
                    <button
                      type="button"
                      className={`payment-method-btn ${paymentMethod === 'banktransfer' ? 'active' : ''}`}
                      onClick={() => setPaymentMethod('banktransfer')}
                      disabled={isProcessingPayment}
                    >
                      <span className="payment-icon-text">🏦</span>
                      <span>Bank Transfer</span>
                    </button>
                    <button
                      type="button"
                      className={`payment-method-btn ${paymentMethod === 'sepa' ? 'active' : ''}`}
                      onClick={() => setPaymentMethod('sepa')}
                      disabled={isProcessingPayment}
                    >
                      <img src="/assets/sepa-svgrepo-com.svg" alt="SEPA" className="payment-icon" />
                      <span>SEPA (EU)</span>
                    </button>
                    <button
                      type="button"
                      className={`payment-method-btn ${paymentMethod === 'ideal' ? 'active' : ''}`}
                      onClick={() => setPaymentMethod('ideal')}
                      disabled={isProcessingPayment}
                    >
                      <img src="/assets/ideal-logo-svgrepo-com.svg" alt="iDEAL" className="payment-icon" />
                      <span>iDEAL (NL)</span>
                    </button>
                    <button
                      type="button"
                      className={`payment-method-btn ${paymentMethod === 'ach' ? 'active' : ''}`}
                      onClick={() => setPaymentMethod('ach')}
                      disabled={isProcessingPayment}
                    >
                      <img src="/assets/ach.svg" alt="ACH" className="payment-icon" />
                      <span>ACH (USA)</span>
                    </button>
                  </div>
                </div>

                <div className="payment-category">
                  <h4 className="payment-category-title">📱 Buy Now, Pay Later</h4>
                  <div className="payment-method-grid">
                    <button
                      type="button"
                      className={`payment-method-btn ${paymentMethod === 'klarna' ? 'active' : ''}`}
                      onClick={() => setPaymentMethod('klarna')}
                      disabled={isProcessingPayment}
                    >
                      <img src="/assets/klarna-logo-svgrepo-com.svg" alt="Klarna" className="payment-icon" />
                      <span>Klarna</span>
                    </button>
                    <button
                      type="button"
                      className={`payment-method-btn ${paymentMethod === 'afterpay' ? 'active' : ''}`}
                      onClick={() => setPaymentMethod('afterpay')}
                      disabled={isProcessingPayment}
                    >
                      <img src="/assets/brand-afterpay-svgrepo-com.svg" alt="Afterpay" className="payment-icon" />
                      <span>Afterpay</span>
                    </button>
                    <button
                      type="button"
                      className={`payment-method-btn ${paymentMethod === 'affirm' ? 'active' : ''}`}
                      onClick={() => setPaymentMethod('affirm')}
                      disabled={isProcessingPayment}
                    >
                      <span className="payment-icon-badge affirm-badge">A</span>
                      <span>Affirm</span>
                    </button>
                  </div>
                </div>

                <div className="payment-category">
                  <h4 className="payment-category-title">🌏 Regional Methods</h4>
                  <div className="payment-method-grid">
                    <button
                      type="button"
                      className={`payment-method-btn ${paymentMethod === 'upi' ? 'active' : ''}`}
                      onClick={() => setPaymentMethod('upi')}
                      disabled={isProcessingPayment}
                    >
                      <img src="/assets/phonepe-logo.svg" alt="UPI" className="payment-icon" />
                      <span>UPI (India)</span>
                    </button>
                    <button
                      type="button"
                      className={`payment-method-btn ${paymentMethod === 'alipay' ? 'active' : ''}`}
                      onClick={() => setPaymentMethod('alipay')}
                      disabled={isProcessingPayment}
                    >
                      <img src="/assets/alipay-svgrepo-com.svg" alt="Alipay" className="payment-icon" />
                      <span>Alipay</span>
                    </button>
                    <button
                      type="button"
                      className={`payment-method-btn ${paymentMethod === 'wechatpay' ? 'active' : ''}`}
                      onClick={() => setPaymentMethod('wechatpay')}
                      disabled={isProcessingPayment}
                    >
                      <img src="/assets/wechartpay.svg" alt="WeChat Pay" className="payment-icon" />
                      <span>WeChat Pay</span>
                    </button>
                    <button
                      type="button"
                      className={`payment-method-btn ${paymentMethod === 'grabpay' ? 'active' : ''}`}
                      onClick={() => setPaymentMethod('grabpay')}
                      disabled={isProcessingPayment}
                    >
                      <img src="/assets/grabpay.svg" alt="GrabPay" className="payment-icon" />
                      <span>GrabPay (SEA)</span>
                    </button>
                  </div>
                </div>

                <div className="payment-category">
                  <h4 className="payment-category-title">₿ Cryptocurrency</h4>
                  <div className="payment-method-grid">
                    <button
                      type="button"
                      className={`payment-method-btn ${paymentMethod === 'crypto' ? 'active' : ''}`}
                      onClick={() => setPaymentMethod('crypto')}
                      disabled={isProcessingPayment}
                    >
                      <span className="payment-icon-badge crypto-badge">₿</span>
                      <span>Bitcoin/Crypto</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Stripe Payment Form */}
              {paymentMethod === 'stripe' ? (
                <StripePaymentForm
                  amount={toMinorUnits(discountedPrice)}
                  currency={currency}
                  onSuccess={(paymentIntentId) => {
                    const newTrip = {
                      destination: displayDestination.name,
                      country: displayDestination.country,
                      startDate: bookingData.startDate,
                      endDate: bookingData.endDate,
                      travelers: bookingData.travelers,
                      totalCost: discountedPrice,
                      paymentStatus: 'completed',
                      paymentMethod: 'Stripe',
                      transactionId: paymentIntentId,
                      bookingDate: new Date().toISOString(),
                    };
                    addTrip(newTrip);
                    setShowPaymentModal(false);
                    navigate('/payment-success', { state: { bookingRef } });
                  }}
                  onFailure={() => {
                    navigate('/payment-failed');
                  }}
                />
              ) : paymentMethod === 'paypal' ? (
                <div className="payment-info-card">
                  <img src="/assets/paypal-svgrepo-com.svg" alt="PayPal" className="payment-info-icon-img" />
                  <h4>PayPal Payment</h4>
                  <p>Pay securely with your PayPal account or credit card.</p>
                  <ul className="payment-info-list">
                    <li>✓ Available in 200+ countries</li>
                    <li>✓ No card needed - use PayPal balance</li>
                    <li>✓ Buyer protection included</li>
                  </ul>
                  <button 
                    type="button" 
                    className="btn btn-primary" 
                    style={{marginTop: '1rem'}}
                    onClick={handleDirectPayment}
                    disabled={isProcessingPayment}
                  >
                    {isProcessingPayment ? (
                      <>
                        <span className="spinner"></span>
                        Processing Payment...
                      </>
                    ) : (
                      'Continue with PayPal'
                    )}
                  </button>
                </div>
              ) : paymentMethod === 'applepay' ? (
                <div className="payment-info-card">
                  <img src="/assets/apple-pay-logo-svgrepo-com.svg" alt="Apple Pay" className="payment-info-icon-img" />
                  <h4>Apple Pay</h4>
                  <p>Fast, secure payment with Face ID or Touch ID.</p>
                  <ul className="payment-info-list">
                    <li>✓ Works on iPhone, iPad, Mac</li>
                    <li>✓ No card details shared with merchant</li>
                    <li>✓ One-touch checkout</li>
                  </ul>
                  <button 
                    type="button" 
                    className="btn btn-primary" 
                    style={{marginTop: '1rem', background: isProcessingPayment ? '#666' : 'black'}}
                    onClick={handleDirectPayment}
                    disabled={isProcessingPayment}
                  >
                    {isProcessingPayment ? (
                      <>
                        <span className="spinner"></span>
                        Processing Payment...
                      </>
                    ) : (
                      'Pay with Apple Pay'
                    )}
                  </button>
                </div>
              ) : paymentMethod === 'googlepay' ? (
                <div className="payment-info-card">
                  <img src="/assets/google-pay-logo.svg" alt="Google Pay" className="payment-info-icon-img" />
                  <h4>Google Pay</h4>
                  <p>Quick and easy payment from your Google account.</p>
                  <ul className="payment-info-list">
                    <li>✓ Works on Android devices</li>
                    <li>✓ Secure tokenization</li>
                    <li>✓ Saved payment methods</li>
                  </ul>
                  <button 
                    type="button" 
                    className="btn btn-primary" 
                    style={{marginTop: '1rem'}}
                    onClick={handleDirectPayment}
                    disabled={isProcessingPayment}
                  >
                    {isProcessingPayment ? (
                      <>
                        <span className="spinner"></span>
                        Processing Payment...
                      </>
                    ) : (
                      'Continue with Google Pay'
                    )}
                  </button>
                </div>
              ) : paymentMethod === 'banktransfer' || paymentMethod === 'sepa' || paymentMethod === 'ideal' || paymentMethod === 'ach' ? (
                <div className="payment-info-card">
                  <div className="payment-info-icon">🏦</div>
                  <h4>Bank Transfer</h4>
                  <p>Direct payment from your bank account - no card needed.</p>
                  <ul className="payment-info-list">
                    <li>✓ Transfer directly from bank account</li>
                    <li>✓ No credit card required</li>
                    <li>✓ Secure bank-to-bank transfer</li>
                    <li>✓ Lower processing fees</li>
                  </ul>
                  <p style={{marginTop: '1rem', padding: '0.75rem', background: '#eff6ff', borderRadius: '8px', fontSize: '0.9rem'}}>
                    <strong>Selected: </strong>
                    {paymentMethod === 'sepa' && 'SEPA (Europe)'}
                    {paymentMethod === 'ideal' && 'iDEAL (Netherlands)'}
                    {paymentMethod === 'ach' && 'ACH (USA)'}
                    {paymentMethod === 'banktransfer' && 'International Bank Transfer'}
                  </p>
                  <button 
                    type="button" 
                    className="btn btn-primary" 
                    style={{marginTop: '1rem'}}
                    onClick={handleDirectPayment}
                    disabled={isProcessingPayment}
                  >
                    {isProcessingPayment ? (
                      <>
                        <span className="spinner"></span>
                        Processing Payment...
                      </>
                    ) : (
                      'Continue to Bank'
                    )}
                  </button>
                </div>
              ) : paymentMethod === 'klarna' || paymentMethod === 'afterpay' || paymentMethod === 'affirm' ? (
                <div className="payment-info-card">
                  <div className="payment-info-icon">🛍️</div>
                  <h4>Buy Now, Pay Later</h4>
                  <p>Split your payment into interest-free installments.</p>
                  <ul className="payment-info-list">
                    <li>✓ Pay in 4 interest-free installments</li>
                    <li>✓ No hidden fees or surprises</li>
                    <li>✓ Instant approval decision</li>
                    <li>✓ Flexible payment schedule</li>
                  </ul>
                  <div style={{marginTop: '1rem', padding: '1rem', background: '#f0fdf4', borderRadius: '8px', border: '1px solid #86efac'}}>
                    <p style={{margin: 0, fontWeight: 600, color: '#15803d'}}>
                      Pay {formatAmount(Math.round(discountedPrice / 4))} today, then 3 more payments every 2 weeks
                    </p>
                  </div>
                  <button 
                    type="button" 
                    className="btn btn-primary" 
                    style={{marginTop: '1rem'}}
                    onClick={handleDirectPayment}
                    disabled={isProcessingPayment}
                  >
                    {isProcessingPayment ? (
                      <>
                        <span className="spinner"></span>
                        Processing Payment...
                      </>
                    ) : (
                      <>Continue with {paymentMethod === 'klarna' && 'Klarna'}{paymentMethod === 'afterpay' && 'Afterpay'}{paymentMethod === 'affirm' && 'Affirm'}</>
                    )}
                  </button>
                </div>
              ) : paymentMethod === 'alipay' || paymentMethod === 'wechatpay' || paymentMethod === 'grabpay' ? (
                <div className="payment-info-card">
                  <div className="payment-info-icon">
                    {paymentMethod === 'alipay' && '🇨🇳'}
                    {paymentMethod === 'wechatpay' && '💬'}
                    {paymentMethod === 'grabpay' && '🚗'}
                  </div>
                  <h4>
                    {paymentMethod === 'alipay' && 'Alipay'}
                    {paymentMethod === 'wechatpay' && 'WeChat Pay'}
                    {paymentMethod === 'grabpay' && 'GrabPay'}
                  </h4>
                  <p>Pay with your preferred regional e-wallet.</p>
                  <ul className="payment-info-list">
                    <li>✓ Local payment method</li>
                    <li>✓ Instant confirmation</li>
                    <li>✓ Widely accepted in Asia</li>
                  </ul>
                  <button 
                    type="button" 
                    className="btn btn-primary" 
                    style={{marginTop: '1rem'}}
                    onClick={handleDirectPayment}
                    disabled={isProcessingPayment}
                  >
                    {isProcessingPayment ? (
                      <>
                        <span className="spinner"></span>
                        Processing Payment...
                      </>
                    ) : (
                      <>Continue with {paymentMethod === 'alipay' && 'Alipay'}{paymentMethod === 'wechatpay' && 'WeChat Pay'}{paymentMethod === 'grabpay' && 'GrabPay'}</>
                    )}
                  </button>
                </div>
              ) : paymentMethod === 'crypto' ? (
                <div className="payment-info-card">
                  <div className="payment-info-icon">₿</div>
                  <h4>Cryptocurrency Payment</h4>
                  <p>Pay with Bitcoin, Ethereum, USDC, or other cryptocurrencies.</p>
                  <ul className="payment-info-list">
                    <li>✓ Borderless payments - no banks needed</li>
                    <li>✓ Lower transaction fees</li>
                    <li>✓ Fast international transfers</li>
                    <li>✓ Supported: BTC, ETH, USDC, USDT</li>
                  </ul>
                  <button 
                    type="button" 
                    className="btn btn-primary" 
                    style={{marginTop: '1rem', background: isProcessingPayment ? '#c87f15' : '#f7931a'}}
                    onClick={handleDirectPayment}
                    disabled={isProcessingPayment}
                  >
                    {isProcessingPayment ? (
                      <>
                        <span className="spinner"></span>
                        Processing Payment...
                      </>
                    ) : (
                      'Pay with Crypto'
                    )}
                  </button>
                </div>
              ) : (
                <>
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
                      <>💳 Pay {formatAmount(discountedPrice)}</>
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

              <div className="payment-security">
                <p>🔒 100% Secure Payments · SSL Encrypted</p>
                <div className="trust-badges">
                  <span className="trust-badge">✓ PCI-DSS Compliant</span>
                  <span className="trust-badge">✓ Bank-Level Security</span>
                </div>
              </div>
              </>
            )}
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
                  <strong className="amount-value">₹{discountedPrice}</strong>
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
                      <>✓ Pay ₹{discountedPrice}</>
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
                <img src={displayDestination.image} alt={displayDestination.name} />
              </div>

              {/* Trip Summary Card */}
              <div className="trip-summary-card official">
                <div className="trip-header">
                  <h3>{displayDestination.name}</h3>
                  <span className="country-badge">{displayDestination.country}</span>
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
                  <span className="meta-item">📅 {displayDestination.duration} days</span>
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
                    <span className="breakdown-value">₹{discountedPrice}</span>
                  </div>
                  <div className="breakdown-item">
                    <span className="breakdown-label">Taxes & Fees</span>
                    <span className="breakdown-value">₹0</span>
                  </div>
                  <div className="breakdown-divider"></div>
                  <div className="breakdown-item total-amount">
                    <span className="breakdown-label">Total Amount</span>
                    <span className="breakdown-value amount-highlight">₹{discountedPrice}</span>
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
                    <>✓ Confirm & Pay ₹{discountedPrice}</>
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
                  <strong>Amount:</strong> ₹{discountedPrice}
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
                    <h4>{displayDestination.name}, {displayDestination.country}</h4>
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
    </Elements>
  );
};

export default DestinationDetails;

