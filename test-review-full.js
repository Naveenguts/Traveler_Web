// Test to visualize what data is being sent
const API_URL = 'http://localhost:5000/api';

(async () => {
  try {
    // Get destination data (same as browser does)
    console.log('1. Fetching destinations...\n');
    const destResponse = await fetch(`${API_URL}/destinations`);
    const destData = await destResponse.json();
    
    const parisDestination = destData.destinations.find(d => d.name === 'Paris');
    console.log('Found Paris destination:', parisDestination ? parisDestination._id : 'NOT FOUND');
    console.log('Destination details:', {
      id: parisDestination?._id,
      name: parisDestination?.name,
      country: parisDestination?.country
    });
    console.log('');

    if (!parisDestination) {
      console.log('ERROR: Paris destination not found!');
      process.exit(1);
    }

    // Simulate a login first to get a valid token
    console.log('2. Signing up a test user...\n');
    const signupResponse = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Test User',
        email: 'test-' + Date.now() + '@example.com',
        password: 'Test@1234'
      })
    });
    
    const signupData = await signupResponse.json();
    if (!signupData.success || !signupData.token) {
      console.log('Signup failed:', signupData);
      console.log('Trying to login with existing user instead...\n');
      
      // Try login with test credentials
      const loginResponse = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'test@example.com',
          password: 'test@123'
        })
      });
      
      const loginData = await loginResponse.json();
      if (!loginData.success || !loginData.token) {
        console.log('Login failed:', loginData);
        process.exit(1);
      }
      signupData.token = loginData.token;
      signupData.user = loginData.user;
    }

    const token = signupData.token;
    const userId = signupData.user?.id;

    console.log('Got token for user:', userId);
    console.log('Token length:', token.length);
    console.log('');

    // Now try to create a review
    console.log('3. Creating a review...\n');
    const reviewData = {
      destinationId: parisDestination._id,
      destinationName: parisDestination.name,
      rating: 5,
      comment: 'This is a test review with more than 10 characters'
    };

    console.log('Review data being sent:', JSON.stringify(reviewData, null, 2));
    console.log('Token:', token.substring(0, 50) + '...');
    console.log('');

    const reviewResponse = await fetch(`${API_URL}/reviews`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(reviewData)
    });

    console.log('Review response status:', reviewResponse.status);
    const reviewResult = await reviewResponse.json();
    console.log('Review response:', JSON.stringify(reviewResult, null, 2));

  } catch (error) {
    console.error('Error:', error.message);
  }
})();
