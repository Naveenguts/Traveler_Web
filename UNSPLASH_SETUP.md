# Unsplash API Setup Guide

## Overview
Your traveler app now uses the Unsplash API to fetch high-quality destination images dynamically instead of using hardcoded image URLs.

## Setup Instructions

### 1. Get Your Unsplash API Key

1. Go to [Unsplash Developers](https://unsplash.com/developers)
2. Click "Register as a developer" (if you haven't already)
3. Create a new application:
   - Click "New Application"
   - Accept the API guidelines
   - Fill in your application details:
     - **Application name**: `Traveler Project` (or any name)
     - **Description**: `Travel destination discovery app`
4. Copy your **Access Key**

### 2. Add API Key to Your Project

Edit the file `frontend/.env` and replace `your-unsplash-access-key-here` with your actual Access Key:

```env
VITE_UNSPLASH_ACCESS_KEY=YOUR_ACTUAL_ACCESS_KEY_HERE
```

### 3. Restart Your Development Server

After adding the API key:

```bash
# Stop your current dev server (Ctrl+C)
# Then restart it
cd frontend
npm run dev
```

## Features

### Image Loading
- ✅ Images are fetched automatically when destinations are loaded
- ✅ Intelligent caching prevents repeated API calls
- ✅ Smooth fade-in effect when images load
- ✅ Fallback placeholders if images fail to load

### API Usage
The app uses Unsplash responsibly:
- Images are cached in memory to reduce API calls
- Smart search queries combine destination name + country
- Graceful fallbacks ensure the app works even if Unsplash is down

## Files Modified

1. **`frontend/src/services/unsplashService.js`** - New service for Unsplash API
2. **`frontend/src/pages/Destinations.jsx`** - Fetches images for 150 destinations
3. **`frontend/src/pages/Home.jsx`** - Fetches images for popular destinations
4. **`frontend/src/components/DestinationCard.jsx`** - Fixed image loading with opacity
5. **`frontend/.env`** - Added VITE_UNSPLASH_ACCESS_KEY

## API Limits

**Free Tier:**
- 50 requests per hour
- 50,000 requests per month

**Important**: The app caches images in memory, so you won't hit these limits during normal development.

## Testing

1. Open your app in the browser
2. Navigate to the Destinations page
3. You should see destination images loading with a smooth fade-in effect
4. Check the browser console for any errors

## Troubleshooting

### Images not loading?
1. Verify your API key is correct in `.env`
2. Restart the dev server after changing `.env`
3. Check browser console for errors
4. Verify you haven't exceeded the API rate limit

### Rate limit exceeded?
- Wait an hour for the limit to reset
- Clear the cache by refreshing the page
- The app will use placeholder images as fallback

## Alternative: Use Demo Key for Testing

If you don't want to create an account right away, you can test with this demo key (limited to 50 requests/hour):

```env
VITE_UNSPLASH_ACCESS_KEY=YOUR_DEMO_KEY
```

Note: Create your own key for production use.

## Benefits of This Approach

✅ **No more broken image links** - Dynamic fetching ensures images are always available  
✅ **High-quality photos** - Unsplash provides professional travel photography  
✅ **Automatic resizing** - Images are optimized for your layout  
✅ **Caching** - Reduces API calls and improves performance  
✅ **Fallback support** - Graceful degradation if API fails  

## Next Steps

Consider implementing:
- Lazy loading for better performance
- Image preloading for smoother UX  
- Local caching in localStorage for persistence
- Batch API requests to reduce calls

Enjoy your beautiful destination images! 🌍✨
