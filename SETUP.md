# 🚀 Setup Instructions

## Prerequisites

Before running the application, make sure you have:

1. ✅ Node.js installed (v14 or higher)
2. ✅ MongoDB installed and running
3. ✅ npm or yarn package manager

## Starting MongoDB

### Windows
1. **Option 1: Using MongoDB Compass**
   - Open MongoDB Compass
   - Connect to `mongodb://localhost:27017`
   - MongoDB will start automatically

2. **Option 2: Using Command Line**
   ```powershell
   # If MongoDB is installed as a service
   net start MongoDB
   
   # Or start manually
   mongod --dbpath="C:\data\db"
   ```

3. **Option 3: Download MongoDB Community Edition**
   - Download from: https://www.mongodb.com/try/download/community
   - Install with default settings
   - MongoDB Compass will be included

### macOS
```bash
# Using Homebrew
brew services start mongodb-community

# Or start manually
mongod --config /usr/local/etc/mongod.conf
```

### Linux
```bash
# Start MongoDB service
sudo systemctl start mongod

# Check status
sudo systemctl status mongod
```

## Installation Steps

### 1. Install Backend Dependencies
```powershell
cd traveler-backend
npm install
```

### 2. Install Frontend Dependencies
```powershell
cd frontend
npm install
```

### 3. Configure Environment Variables

The `.env` file in `traveler-backend/` should contain:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/traveler-app
NODE_ENV=development
JWT_SECRET=traveler-app-super-secret-jwt-key-2024-change-this-in-production
```

## Running the Application

### Terminal 1: Start Backend Server
```powershell
cd traveler-backend
npm start
```

You should see:
```
🚀 Server is running on port 5000
📡 API URL: http://localhost:5000
💾 MongoDB: mongodb://localhost:27017/traveler-app
✅ Connected to MongoDB
```

### Terminal 2: Start Frontend Development Server
```powershell
cd frontend
npm run dev
```

You should see:
```
VITE v5.x.x ready in xxx ms
➜ Local:   http://localhost:5173/
```

## Testing the Authentication Flow

### 1. Open Browser
Navigate to: http://localhost:5173

### 2. Create Account
1. Click "Login" button in header
2. Click "click here" to go to Sign Up
3. Fill in:
   - Name: Your Name
   - Email: test@example.com
   - Password: password123
4. Click "Create Account"

You should be automatically logged in and redirected to home page.

### 3. Test Login
1. Logout (click profile dropdown → Logout)
2. Click "Login" button
3. Enter your credentials:
   - Email: test@example.com
   - Password: password123
4. Click "Login"

You should be logged in successfully!

### 4. Book a Trip
1. Navigate to "Destinations" page
2. Click on any destination (e.g., Tokyo)
3. Click "✈️ Book This Trip" button
4. Fill in travel dates
5. Click "Confirm Booking"
6. Go to profile dropdown → "My Trips"
7. You should see your booked trip!

## Troubleshooting

### MongoDB Connection Error
**Error**: `MongooseServerSelectionError: connect ECONNREFUSED`

**Solution**:
1. Check if MongoDB is running:
   ```powershell
   # Windows
   Get-Service MongoDB*
   
   # Or check if port 27017 is listening
   netstat -an | Select-String "27017"
   ```

2. Start MongoDB:
   - Open MongoDB Compass and connect
   - Or run `net start MongoDB` (Windows)
   - Or start mongod manually

3. Verify connection in Compass:
   - Connect to `mongodb://localhost:27017`
   - Check if "traveler-app" database exists

### Port Already in Use
**Error**: `Port 5000 is already in use`

**Solution**:
```powershell
# Find process using port 5000
Get-Process -Id (Get-NetTCPConnection -LocalPort 5000).OwningProcess

# Kill the process (replace PID with actual process ID)
Stop-Process -Id PID -Force

# Or change port in .env file
PORT=5001
```

### CORS Errors
**Error**: `CORS policy: No 'Access-Control-Allow-Origin' header`

**Solution**:
- Make sure backend server is running on port 5000
- Check backend terminal for errors
- Restart both frontend and backend servers

### Login Not Working
**Issue**: User stays logged out after entering credentials

**Possible causes**:
1. Backend server not running
2. MongoDB not connected
3. Incorrect email/password
4. Network error

**Check**:
1. Open browser console (F12) and check for errors
2. Check backend terminal for error messages
3. Try registering a new account
4. Clear browser localStorage: `localStorage.clear()`

### "Please login to book trips" Still Shows
**Issue**: Alert appears even after logging in

**Solution**:
1. Check browser console: `localStorage.getItem('traveler_token')`
2. Should see a JWT token string
3. If null, try logging in again
4. If still issues, check backend terminal for errors
5. Make sure you used valid credentials during registration

## Verifying Installation

### Check Backend
```powershell
# Test health endpoint
curl http://localhost:5000/api/health

# Should return:
# {"status":"OK","message":"Traveler Backend API is running","timestamp":"..."}
```

### Check Frontend
Open http://localhost:5173 in browser
- Home page should load
- Navigation should work
- Can browse destinations

### Check MongoDB
```powershell
# Using MongoDB shell
mongosh

# Then run:
use traveler-app
show collections
# Should see: users, trips, destinations
```

## Database Collections

After running the app, MongoDB will have these collections:

1. **users** - User accounts with hashed passwords
2. **trips** - Booked trips
3. **destinations** - Available destinations (if using DB)

## Default Test Account

For quick testing, you can manually create a test account:

**Email**: test@example.com  
**Password**: password123  

Or register a new account through the UI.

## Next Steps

After successful setup:
1. ✅ Register an account
2. ✅ Login with your credentials
3. ✅ Browse destinations
4. ✅ Book a trip
5. ✅ View your trips in "My Trips"
6. ✅ Add destinations to wishlist
7. ✅ Write blog posts
8. ✅ Update your profile

## API Endpoints Available

### Authentication
- POST `/api/auth/register` - Register new user
- POST `/api/auth/login` - Login user
- GET `/api/auth/profile` - Get user profile
- PUT `/api/auth/profile` - Update profile

### Trips
- GET `/api/trips/user/:userId` - Get user's trips
- POST `/api/trips` - Create new trip
- PUT `/api/trips/:id` - Update trip
- DELETE `/api/trips/:id` - Delete trip
- PATCH `/api/trips/:id/cancel` - Cancel trip

### Destinations
- GET `/api/destinations` - Get all destinations
- GET `/api/destinations/:id` - Get single destination
- POST `/api/destinations` - Create destination (admin)

## Support

If you encounter issues:
1. Check this guide's Troubleshooting section
2. Review [AUTHENTICATION.md](./AUTHENTICATION.md) for auth details
3. Check browser console for frontend errors
4. Check terminal for backend errors
5. Verify MongoDB is running

## Development Tools

Recommended tools for development:
- **MongoDB Compass** - GUI for MongoDB
- **Postman** - API testing
- **VS Code** - Code editor with extensions:
  - ESLint
  - Prettier
  - MongoDB for VS Code
  - Thunder Client (Postman alternative)
