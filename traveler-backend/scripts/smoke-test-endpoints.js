const axios = require('axios');

const BASE_URL = process.env.BASE_URL || 'http://localhost:5000';

const endpoints = [
  { method: 'GET', path: '/', expected: [200] },
  { method: 'GET', path: '/api/health', expected: [200] },

  { method: 'POST', path: '/api/auth/register', data: { name: 'Smoke', email: 'smoke@example.com', password: '123' }, expected: [201, 400, 409, 422] },
  { method: 'POST', path: '/api/auth/login', data: { email: 'none@example.com', password: 'bad' }, expected: [400, 401] },
  { method: 'GET', path: '/api/auth/profile', expected: [401] },
  { method: 'PUT', path: '/api/auth/profile', data: { name: 'X' }, expected: [401] },
  { method: 'GET', path: '/api/auth/verify-token', expected: [401] },

  { method: 'GET', path: '/api/destinations', expected: [200] },
  { method: 'GET', path: '/api/destinations/000000000000000000000000', expected: [400, 404] },
  { method: 'POST', path: '/api/destinations/seed', expected: [200, 201, 400, 409, 500] },

  { method: 'GET', path: '/api/trips/user/000000000000000000000000', expected: [200, 400, 404, 500] },
  { method: 'GET', path: '/api/trips/user/000000000000000000000000/stats', expected: [200, 400, 404, 500] },
  { method: 'GET', path: '/api/trips/000000000000000000000000', expected: [400, 404] },
  { method: 'POST', path: '/api/trips', data: { title: 'x' }, expected: [400, 401, 500] },
  { method: 'PUT', path: '/api/trips/000000000000000000000000', data: { title: 'x' }, expected: [400, 404, 500] },
  { method: 'PATCH', path: '/api/trips/000000000000000000000000/cancel', expected: [400, 404, 500] },
  { method: 'DELETE', path: '/api/trips/000000000000000000000000', expected: [400, 404, 500] },

  { method: 'POST', path: '/api/payments/intent', data: { amount: 1000, currency: 'usd' }, expected: [200, 400, 401, 500] },
  { method: 'POST', path: '/api/payments/setup-intent', expected: [400, 401, 500] },
  { method: 'POST', path: '/api/payments/add', data: { paymentMethodId: 'pm_test' }, expected: [400, 401, 500] },
  { method: 'GET', path: '/api/payments', expected: [400, 401, 500] },
  { method: 'PUT', path: '/api/payments/default/000000000000000000000000', expected: [400, 401, 404, 500] },
  { method: 'DELETE', path: '/api/payments/000000000000000000000000', expected: [400, 401, 404, 500] },

  { method: 'GET', path: '/api/external/wikipedia/image/paris', expected: [200, 400, 404, 429, 500] },
  { method: 'GET', path: '/api/external/pexels?query=paris', expected: [200, 400, 429, 500] },
  { method: 'POST', path: '/api/external/pexels/batch', data: { queries: ['paris', 'rome'] }, expected: [200, 400, 429, 500] },
  { method: 'GET', path: '/api/external/restaurants/paris', expected: [200, 400, 429, 500] },
  { method: 'GET', path: '/api/external/places/paris', expected: [200, 400, 429, 500] },
  { method: 'GET', path: '/api/external/hotels/paris', expected: [200, 400, 429, 500] },
  { method: 'GET', path: '/api/external/flights?origin=LON&destination=PAR&date=2026-12-25', expected: [200, 400, 429, 500] },
  { method: 'GET', path: '/api/external/location-codes/paris', expected: [200, 400, 429, 500] },
  { method: 'GET', path: '/api/external/country-info/france', expected: [200, 400, 404, 429, 500] },
  { method: 'GET', path: '/api/external/weather/paris', expected: [200, 400, 404, 429, 500] },

  { method: 'POST', path: '/api/security/change-password', expected: [401] },
  { method: 'GET', path: '/api/security/2fa/status', expected: [401] },
  { method: 'POST', path: '/api/security/2fa/setup', expected: [401] },
  { method: 'POST', path: '/api/security/2fa/verify', expected: [401] },
  { method: 'POST', path: '/api/security/2fa/disable', expected: [401] },
  { method: 'GET', path: '/api/security/devices', expected: [401] },
  { method: 'DELETE', path: '/api/security/devices/abc123', expected: [401] },
  { method: 'PUT', path: '/api/security/login-alerts', data: { enabled: true }, expected: [401] },
  { method: 'GET', path: '/api/security/settings', expected: [401] },

  { method: 'GET', path: '/api/blogs', expected: [200, 500] },
  { method: 'GET', path: '/api/blogs/000000000000000000000000', expected: [400, 404] },
  { method: 'POST', path: '/api/blogs', data: { title: 'Test', content: 'x' }, expected: [400, 401, 500] },
  { method: 'GET', path: '/api/blogs/my/all', expected: [401] },
  { method: 'PUT', path: '/api/blogs/000000000000000000000000', data: { title: 'x' }, expected: [400, 401, 404, 500] },
  { method: 'DELETE', path: '/api/blogs/000000000000000000000000', expected: [400, 401, 404, 500] },
  { method: 'POST', path: '/api/blogs/000000000000000000000000/like', expected: [400, 401, 404, 500] },
  { method: 'POST', path: '/api/blogs/000000000000000000000000/comment', data: { text: 'Nice' }, expected: [400, 401, 404, 500] },

  { method: 'POST', path: '/api/reviews', data: { rating: 5 }, expected: [400, 401, 500] },
  { method: 'GET', path: '/api/reviews/destination/000000000000000000000000', expected: [200, 400, 404, 500] },
  { method: 'PUT', path: '/api/reviews/000000000000000000000000', data: { rating: 4 }, expected: [400, 401, 404, 500] },
  { method: 'DELETE', path: '/api/reviews/000000000000000000000000', expected: [400, 401, 404, 500] },
  { method: 'POST', path: '/api/reviews/000000000000000000000000/helpful', expected: [400, 401, 404, 500] },
  { method: 'GET', path: '/api/reviews/my-reviews', expected: [401] },

  { method: 'GET', path: '/api/activities/destination/paris', expected: [200, 400, 404, 500] },
  { method: 'GET', path: '/api/activities/category/adventure', expected: [200, 400, 404, 500] },
  { method: 'GET', path: '/api/activities/search?q=hiking', expected: [200, 400, 404, 500] },
  { method: 'GET', path: '/api/activities/000000000000000000000000', expected: [400, 404, 500] },
  { method: 'POST', path: '/api/activities', data: { name: 'x' }, expected: [200, 201, 400, 500] },
  { method: 'PUT', path: '/api/activities/000000000000000000000000', data: { name: 'x' }, expected: [400, 404, 500] },
  { method: 'DELETE', path: '/api/activities/000000000000000000000000', expected: [400, 404, 500] }
];

async function callEndpoint(item) {
  try {
    const res = await axios({
      method: item.method,
      url: `${BASE_URL}${item.path}`,
      data: item.data,
      timeout: 25000,
      validateStatus: () => true
    });
    return { ...item, status: res.status, pass: item.expected.includes(res.status) };
  } catch (error) {
    return { ...item, status: -1, pass: false, error: error.message };
  }
}

async function main() {
  const results = [];
  for (const endpoint of endpoints) {
    // Sequential requests avoid accidental burst rate-limit interference.
    const result = await callEndpoint(endpoint);
    results.push(result);
  }

  const failed = results.filter((r) => !r.pass);
  console.log(`TOTAL: ${results.length}`);
  console.log(`PASSED: ${results.length - failed.length}`);
  console.log(`FAILED: ${failed.length}`);

  if (failed.length > 0) {
    console.log('--- FAILED ENDPOINTS ---');
    for (const f of failed) {
      const errorText = f.error ? ` | ERROR: ${f.error}` : '';
      console.log(`${f.method.padEnd(6)} ${f.path.padEnd(55)} status=${String(f.status).padEnd(3)} expected=[${f.expected.join(',')}]${errorText}`);
    }
    process.exitCode = 1;
  }
}

main();
