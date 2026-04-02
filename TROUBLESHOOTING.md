# 🔧 Troubleshooting Guide

## Common Issues & Solutions

### Issue 1: Module Not Found (express-rate-limit)
```
Error: Cannot find module 'express-rate-limit'
```

**Solution**:
```bash
cd traveler-backend
npm install express-rate-limit
npm start
```

**Status**: ✅ Already installed

---

### Issue 2: Backend Not Starting
```
Error: Server refused connection on port 5000
```

**Solutions**:
1. Check if port 5000 is in use:
```bash
netstat -ano | findstr :5000
# If something is using it, kill it:
taskkill /PID <PID> /F
```

2. Verify MongoDB connection:
   - Check `.env` file has `MONGODB_URI`
   - Verify MongoDB Atlas is accessible
   - Check IP whitelist includes your IP

3. Verify `.env` file exists with required keys:
```
MONGODB_URI=...
PEXELS_API_KEY=...
AMADEUS_CLIENT_ID=...
AMADEUS_CLIENT_SECRET=...
JWT_SECRET=...
```

---

### Issue 3: Batch Endpoint Returns 404
```
Error: POST /api/pexels/batch → 404 Not Found
```

**Solutions**:
1. Verify route is registered in server.js:
```javascript
const externalApisRoutes = require('./routes/external-apis');
app.use('/api', externalApisRoutes);
```

2. Check backend is running: `npm start` in traveler-backend

3. Verify correct URL: `http://localhost:5000/api/pexels/batch`

---

### Issue 4: Images Not Loading (404 on Image URLs)
```
GET https://images.pexels.com/... → 404
```

**Solutions**:
1. Verify Pexels API key is correct in `.env`
2. Check Pexels API quota hasn't been exceeded
3. Backend should log fetch attempts, check console
4. Verify placeholder URL works: `https://via.placeholder.com/400x300?text=Paris`

---

### Issue 5: Search Debounce Not Working
```
Multiple API calls on each keystroke
```

**Solutions**:
1. Verify debounce is in Destinations.jsx:
```javascript
useEffect(() => {
  const timer = setTimeout(() => {
    setSearchDebounce(searchTerm);
  }, 800);
  return () => clearTimeout(timer);
}, [searchTerm]);
```

2. Check that search uses `searchDebounce` not `searchTerm`
3. Clear browser cache and hard refresh: Ctrl+Shift+Delete then Ctrl+F5

---

### Issue 6: Rate Limiting Too Strict
```
Error: Too many requests (HTTP 429) after 100 requests
```

**Solutions**:

If you need to adjust rate limits for development:
```javascript
// server.js - Adjust these values:

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,  // 15 minutes (adjust window)
  max: 100,                    // 100 requests (adjust max)
  message: 'Custom message'    // Custom error message
});

// Or disable for development:
// app.use('/api', apiLimiter);  // Comment out this line
```

**Production Settings**:
- Keep default: 100 requests per 15 minutes
- Prevent API key abuse

**Development Settings**:
- Increase to: 1000 requests per 15 minutes
- Or disable temporarily for testing

---

### Issue 7: CORS Errors
```
Error: Access to XMLHttpRequest blocked by CORS policy
```

**Solutions**:
1. Verify CORS is enabled in server.js:
```javascript
const cors = require('cors');
app.use(cors());
```

2. Check frontend is calling correct backend URL:
```javascript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
```

3. Verify `.env` in frontend:
```
VITE_API_URL=http://localhost:5000/api
```

---

### Issue 8: MongoDB Connection Failed
```
Error: MongoDB connection failed
```

**Solutions**:
1. Check MongoDB Atlas status: https://cloud.mongodb.com
2. Verify IP is whitelisted in MongoDB Atlas
3. Check connection string in `.env`:
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/traveler-app?retryWrites=true&w=majority
```
4. Test connection:
```bash
node test-mongo.js
```

---

### Issue 9: Pexels API Rate Limited
```
Error: 429 Too Many Requests from Pexels API
```

**Solutions**:
1. Verify cache is working (check console logs)
2. Check cache TTL: Should be 7 days
3. Monitor Pexels dashboard for quota
4. Fallback to placeholder images working

**Before Optimization**: Would happen on every page load
**After Optimization**: Should never happen with batch+cache

---

### Issue 10: Frontend Build Errors
```
Error: Failed to compile
```

**Solutions**:
1. Check for JSX syntax errors:
```bash
cd frontend
npm run build  # Detailed error messages
```

2. Verify all imports exist:
```javascript
import { someFunction } from './file'  // file must exist
```

3. Clear node_modules and reinstall:
```bash
cd frontend
rm -r node_modules
npm install
npm run dev
```

---

## Verification Steps

### ✅ Step 1: Backend Running
```bash
cd traveler-backend
npm start

# Should see:
# 🚀 Server is running on port 5000
# ✅ MongoDB Connected
```

### ✅ Step 2: Frontend Running
```bash
cd frontend
npm run dev

# Should see:
# ➜  Local:   http://localhost:5173/
# ➜  ready in XXX ms
```

### ✅ Step 3: Load Application
- Navigate to: http://localhost:5173/destinations
- Open DevTools Network tab
- Verify: 1 POST request to `/api/pexels/batch`
- Verify: Response contains all 150 destination images
- Verify: NO individual Pexels API calls

### ✅ Step 4: Test Search
- Type in search box: "Paris"
- Observe: Only 1 filter (not 1 per keystroke) = Debounce working

### ✅ Step 5: Test Filters
- Apply country filter: Should instant filter
- Apply price range: Should instant filter
- No API calls should occur

---

## Debugging Commands

### Check if ports are in use
```bash
# Check port 5000 (backend)
netstat -ano | findstr :5000

# Check port 5173 (frontend)
netstat -ano | findstr :5173
```

### Test backend endpoint directly
```bash
# In PowerShell:
curl -X POST http://localhost:5000/api/pexels/batch `
  -Headers @{"Content-Type"="application/json"} `
  -Body '{"queries":["Paris","Tokyo"]}'
```

### Check environment variables
```bash
cd traveler-backend
node -e "require('dotenv').config(); console.log(process.env)"
```

### View backend logs
```bash
# Backend logs real-time
cd traveler-backend
npm start

# Look for:
# 📦 Batch request for 150 images
# ✓ Paris (cached)
# ✓ Tokyo (fetched)
```

---

## Common Configuration Mistakes

### ❌ Wrong API URL
```javascript
// ❌ WRONG
const API_URL = 'http://localhost:3000/api';

// ✅ CORRECT
const API_URL = 'http://localhost:5000/api';
```

### ❌ Missing .env Variables
```
// ❌ WRONG (missing PEXELS_API_KEY)
MONGODB_URI=...
AMADEUS_CLIENT_ID=...

// ✅ CORRECT
MONGODB_URI=...
PEXELS_API_KEY=...
AMADEUS_CLIENT_ID=...
AMADEUS_CLIENT_SECRET=...
JWT_SECRET=...
```

### ❌ Wrong Cache TTL
```javascript
// ❌ WRONG (too short)
const PEXELS_CACHE_TTL = 1000 * 60; // 1 minute

// ✅ CORRECT
const PEXELS_CACHE_TTL = 1000 * 60 * 60 * 24 * 7; // 7 days
```

### ❌ Missing Rate Limiting
```javascript
// ❌ WRONG (commented out)
// app.use('/api', apiLimiter);

// ✅ CORRECT
app.use('/api', apiLimiter);
```

---

## Performance Baseline

### Expected Metrics
- Page Load Time: <1 second
- API Batch Request: 200-800ms
- Image Rendering: <2 seconds total
- Search Response: Instant (no API call)
- Filter Response: Instant (no API call)

### Memory Usage
- Backend: ~100-200MB
- Frontend: ~50-100MB
- Cache size: <10MB (150 images)

### API Quota Usage
- Per page load: 1-2 requests (not 600+)
- Per 1000 loads: ~1000-2000 requests
- Free tier limit: 200/hour or 500/day
- Sustainable: Yes ✅

---

## Quick Fix Summary

| Issue | Fix | Time |
|-------|-----|------|
| express-rate-limit not found | `npm install express-rate-limit` | 30s |
| Backend won't start | Check MongoDB connection | 2m |
| Batch endpoint 404 | Restart backend | 10s |
| Images not loading | Check Pexels API key | 2m |
| Search calling API | Clear cache + hard refresh | 15s |
| CORS errors | Check `VITE_API_URL` env var | 1m |
| Rate limited | Increase limit or wait 15m | N/A |

---

## Support Resources

- **Pexels API**: https://www.pexels.com/api/
- **MongoDB Atlas**: https://cloud.mongodb.com
- **Amadeus API**: https://developers.amadeus.com
- **Express Rate Limit**: https://github.com/nfriedly/express-rate-limit
- **Vite**: https://vitejs.dev

---

## 🎯 If Everything Works ✅

You should see:
- ✅ Application loads at http://localhost:5173
- ✅ 150 destination cards with images
- ✅ Search works with debounce
- ✅ Filters work instantly
- ✅ Only 1 POST request to batch endpoint
- ✅ No HTTP 429 errors
- ✅ Page loads in <1 second

---

**Status**: Ready to deploy! 🚀
