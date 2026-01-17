#!/usr/bin/env node

/**
 * Test Real-Time APIs
 * Run this in browser console or with Node.js
 */

const API_URL = 'http://localhost:5000/api/external';

// Test 1: Get Country Info (No API key needed)
async function testCountryInfo() {
  console.log('\n🌍 TEST 1: Country Info (REST Countries - No Key Needed)\n');
  try {
    const response = await fetch(`${API_URL}/country-info/France`);
    const data = await response.json();
    console.log('✅ Country Info Response:');
    console.log(JSON.stringify(data, null, 2));
    return data;
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

// Test 2: Get Location Codes (Amadeus - With Your Credentials)
async function testLocationCodes() {
  console.log('\n🌍 TEST 2: Location Codes (Amadeus - With Your Credentials)\n');
  try {
    const response = await fetch(`${API_URL}/location-codes/Paris`);
    const data = await response.json();
    console.log('✅ Location Codes Response:');
    console.log(JSON.stringify(data, null, 2));
    return data;
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

// Test 3: Get Hotels (Amadeus - With Your Credentials)
async function testHotels() {
  console.log('\n🏨 TEST 3: Hotels (Amadeus - With Your Credentials)\n');
  try {
    const response = await fetch(`${API_URL}/hotels/Paris?checkInDate=2026-02-15&checkOutDate=2026-02-20&adults=1`);
    const data = await response.json();
    console.log('✅ Hotels Response:');
    console.log(JSON.stringify(data, null, 2));
    return data;
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

// Test 4: Search Flights (Amadeus - With Your Credentials)
async function testFlights() {
  console.log('\n✈️ TEST 4: Flights (Amadeus - With Your Credentials)\n');
  try {
    const response = await fetch(`${API_URL}/flights?from=DEL&to=PAR&departureDate=2026-02-15&adults=1`);
    const data = await response.json();
    console.log('✅ Flights Response:');
    console.log(JSON.stringify(data, null, 2));
    return data;
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

// Run all tests
async function runAllTests() {
  console.log('═════════════════════════════════════════════════════');
  console.log('🧪 TESTING REAL-TIME TRAVEL APIs');
  console.log('═════════════════════════════════════════════════════');

  await testCountryInfo();
  await testLocationCodes();
  await testHotels();
  await testFlights();

  console.log('\n═════════════════════════════════════════════════════');
  console.log('✅ ALL TESTS COMPLETED');
  console.log('═════════════════════════════════════════════════════\n');
}

// Export for browser console usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    testCountryInfo,
    testLocationCodes,
    testHotels,
    testFlights,
    runAllTests
  };
}

// Run tests if executed directly
if (require.main === module) {
  runAllTests();
}
