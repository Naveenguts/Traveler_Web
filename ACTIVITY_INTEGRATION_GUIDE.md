# Activity System Integration Guide

## Quick Integration: Add Activities to DestinationDetails

### Step 1: Update DestinationDetails.jsx

Add this at the top with other imports:

```jsx
import ActivityCard from '../components/ActivityCard';
import activityService from '../services/activityService';
```

### Step 2: Add State for Activities

Inside the `DestinationDetails` component, add:

```jsx
const [activities, setActivities] = useState([]);
const [activitiesLoading, setActivitiesLoading] = useState(false);
const [activitiesError, setActivitiesError] = useState(null);
```

### Step 3: Fetch Activities

Add this useEffect to fetch activities when destination loads:

```jsx
useEffect(() => {
  const loadActivities = async () => {
    try {
      setActivitiesLoading(true);
      setActivitiesError(null);
      
      const response = await activityService.getActivitiesByDestination(
        destination.name,
        { 
          page: 1, 
          limit: 6,  // Show 6 activities
          sort: 'rating'
        }
      );
      
      setActivities(response.activities);
    } catch (error) {
      console.error('Error loading activities:', error);
      setActivitiesError('Unable to load activities for this destination');
      setActivities([]);
    } finally {
      setActivitiesLoading(false);
    }
  };

  // Only fetch if we have destination name
  if (destination && destination.name) {
    loadActivities();
  }
}, [destination]);
```

### Step 4: Add Styles for Activities Section

Add to `App.css` or create new section styles:

```css
/* Activities Section in Destination Details */
.destination-activities-section {
  margin: 60px 0;
  padding: 40px 20px;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  border-radius: 12px;
}

.destination-activities-section h2 {
  font-size: 28px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0 0 30px 0;
  text-align: center;
}

.destination-activities-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(290px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
}

.activities-loading {
  text-align: center;
  padding: 40px 20px;
  color: #666;
  font-size: 16px;
}

.activities-error {
  background: #fee;
  color: #c33;
  padding: 15px;
  border-radius: 6px;
  margin-bottom: 20px;
}

.activities-view-all {
  display: flex;
  justify-content: center;
  margin-top: 30px;
}

.activities-view-all a {
  background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
  color: white;
  padding: 12px 30px;
  border-radius: 6px;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s ease;
}

.activities-view-all a:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(37, 99, 235, 0.3);
}

@media (max-width: 768px) {
  .destination-activities-section {
    margin: 40px 0;
    padding: 30px 15px;
  }

  .destination-activities-section h2 {
    font-size: 22px;
    margin-bottom: 20px;
  }

  .destination-activities-grid {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 15px;
  }
}

@media (max-width: 480px) {
  .destination-activities-grid {
    grid-template-columns: 1fr;
  }
}
```

### Step 5: Render Activities Section

Add this in the JSX, typically after the reviews section:

```jsx
{/* Activities Section */}
{activities.length > 0 && (
  <section className="destination-activities-section">
    <h2>Popular Activities in {destination.name}</h2>
    
    {activitiesLoading && (
      <div className="activities-loading">
        <p>Loading activities...</p>
      </div>
    )}

    {activitiesError && (
      <div className="activities-error">
        <p>{activitiesError}</p>
      </div>
    )}

    {!activitiesLoading && activities.length > 0 && (
      <>
        <div className="destination-activities-grid">
          {activities.map(activity => (
            <ActivityCard 
              key={activity._id} 
              activity={activity} 
            />
          ))}
        </div>

        {/* View All Activities Link (Optional) */}
        {activities.length >= 6 && (
          <div className="activities-view-all">
            <a href={`/activities?destination=${destination.name}`}>
              View All Activities →
            </a>
          </div>
        )}
      </>
    )}
  </section>
)}
```

## Alternative: Create Dedicated Activities Page

### Create `Activities.jsx`

```jsx
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ActivityCard from '../components/ActivityCard';
import activityService from '../services/activityService';
import '../styles/Activities.css';

const Activities = () => {
  const [searchParams] = useSearchParams();
  const destination = searchParams.get('destination') || '';
  
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    category: '',
    minPrice: '',
    maxPrice: '',
    sort: 'rating'
  });
  const [page, setPage] = useState(1);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        setLoading(true);
        let response;

        if (destination) {
          response = await activityService.getActivitiesByDestination(
            destination,
            { ...filters, page, limit: 12 }
          );
        } else {
          response = await activityService.searchActivities(
            '',
            { ...filters }
          );
        }

        setActivities(response.activities);
        setError(null);
      } catch (err) {
        console.error('Error fetching activities:', err);
        setError('Failed to load activities');
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, [destination, filters, page]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
    setPage(1); // Reset to first page when filters change
  };

  return (
    <div className="activities-page">
      <div className="activities-header">
        <h1>
          {destination 
            ? `Activities in ${destination}` 
            : 'Explore Activities Worldwide'
          }
        </h1>
      </div>

      {/* Filters Sidebar */}
      <div className="activities-container">
        <aside className="filters-sidebar">
          <h3>Filters</h3>

          <div className="filter-group">
            <label htmlFor="category">Category</label>
            <select
              id="category"
              name="category"
              value={filters.category}
              onChange={handleFilterChange}
            >
              <option value="">All Categories</option>
              <option value="Historical Tours">Historical Tours</option>
              <option value="Architectural Tours">Architectural Tours</option>
              <option value="Adventure & Sports">Adventure & Sports</option>
              <option value="Cultural Experiences">Cultural Experiences</option>
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="minPrice">Min Price ($)</label>
            <input
              type="number"
              id="minPrice"
              name="minPrice"
              value={filters.minPrice}
              onChange={handleFilterChange}
              placeholder="0"
            />
          </div>

          <div className="filter-group">
            <label htmlFor="maxPrice">Max Price ($)</label>
            <input
              type="number"
              id="maxPrice"
              name="maxPrice"
              value={filters.maxPrice}
              onChange={handleFilterChange}
              placeholder="500"
            />
          </div>

          <div className="filter-group">
            <label htmlFor="sort">Sort By</label>
            <select
              id="sort"
              name="sort"
              value={filters.sort}
              onChange={handleFilterChange}
            >
              <option value="rating">Highest Rated</option>
              <option value="price-low-high">Price: Low to High</option>
              <option value="price-high-low">Price: High to Low</option>
            </select>
          </div>
        </aside>

        {/* Activities Grid */}
        <main className="activities-grid-container">
          {loading && (
            <div className="activities-loading">
              <p>Loading activities...</p>
            </div>
          )}

          {error && (
            <div className="activities-error">
              <p>{error}</p>
            </div>
          )}

          {!loading && activities.length === 0 && (
            <div className="no-activities">
              <p>No activities found. Try adjusting your filters.</p>
            </div>
          )}

          {!loading && activities.length > 0 && (
            <div className="activities-grid">
              {activities.map(activity => (
                <ActivityCard
                  key={activity._id}
                  activity={activity}
                />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Activities;
```

### Add Route to App.jsx

```jsx
import Activities from './pages/Activities';

// In Routes:
<Route path="/activities" element={<Activities />} />
```

## Display Activities in Home Page

### Add to Home.jsx

```jsx
import ActivityCard from '../components/ActivityCard';
import activityService from '../services/activityService';

// In component:
const [featuredActivities, setFeaturedActivities] = useState([]);

useEffect(() => {
  activityService.searchActivities('')
    .then(data => setFeaturedActivities(data.activities.slice(0, 4)))
    .catch(err => console.error('Error loading activities:', err));
}, []);

// In JSX:
{featuredActivities.length > 0 && (
  <section className="featured-activities">
    <h2>Trending Activities</h2>
    <div className="activities-grid">
      {featuredActivities.map(activity => (
        <ActivityCard key={activity._id} activity={activity} />
      ))}
    </div>
  </section>
)}
```

## API Usage Examples

### Get Activities for Destination
```javascript
const response = await activityService.getActivitiesByDestination('Paris', {
  page: 1,
  limit: 10,
  sort: 'rating'
});

// Response:
{
  success: true,
  count: 3,
  total: 3,
  activities: [...]
}
```

### Search Activities
```javascript
const results = await activityService.searchActivities('tower', {
  category: 'Historical Tours',
  minPrice: 20,
  maxPrice: 100
});
```

### Get Single Activity Details
```javascript
const data = await activityService.getActivityDetail('activityId123');
// Returns: { success: true, activity: {...} }
```

## Common Integration Patterns

### Pattern 1: Show Activities by Destination
```jsx
// In DestinationDetails page
<ActivityCard activity={activity} /> // Click leads to detail page
```

### Pattern 2: Activity Carousel (Optional)
```jsx
// If using Swiper or similar
<Swiper>
  {activities.map(activity => (
    <SwiperSlide key={activity._id}>
      <ActivityCard activity={activity} />
    </SwiperSlide>
  ))}
</Swiper>
```

### Pattern 3: Activity Listing Page
```jsx
// Dedicated page for browsing activities
<div className="activities-grid">
  {activities.map(activity => (
    <ActivityCard key={activity._id} activity={activity} />
  ))}
</div>
```

## Error Handling

```jsx
try {
  const data = await activityService.getActivitiesByDestination(destination);
  setActivities(data.activities);
} catch (error) {
  if (error.response?.status === 404) {
    setError('Destination not found');
  } else if (error.response?.status === 500) {
    setError('Server error. Please try again later.');
  } else {
    setError('Failed to load activities: ' + error.message);
  }
}
```

## Performance Tips

1. **Pagination**: Use `limit` parameter to avoid loading too many activities
2. **Filtering**: Filter on backend, not client-side
3. **Image Optimization**: Use lazy loading in image galleries
4. **Caching**: Cache activity lists to reduce API calls
5. **Debouncing**: Debounce search input to avoid excessive API calls

```javascript
// Example: Debounced search
import { debounce } from 'lodash';

const debouncedSearch = debounce(async (query) => {
  const results = await activityService.searchActivities(query);
  setActivities(results.activities);
}, 500);

const handleSearch = (query) => {
  debouncedSearch(query);
};
```

## Testing the Integration

1. **Verify API Response**: 
   ```bash
   curl http://localhost:5000/api/activities/destination/Paris
   ```

2. **Check Component Rendering**:
   - Open browser DevTools
   - Check Console for errors
   - Verify ActivityCard renders with data

3. **Test Responsiveness**:
   - Resize browser window
   - Check styles on mobile/tablet/desktop
   - Verify touch interactions work

## Next Steps

1. ✅ Add activities to DestinationDetails (choose Integration Pattern 1)
2. 🔄 Create dedicated Activities page (optional)
3. 📊 Add filtering and search
4. 💳 Connect to booking/payment system
5. ⭐ Add activity reviews and ratings
6. 🎁 Create activity wishlists
