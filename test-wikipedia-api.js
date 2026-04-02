// Test Wikipedia API (No API key required!)
// Run with: node test-wikipedia-api.js

const axios = require('axios');

// Test function for Wikipedia API
async function getWikiImage(city) {
  try {
    const res = await axios.get(
      `https://en.wikipedia.org/api/rest_v1/page/summary/${city}`
    );
    const data = res.data;
    return {
      thumbnail: data.thumbnail?.source,
      fullImage: data.originalimage?.source,
      description: data.extract,
      title: data.title
    };
  } catch (error) {
    console.error(`Error fetching ${city}:`, error.message);
    return null;
  }
}

// Test through your backend API
async function testBackendAPI(city) {
  try {
    const res = await axios.get(`http://localhost:5000/api/external/wikipedia/${city}`);
    console.log(`\n✅ Backend API Response for ${city}:`, JSON.stringify(res.data, null, 2));
  } catch (error) {
    console.error(`❌ Error testing backend for ${city}:`, error.message);
  }
}

// Run tests
async function runTests() {
  console.log('🧪 Testing Wikipedia REST API...\n');
  
  // Test direct API call
  console.log('1️⃣ Direct Wikipedia API Test:');
  const cities = ['Paris', 'Tokyo', 'New_York', 'London', 'Dubai'];
  
  for (const city of cities) {
    const result = await getWikiImage(city);
    if (result) {
      console.log(`\n${city}:`);
      console.log(`  Title: ${result.title}`);
      console.log(`  Thumbnail: ${result.thumbnail || 'N/A'}`);
      console.log(`  Full Image: ${result.fullImage || 'N/A'}`);
      console.log(`  Description: ${result.description?.substring(0, 100)}...`);
    }
  }
  
  // Test backend API (make sure backend is running!)
  console.log('\n\n2️⃣ Testing Backend API (ensure server is running on port 5000):');
  await testBackendAPI('Paris');
  await testBackendAPI('Bali');
  await testBackendAPI('Rome');
  
  console.log('\n✅ Tests complete!');
  console.log('\n📝 Integration tip: Use externalAPI.getWikipediaInfo(city) in your frontend');
}

runTests().catch(console.error);
