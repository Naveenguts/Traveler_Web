const express = require('express');
const router = express.Router();
const axios = require('axios');
const { URLSearchParams } = require('url');
const https = require('https');
const { resolveTripadvisorLocationId } = require('../config/tripadvisorLocationMap');

// Create an HTTPS agent that doesn't reject self-signed certificates (for development)
const httpsAgent = new https.Agent({
  rejectUnauthorized: false
});

// In-memory cache for Pexels lookups to reduce API calls
const pexelsCache = new Map();
const PEXELS_CACHE_TTL = 1000 * 60 * 60 * 24 * 7; // 7 days (was 60 minutes)

// ✅ Weather cache (fixes the glitch - weather was refetching every render)
const weatherCache = new Map();
const WEATHER_CACHE_TTL = 1000 * 60 * 10; // 10 minutes

// ✅ Amadeus city code cache (fixes hotels glitch - city lookups were not cached)
const cityCodeCache = new Map();
const CITY_CODE_TTL = 1000 * 60 * 60 * 24 * 7; // 7 days

// Tripadvisor restaurants cache
const restaurantsCache = new Map();
const RESTAURANTS_CACHE_TTL = 1000 * 60 * 30; // 30 minutes

// Wikipedia image cache
const wikipediaImageCache = new Map();
const WIKIPEDIA_IMAGE_CACHE_TTL = 1000 * 60 * 60 * 24 * 7; // 7 days
const WIKIPEDIA_USER_AGENT = 'TravelerProject/1.0 (travel-app image proxy; contact: support@traveler.local)';

// Overpass OSM places cache
const overpassCache = new Map();
const OVERPASS_CACHE_TTL = 1000 * 60 * 60 * 2; // 2 hours

const normalizeWikiTitle = (title = '') => String(title).trim().replace(/\s+/g, '_');

const getWikipediaImage = async (title, thumbSize = 800) => {
  const normalizedTitle = normalizeWikiTitle(title);
  if (!normalizedTitle) return null;

  // 1) Try REST summary API first
  try {
    const summaryUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(normalizedTitle)}`;
    const summaryResponse = await axios.get(summaryUrl, {
      timeout: 8000,
      headers: {
        'User-Agent': WIKIPEDIA_USER_AGENT,
        'Accept': 'application/json'
      }
    });

    const summaryImage = summaryResponse?.data?.thumbnail?.source || summaryResponse?.data?.originalimage?.source || null;
    if (summaryImage) {
      return summaryImage;
    }
  } catch (error) {
    // Fall through to pageimages API.
  }

  // 2) Fallback to MediaWiki pageimages API
  try {
    const pageImageResponse = await axios.get('https://en.wikipedia.org/w/api.php', {
      timeout: 8000,
      params: {
        action: 'query',
        format: 'json',
        prop: 'pageimages',
        pithumbsize: Number(thumbSize) || 800,
        titles: normalizedTitle,
        origin: '*'
      },
      headers: {
        'User-Agent': WIKIPEDIA_USER_AGENT,
        'Accept': 'application/json'
      }
    });

    const pages = pageImageResponse?.data?.query?.pages || {};
    const firstPage = Object.values(pages)[0];
    return firstPage?.thumbnail?.source || null;
  } catch (error) {
    return null;
  }
};

const fallbackRestaurantsByCity = {
  Paris: [
    {
      name: 'Le Jules Verne',
      cuisines: ['French', 'Fine Dining'],
      priceTag: '$$$$',
      rating: 4.7,
      reviewCount: 1200,
      openStatusText: 'Open now',
      address: 'Avenue Gustave Eiffel, Paris',
      photo: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=900&h=600&fit=crop'
    },
    {
      name: 'Septime',
      cuisines: ['Modern French', 'European'],
      priceTag: '$$$',
      rating: 4.6,
      reviewCount: 980,
      openStatusText: 'Open now',
      address: 'Rue de Charonne, Paris',
      photo: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=900&h=600&fit=crop'
    },
    {
      name: 'Le Comptoir du Relais',
      cuisines: ['French Bistro'],
      priceTag: '$$',
      rating: 4.5,
      reviewCount: 860,
      openStatusText: 'Closes soon',
      address: 'Carrefour de l\'Odeon, Paris',
      photo: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=900&h=600&fit=crop'
    }
  ],
  Tokyo: [
    { name: 'Sukiyabashi Jiro', cuisines: ['Sushi', 'Japanese'], priceTag: '$$$$', rating: 4.8, reviewCount: 720, openStatusText: 'Open now', address: 'Ginza, Tokyo', photo: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=900&h=600&fit=crop' },
    { name: 'Ichiran Shibuya', cuisines: ['Ramen', 'Japanese'], priceTag: '$$', rating: 4.6, reviewCount: 2100, openStatusText: 'Open now', address: 'Shibuya, Tokyo', photo: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=900&h=600&fit=crop' },
    { name: 'Narisawa', cuisines: ['Japanese', 'Contemporary'], priceTag: '$$$$', rating: 4.7, reviewCount: 410, openStatusText: 'Opens at 6 PM', address: 'Minato, Tokyo', photo: 'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?w=900&h=600&fit=crop' }
  ],
  'New York': [
    { name: 'Katz\'s Delicatessen', cuisines: ['Deli', 'American'], priceTag: '$$', rating: 4.5, reviewCount: 5300, openStatusText: 'Open now', address: 'Lower East Side, New York', photo: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=900&h=600&fit=crop' },
    { name: 'Gramercy Tavern', cuisines: ['American', 'Contemporary'], priceTag: '$$$$', rating: 4.7, reviewCount: 2400, openStatusText: 'Open now', address: 'Flatiron District, New York', photo: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=900&h=600&fit=crop' },
    { name: 'Le Bernardin', cuisines: ['Seafood', 'French'], priceTag: '$$$$', rating: 4.8, reviewCount: 1800, openStatusText: 'Open now', address: 'Midtown, New York', photo: 'https://images.unsplash.com/photo-1559847844-5315695dadae?w=900&h=600&fit=crop' }
  ],
  London: [
    { name: 'Dishoom Covent Garden', cuisines: ['Indian', 'Cafe'], priceTag: '$$', rating: 4.6, reviewCount: 4800, openStatusText: 'Open now', address: 'Covent Garden, London', photo: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=900&h=600&fit=crop' },
    { name: 'The Ledbury', cuisines: ['British', 'Fine Dining'], priceTag: '$$$$', rating: 4.7, reviewCount: 950, openStatusText: 'Open now', address: 'Notting Hill, London', photo: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=900&h=600&fit=crop' },
    { name: 'Sketch London', cuisines: ['European', 'Contemporary'], priceTag: '$$$$', rating: 4.5, reviewCount: 1600, openStatusText: 'Open now', address: 'Mayfair, London', photo: 'https://images.unsplash.com/photo-1424847651672-bf20a4b0982b?w=900&h=600&fit=crop' }
  ],
  Dubai: [
    { name: 'Al Fanar Restaurant', cuisines: ['Emirati', 'Middle Eastern'], priceTag: '$$$', rating: 4.5, reviewCount: 990, openStatusText: 'Open now', address: 'Al Seef, Dubai', photo: 'https://images.unsplash.com/photo-1541518763669-27fef9f0f36b?w=900&h=600&fit=crop' },
    { name: 'Pierchic', cuisines: ['Seafood', 'Mediterranean'], priceTag: '$$$$', rating: 4.7, reviewCount: 1200, openStatusText: 'Open now', address: 'Madinat Jumeirah, Dubai', photo: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=900&h=600&fit=crop' },
    { name: 'Zuma Dubai', cuisines: ['Japanese', 'Sushi'], priceTag: '$$$$', rating: 4.6, reviewCount: 2100, openStatusText: 'Open now', address: 'DIFC, Dubai', photo: 'https://images.unsplash.com/photo-1611143669185-af224c5e3252?w=900&h=600&fit=crop' }
  ],
  Barcelona: [
    { name: 'Disfrutar', cuisines: ['Spanish', 'Modern'], priceTag: '$$$$', rating: 4.8, reviewCount: 870, openStatusText: 'Open now', address: 'Eixample, Barcelona', photo: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=900&h=600&fit=crop' },
    { name: 'Can Culleretes', cuisines: ['Catalan', 'Spanish'], priceTag: '$$$', rating: 4.4, reviewCount: 1300, openStatusText: 'Open now', address: 'Gothic Quarter, Barcelona', photo: 'https://images.unsplash.com/photo-1424847651672-bf20a4b0982b?w=900&h=600&fit=crop' },
    { name: 'Tickets Barcelona', cuisines: ['Tapas', 'Creative'], priceTag: '$$$$', rating: 4.6, reviewCount: 1500, openStatusText: 'Temporarily closed', address: 'Avinguda del Paral-lel, Barcelona', photo: 'https://images.unsplash.com/photo-1544148103-0773bf10d330?w=900&h=600&fit=crop' }
  ]
};

const normalizeTripadvisorRestaurants = (payload, destination) => {
  const candidates = payload?.data?.data
    || payload?.data
    || payload?.restaurants
    || payload?.results
    || [];

  if (!Array.isArray(candidates)) {
    return [];
  }

  const photoFromTemplate = (template, width = 900, height = 600) => {
    if (!template || typeof template !== 'string') return null;
    return template
      .replace('{width}', String(width))
      .replace('{height}', String(height));
  };

  return candidates
    .map((item) => ({
      restaurantsId: item?.restaurantsId || null,
      locationId: item?.locationId || null,
      name: item?.name || item?.restaurantName || item?.title || null,
      rating: item?.averageRating || item?.rating || item?.bubbleRating?.rating || null,
      reviewCount: item?.userReviewCount || item?.num_reviews || 0,
      priceTag: item?.priceTag || item?.price_level || null,
      cuisines: Array.isArray(item?.establishmentTypeAndCuisineTags)
        ? item.establishmentTypeAndCuisineTags.slice(0, 6)
        : [],
      openStatusCategory: item?.currentOpenStatusCategory || null,
      openStatusText: item?.currentOpenStatusText || null,
      hasMenu: Boolean(item?.hasMenu),
      menuUrl: item?.menuUrl || null,
      parentGeoName: item?.parentGeoName || null,
      isPremium: Boolean(item?.isPremium),
      hasReservation: Boolean(item?.offers?.hasReservation || item?.offers?.slot1Offer?.offerURL),
      reservationProvider: item?.offers?.slot1Offer?.providerDisplayName || null,
      address: item?.addressObj?.street1
        || item?.address
        || item?.locationString
        || item?.neighborhood
        || null,
      photo: item?.heroImgUrl
        || item?.photo?.images?.large?.url
        || photoFromTemplate(item?.thumbnail?.photo?.photoSizeDynamic?.urlTemplate, 900, 600)
        || item?.thumbnail?.url
        || null,
      squarePhoto: item?.squareImgUrl
        || photoFromTemplate(item?.thumbnail?.photo?.photoSizeDynamic?.urlTemplate, 300, 300)
        || null,
      reviewSnippets: Array.isArray(item?.reviewSnippets?.reviewSnippetsList)
        ? item.reviewSnippets.reviewSnippetsList
            .slice(0, 2)
            .map((snippet) => ({
              text: snippet?.reviewText || '',
              url: snippet?.reviewUrl || null
            }))
            .filter((snippet) => Boolean(snippet.text))
        : [],
      source: 'tripadvisor'
    }))
    .filter((item) => Boolean(item.name))
    .slice(0, 8);
};

const getFallbackRestaurants = (destination) => {
  const byCity = fallbackRestaurantsByCity[destination] || [
    {
      name: `${destination} Central Kitchen`,
      cuisines: ['Local', 'International'],
      priceTag: '$$',
      rating: 4.4,
      reviewCount: 560,
      openStatusText: 'Open now',
      address: `${destination} city center`,
      photo: `https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=900&h=600&fit=crop`
    },
    {
      name: `${destination} Heritage Table`,
      cuisines: ['Traditional'],
      priceTag: '$$$',
      rating: 4.5,
      reviewCount: 430,
      openStatusText: 'Open now',
      address: `${destination} old town`,
      photo: `https://images.unsplash.com/photo-1424847651672-bf20a4b0982b?w=900&h=600&fit=crop`
    },
    {
      name: `${destination} Skyline Grill`,
      cuisines: ['Fusion'],
      priceTag: '$$$$',
      rating: 4.6,
      reviewCount: 390,
      openStatusText: 'Open now',
      address: `${destination} downtown`,
      photo: `https://images.unsplash.com/photo-1559339352-11d035aa65de?w=900&h=600&fit=crop`
    }
  ];

  return byCity.map((item) => ({
    name: item.name,
    rating: item.rating || null,
    reviewCount: item.reviewCount || 0,
    priceTag: item.priceTag || null,
    cuisines: item.cuisines || [],
    openStatusCategory: null,
    openStatusText: item.openStatusText || null,
    hasMenu: false,
    menuUrl: null,
    parentGeoName: destination,
    isPremium: false,
    hasReservation: false,
    reservationProvider: null,
    address: item.address || null,
    photo: item.photo || null,
    squarePhoto: null,
    reviewSnippets: [
      { text: 'Popular curated restaurant in this city.', url: null }
    ],
    source: 'fallback'
  }));
};

// Wikipedia Image API - Server-side proxy to avoid browser-side CORS/rate-limit issues
router.get('/wikipedia/image/:title', async (req, res) => {
  try {
    const { title } = req.params;
    const thumbSize = Number(req.query.thumbSize) || 800;

    if (!title || !String(title).trim()) {
      return res.status(400).json({
        success: false,
        message: 'Missing title parameter'
      });
    }

    const cacheKey = `${String(title).trim().toLowerCase()}-${thumbSize}`;
    const now = Date.now();
    const cached = wikipediaImageCache.get(cacheKey);

    if (cached && now - cached.fetchedAt < WIKIPEDIA_IMAGE_CACHE_TTL) {
      return res.json({
        success: true,
        image: cached.image,
        cached: true,
        source: cached.image ? 'wikipedia' : 'none'
      });
    }

    const image = await getWikipediaImage(title, thumbSize);

    // Cache both hits and misses to prevent repeated hammering when a page has no image.
    wikipediaImageCache.set(cacheKey, {
      image: image || null,
      fetchedAt: now
    });

    return res.json({
      success: true,
      image: image || null,
      cached: false,
      source: image ? 'wikipedia' : 'none'
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch Wikipedia image',
      error: error.message
    });
  }
});

// Amadeus token cache (expires in 30 minutes)
let amadeusToken = null;
let tokenExpiry = null;

// Function to get or refresh Amadeus access token
async function getAmadeusToken() {
  const now = Date.now();
  
  // Return cached token if still valid (with 5-minute buffer)
  if (amadeusToken && tokenExpiry && now < tokenExpiry - (5 * 60 * 1000)) {
    console.log('✓ Using cached Amadeus token');
    return amadeusToken;
  }
  
  console.log('⟳ Fetching new Amadeus access token...');
  
  try {
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

    amadeusToken = tokenResponse.data.access_token;
    // Token expires in 30 minutes (1799 seconds)
    tokenExpiry = now + (tokenResponse.data.expires_in * 1000);
    
    console.log('✓ New Amadeus token obtained, expires in', tokenResponse.data.expires_in, 'seconds');
    return amadeusToken;
  } catch (error) {
    console.error('✗ Failed to get Amadeus token:', error.response?.data || error.message);
    throw new Error('Amadeus authentication failed');
  }
}

// Pexels Image API - Get high-quality destination images
router.get('/pexels', async (req, res) => {
  try {
    const { query, width = 1200, height = 800, per_page = 1 } = req.query;

    if (!query) {
      return res.status(400).json({ success: false, message: 'Missing query parameter' });
    }

    const cacheKey = `${query.toLowerCase()}-${width}-${height}`;

    // Check cache first
    const cached = pexelsCache.get(cacheKey);
    const now = Date.now();
    if (cached && now - cached.fetchedAt < PEXELS_CACHE_TTL) {
      return res.json({
        success: true,
        image: cached.image,
        images: cached.images,
        cached: true,
        source: 'pexels'
      });
    }

    // Try to fetch from Pexels API
    let response;
    try {
      response = await axios.get('https://api.pexels.com/v1/search', {
        params: {
          query,
          per_page: Math.min(Number(per_page) || 1, 15),
          orientation: 'landscape'
        },
        headers: {
          Authorization: process.env.PEXELS_API_KEY
        },
        httpsAgent
      });
    } catch (pexelError) {
      // If Pexels fails, use fallback Unsplash API
      console.error('Pexels API error:', pexelError.response?.status || pexelError.message);
      
      try {
        // Fallback to Unsplash API (more reliable than picsum.photos)
        const unsplashResponse = await axios.get('https://api.unsplash.com/search/photos', {
          params: {
            query,
            per_page: Math.min(Number(per_page) || 1, 15),
            orientation: 'landscape'
          },
          headers: {
            'Authorization': `Client-ID ${process.env.UNSPLASH_ACCESS_KEY || ''}`
          }
        });
        
        response = {
          data: {
            photos: unsplashResponse.data.results.map(photo => ({
              src: {
                large: `${photo.urls.regular}`,
                medium: `${photo.urls.small}`,
                small: `${photo.urls.thumb}`
              },
              photographer: photo.user.name,
              photographer_url: photo.user.links.html,
              alt: photo.alt_description || query
            })) || []
          }
        };
      } catch (unsplashError) {
        // If both Pexels and Unsplash fail, use a simple gradient placeholder service
        console.error('Unsplash API error:', unsplashError.message);
        response = {
          data: {
            photos: [{
              src: {
                large: `https://via.placeholder.com/${width}x${height}/0066cc/ffffff?text=${encodeURIComponent(query)}`,
                medium: `https://via.placeholder.com/800x600/0066cc/ffffff?text=${encodeURIComponent(query)}`,
                small: `https://via.placeholder.com/400x300/0066cc/ffffff?text=${encodeURIComponent(query)}`
              },
              photographer: 'Placeholder Service',
              photographer_url: '#',
              alt: query
            }]
          }
        };
      }
    }

    const photos = response.data?.photos || [];
    
    if (photos.length === 0) {
      return res.json({
        success: true,
        image: `https://via.placeholder.com/${width}x${height}/0066cc/ffffff?text=Image+Not+Found`,
        images: [],
        cached: false,
        source: 'placeholder',
        message: 'Using placeholder service'
      });
    }

    // Extract image URLs
    const images = photos.map(photo => ({
      large: photo.src.large,
      medium: photo.src.medium,
      small: photo.src.small,
      photographer: photo.photographer || 'Photo Collection',
      photographer_url: photo.photographer_url || '#',
      alt: photo.alt || query
    }));

    const firstImage = images[0]?.large || `https://via.placeholder.com/${width}x${height}/0066cc/ffffff?text=${encodeURIComponent(query)}`;

    // Cache the result
    pexelsCache.set(cacheKey, { 
      image: firstImage, 
      images,
      fetchedAt: now 
    });

    res.json({
      success: true,
      image: firstImage,
      images,
      cached: false,
      source: 'pexels'
    });
  } catch (error) {
    console.error('Error in Pexels route:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch images',
      statusCode: 500,
      error: error.message
    });
  }
});

// Batch Pexels Images API - Get images for multiple destinations in one request
router.post('/pexels/batch', async (req, res) => {
  try {
    const { queries } = req.body;

    if (!Array.isArray(queries) || queries.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide an array of queries'
      });
    }

    console.log(`\n📦 Batch request for ${queries.length} images`);

    const results = {};

    for (const query of queries) {
      const cacheKey = `${query.toLowerCase()}-800-600`;
      
      // Check cache first
      const cached = pexelsCache.get(cacheKey);
      const now = Date.now();

      if (cached && now - cached.fetchedAt < PEXELS_CACHE_TTL) {
        console.log(`   ✓ ${query} (cached)`);
        results[query] = { image: cached.image, cached: true };
        continue;
      }

      // Fetch from Pexels API
      try {
        const response = await axios.get('https://api.pexels.com/v1/search', {
          params: {
            query,
            per_page: 1,
            orientation: 'landscape'
          },
          headers: {
            Authorization: process.env.PEXELS_API_KEY
          },
          httpsAgent
        });

        const photo = response.data?.photos?.[0];
        const imageUrl = photo?.src?.large || `https://via.placeholder.com/800x600/0066cc/ffffff?text=${encodeURIComponent(query)}`;

        // Cache it
        pexelsCache.set(cacheKey, { image: imageUrl, fetchedAt: now });
        results[query] = { image: imageUrl, cached: false };
        console.log(`   ✓ ${query} (fetched)`);
      } catch (err) {
        console.log(`   ⚠ ${query} (fallback)`);
        const fallbackUrl = `https://via.placeholder.com/800x600/0066cc/ffffff?text=${encodeURIComponent(query)}`;
        results[query] = { image: fallbackUrl, cached: false };
      }
    }

    res.json({
      success: true,
      images: results,
      total: queries.length
    });
  } catch (error) {
    console.error('Error in batch Pexels route:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch batch images',
      error: error.message
    });
  }
});

// Tripadvisor Restaurants API (RapidAPI proxy to avoid frontend CORS issues)
router.get('/restaurants/:destination', async (req, res) => {
  try {
    const { destination } = req.params;
    const { locationId, limit = 6 } = req.query;

    if (!destination) {
      return res.status(400).json({
        success: false,
        message: 'Destination is required'
      });
    }

    const apiKey = process.env.TRIPADVISOR_RAPIDAPI_KEY;
    const apiHost = process.env.TRIPADVISOR_RAPIDAPI_HOST || 'tripadvisor16.p.rapidapi.com';
    const resolvedLocationId = String(locationId || resolveTripadvisorLocationId(destination) || '').trim();

    // If key or location is unavailable, return curated fallback set
    if (!apiKey || !resolvedLocationId) {
      const fallbackRestaurants = getFallbackRestaurants(destination).slice(0, Number(limit) || 6);
      return res.json({
        success: true,
        restaurants: fallbackRestaurants,
        total: fallbackRestaurants.length,
        isMocked: true,
        source: 'fallback',
        message: !apiKey
          ? 'Tripadvisor key missing. Returning fallback restaurants.'
          : 'No Tripadvisor location mapping found. Returning fallback restaurants.'
      });
    }

    const cacheKey = `${destination.toLowerCase()}-${resolvedLocationId}-${limit}`;
    const now = Date.now();
    const cached = restaurantsCache.get(cacheKey);

    if (cached && now - cached.fetchedAt < RESTAURANTS_CACHE_TTL) {
      return res.json({
        success: true,
        restaurants: cached.restaurants,
        total: cached.restaurants.length,
        cached: true,
        source: 'tripadvisor'
      });
    }

    const response = await axios.get(
      `https://${apiHost}/api/v1/restaurant/searchRestaurants`,
      {
        params: { locationId: resolvedLocationId },
        headers: {
          'x-rapidapi-key': apiKey,
          'x-rapidapi-host': apiHost,
          'content-type': 'application/json'
        },
        timeout: 12000
      }
    );

    const restaurants = normalizeTripadvisorRestaurants(response.data, destination).slice(0, Number(limit) || 6);

    if (!restaurants.length) {
      const fallbackRestaurants = getFallbackRestaurants(destination).slice(0, Number(limit) || 6);
      return res.json({
        success: true,
        restaurants: fallbackRestaurants,
        total: fallbackRestaurants.length,
        isMocked: true,
        source: 'fallback',
        message: 'Tripadvisor returned no restaurants. Using fallback list.'
      });
    }

    restaurantsCache.set(cacheKey, {
      restaurants,
      fetchedAt: now
    });

    return res.json({
      success: true,
      restaurants,
      total: restaurants.length,
      source: 'tripadvisor',
      locationId: resolvedLocationId,
      cached: false
    });
  } catch (error) {
    const destination = req.params.destination;
    const fallbackRestaurants = getFallbackRestaurants(destination).slice(0, Number(req.query.limit) || 6);

    return res.status(200).json({
      success: true,
      restaurants: fallbackRestaurants,
      total: fallbackRestaurants.length,
      isMocked: true,
      source: 'fallback',
      message: 'Tripadvisor API unavailable. Returning fallback restaurants.',
      error: error.response?.data?.message || error.message
    });
  }
});

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
  const { destination } = req.params;
  const { checkInDate, checkOutDate, adults } = req.query;

  // Pre-calculate dates outside try-catch so they're available in catch block
  const checkIn = checkInDate || new Date(Date.now() + 86400000).toISOString().split('T')[0];
  const checkOut = checkOutDate || new Date(Date.now() + 172800000).toISOString().split('T')[0];

  try {
    console.log(`\n🏨 Hotels request for: ${destination}`);
    console.log('   Check-in:', checkIn, 'Check-out:', checkOut, 'Adults:', adults);

    // Get Amadeus access token (cached)
    const token = await getAmadeusToken();

    // ✅ Check city code cache first (fixes hotels glitch)
    let cityCode = cityCodeCache.get(destination);
    
    if (!cityCode) {
      // Get city code from location API first
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
          // ✅ Cache the city code (7 days)
          cityCodeCache.set(destination, cityCode);
          console.log(`   ✓ Found city code: ${destination} → ${cityCode}`);
        } else {
          cityCode = destination;
          console.log(`   ⚠ No city code found for ${destination}, using name directly`);
        }
      } catch (locError) {
        cityCode = destination;
        console.log('   ⚠ Location lookup failed:', locError.response?.status || locError.message);
      }
    } else {
      console.log(`   ✓ City code cached: ${destination} → ${cityCode}`);
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
          checkInDate: checkIn,
          checkOutDate: checkOut
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

    console.log(`   ✓ Hotels API returned ${hotels.length} hotels`);

    res.json({
      success: true,
      hotels,
      total: hotels.length,
      cityCode: cityCode,
      isEmpty: hotels.length === 0
    });
  } catch (error) {
    console.error('   ✗ Hotels API Error:', error.response?.status, error.message);
    console.error('   Response:', error.response?.data);
    
    // Provide specific error messages
    let errorMessage = 'Failed to fetch hotels';
    if (error.response?.status === 401) {
      errorMessage = 'Authentication failed - check Amadeus credentials';
    } else if (error.response?.status === 429) {
      errorMessage = 'Rate limit exceeded - too many requests';
    } else if (error.response?.status === 400) {
      errorMessage = 'Invalid request parameters';
    }
    
    // Fallback: Return mock hotels when API fails
    console.log('   📌 Returning mock hotel data as fallback');
    const mockHotels = [
      {
        name: `Luxury Resort - ${destination}`,
        hotelId: 'MOCK_1',
        rating: 5,
        address: { city: destination, country: 'XX' },
        price: '150.00',
        currency: 'USD',
        checkInDate,
        checkOutDate,
        rooms: 1
      },
      {
        name: `Business Hotel - ${destination}`,
        hotelId: 'MOCK_2',
        rating: 4,
        address: { city: destination, country: 'XX' },
        price: '100.00',
        currency: 'USD',
        checkInDate,
        checkOutDate,
        rooms: 1
      },
      {
        name: `Budget Inn - ${destination}`,
        hotelId: 'MOCK_3',
        rating: 3,
        address: { city: destination, country: 'XX' },
        price: '60.00',
        currency: 'USD',
        checkInDate,
        checkOutDate,
        rooms: 1
      }
    ];

    res.status(200).json({
      success: true,
      hotels: mockHotels,
      total: mockHotels.length,
      cityCode: destination,
      isEmpty: false,
      isMocked: true,
      message: 'Using sample hotel data (API currently unavailable)'
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

    console.log(`\n✈️ Flights request: ${from} → ${to} on ${departureDate}`);
    
    // Validate departure date is not in the past
    const depDate = new Date(departureDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (depDate < today) {
      console.log('   ✗ Departure date is in the past');
      return res.status(400).json({
        success: false,
        message: 'Departure date cannot be in the past',
        hint: 'Please select a future date'
      });
    }

    // Get Amadeus access token (cached)
    const token = await getAmadeusToken();

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

    console.log(`   ✓ Flights API returned ${flights.length} flights`);

    res.json({
      success: true,
      flights,
      total: flights.length
    });
  } catch (error) {
    console.error('   ✗ Flights API Error:', error.response?.status, error.message);
    console.error('   Response:', error.response?.data);
    
    // Return mock flight data as fallback
    console.log('   📌 Returning mock flight data as fallback');
    const mockFlights = [
      {
        id: 'MOCK_1',
        source: 'MOCK',
        instantTicketingRequired: false,
        nonHomogeneous: false,
        oneWay: true,
        numberOfBookableSeats: 9,
        itineraries: [
          {
            duration: 'PT17H25M',
            segments: [
              {
                departure: { iataCode: from, at: departureDate + 'T08:00:00' },
                arrival: { iataCode: to, at: departureDate + 'T17:00:00' },
                carrierCode: 'UL',
                number: '101',
                aircraft: '787',
                stops: 1
              }
            ]
          }
        ],
        price: { currency: 'EUR', total: '220.66', base: '180.00' }
      },
      {
        id: 'MOCK_2',
        source: 'MOCK',
        instantTicketingRequired: false,
        nonHomogeneous: false,
        oneWay: true,
        numberOfBookableSeats: 9,
        itineraries: [
          {
            duration: 'PT30H50M',
            segments: [
              {
                departure: { iataCode: from, at: departureDate + 'T14:00:00' },
                arrival: { iataCode: to, at: departureDate + 'T22:50:00' },
                carrierCode: 'UL',
                number: '205',
                aircraft: '777',
                stops: 1
              }
            ]
          }
        ],
        price: { currency: 'EUR', total: '220.66', base: '180.00' }
      },
      {
        id: 'MOCK_3',
        source: 'MOCK',
        instantTicketingRequired: false,
        nonHomogeneous: false,
        oneWay: true,
        numberOfBookableSeats: 7,
        itineraries: [
          {
            duration: 'PT13H40M',
            segments: [
              {
                departure: { iataCode: from, at: departureDate + 'T20:00:00' },
                arrival: { iataCode: to, at: departureDate + 'T09:40:00' },
                carrierCode: 'GF',
                number: '502',
                aircraft: '380',
                stops: 1
              }
            ]
          }
        ],
        price: { currency: 'EUR', total: '230.08', base: '190.00' }
      }
    ];

    res.status(200).json({
      success: true,
      flights: mockFlights,
      total: mockFlights.length,
      isMocked: true,
      message: 'Using sample flight data (API currently unavailable)'
    });
  }
});

// Get Airport/City Codes (for flight search)
router.get('/location-codes/:keyword', async (req, res) => {
  try {
    const { keyword } = req.params;

    console.log(`\n🔍 Location codes search for: ${keyword}`);

    // Get Amadeus access token (cached)
    const token = await getAmadeusToken();

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
    const city = req.params.city.toLowerCase();
    const now = Date.now();

    // ✅ Check weather cache first (fixes glitch - was refetching every render)
    const cached = weatherCache.get(city);
    if (cached && now - cached.fetchedAt < WEATHER_CACHE_TTL) {
      console.log(`✓ Weather for ${city} (cached)`);
      return res.json({
        success: true,
        data: cached.data,
        cached: true
      });
    }

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

    // ✅ Cache the weather data (10 minutes)
    weatherCache.set(city, { data: weather, fetchedAt: now });

    res.json({
      success: true,
      data: weather,
      cached: false
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

// Overpass API Proxy Route
router.post('/overpass', async (req, res) => {
  try {
    const { query } = req.body;
    if (!query) {
      return res.status(400).json({
        success: false,
        message: 'Missing query in request body'
      });
    }

    const now = Date.now();
    const cached = overpassCache.get(query);

    if (cached && now - cached.fetchedAt < OVERPASS_CACHE_TTL) {
      console.log('✓ Overpass query returned from cache');
      return res.json(cached.data);
    }

    console.log('⟳ Fetching Overpass API (proxying request)...');
    const response = await axios.post(
      'https://overpass-api.de/api/interpreter',
      'data=' + encodeURIComponent(query),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'User-Agent': 'TravelerApp/1.0 (contact@traveler.local)'
        },
        timeout: 20000
      }
    );

    // Cache the response
    overpassCache.set(query, {
      data: response.data,
      fetchedAt: now
    });

    return res.json(response.data);
  } catch (error) {
    console.error('Error in Overpass proxy route:', error.response?.data || error.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch places from Overpass API',
      error: error.message
    });
  }
});

module.exports = router;

