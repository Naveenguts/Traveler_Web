# Real-Time Review & Rating System

## Overview
The review and rating system is now fully integrated with the backend API, allowing real-time creation, retrieval, and display of user reviews for destinations.

## Features
✅ **Real-time reviews** - Reviews are stored in MongoDB and fetched dynamically
✅ **User authentication** - Only logged-in users can submit reviews
✅ **Rating system** - 5-star rating with visual stars
✅ **Validation** - Prevents duplicate reviews per user per destination
✅ **Loading states** - Shows loading indicators while fetching data
✅ **Error handling** - Gracefully handles API failures
✅ **Helpful votes** - Users can mark reviews as helpful (ready for future implementation)

## Setup Instructions

### 1. Seed Destinations (First Time Only)
Before adding reviews, you need to seed the destination data into MongoDB:

```bash
# From the traveler-backend directory
cd traveler-backend
npm start

# Then make a POST request to seed destinations
# Using curl:
curl -X POST http://localhost:5000/api/destinations/seed

# Or use Postman/Thunder Client to POST to:
# http://localhost:5000/api/destinations/seed
```

This will populate the database with 6 destinations (Paris, Tokyo, New York, London, Dubai, Barcelona).

### 2. Start the Backend Server
```bash
cd traveler-backend
npm start
```

The server will run on `http://localhost:5000`

### 3. Start the Frontend
```bash
cd frontend
npm run dev
```

The frontend will run on `http://localhost:5173` (or your configured port)

## API Endpoints

### Reviews
- **POST** `/api/reviews` - Create a new review (requires authentication)
- **GET** `/api/reviews/destination/:destinationId` - Get reviews for a destination
- **PUT** `/api/reviews/:reviewId` - Update a review (requires authentication)
- **DELETE** `/api/reviews/:reviewId` - Delete a review (requires authentication)
- **POST** `/api/reviews/:reviewId/helpful` - Mark review as helpful (requires authentication)
- **GET** `/api/reviews/my-reviews` - Get current user's reviews (requires authentication)

### Destinations
- **GET** `/api/destinations` - Get all destinations
- **GET** `/api/destinations/:id` - Get single destination
- **POST** `/api/destinations/seed` - Seed initial destinations

## How It Works

### Frontend (React)
1. **DestinationDetails.jsx** fetches reviews when the component mounts
2. Uses `reviewAPI.getDestinationReviews()` to fetch from backend
3. Displays loading state while fetching
4. Shows error message if fetch fails
5. Renders reviews with star ratings and user info

### Backend (Node.js + Express + MongoDB)
1. **Review Model** stores review data in MongoDB
2. **reviewController** handles all review operations
3. Reviews are linked to destinations and users
4. Automatic rating calculation for destinations
5. Prevents duplicate reviews per user

### Review Submission Flow
1. User clicks "Write a Review"
2. Fills rating (1-5 stars) and comment (min 10 characters)
3. Frontend validates input
4. POST request sent to `/api/reviews` with JWT token
5. Backend validates token and data
6. Review saved to MongoDB
7. Frontend updates UI with new review
8. Success message displayed

## Testing the System

### 1. Create a User Account
- Navigate to the signup page
- Create a new account
- Login with credentials

### 2. View a Destination
- Go to Destinations page
- Click on any destination (e.g., Paris)

### 3. Submit a Review
- Click "Write a Review" button
- Select a star rating (1-5 stars)
- Write a comment (minimum 10 characters)
- Click "Submit Review"
- Review will appear at the top of the reviews list

### 4. View Reviews
- Reviews are automatically loaded when you open a destination
- Shows loading indicator while fetching
- Displays all reviews with ratings, user names, and dates
- Shows helpful count if available

## Database Schema

### Review Model
```javascript
{
  destination: ObjectId (ref: 'Destination'),
  destinationName: String,
  user: ObjectId (ref: 'User'),
  userName: String,
  userEmail: String,
  rating: Number (1-5),
  comment: String,
  helpful: Number (default: 0),
  verified: Boolean (default: false),
  helpfulBy: [ObjectId] (refs: 'User'),
  timestamps: true (createdAt, updatedAt)
}
```

### Destination Model
```javascript
{
  name: String,
  country: String,
  description: String,
  longDescription: String,
  image: String,
  price: Number,
  duration: Number,
  averageRating: Number (0-5),
  totalReviews: Number,
  timestamps: true
}
```

## Future Enhancements
- ✨ Edit and delete own reviews
- ✨ Mark reviews as helpful/unhelpful
- ✨ Sort reviews by rating, date, helpfulness
- ✨ Filter reviews by rating
- ✨ Verified purchase badges
- ✨ Review images/photos
- ✨ Admin moderation
- ✨ Reply to reviews
- ✨ Report inappropriate reviews

## Troubleshooting

### Reviews not loading
- Check if backend server is running on port 5000
- Verify MongoDB connection is successful
- Check browser console for errors
- Ensure destinations are seeded (see Step 1)

### Cannot submit review
- Ensure you're logged in
- Check that you haven't already reviewed this destination
- Verify JWT token is valid
- Check backend logs for errors

### "Destination not found" error
- Run the seed command: `POST http://localhost:5000/api/destinations/seed`
- Verify MongoDB has the destinations collection

## Environment Variables
Make sure you have these in your `.env` file:

```env
# Backend (.env in traveler-backend/)
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=5000

# Frontend (.env in frontend/)
VITE_API_URL=http://localhost:5000/api
```

## Success Criteria
✅ Users can view reviews without logging in
✅ Logged-in users can submit reviews
✅ Reviews are saved to database
✅ Average ratings are calculated automatically
✅ Loading and error states work correctly
✅ UI updates immediately after submission
✅ System prevents duplicate reviews

---

**Note**: This is a real-time system. All reviews are immediately visible to all users once submitted. Make sure to moderate content if deploying to production!
