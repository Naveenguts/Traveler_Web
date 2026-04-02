/**
 * Image utility functions with fallback support
 * Handles SSL certificate errors and image loading issues
 */

// Color palette for placeholder backgrounds
const FALLBACK_COLORS = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8',
  '#6C5CE7', '#A29BFE', '#FF7675', '#74B9FF', '#81ECEC'
];

/**
 * Get a deterministic color for a destination based on its name
 * @param {string} destination - The destination name
 * @returns {string} - A hex color code
 */
export function getPlaceholderColor(destination = '') {
  if (!destination) return FALLBACK_COLORS[0];
  
  // Generate a hash from the destination name
  let hash = 0;
  for (let i = 0; i < destination.length; i++) {
    hash = ((hash << 5) - hash) + destination.charCodeAt(i);
    hash = hash & hash; // Convert to 32bit integer
  }
  
  const index = Math.abs(hash) % FALLBACK_COLORS.length;
  return FALLBACK_COLORS[index];
}

/**
 * Convert problematic HTTPS URLs to local inline fallback
 * Handles SSL certificate errors on Unsplash URLs
 * @param {string} url - The original image URL
 * @param {object} options - Options for placeholder generation
 * @returns {string} - Fallback URL if Unsplash, otherwise original URL
 */
export function getImageUrlWithFallback(url, options = {}) {
  const { width = 800, height = 500, text = '' } = options;
  
  // If it's an unreachable third-party image URL in this environment, use inline fallback.
  if (url && (url.includes('unsplash.com') || url.includes('via.placeholder.com'))) {
    return getPlaceholderImage(width, height, text || 'Image');
  }
  
  // If it's a Pexels URL or other trusted source, use as-is
  return url || getPlaceholderImage(width, height, text || 'No Image');
}

/**
 * Generate a placeholder image URL with color
 * @param {number} width - Image width
 * @param {number} height - Image height
 * @param {string} text - Text to display
 * @param {string} bgColor - Background color (hex code)
 * @returns {string} - Placeholder URL
 */
export function getPlaceholderImage(width = 800, height = 500, text = '', bgColor = '#cccccc') {
  const safeText = String(text || 'Image').replace(/[<>&"']/g, '');
  const color = bgColor || '#cccccc';
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
    <rect width="100%" height="100%" fill="${color}"/>
    <rect x="0" y="${Math.round(height * 0.72)}" width="100%" height="${Math.round(height * 0.28)}" fill="rgba(0,0,0,0.2)"/>
    <text x="50%" y="${Math.round(height * 0.86)}" text-anchor="middle" font-family="Segoe UI, Arial, sans-serif" font-size="${Math.max(14, Math.round(width * 0.045))}" fill="#ffffff">${safeText}</text>
  </svg>`;
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

/**
 * Handle image loading error with fallback
 * @param {Event} event - Image error event
 * @param {string} destination - Destination name for placeholder
 */
export function handleImageError(event, destination = '') {
  if (!event.target) return;

  // Prevent infinite onError loops if fallback itself fails for any reason.
  if (event.target.dataset.fallbackApplied === 'true') return;
  event.target.dataset.fallbackApplied = 'true';
  
  const bgColor = getPlaceholderColor(destination);
  event.target.src = getPlaceholderImage(
    event.target.width || 800,
    event.target.height || 500,
    destination,
    bgColor
  );
}

/**
 * Preload an image and return the URL after successful load
 * Falls back to placeholder if loading fails
 * @param {string} url - Image URL to load
 * @param {object} options - Options
 * @returns {Promise<string>} - Promise resolving to image URL or fallback
 */
export function preloadImage(url, options = {}) {
  return new Promise((resolve) => {
    const { width = 800, height = 500, text = '' } = options;
    
    // If Unsplash URL, skip loading and use fallback immediately
    if (url && url.includes('unsplash.com')) {
      resolve(getImageUrlWithFallback(url, options));
      return;
    }
    
    // For other URLs, try to load
    const img = new Image();
    
    img.onload = () => {
      resolve(url);
    };
    
    img.onerror = () => {
      resolve(getPlaceholderImage(width, height, text));
    };
    
    // Set a timeout in case image takes too long
    const timeout = setTimeout(() => {
      resolve(getPlaceholderImage(width, height, text));
    }, 5000);
    
    img.onload = () => {
      clearTimeout(timeout);
      resolve(url);
    };
    
    img.onerror = () => {
      clearTimeout(timeout);
      resolve(getPlaceholderImage(width, height, text));
    };
    
    img.src = url;
  });
}

export default {
  getPlaceholderColor,
  getImageUrlWithFallback,
  getPlaceholderImage,
  handleImageError,
  preloadImage
};
