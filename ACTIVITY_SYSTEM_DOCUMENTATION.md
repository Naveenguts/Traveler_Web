# Activity/Tour Booking System Documentation

## Overview

The Activity system provides comprehensive tour and activity booking functionality similar to professional travel platforms like GetYourGuide, Viator, and Klook. Users can browse activities, view detailed information, and make reservations.

## System Architecture

### Backend

#### Models
- **Activity** (`traveler-backend/models/Activity.js`)
  - Comprehensive schema for tour activities
  - 30+ fields covering all booking details
  - Includes pricing, descriptions, highlights, inclusions/exclusions, ratings, and booking options

#### Controllers
- **Activity Controller** (`traveler-backend/controllers/activityController.js`)
  - `getActivitiesByDestination()` - Fetch activities for a destination
  - `getActivityDetail()` - Get single activity details
  - `getActivitiesByCategory()` - Filter activities by category
  - `searchActivities()` - Search across activities
  - `createActivity()` - Create new activity (admin)
  - `updateActivity()` - Update activity details
  - `deleteActivity()` - Delete activity

#### Routes
- **Activities Routes** (`traveler-backend/routes/activities.js`)
  - `GET /api/activities/destination/:destination` - Get activities by destination
  - `GET /api/activities/category/:category` - Get activities by category
  - `GET /api/activities/search` - Search activities
  - `GET /api/activities/:id` - Get activity details
  - `POST /api/activities` - Create activity (protected)
  - `PUT /api/activities/:id` - Update activity (protected)
  - `DELETE /api/activities/:id` - Delete activity (protected)

### Frontend

#### Components
1. **ActivityCard** (`frontend/src/components/ActivityCard.jsx`)
   - Reusable card component for activity display
   - Shows image, rating, price, features
   - Discount and cancellation badges
   - Links to activity detail page

2. **ActivityDetail** (`frontend/src/pages/ActivityDetail.jsx`)
   - Full activity information display
   - Image gallery with thumbnails
   - Booking form with date/guest selection
   - Pricing display with discounts
   - All sections: highlights, inclusions, exclusions, what to bring, etc.
   - Trust badges (free cancellation, pay later, instant confirmation)

#### Services
- **Activity Service** (`frontend/src/services/activityService.js`)
  - API client for all activity endpoints
  - Error handling and logging
  - Support for filters, pagination, search

#### Styling
- **ActivityCard.css** - Card styling with hover effects, badges, responsive design
- **ActivityDetail.css** - Activity detail page with gallery, form, and information sections

## Data Structure

### Activity Document Schema

```javascript
{
  // Basic Info
  name: String (required),
  destination: String (required),
  country: String (required),
  category: String (required),
  tags: [String],
  
  // Media
  images: [String], // Array of image URLs
  
  // Pricing
  basePrice: Number (required),
  originalPrice: Number,
  
  // Duration
  duration: {
    hours: Number,
    minutes: Number
  },
  
  // Description
  shortDescription: String,
  fullDescription: String,
  
  // Highlights
  highlights: [String],
  
  // What's Included/Excluded
  includes: [String],
  excludes: [String],
  
  // Important Info
  whatToBring: [String],
  notAllowed: [String],
  knowBeforeYouGo: [String],
  
  // Provider Info
  provider: {
    name: String,
    rating: Number,
    reviewCount: Number
  },
  
  // Booking Options
  pickupIncluded: Boolean,
  freeCancel: Boolean,
  freeCancelHours: Number,
  reserveNowPayLater: Boolean,
  
  // Group Limits
  maxGroupSize: Number,
  minGroupSize: Number,
  
  // Ratings
  averageRating: Number,
  reviewCount: Number,
  
  // Status
  isAvailable: Boolean,
  
  // Timestamps
  created: Date,
  updated: Date
}
```

## Usage Guide

### 1. Backend Setup

#### Install Dependencies
Make sure all dependencies are installed in the backend:
```bash
cd traveler-backend
npm install
```

#### Configure Environment Variables
Ensure `.env` has MongoDB connection:
```
MONGODB_URI=<your-mongodb-connection-string>
PORT=5000
```

#### Seed Sample Data
Run the seeding script to populate sample activities:
```bash
node seed-activities.js
```

Output:
```
✓ Connected to MongoDB
✓ Cleared 0 existing activities
✓ Successfully seeded 5 activities
1. Eiffel Tower Skip-the-Line Tour (Paris, France) - $35
2. Sagrada Familia Fast-Track Entrance (Barcelona, Spain) - $28
... (etc)
✓ Seeding complete!
```

#### Start Backend Server
```bash
npm start
# Server running on http://localhost:5000
```

### 2. Frontend Integration

#### Import ActivityCard Component
```jsx
import ActivityCard from '../components/ActivityCard';
import activityService from '../services/activityService';

// In DestinationDetails.jsx
const [activities, setActivities] = useState([]);

useEffect(() => {
  const fetchActivities = async () => {
    try {
      const data = await activityService.getActivitiesByDestination(
        destination,
        { category: selectedCategory, page: 1, limit: 10 }
      );
      setActivities(data.activities);
    } catch (error) {
      console.error('Error fetching activities:', error);
    }
  };
  
  fetchActivities();
}, [destination]);

// Render activities
<div className="activities-grid">
  {activities.map(activity => (
    <ActivityCard key={activity._id} activity={activity} />
  ))}
</div>
```

#### ActivityDetail Page
- Automatically accessible at `/activities/:id`
- Shows full activity information
- Includes booking form
- Gallery with navigation
- All descriptive sections

### 3. API Usage Examples

#### Get Activities by Destination
```bash
curl -X GET "http://localhost:5000/api/activities/destination/Paris?page=1&limit=10"
```

Response:
```json
{
  "success": true,
  "count": 3,
  "total": 3,
  "page": 1,
  "pages": 1,
  "activities": [
    {
      "_id": "...",
      "name": "Eiffel Tower Skip-the-Line Tour",
      "destination": "Paris",
      "basePrice": 35,
      "averageRating": 4.8,
      ...
    }
  ]
}
```

#### Get Activity Detail
```bash
curl -X GET "http://localhost:5000/api/activities/{activityId}"
```

#### Search Activities
```bash
curl -X GET "http://localhost:5000/api/activities/search?query=tower&category=Historical%20Tours"
```

#### Create Activity (Admin)
```bash
curl -X POST "http://localhost:5000/api/activities" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "New Activity",
    "destination": "London",
    "country": "UK",
    "basePrice": 50,
    "category": "Historical Tours",
    "images": ["url1", "url2"]
  }'
```

## Integration with DestinationDetails

To show activities in the destination details page:

```jsx
// In DestinationDetails.jsx

import ActivityCard from '../components/ActivityCard';
import activityService from '../services/activityService';

// Add state for activities
const [activities, setActivities] = useState([]);
const [activitiesLoading, setActivitiesLoading] = useState(false);

// Fetch activities when destination loads
useEffect(() => {
  const loadActivities = async () => {
    try {
      setActivitiesLoading(true);
      const response = await activityService.getActivitiesByDestination(
        destination.name,
        { page: 1, limit: 8 }
      );
      setActivities(response.activities);
    } catch (error) {
      console.error('Error loading activities:', error);
      setActivities([]);
    } finally {
      setActivitiesLoading(false);
    }
  };
  
  if (destination) {
    loadActivities();
  }
}, [destination]);

// Render section
{activities.length > 0 && (
  <section className="activities-section">
    <h2>Popular Activities in {destination.name}</h2>
    <div className="activities-grid">
      {activities.map(activity => (
        <ActivityCard key={activity._id} activity={activity} />
      ))}
    </div>
  </section>
)}
```

## CSS Grid Layout for Activities

```css
.activities-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(290px, 1fr));
  gap: 20px;
  margin: 20px 0;
}

@media (max-width: 768px) {
  .activities-grid {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 15px;
  }
}

@media (max-width: 480px) {
  .activities-grid {
    grid-template-columns: 1fr;
  }
}
```

## Sample Data

The `seed-activities.js` script includes 5 sample activities:

1. **Eiffel Tower Skip-the-Line Tour** (Paris, France)
   - Price: $35 | Original: $45
   - Rating: 4.8 ⭐ (2543 reviews)
   - Duration: 2h 30m

2. **Sagrada Familia Fast-Track Entrance** (Barcelona, Spain)
   - Price: $28 | Original: $38
   - Rating: 4.7 ⭐ (3891 reviews)
   - Duration: 3h

3. **Colosseum & Roman Forum Guided Tour** (Rome, Italy)
   - Price: $42 | Original: $55
   - Rating: 4.9 ⭐ (5234 reviews)
   - Duration: 3h 30m

4. **Mount Fuji Sunrise Hike** (Tokyo, Japan)
   - Price: $85 | Original: $110
   - Rating: 4.8 ⭐ (1234 reviews)
   - Duration: 8h

5. **Taj Mahal Sunrise Private Tour** (Agra, India)
   - Price: $65 | Original: $85
   - Rating: 4.9 ⭐ (3456 reviews)
   - Duration: 5h

## Features Included

### User-Facing Features
✅ Browse activities by destination
✅ Search and filter activities
✅ View detailed activity information
✅ Image gallery with navigation
✅ Price display with original price
✅ Guest selection
✅ Date picker
✅ Discount calculation
✅ Free cancellation information
✅ "Reserve now, pay later" option
✅ Trust badges and provider info

### Admin Features
✅ Create new activities
✅ Update activity details
✅ Delete activities
✅ Manage pricing and discounts
✅ Upload images
✅ Set booking options

## Error Handling

The activity service includes comprehensive error handling:

```javascript
try {
  const data = await activityService.getActivityDetail(id);
  setActivity(data.activity);
} catch (error) {
  if (error.response?.status === 404) {
    setError('Activity not found');
  } else if (error.response?.status === 500) {
    setError('Server error. Please try again later.');
  } else {
    setError('Failed to load activity details');
  }
}
```

## Future Enhancements

- [ ] Add review/rating system for activities
- [ ] Implement booking confirmation and payment
- [ ] Add calendar with availability
- [ ] Integrate with Viator/GetYourGuide APIs
- [ ] Add activity recommendations based on destination
- [ ] Implement activity comparison tool
- [ ] Add activity categories and tags
- [ ] Create admin dashboard for activity management
- [ ] Add activity reviews and ratings display
- [ ] Implement wishlist for activities

## Testing

### Manual Testing Checklist
- [ ] Fetch activities by destination works
- [ ] Activity detail page loads correctly
- [ ] Image gallery navigation works
- [ ] Guest selector operates properly
- [ ] Date picker functions correctly
- [ ] Price calculations are accurate
- [ ] Responsive design on mobile
- [ ] Error messages display properly

## Troubleshooting

### Issue: "Activity not found" error
**Solution:** Check MongoDB connection and verify activity ID in URL

### Issue: Images not loading
**Solution:** Verify image URLs are valid public URLs

### Issue: Seeding fails
**Solution:** Ensure MongoDB is running and connection string is correct

### Issue: API returns 500 error
**Solution:** Check server logs with `npm start` and verify MongoDB connection

## Files Created/Modified

### New Files
- `traveler-backend/controllers/activityController.js`
- `traveler-backend/routes/activities.js`
- `traveler-backend/seed-activities.js`
- `traveler-backend/models/Activity.js` (model file)
- `frontend/src/pages/ActivityDetail.jsx`
- `frontend/src/components/ActivityCard.jsx`
- `frontend/src/services/activityService.js`
- `frontend/src/styles/ActivityDetail.css`
- `frontend/src/styles/ActivityCard.css`

### Modified Files
- `frontend/src/App.jsx` (added ActivityDetail route)
- `traveler-backend/server.js` (added activities route)

## API Integration Points

The Activity system integrates with:
1. **Destination Details** - Shows related activities for a destination
2. **Search** - Find activities by keyword
3. **Profile/Wishlist** - Save favorite activities (future)
4. **Booking System** - Reserve activities (future)
5. **Payment System** - Process activity payments (future)

## Performance Considerations

- Activities are paginated (default 10 per page)
- Database queries use filters and sorting
- Images lazy-loaded in galleries
- Responsive images for different screen sizes
- Cached API responses recommended for frontend
