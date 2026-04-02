const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const wikiImageCache = new Map();
const foodImageCache = new Map();

const curatedFoodImageOverrides = {
  'paris|croissant': 'https://images.unsplash.com/photo-1555507036-ab794f57598f?w=1200&h=800&fit=crop&auto=format',
  'paris|coq au vin': 'https://images.unsplash.com/photo-1604908176997-4314b2b5f9f7?w=1200&h=800&fit=crop&auto=format',
  'paris|macarons': 'https://images.unsplash.com/photo-1558326567-98ae2405596b?w=1200&h=800&fit=crop&auto=format',
  'tokyo|sushi': 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=1200&h=800&fit=crop&auto=format',
  'tokyo|ramen': 'https://images.unsplash.com/photo-1557872943-16a5ac26437e?w=1200&h=800&fit=crop&auto=format',
  'tokyo|takoyaki': 'https://images.unsplash.com/photo-1625943555404-7f6fd9a5f7cf?w=1200&h=800&fit=crop&auto=format',
  'new york|new york pizza': 'https://images.unsplash.com/photo-1548365328-9f547fb0953f?w=1200&h=800&fit=crop&auto=format',
  'new york|bagel and lox': 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=1200&h=800&fit=crop&auto=format',
  'new york|cheesecake': 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=1200&h=800&fit=crop&auto=format',
  'barcelona|paella': 'https://images.unsplash.com/photo-1534080564583-6be75777b70a?w=1200&h=800&fit=crop&auto=format',
  'dubai|shawarma': 'https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=1200&h=800&fit=crop&auto=format',
  'london|fish and chips': 'https://images.unsplash.com/photo-1579208030886-b937da0925dc?w=1200&h=800&fit=crop&auto=format'
};

const fallbackImagePool = [
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&h=800&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1200&h=800&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1200&h=800&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1488085061387-422e29b40080?w=1200&h=800&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=1200&h=800&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1200&h=800&fit=crop&auto=format'
];

const cityImageMap = {
  Paris: 'https://cdn.pixabay.com/photo/2016/11/18/14/44/paris-1835986_1280.jpg',
  Tokyo: 'https://cdn.pixabay.com/photo/2016/08/01/01/52/shibuya-1562432_1280.jpg',
  'New York': 'https://cdn.pixabay.com/photo/2017/10/01/20/36/new-york-2808502_1280.jpg',
  London: 'https://cdn.pixabay.com/photo/2016/02/18/16/34/big-ben-1208677_1280.jpg',
  Dubai: 'https://cdn.pixabay.com/photo/2014/09/18/14/54/dubai-450341_1280.jpg',
  Barcelona: 'https://cdn.pixabay.com/photo/2016/03/12/10/29/barcelona-1250884_1280.jpg',
  Rome: 'https://cdn.pixabay.com/photo/2015/07/16/18/20/colosseum-848969_1280.jpg',
  Amsterdam: 'https://cdn.pixabay.com/photo/2016/08/13/16/13/amsterdam-1592267_1280.jpg',
  Sydney: 'https://cdn.pixabay.com/photo/2013/10/02/12/35/sydney-opera-house-190885_1280.jpg',
  Bangkok: 'https://cdn.pixabay.com/photo/2016/11/16/22/31/thailand-1831145_1280.jpg',
  Venice: 'https://cdn.pixabay.com/photo/2015/01/26/01/08/venice-612865_1280.jpg',
  Singapore: 'https://cdn.pixabay.com/photo/2018/03/13/14/49/singapore-3223811_1280.jpg',
  Berlin: 'https://cdn.pixabay.com/photo/2016/06/07/09/22/berlin-1441764_1280.jpg',
  Istanbul: 'https://cdn.pixabay.com/photo/2015/11/23/15/36/istanbul-1057406_1280.jpg',
  Montreal: 'https://cdn.pixabay.com/photo/2017/04/04/22/20/montreal-2204102_1280.jpg',
  Vienna: 'https://cdn.pixabay.com/photo/2015/09/19/20/48/schonbrunn-palace-947340_1280.jpg',
  Prague: 'https://cdn.pixabay.com/photo/2014/02/27/16/00/prague-274852_1280.jpg',
  Budapest: 'https://cdn.pixabay.com/photo/2015/04/11/21/06/budapest-718770_1280.jpg',
  Madrid: 'https://cdn.pixabay.com/photo/2016/04/21/15/05/madrid-1344076_1280.jpg',
  Athens: 'https://cdn.pixabay.com/photo/2015/09/30/14/43/greece-963779_1280.jpg',
  Bali: 'https://cdn.pixabay.com/photo/2017/10/11/19/40/bali-2840926_1280.jpg',
  'Ho Chi Minh City': 'https://cdn.pixabay.com/photo/2016/04/15/09/11/ben-thanh-market-1330441_1280.jpg',
  Hanoi: 'https://cdn.pixabay.com/photo/2016/02/19/11/46/hoan-kiem-lake-1208801_1280.jpg',
  Phuket: 'https://cdn.pixabay.com/photo/2016/04/28/07/07/patong-beach-1357598_1280.jpg',
  'Chiang Mai': 'https://cdn.pixabay.com/photo/2015/10/04/10/10/wat-chedi-luang-971560_1280.jpg',
  Krabi: 'https://cdn.pixabay.com/photo/2019/01/08/20/42/railay-beach-3918305_1280.jpg',
  Boracay: 'https://cdn.pixabay.com/photo/2017/03/24/10/26/boracay-2169268_1280.jpg',
  Manila: 'https://cdn.pixabay.com/photo/2018/07/14/11/10/manila-3537382_1280.jpg',
  'Kuala Lumpur': 'https://cdn.pixabay.com/photo/2016/11/18/14/59/petronas-towers-1835917_1280.jpg',
  Penang: 'https://cdn.pixabay.com/photo/2016/04/17/15/13/penang-bridge-1334658_1280.jpg'
};

const hashString = (value = '') => {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
};

const foodQueryMap = {
  croissant: ['french croissant pastry close up', 'fresh butter croissant bakery'],
  'coq au vin': ['coq au vin french chicken stew', 'classic french coq au vin dish'],
  macarons: ['french macarons dessert colorful', 'parisian macarons pastry'],
  sushi: ['japanese sushi platter', 'fresh sushi nigiri close up'],
  ramen: ['japanese ramen bowl', 'tonkotsu ramen noodles'],
  takoyaki: ['takoyaki japanese street food', 'octopus balls japan'],
  paella: ['spanish seafood paella', 'traditional paella valenciana'],
  shawarma: ['middle eastern shawarma wrap', 'shawarma street food'],
  'fish and chips': ['british fish and chips', 'classic fish chips plate'],
  'new york pizza': ['new york style pizza slice', 'nyc pizza close up'],
  'bagel and lox': ['bagel lox smoked salmon', 'new york bagel breakfast']
};

const normalizeFoodKey = (value = '') =>
  String(value)
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const normalizeCityKey = (value = '') =>
  String(value)
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const getFoodWikipediaCandidates = (foodName = '') => {
  const base = String(foodName || '').trim();
  if (!base) return [];

  const normalized = base.replace(/\s+/g, ' ').trim();
  const singular = normalized.endsWith('s') && normalized.length > 3
    ? normalized.slice(0, -1)
    : normalized;

  const candidates = [
    normalized,
    singular,
    `${normalized} (dish)`,
    `${singular} (dish)`,
    `${normalized} (food)`,
    `${singular} (food)`
  ];

  return [...new Set(candidates.filter(Boolean))];
};

const getCuratedFoodOverride = (foodName, cityName) => {
  const key = `${normalizeCityKey(cityName)}|${normalizeFoodKey(foodName)}`;
  return curatedFoodImageOverrides[key] || '';
};

const appendSizeParams = (url, width, height) => {
  if (!url) return url;
  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}w=${width}&h=${height}&fit=crop&auto=format`;
};

const buildInlineFallback = (city, width = 1200, height = 800) => {
  const safeCity = String(city || 'Destination').replace(/[<>&"']/g, '');
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#cbd5e1"/>
        <stop offset="100%" stop-color="#94a3b8"/>
      </linearGradient>
    </defs>
    <rect width="100%" height="100%" fill="url(#bg)"/>
    <path d="M0 ${Math.round(height * 0.75)} L${Math.round(width * 0.2)} ${Math.round(height * 0.55)} L${Math.round(width * 0.35)} ${Math.round(height * 0.7)} L${Math.round(width * 0.52)} ${Math.round(height * 0.48)} L${Math.round(width * 0.72)} ${Math.round(height * 0.72)} L${width} ${Math.round(height * 0.58)} L${width} ${height} L0 ${height} Z" fill="rgba(15,23,42,0.22)"/>
    <circle cx="${Math.round(width * 0.82)}" cy="${Math.round(height * 0.22)}" r="${Math.round(Math.min(width, height) * 0.08)}" fill="rgba(255,255,255,0.45)"/>
    <rect x="${Math.round(width * 0.08)}" y="${Math.round(height * 0.78)}" rx="12" ry="12" width="${Math.round(width * 0.84)}" height="${Math.round(height * 0.14)}" fill="rgba(15,23,42,0.35)"/>
    <text x="50%" y="${Math.round(height * 0.865)}" text-anchor="middle" font-family="Segoe UI, Arial, sans-serif" font-size="${Math.max(20, Math.round(width * 0.035))}" fill="#ffffff">${safeCity}</text>
  </svg>`;
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
};

export const externalAPI = {
  // Deterministic photo fallback without picsum (avoids SSL certificate issues)
  getPhotoFallback: (city, width = 1200, height = 800) => {
    const normalized = String(city || 'destination').trim().toLowerCase();
    const poolIndex = hashString(normalized) % fallbackImagePool.length;
    const baseUrl = fallbackImagePool[poolIndex];
    return appendSizeParams(baseUrl, width, height);
  },

  // Guaranteed local fallback that does not rely on external hosts.
  getInlineFallback: (city, width = 1200, height = 800) => buildInlineFallback(city, width, height),

  // City-specific image where available, then deterministic pool fallback
  getUnsplashFallback: (city, width = 1200, height = 800) => {
    const normalized = String(city || '').trim();
    const mapped = cityImageMap[normalized];
    if (mapped) return appendSizeParams(mapped, width, height);
    return externalAPI.getPhotoFallback(normalized, width, height);
  },

  // Wikipedia image lookup via backend proxy (cached + header-compliant).
  getWikipediaPageImage: async (title, thumbSize = 800) => {
    try {
      const rawTitle = String(title || '').trim();
      if (!rawTitle) return null;

      const cacheKey = `${rawTitle.toLowerCase()}-${Number(thumbSize) || 800}`;
      if (wikiImageCache.has(cacheKey)) {
        return wikiImageCache.get(cacheKey);
      }

      const response = await fetch(`${API_URL}/external/wikipedia/image/${encodeURIComponent(rawTitle)}?thumbSize=${Number(thumbSize) || 800}`);
      if (!response.ok) throw new Error('Failed to fetch Wikipedia page image');

      const data = await response.json();
      const image = data?.image || null;
      wikiImageCache.set(cacheKey, image);

      return image;
    } catch (error) {
      // Suppress noisy logs from third-party throttling in client console.
      return null;
    }
  },

  // Main city image resolver used by cards and lists.
  getCityImage: async (city, thumbSize = 800) => {
    const width = Math.max(Number(thumbSize) || 800, 800);
    const height = Math.round((width * 2) / 3);
    const wikiImage = await externalAPI.getWikipediaPageImage(city, width);
    return wikiImage || externalAPI.getUnsplashFallback(city, width, height) || externalAPI.getInlineFallback(city, width, height);
  },

  // Food image resolver via backend proxy (Pexels/Unsplash/placeholder fallback handled server-side).
  getFoodImage: async (foodName, cityName = '', width = 900, height = 600) => {
    const food = String(foodName || '').trim();
    const city = String(cityName || '').trim();
    const cacheKey = `${food.toLowerCase()}|${city.toLowerCase()}|${width}|${height}`;

    if (foodImageCache.has(cacheKey)) {
      return foodImageCache.get(cacheKey);
    }

    const curated = getCuratedFoodOverride(food, city);
    if (curated) {
      foodImageCache.set(cacheKey, curated);
      return curated;
    }

    const queryCandidates = [];
    const mappedQueries = foodQueryMap[normalizeFoodKey(food)] || [];
    mappedQueries.forEach((query) => queryCandidates.push(query));
    if (food) queryCandidates.push(`${food} food dish close up`);
    if (food && city) queryCandidates.push(`${food} ${city} cuisine food`);
    if (food) queryCandidates.push(`${food} plated meal`);

    try {
      for (const query of queryCandidates) {
        const params = new URLSearchParams({
          query,
          width: String(width),
          height: String(height),
          per_page: '1'
        });

        const response = await fetch(`${API_URL}/external/pexels?${params}`);
        if (!response.ok) {
          continue;
        }

        const data = await response.json();
        const imageUrl = data?.image || '';
        const isPlaceholder = imageUrl.includes('via.placeholder.com');

        if (imageUrl && !isPlaceholder) {
          foodImageCache.set(cacheKey, imageUrl);
          return imageUrl;
        }
      }

      const wikiCandidates = getFoodWikipediaCandidates(food);
      for (const wikiTitle of wikiCandidates) {
        const wikiImage = await externalAPI.getWikipediaPageImage(wikiTitle, width);
        if (wikiImage) {
          foodImageCache.set(cacheKey, wikiImage);
          return wikiImage;
        }
      }

      return externalAPI.getInlineFallback(foodName || cityName || 'Food', width, height);
    } catch {
      return externalAPI.getInlineFallback(foodName || cityName || 'Food', width, height);
    }
  },

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
      
      // Accept both success (200) and 500 errors with mock data
      if (!response.ok && response.status !== 500) {
        throw new Error('Failed to fetch hotels');
      }
      
      const data = await response.json();
      
      // Accept mock data responses too
      if (data.success || data.isMocked) {
        return data;
      }
      
      throw new Error(data.message || 'Failed to fetch hotels');
    } catch (error) {
      console.error('Error fetching hotels:', error);
      throw error;
    }
  },

  // Get restaurants for a destination via backend proxy (Tripadvisor RapidAPI)
  getRestaurants: async (destination, limit = 6, locationId = '') => {
    try {
      const params = new URLSearchParams({ limit: String(limit) });
      if (locationId) {
        params.set('locationId', String(locationId));
      }

      const response = await fetch(`${API_URL}/external/restaurants/${encodeURIComponent(destination)}?${params}`);
      if (!response.ok) {
        throw new Error('Failed to fetch restaurants');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching restaurants:', error);
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
      
      // Accept both success (200) and 500 errors with mock data
      if (!response.ok && response.status !== 500) {
        throw new Error('Failed to fetch flights');
      }
      
      const data = await response.json();
      
      // Accept mock data responses too
      if (data.success || data.isMocked) {
        return data;
      }
      
      throw new Error(data.message || 'Failed to fetch flights');
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
  },

  // Get Wikipedia summary for a destination
  getWikipediaSummary: async (title) => {
    try {
      const normalized = encodeURIComponent(String(title || '').trim().replace(/\s+/g, '_'));
      const response = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${normalized}`);
      if (!response.ok) return null;
      return await response.json();
    } catch (error) {
      return null;
    }
  }
};

export default externalAPI;
