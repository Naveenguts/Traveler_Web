# Traveler Backend API

Backend API for the Traveler application with MongoDB database.

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)

### Installation

1. **Install dependencies:**
   ```bash
   cd traveler-backend
   npm install
   ```

2. **Configure environment variables:**
   - Edit `.env` file if needed
   - Default MongoDB URI: `mongodb://localhost:27017/traveler-app`

3. **Start MongoDB** (if using local):
   ```bash
   # Windows (if MongoDB is installed as service, it's already running)
   # Or start manually:
   mongod
   ```

4. **Start the server:**
   ```bash
   # Development mode (auto-reload)
   npm run dev

   # Production mode
   npm start
   ```

Server will run on: **http://localhost:5000**

---

## 📡 API Endpoints

### Health Check
```
GET /api/health
```
Check if API is running.

---

### Trip Endpoints

#### Get All Trips for User
```
GET /api/trips/user/:userId?status=upcoming
```
Query params:
- `status` (optional): filter by status (upcoming/completed/cancelled/all)

**Response:**
```json
{
  "success": true,
  "trips": [
    {
      "_id": "abc123",
      "userId": "user123",
      "destinationName": "Paris",
      "country": "🇫🇷 France",
      "startDate": "2026-01-15",
      "endDate": "2026-01-22",
      "status": "upcoming",
      "description": "Romantic getaway",
      "coverImage": "https://...",
      "price": 2500,
      "duration": 7,
      "createdAt": "2025-12-15T10:30:00.000Z",
      "updatedAt": "2025-12-15T10:30:00.000Z"
    }
  ]
}
```

#### Get Trip by ID
```
GET /api/trips/:id
```

#### Create Trip
```
POST /api/trips
Content-Type: application/json

{
  "userId": "user123",
  "destinationName": "Paris",
  "country": "🇫🇷 France",
  "startDate": "2026-01-15",
  "endDate": "2026-01-22",
  "description": "Romantic getaway",
  "coverImage": "https://...",
  "price": 2500,
  "duration": 7,
  "status": "upcoming"
}
```

**Required fields:** `userId`, `destinationName`, `country`, `startDate`, `endDate`

#### Update Trip
```
PUT /api/trips/:id
Content-Type: application/json

{
  "description": "Updated description",
  "status": "completed"
}
```

#### Cancel Trip
```
PATCH /api/trips/:id/cancel
```
Sets trip status to "cancelled".

#### Delete Trip
```
DELETE /api/trips/:id
```

#### Get Trip Statistics
```
GET /api/trips/user/:userId/stats
```

**Response:**
```json
{
  "success": true,
  "stats": {
    "total": 5,
    "upcoming": 2,
    "completed": 2,
    "cancelled": 1
  }
}
```

---

## 🗄️ Database Schema

### Trip Model
```javascript
{
  userId: String (required, indexed),
  destinationName: String (required),
  country: String (required),
  startDate: Date (required),
  endDate: Date (required),
  status: String (enum: ['upcoming', 'completed', 'cancelled'], default: 'upcoming'),
  description: String,
  coverImage: String,
  price: Number,
  duration: Number,
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

---

## 🧪 Testing the API

### Using cURL:

**Create a trip:**
```bash
curl -X POST http://localhost:5000/api/trips \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user123",
    "destinationName": "Tokyo",
    "country": "🇯🇵 Japan",
    "startDate": "2026-03-10",
    "endDate": "2026-03-18",
    "description": "Cultural exploration",
    "coverImage": "https://example.com/tokyo.jpg",
    "price": 3200,
    "duration": 8
  }'
```

**Get all trips:**
```bash
curl http://localhost:5000/api/trips/user/user123
```

**Cancel a trip:**
```bash
curl -X PATCH http://localhost:5000/api/trips/TRIP_ID/cancel
```

### Using Thunder Client / Postman:
Import the collection or manually test each endpoint.

---

## 🔧 Configuration

### Environment Variables (.env)
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/traveler-app
NODE_ENV=development
```

### MongoDB Atlas (Cloud Database)
To use MongoDB Atlas instead of local:

1. Create account at [mongodb.com/cloud/atlas](https://mongodb.com/cloud/atlas)
2. Create a cluster
3. Get connection string
4. Update `.env`:
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/traveler-app
   ```

---

## 📦 Dependencies

- **express** - Web framework
- **mongoose** - MongoDB ODM
- **cors** - CORS middleware
- **dotenv** - Environment variables
- **bcryptjs** - Password hashing (for future auth)
- **jsonwebtoken** - JWT tokens (for future auth)

---

## 🔒 Future Enhancements

- [ ] User authentication with JWT
- [ ] Trip sharing functionality
- [ ] File upload for trip photos
- [ ] Itinerary management
- [ ] Budget tracking
- [ ] Review system integration
- [ ] Email notifications
- [ ] Payment integration

---

## 🐛 Troubleshooting

### MongoDB Connection Issues
```
❌ MongoDB connection error
```
**Solution:**
- Ensure MongoDB is running (`mongod` or service)
- Check MONGODB_URI in .env
- Verify port 27017 is available

### Port Already in Use
```
Error: listen EADDRINUSE: address already in use :::5000
```
**Solution:**
- Change PORT in .env to another port (e.g., 5001)
- Or kill the process using port 5000

### CORS Issues
If frontend can't connect:
- Check CORS is enabled in server.js
- Verify API_URL in frontend matches backend URL

---

## 📝 Notes

- Trip IDs are MongoDB ObjectIds (e.g., `_id: "507f1f77bcf86cd799439011"`)
- All dates are stored as ISO 8601 strings
- Frontend includes localStorage fallback for offline support
- API includes error handling for all operations

---

## 👨‍💻 Development

**Watch mode with auto-reload:**
```bash
npm run dev
```

**Check API status:**
```bash
curl http://localhost:5000/api/health
```

**View logs:**
Server logs appear in terminal with clear emojis for easy reading.

---

That's it! Your backend is ready to handle trip management. 🎉
