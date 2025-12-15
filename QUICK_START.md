# 🚀 Quick Start Guide

## Start Backend & Frontend Together

### 1️⃣ Start Backend (Terminal 1)

```bash
cd traveler-backend
npm run dev
```

**Expected output:**
```
🚀 Server is running on port 5000
📡 API URL: http://localhost:5000
💾 MongoDB: mongodb://localhost:27017/traveler-app
✅ Connected to MongoDB
```

### 2️⃣ Start Frontend (Terminal 2)

```bash
cd frontend
npm run dev
```

**Expected output:**
```
VITE ready in 500 ms
➜  Local:   http://localhost:5173/
```

---

## 🎯 Test the Trip Feature

1. **Open browser:** http://localhost:5173
2. **Login** (or use the app without login - trips will be stored by user ID)
3. **Go to Destinations** page
4. **Click on any destination**
5. **Click "✈️ Book This Trip"** button
6. **Fill in dates** and submit
7. **Navigate to "My Trips"** (from profile dropdown)
8. **See your trip!** ✈️

---

## 🔧 Prerequisites

### Install MongoDB (If not installed)

**Windows:**
1. Download: https://www.mongodb.com/try/download/community
2. Install with default settings
3. MongoDB runs as a service automatically

**Or use MongoDB Atlas (Cloud - Free):**
1. Sign up: https://www.mongodb.com/cloud/atlas
2. Create free cluster
3. Get connection string
4. Update `traveler-backend/.env`:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/traveler-app
   ```

---

## 📱 Features Working

✅ **Book trips** from destination pages  
✅ **View all trips** in My Trips page  
✅ **Filter trips** by status (upcoming/completed/cancelled)  
✅ **Cancel trips** with confirmation  
✅ **Backend API** with MongoDB storage  
✅ **Offline fallback** with localStorage  
✅ **Auto-sync** when coming back online  

---

## 🐛 Troubleshooting

### Backend won't start
- Ensure MongoDB is running
- Check if port 5000 is available
- Try: `npm install` in traveler-backend folder

### Frontend can't connect to backend
- Ensure backend is running on port 5000
- Check console for CORS errors
- Verify API_URL in AuthContext: `http://localhost:5000/api`

### "Network Error" when booking trip
- Backend might not be running
- Check MongoDB connection
- App will fallback to localStorage (offline mode)

---

## 📂 Project Structure

```
traveler-project/
├── frontend/                 # React + Vite
│   ├── src/
│   │   ├── context/
│   │   │   └── AuthContext.jsx    # ← Handles API calls
│   │   ├── pages/
│   │   │   ├── MyTrips.jsx        # ← Trips list page
│   │   │   └── DestinationDetails.jsx  # ← Booking modal
│   │   └── ...
│   └── package.json
│
└── traveler-backend/         # Express + MongoDB
    ├── models/
    │   └── Trip.js           # ← Trip schema
    ├── controllers/
    │   └── tripController.js # ← Trip logic
    ├── routes/
    │   └── trips.js          # ← API routes
    ├── server.js             # ← Main server
    └── .env                  # ← Config
```

---

## 🎉 You're All Set!

The trip management system is now fully integrated with:
- ✅ Backend API with MongoDB
- ✅ Frontend with React
- ✅ Real-time data sync
- ✅ Offline support

Happy coding! 🚀
