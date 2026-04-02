// Quick test script to verify Unsplash API
// Run this in your browser console on your app

const testUnsplash = async () => {
  const API_KEY = 'FiLAlpWNG_4hkvOIbogB1QOvya86pK1Xi8__bpJ6KIM';
  const query = 'Paris France';
  
  try {
    console.log('Testing Unsplash API with query:', query);
    
    const response = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=1`,
      {
        headers: {
          'Authorization': `Client-ID ${API_KEY}`
        }
      }
    );
    
    console.log('Status:', response.status);
    
    if (!response.ok) {
      const error = await response.text();
      console.error('Error:', error);
      return;
    }
    
    const data = await response.json();
    console.log('Success! Results:', data.total);
    console.log('First image:', data.results[0]?.urls?.regular);
    
    if (data.results[0]) {
      // Test display
      const img = document.createElement('img');
      img.src = data.results[0].urls.regular;
      img.style.maxWidth = '400px';
      document.body.appendChild(img);
      console.log('✅ Image should appear on the page');
    }
    
  } catch (error) {
    console.error('Fetch error:', error);
  }
};

testUnsplash();
