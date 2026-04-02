// Pexels API proxy client (calls backend; no keys in frontend)
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Cache to avoid repeated API calls for the same destination
const imageCache = new Map();

const buildPlaceholder = (text, width, height) =>
  `data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}"%3E%3Crect fill="%23e0e0e0" width="${width}" height="${height}"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%23999" font-size="24" font-family="Arial"%3E${encodeURIComponent(text)}%3C/text%3E%3C/svg%3E`;

const fetchImageFromBackend = async (query, width, height, options = {}) => {
  const params = new URLSearchParams({
    query,
    width: width.toString(),
    height: height.toString(),
    ...options
  });

  const response = await fetch(`${API_URL}/external/pexels?${params.toString()}`);

  if (!response.ok) {
    throw new Error(`Pexels proxy failed with status ${response.status}`);
  }

  return response.json();
};

export const pexelsService = {
  getDestinationImage: async (query, width = 800, height = 600) => {
    const cacheKey = `${query}-${width}-${height}`;
    if (imageCache.has(cacheKey)) {
      return imageCache.get(cacheKey);
    }

    try {
      const data = await fetchImageFromBackend(query, width, height, { per_page: 1 });
      const imageUrl = data?.image;
      
      // If we got a real image URL from Pexels
      if (imageUrl && (imageUrl.startsWith('https://images.pexels.com') || imageUrl.includes('pexels.com'))) {
        imageCache.set(cacheKey, imageUrl);
        return imageUrl;
      }
      
      // Otherwise return placeholder
      return buildPlaceholder(query, width, height);
    } catch (error) {
      console.error('Error fetching Pexels image via proxy:', error);
      return buildPlaceholder(query, width, height);
    }
  },

  getPhotos: async (query, per_page = 10, width = 800, height = 600) => {
    try {
      const data = await fetchImageFromBackend(query, width, height, { per_page });
      return data?.images || [];
    } catch (error) {
      console.error('Error fetching Pexels photos via proxy:', error);
      return [];
    }
  },

  clearCache: () => {
    imageCache.clear();
  }
};

export default pexelsService;
