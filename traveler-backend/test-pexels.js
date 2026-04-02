const axios = require('axios');

async function testPexels() {
  try {
    console.log('🧪 Testing Pexels API...\n');
    console.log('Waiting for server...');
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const response = await axios.get('http://localhost:5000/api/external/pexels?query=Paris&per_page=1');
    
    console.log('✅ SUCCESS!');
    console.log('Image URL:', response.data.image);
    console.log('Source:', response.data.source);
    console.log('Cached:', response.data.cached);
    console.log('\n📸 Full Response:');
    console.log(JSON.stringify(response.data, null, 2));
    
  } catch (error) {
    console.log('❌ ERROR:', error.message);
    console.log('Error details:', error.code);
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Data:', JSON.stringify(error.response.data, null, 2));
    }
    if (error.code === 'ECONNREFUSED') {
      console.log('\n⚠️  Server is not running! Start it with: node server.js');
    }
  }
}

testPexels();
