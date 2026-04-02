// Test script to check the review API
const API_URL = 'http://localhost:5000/api';

// Mock review data
const testReview = {
  destinationId: '6789abcdef0000000000000a', // Example MongoDB ID
  destinationName: 'Paris',
  rating: 5,
  comment: 'Nice place to visit'
};

const mockToken = 'your-jwt-token-here';

(async () => {
  try {
    console.log('Testing Review API...');
    console.log('API URL:', API_URL);
    console.log('Test data:', testReview);
    console.log('');

    // Step 1: Check if server is running
    console.log('Step 1: Checking if server is running...');
    const healthCheck = await fetch(`${API_URL.replace('/api', '')}/api/health`);
    const healthData = await healthCheck.json();
    console.log('Health check response:', healthData);
    console.log('✓ Server is running\n');

    // Step 2: Try to get all destinations
    console.log('Step 2: Fetching all destinations...');
    const destResponse = await fetch(`${API_URL}/destinations`);
    const destData = await destResponse.json();
    console.log('Destinations response status:', destResponse.status);
    console.log('Found', destData.destinations?.length || 0, 'destinations');
    if (destData.destinations?.length > 0) {
      console.log('First destination:', destData.destinations[0]);
    }
    console.log('');

    // Step 3: Check review endpoint without token
    console.log('Step 3: Trying to create review without token (should fail)...');
    const noTokenResponse = await fetch(`${API_URL}/reviews`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(testReview)
    });
    const noTokenData = await noTokenResponse.json();
    console.log('Response status:', noTokenResponse.status);
    console.log('Response:', noTokenData);
    console.log('');

    // Step 4: Check if destinations need to be seeded
    if (destData.destinations?.length === 0) {
      console.log('Step 4: Seeding destinations...');
      const seedResponse = await fetch(`${API_URL}/destinations/seed`, {
        method: 'POST'
      });
      const seedData = await seedResponse.json();
      console.log('Seed response status:', seedResponse.status);
      console.log('Seed response:', seedData);
    }

  } catch (error) {
    console.error('Test error:', error.message);
  }
})();
