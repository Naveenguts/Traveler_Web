#!/usr/bin/env node
/**
 * Activity Seeding Script
 * Run this with: node seed-activities.js
 * 
 * This script populates the database with sample activities
 * for destinations in the traveler application.
 */

require('dotenv').config();
const mongoose = require('mongoose');
const Activity = require('./models/Activity');

// Sample activities data
const sampleActivities = [
  {
    name: 'Eiffel Tower Skip-the-Line Tour',
    destination: 'Paris',
    country: 'France',
    basePrice: 35,
    originalPrice: 45,
    duration: { hours: 2, minutes: 30 },
    shortDescription: 'Experience iconic Eiffel Tower with skip-the-line access and expert guide.',
    fullDescription: 'Ascend the legendary Eiffel Tower with our exclusive skip-the-line guided tour. Your expert guide will share fascinating insights about the monument\'s history, architecture, and the panoramic city views from three different levels. Perfect for first-time visitors and photography enthusiasts.',
    images: [
      { url: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800', alt: 'Eiffel Tower Day View' },
      { url: 'https://images.unsplash.com/photo-1550340579-b4c0694abf16?w=800', alt: 'Eiffel Tower Night View' }
    ],
    highlights: [
      'Skip-the-line entry',
      'Ascend to the 3rd floor',
      'Panoramic views of Paris',
      'Expert English-speaking guide',
      'Learn fascinating historical facts'
    ],
    includes: [
      'Skip-the-line ticket',
      'Professional guide service',
      'Access to all three floors',
      'Souvenir map'
    ],
    excludes: [
      'Hotel pickup',
      'Meals',
      'Personal guide for private groups'
    ],
    whatToBring: [
      'Comfortable walking shoes',
      'Camera',
      'Sunscreen',
      'Light jacket'
    ],
    notAllowed: [
      'Glass bottles',
      'Large luggage',
      'Pets',
      'Sharp objects'
    ],
    knowBeforeYouGo: [
      'Meetings point: Bir-Hakeim Bridge entrance',
      'Tour starts at 10:00 AM',
      'Wear comfortable clothing',
      'Height restrictions may apply to some areas',
      'Children under 4 are free'
    ],
    provider: {
      name: 'Paris City Tours',
      rating: 4.8,
      reviewCount: 2543
    },
    category: 'Tours',
    tags: ['iconic', 'guided-tour', 'skip-the-line', 'paris', 'monument'],
    pickupIncluded: false,
    freeCancel: true,
    freeCancelHours: 24,
    reserveNowPayLater: true,
    maxGroupSize: 15,
    minGroupSize: 1,
    averageRating: 4.8,
    totalReviews: 2543,
    isAvailable: true
  },
  {
    name: 'Sagrada Familia Fast-Track Entrance',
    destination: 'Barcelona',
    country: 'Spain',
    basePrice: 28,
    originalPrice: 38,
    duration: { hours: 3, minutes: 0 },
    shortDescription: 'Explore Gaudí\'s masterpiece with skip-the-line access and interactive guides.',
    fullDescription: 'Discover one of the most visited monuments in Europe - the breathtaking Sagrada Familia basilica. With fast-track entry, you\'ll skip the queues and spend more time admiring Gaudí\'s architectural genius. Our digital guide provides detailed information about the construction, symbolism, and artistic elements of this UNESCO World Heritage site.',
    images: [
      { url: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?w=800', alt: 'Sagrada Familia Basilica' }
    ],
    highlights: [
      'Fast-track entrance',
      'Admission to all areas',
      'Interactive digital guide',
      'Learn about Gaudí\'s vision',
      'Spectacular architecture photos'
    ],
    includes: [
      'Fast-track entrance ticket',
      'Digital interactive guide',
      'Audio commentary in 15 languages'
    ],
    excludes: [
      'Towers climbing',
      'Cloister access',
      'Guided tour with physical guide'
    ],
    whatToBring: [
      'Camera',
      'Comfortable shoes',
      'Headphones for audio guide',
      'Respectful clothing'
    ],
    notAllowed: [
      'Photography with flash',
      'Professional equipment without permission',
      'Loud noise',
      'Disrespectful behavior'
    ],
    knowBeforeYouGo: [
      'Active religious site - dress respectfully',
      'No entry to those under 16 with exposed shoulders',
      'Construction ongoing - some areas may be restricted',
      'Allow 2-3 hours for complete visit',
      'Combine with Park Güell for full day experience'
    ],
    provider: {
      name: 'Barcelona Attractions',
      rating: 4.7,
      reviewCount: 3891
    },
    category: 'Tours',
    tags: ['architects', 'sagrada-familia', 'barcelona', 'gaudí', 'skip-the-line'],
    pickupIncluded: false,
    freeCancel: true,
    freeCancelHours: 48,
    reserveNowPayLater: true,
    maxGroupSize: 20,
    minGroupSize: 1,
    averageRating: 4.7,
    totalReviews: 3891,
    isAvailable: true
  },
  {
    name: 'Colosseum & Roman Forum Guided Tour',
    destination: 'Rome',
    country: 'Italy',
    basePrice: 42,
    originalPrice: 55,
    duration: { hours: 3, minutes: 30 },
    shortDescription: 'Skip-the-line access to Rome\'s most iconic ancient monuments with expert guide.',
    fullDescription: 'Step back in time with our comprehensive guided tour of Rome\'s most famous ancient sites. Your knowledgeable guide will bring ancient Rome to life, explaining the gladiatorial combats, political intrigues, and engineering marvels that built an empire. Explore the Colosseum, Roman Forum, and Palatine Hill with skip-the-line access.',
    images: [
      { url: 'https://images.unsplash.com/photo-1552832860-cfaf4f10b4d2?w=800', alt: 'Roman Colosseum' }
    ],
    highlights: [
      'Skip-the-line at Colosseum',
      'Ancient Roman sites exploration',
      'Expert archaeological knowledge',
      'Three UNESCO sites in one tour',
      'Stunning photo opportunities'
    ],
    includes: [
      'Skip-the-line tickets',
      'Professional English-speaking guide',
      'Access to Colosseum, Roman Forum, Palatine Hill',
      'Printed itinerary'
    ],
    excludes: [
      'Transport',
      'Meals',
      'Hotel pickup'
    ],
    whatToBring: [
      'Comfortable walking shoes',
      'Sun protection (hat, sunscreen)',
      'Water bottle',
      'Camera'
    ],
    notAllowed: [
      'Food and drink inside monuments',
      'Climbing on monuments',
      'Disrespectful behavior'
    ],
    knowBeforeYouGo: [
      'Very hot in summer - visit early morning',
      'Bring plenty of water',
      'Uneven surfaces - wear good shoes',
      'No shade in many areas',
      'Bring umbrella for unexpected rain'
    ],
    provider: {
      name: 'Rome Classic Tours',
      rating: 4.9,
      reviewCount: 5234
    },
    category: 'Tours',
    tags: ['rome', 'colosseum', 'ancient', 'guided-tour', 'history'],
    pickupIncluded: false,
    freeCancel: true,
    freeCancelHours: 24,
    reserveNowPayLater: true,
    maxGroupSize: 12,
    minGroupSize: 1,
    averageRating: 4.9,
    totalReviews: 5234,
    isAvailable: true
  },
  {
    name: 'Mount Fuji Sunrise Hike',
    destination: 'Tokyo',
    country: 'Japan',
    basePrice: 85,
    originalPrice: 110,
    duration: { hours: 8, minutes: 0 },
    shortDescription: 'Experience the legendary sunrise from Japan\'s most iconic mountain.',
    fullDescription: 'Climb Japan\'s highest peak and witness the magical sunrise from Mount Fuji\'s summit. This bucket-list experience includes hotel pickup, meals, a professional mountain guide, and acclimatization stops. All equipment is provided.',
    images: [
      { url: 'https://images.unsplash.com/photo-1580896579312-94651dfd596d?w=800', alt: 'Mount Fuji Sunrise' }
    ],
    highlights: [
      'Summit sunrise experience',
      'Mount Fuji\'s peak (3,776m)',
      'Professional summit guide',
      'Small group size',
      'Acclimatization rest stops',
      'Meals provided'
    ],
    includes: [
      'Hotel pickup and drop-off',
      'Professional guide',
      'All climbing equipment',
      'Meals and snacks',
      'Accommodation near base'
    ],
    excludes: [
      'Personal guide for groups',
      'Advanced climbing equipment'
    ],
    whatToBring: [
      'Warm jacket',
      'Headlamp/flashlight',
      'Sturdy hiking boots',
      'Extra socks'
    ],
    notAllowed: [
      'High heels',
      'Infants and young children'
    ],
    knowBeforeYouGo: [
      'Moderate to strenuous activity',
      'Altitude can cause discomfort',
      'Cold at summit (-10°C)',
      'Night climbing required',
      'Check weather forecasts',
      'Book 1-2 weeks in advance'
    ],
    provider: {
      name: 'Japan Alpine Guides',
      rating: 4.8,
      reviewCount: 1234
    },
    category: 'Adventure',
    tags: ['mountain', 'hiking', 'sunrise', 'japan', 'adventure'],
    pickupIncluded: true,
    freeCancel: true,
    freeCancelHours: 72,
    reserveNowPayLater: true,
    maxGroupSize: 8,
    minGroupSize: 2,
    averageRating: 4.8,
    totalReviews: 1234,
    isAvailable: true
  },
  {
    name: 'Taj Mahal Sunrise Private Tour',
    destination: 'Agra',
    country: 'India',
    basePrice: 65,
    originalPrice: 85,
    duration: { hours: 5, minutes: 0 },
    shortDescription: 'Experience the world\'s most beautiful monument at sunrise with private guide.',
    fullDescription: 'Witness the magical sunrise at the Taj Mahal, transforming the white marble from pink to gold. This private tour includes hotel pickup, professional guide, skip-the-line entry, and breakfast. Experience this wonder of the world with minimal crowds.',
    images: [
      { url: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800', alt: 'Taj Mahal Sunrise' }
    ],
    highlights: [
      'Sunrise at Taj Mahal',
      'Skip-the-line entry',
      'Private guide',
      'Hotel pickup',
      'Breakfast included',
      'Photography guidance'
    ],
    includes: [
      'Hotel pickup and drop-off',
      'Private professional guide',
      'Skip-the-line entry',
      'Indian breakfast',
      'Cold bottled water'
    ],
    excludes: [
      'Lunch',
      'Camera fees'
    ],
    whatToBring: [
      'Camera',
      'Hat and sunglasses',
      'Comfortable shoes',
      'Light jacket (early morning)'
    ],
    notAllowed: [
      'Tripods',
      'Drones',
      'Large bags inside mosque'
    ],
    knowBeforeYouGo: [
      'Dress modestly for mosque area',
      'Remove shoes before entering mosque',
      'Photography restricted in some areas',
      'Arrive 4:30 AM for sunrise viewing',
      'Closed on Fridays'
    ],
    provider: {
      name: 'Agra Experiences',
      rating: 4.9,
      reviewCount: 3456
    },
    category: 'Tours',
    tags: ['taj-mahal', 'sunrise', 'private-tour', 'india', 'romantic'],
    pickupIncluded: true,
    freeCancel: true,
    freeCancelHours: 48,
    reserveNowPayLater: true,
    maxGroupSize: 4,
    minGroupSize: 1,
    averageRating: 4.9,
    totalReviews: 3456,
    isAvailable: true
  }
];

// Connect to MongoDB and seed data
async function seedActivities() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    console.log('✓ Connected to MongoDB');

    // Clear existing activities (optional - comment out if you want to keep existing data)
    const result = await Activity.deleteMany({});
    console.log(`✓ Cleared ${result.deletedCount} existing activities`);

    // Insert sample activities
    const inserted = await Activity.insertMany(sampleActivities);
    console.log(`✓ Successfully seeded ${inserted.length} activities`);

    // Display summary
    console.log('\n--- Activities Seeded ---');
    inserted.forEach((activity, idx) => {
      console.log(
        `${idx + 1}. ${activity.name} (${activity.destination}, ${activity.country}) - $${activity.basePrice}`
      );
    });

    console.log('\n✓ Seeding complete!');
    process.exit(0);
  } catch (error) {
    console.error('✗ Seeding failed:', error.message);
    process.exit(1);
  }
}

// Run the seeding function
seedActivities();
