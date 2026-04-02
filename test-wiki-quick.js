const axios = require('axios');

async function testWikipedia() {
  try {
    console.log('Testing Wikipedia API...\n');
    
    const response = await axios.get('http://localhost:5000/api/external/wikipedia/Paris');
    
    console.log('✅ SUCCESS!');
    console.log('Title:', response.data.data.title);
    console.log('Description:', response.data.data.description);
    console.log('Image:', response.data.data.image);
    console.log('Thumbnail:', response.data.data.thumbnail);
    console.log('\nFull Response:', JSON.stringify(response.data, null, 2));
    
  } catch (error) {
    console.log('❌ ERROR:', error.message);
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Data:', error.response.data);
    }
  }
}

testWikipedia();
