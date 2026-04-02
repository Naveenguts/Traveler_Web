const Destination = require('../models/Destination');

const cityFoodProfiles = {
  Paris: {
    dishes: ['Croissant', 'Coq au Vin', 'Macarons'],
    places: ['Le Marais bakeries', 'Saint-Germain bistros', 'Laduree pastry houses']
  },
  Tokyo: {
    dishes: ['Sushi', 'Ramen', 'Takoyaki'],
    places: ['Tsukiji Outer Market', 'Shinjuku ramen alleys', 'Asakusa food street']
  },
  'New York': {
    dishes: ['New York Pizza', 'Bagel and Lox', 'Cheesecake'],
    places: ['Greenwich Village pizzerias', 'Manhattan deli counters', 'Classic NY diners']
  },
  London: {
    dishes: ['Fish and Chips', 'Sunday Roast', 'Sticky Toffee Pudding'],
    places: ['Soho gastropubs', 'Westminster traditional pubs', 'Covent Garden dessert bars']
  },
  Dubai: {
    dishes: ['Shawarma', 'Machboos', 'Luqaimat'],
    places: ['Al Dhiyafah Road', 'Deira Emirati kitchens', 'Global Village food stalls']
  },
  Barcelona: {
    dishes: ['Paella', 'Patatas Bravas', 'Crema Catalana'],
    places: ['Barceloneta taverns', 'El Born tapas bars', 'Catalan bakeries']
  }
};

const countryCuisineProfiles = {
  France: ['Bistro tasting menu', 'Artisan cheese platter', 'Fresh bakery breakfast'],
  Japan: ['Chef-led sushi sampler', 'Ramen and gyoza combo', 'Seasonal street-food snack'],
  Italy: ['Regional pasta course', 'Wood-fired pizza dinner', 'Gelato tasting stop'],
  Spain: ['Tapas selection', 'Seafood rice specialty', 'Local dessert tasting'],
  UK: ['Classic pub plate', 'Afternoon tea service', 'Traditional roast meal'],
  USA: ['Signature local burger', 'Deli-style brunch', 'City dessert favorite'],
  UAE: ['Arabian mezze spread', 'Grilled kebab platter', 'Date-based dessert tasting']
};

const buildDefaultFoods = (destination) => {
  const cityProfile = cityFoodProfiles[destination.name];
  if (cityProfile) {
    return cityProfile.dishes.map((dish, index) => ({
      name: dish,
      description: `${dish} is a must-try local specialty in ${destination.name}.`,
      bestPlace: cityProfile.places[index] || `${destination.name} city center`
    }));
  }

  const cuisine = countryCuisineProfiles[destination.country] || [
    'Signature local breakfast',
    'Regional main-course specialty',
    'Traditional dessert tasting'
  ];

  return cuisine.slice(0, 3).map((dish, index) => ({
    name: dish,
    description: `${dish} gives you a taste of ${destination.country} cuisine.`,
    bestPlace: index === 0 ? `${destination.name} old town` : `${destination.name} local food district`
  }));
};

const buildDefaultMealsIncluded = (destination, foods) => {
  const curatedFoods = foods.map((item) => item.name).slice(0, 2);
  return [
    `Daily breakfast at ${destination.name}`,
    `${curatedFoods[0] || 'Local specialty'} tasting experience`,
    `${curatedFoods[1] || 'Chef-selected dinner'} welcome meal`
  ];
};

const buildDefaultRestaurants = (destination) => [
  `${destination.name} Central Kitchen`,
  `${destination.name} Heritage Table`,
  `${destination.name} Skyline Grill`
];

const enrichDestinationFoodData = (destinationDoc) => {
  const destination = typeof destinationDoc.toObject === 'function'
    ? destinationDoc.toObject()
    : { ...destinationDoc };

  const famousFoods = Array.isArray(destination.famousFoods) && destination.famousFoods.length > 0
    ? destination.famousFoods
    : buildDefaultFoods(destination);

  const topRestaurants = Array.isArray(destination.topRestaurants) && destination.topRestaurants.length > 0
    ? destination.topRestaurants
    : buildDefaultRestaurants(destination);

  const bookingInfo = destination.bookingInfo || {};
  const mealsIncluded = Array.isArray(bookingInfo.mealsIncluded) && bookingInfo.mealsIncluded.length > 0
    ? bookingInfo.mealsIncluded
    : buildDefaultMealsIncluded(destination, famousFoods);

  return {
    ...destination,
    famousFoods,
    topRestaurants,
    bookingInfo: {
      ...bookingInfo,
      mealsIncluded
    }
  };
};

// Get all destinations
exports.getAllDestinations = async (req, res) => {
  try {
    const destinations = await Destination.find().sort({ averageRating: -1 });
    const enrichedDestinations = destinations.map(enrichDestinationFoodData);
    
    res.json({
      success: true,
      count: enrichedDestinations.length,
      destinations: enrichedDestinations
    });
  } catch (error) {
    console.error('Get destinations error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch destinations',
      error: error.message
    });
  }
};

// Get single destination by ID
exports.getDestinationById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const destination = await Destination.findById(id);
    
    if (!destination) {
      return res.status(404).json({
        success: false,
        message: 'Destination not found'
      });
    }

    const enrichedDestination = enrichDestinationFoodData(destination);
    
    res.json({
      success: true,
      destination: enrichedDestination
    });
  } catch (error) {
    console.error('Get destination error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch destination',
      error: error.message
    });
  }
};

// Image URL mapping for reliable production-ready images
const imageMap = {
  'Paris': 'https://cdn.pixabay.com/photo/2016/11/18/14/44/paris-1835986_1280.jpg',
  'Tokyo': 'https://cdn.pixabay.com/photo/2016/08/01/01/52/shibuya-1562432_1280.jpg',
  'New York': 'https://cdn.pixabay.com/photo/2017/10/01/20/36/new-york-2808502_1280.jpg',
  'London': 'https://cdn.pixabay.com/photo/2016/02/18/16/34/big-ben-1208677_1280.jpg',
  'Dubai': 'https://cdn.pixabay.com/photo/2014/09/18/14/54/dubai-450341_1280.jpg',
  'Barcelona': 'https://cdn.pixabay.com/photo/2016/03/12/10/29/barcelona-1250884_1280.jpg',
  'Rome': 'https://cdn.pixabay.com/photo/2015/07/16/18/20/colosseum-848969_1280.jpg',
  'Amsterdam': 'https://cdn.pixabay.com/photo/2016/08/13/16/13/amsterdam-1592267_1280.jpg',
  'Sydney': 'https://cdn.pixabay.com/photo/2013/10/02/12/35/sydney-opera-house-190885_1280.jpg',
  'Bangkok': 'https://cdn.pixabay.com/photo/2016/11/16/22/31/thailand-1831145_1280.jpg',
  'Venice': 'https://cdn.pixabay.com/photo/2015/01/26/01/08/venice-612865_1280.jpg',
  'Singapore': 'https://cdn.pixabay.com/photo/2018/03/13/14/49/singapore-3223811_1280.jpg',
  'Berlin': 'https://cdn.pixabay.com/photo/2016/06/07/09/22/berlin-1441764_1280.jpg',
  'Istanbul': 'https://cdn.pixabay.com/photo/2015/11/23/15/36/istanbul-1057406_1280.jpg',
  'Montreal': 'https://cdn.pixabay.com/photo/2017/04/04/22/20/montreal-2204102_1280.jpg',
  'Vienna': 'https://cdn.pixabay.com/photo/2015/09/19/20/48/schonbrunn-palace-947340_1280.jpg',
  'Prague': 'https://cdn.pixabay.com/photo/2014/02/27/16/00/prague-274852_1280.jpg',
  'Budapest': 'https://cdn.pixabay.com/photo/2015/04/11/21/06/budapest-718770_1280.jpg',
  'Madrid': 'https://cdn.pixabay.com/photo/2016/04/21/15/05/madrid-1344076_1280.jpg',
  'Athens': 'https://cdn.pixabay.com/photo/2015/09/30/14/43/greece-963779_1280.jpg',
  'Bali': 'https://cdn.pixabay.com/photo/2017/10/11/19/40/bali-2840926_1280.jpg',
  'Ho Chi Minh City': 'https://cdn.pixabay.com/photo/2016/04/15/09/11/ben-thanh-market-1330441_1280.jpg',
  'Hanoi': 'https://cdn.pixabay.com/photo/2016/02/19/11/46/hoan-kiem-lake-1208801_1280.jpg',
  'Phuket': 'https://cdn.pixabay.com/photo/2016/04/28/07/07/patong-beach-1357598_1280.jpg',
  'Chiang Mai': 'https://cdn.pixabay.com/photo/2015/10/04/10/10/wat-chedi-luang-971560_1280.jpg',
  'Krabi': 'https://cdn.pixabay.com/photo/2019/01/08/20/42/railay-beach-3918305_1280.jpg',
  'Boracay': 'https://cdn.pixabay.com/photo/2017/03/24/10/26/boracay-2169268_1280.jpg',
  'Manila': 'https://cdn.pixabay.com/photo/2018/07/14/11/10/manila-3537382_1280.jpg',
  'Kuala Lumpur': 'https://cdn.pixabay.com/photo/2016/11/18/14/59/petronas-towers-1835917_1280.jpg',
  'Penang': 'https://cdn.pixabay.com/photo/2016/04/17/15/13/penang-bridge-1334658_1280.jpg',
};

// Seed destinations (for development/setup)
exports.seedDestinations = async (req, res) => {
  try {
    const getTemplateKey = (country) => {
      const europe = {
        nordics: ['Denmark', 'Sweden', 'Norway', 'Finland', 'Iceland'],
        baltics: ['Estonia', 'Latvia', 'Lithuania'],
        southern: ['Italy', 'Spain', 'Portugal', 'Greece', 'Croatia'],
        central: ['Germany', 'Austria', 'Switzerland', 'Czech Republic', 'Hungary', 'Poland'],
        western: ['France', 'Netherlands', 'Belgium', 'UK', 'Ireland']
      };

      const regionMap = {
        Asia: ['Japan', 'Thailand', 'Vietnam', 'Indonesia', 'China', 'Singapore', 'South Korea', 'Malaysia', 'India', 'Philippines'],
        MiddleEast: ['UAE', 'Turkey', 'Israel', 'Jordan', 'Qatar', 'Saudi Arabia'],
        Africa: ['Egypt', 'Morocco', 'South Africa'],
        NorthAmerica: ['USA', 'Canada', 'Mexico'],
        SouthAmerica: ['Brazil', 'Argentina', 'Peru', 'Chile'],
        Oceania: ['Australia', 'New Zealand', 'Fiji']
      };

      if (Object.values(europe).some(list => list.includes(country))) {
        const subRegion = Object.keys(europe).find(key => europe[key].includes(country));
        return subRegion ? `Europe-${subRegion}` : 'Europe';
      }

      return Object.keys(regionMap).find(region => regionMap[region].includes(country)) || 'Global';
    };

    const buildGalleryImages = (name, country) => {
      const slug = `${name}-${country}`
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      return [1, 2, 3].map((index) => `https://picsum.photos/seed/${slug}-${index}/1200/800`);
    };

    const hashString = (value) => {
      let hash = 7;
      for (let i = 0; i < value.length; i += 1) {
        hash = (hash * 31 + value.charCodeAt(i)) % 100000;
      }
      return hash;
    };

    const pickHighlights = (patterns, seed, count = 4) => {
      return Array.from({ length: count }, (_, index) => {
        const pattern = patterns[(seed + index) % patterns.length];
        return pattern;
      });
    };

    const regionHighlightPatterns = {
      'Europe-nordics': [
        (city) => `${city} waterfront and harbor walk`,
        (city) => `${city} design district highlights`,
        (city) => `${city} museum and gallery circuit`,
        (city) => `${city} nature escape and scenic trails`,
        (city) => `${city} cafe and bakery tasting stop`,
        (city) => `${city} sunset viewpoint experience`
      ],
      'Europe-baltics': [
        (city) => `${city} old town storytelling tour`,
        (city) => `${city} artisan market discovery`,
        (city) => `${city} riverfront promenade stroll`,
        (city) => `${city} heritage museum visit`,
        (city) => `${city} local cafe tasting`,
        (city) => `${city} evening city lights walk`
      ],
      'Europe-southern': [
        (city) => `${city} cathedral and plaza highlights`,
        (city) => `${city} seaside or coastal escape`,
        (city) => `${city} tapas and market tasting`,
        (city) => `${city} golden hour viewpoint`,
        (city) => `${city} historic quarter walking tour`,
        (city) => `${city} local artisan shopping time`
      ],
      'Europe-central': [
        (city) => `${city} castle or palace guided visit`,
        (city) => `${city} historic district walking tour`,
        (city) => `${city} riverfront promenade`,
        (city) => `${city} market tasting experience`,
        (city) => `${city} cultural museum visit`,
        (city) => `${city} evening square stroll`
      ],
      'Europe-western': [
        (city) => `${city} landmark and skyline highlights`,
        (city) => `${city} museum or gallery day`,
        (city) => `${city} food market tasting`,
        (city) => `${city} river or canal cruise`,
        (city) => `${city} cafe culture stop`,
        (city) => `${city} evening lights walk`
      ],
      Asia: [
        (city) => `${city} heritage district tour`,
        (city) => `${city} street food tasting trail`,
        (city) => `${city} evening night market visit`,
        (city) => `${city} skyline viewpoint stop`,
        (city) => `${city} cultural temple experience`,
        (city) => `${city} local craft shopping time`
      ],
      MiddleEast: [
        (city) => `${city} skyline or heritage landmarks`,
        (city) => `${city} souk and bazaar discovery`,
        (city) => `${city} waterfront promenade walk`,
        (city) => `${city} cultural dinner experience`,
        (city) => `${city} sunset viewpoint stop`,
        (city) => `${city} historic district highlights`
      ],
      Africa: [
        (city) => `${city} heritage and history tour`,
        (city) => `${city} local market discovery`,
        (city) => `${city} scenic overlook stop`,
        (city) => `${city} cultural performance option`,
        (city) => `${city} coastal or riverfront time`,
        (city) => `${city} local cuisine tasting`
      ],
      NorthAmerica: [
        (city) => `${city} iconic landmark visit`,
        (city) => `${city} skyline viewpoint experience`,
        (city) => `${city} neighborhood food crawl`,
        (city) => `${city} museum or gallery visit`,
        (city) => `${city} historic district walk`,
        (city) => `${city} waterfront or park time`
      ],
      SouthAmerica: [
        (city) => `${city} historic center walking tour`,
        (city) => `${city} local cuisine tasting`,
        (city) => `${city} scenic viewpoint stop`,
        (city) => `${city} cultural market visit`,
        (city) => `${city} nightlife district walk`,
        (city) => `${city} riverside promenade`
      ],
      Oceania: [
        (city) => `${city} harbor or coastal cruise`,
        (city) => `${city} beach and nature time`,
        (city) => `${city} landmark guided tour`,
        (city) => `${city} local food tasting`,
        (city) => `${city} scenic coastal walk`,
        (city) => `${city} sunset viewpoint`
      ],
      Global: [
        (city) => `${city} landmark highlights`,
        (city) => `${city} cultural walking tour`,
        (city) => `${city} local market tasting`,
        (city) => `${city} sunset viewpoint`,
        (city) => `${city} historic district visit`,
        (city) => `${city} local cafe stop`
      ]
    };

    const galleryMap = {
      Paris: [
        'https://cdn.pixabay.com/photo/2016/11/18/14/44/paris-1835986_1280.jpg',
        'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1200&h=800&fit=crop',
        'https://images.unsplash.com/photo-1508057198894-247b23fe5ade?w=1200&h=800&fit=crop'
      ],
      Tokyo: [
        'https://cdn.pixabay.com/photo/2016/08/01/01/52/shibuya-1562432_1280.jpg',
        'https://images.unsplash.com/photo-1549693578-d683be217e58?w=1200&h=800&fit=crop',
        'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=1200&h=800&fit=crop'
      ],
      'New York': [
        'https://cdn.pixabay.com/photo/2017/10/01/20/36/new-york-2808502_1280.jpg',
        'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=1200&h=800&fit=crop',
        'https://images.unsplash.com/photo-1485871981521-5b1fd3805eee?w=1200&h=800&fit=crop'
      ],
      London: [
        'https://cdn.pixabay.com/photo/2016/02/18/16/34/big-ben-1208677_1280.jpg',
        'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1200&h=800&fit=crop',
        'https://images.unsplash.com/photo-1448906654166-444d494666b3?w=1200&h=800&fit=crop'
      ],
      Dubai: [
        'https://cdn.pixabay.com/photo/2014/09/18/14/54/dubai-450341_1280.jpg',
        'https://images.unsplash.com/photo-1496417263034-38ec4f0b665a?w=1200&h=800&fit=crop',
        'https://images.unsplash.com/photo-1496560736447-4f4a3e00b27b?w=1200&h=800&fit=crop'
      ],
      Barcelona: [
        'https://cdn.pixabay.com/photo/2016/03/12/10/29/barcelona-1250884_1280.jpg',
        'https://images.unsplash.com/photo-1464790719320-516ecd75af6c?w=1200&h=800&fit=crop',
        'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1200&h=800&fit=crop'
      ],
      Rome: [
        'https://cdn.pixabay.com/photo/2015/07/16/18/20/colosseum-848969_1280.jpg',
        'https://images.unsplash.com/photo-1552832860-cfb67165eaf0?w=1200&h=800&fit=crop',
        'https://images.unsplash.com/photo-1529154036614-a60975f5c760?w=1200&h=800&fit=crop'
      ],
      Amsterdam: [
        'https://cdn.pixabay.com/photo/2016/08/13/16/13/amsterdam-1592267_1280.jpg',
        'https://images.unsplash.com/photo-1503784915596-c1581d0b3a19?w=1200&h=800&fit=crop',
        'https://images.unsplash.com/photo-1471899236350-e3016bf1e69c?w=1200&h=800&fit=crop'
      ],
      Sydney: [
        'https://cdn.pixabay.com/photo/2013/10/02/12/35/sydney-opera-house-190885_1280.jpg',
        'https://images.unsplash.com/photo-1506973404872-a4a41e1d267e?w=1200&h=800&fit=crop',
        'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=1200&h=800&fit=crop'
      ],
      Bangkok: [
        'https://cdn.pixabay.com/photo/2016/11/16/22/31/thailand-1831145_1280.jpg',
        'https://images.unsplash.com/photo-1505953490908-58f5ab2e8f87?w=1200&h=800&fit=crop',
        'https://images.unsplash.com/photo-1506595046336-338483c9a407?w=1200&h=800&fit=crop'
      ],
      Venice: [
        'https://cdn.pixabay.com/photo/2015/01/26/01/08/venice-612865_1280.jpg',
        'https://images.unsplash.com/photo-1495576066215-137a3bf13a5f?w=1200&h=800&fit=crop',
        'https://images.unsplash.com/photo-1501876725168-00c445821c9e?w=1200&h=800&fit=crop'
      ],
      Singapore: [
        'https://cdn.pixabay.com/photo/2018/03/13/14/49/singapore-3223811_1280.jpg',
        'https://images.unsplash.com/photo-1515731566361-fdb1e7cecb84?w=1200&h=800&fit=crop',
        'https://images.unsplash.com/photo-1494526585095-c41746248156?w=1200&h=800&fit=crop'
      ],
      Berlin: [
        'https://cdn.pixabay.com/photo/2016/06/07/09/22/berlin-1441764_1280.jpg',
        'https://images.unsplash.com/photo-1579537193181-5c79c4ed3a19?w=1200&h=800&fit=crop',
        'https://images.unsplash.com/photo-1471879832106-c7ab9e0cee23?w=1200&h=800&fit=crop'
      ],
      Istanbul: [
        'https://cdn.pixabay.com/photo/2015/11/23/15/36/istanbul-1057406_1280.jpg',
        'https://images.unsplash.com/photo-1495845842352-d6c1b2e6f37d?w=1200&h=800&fit=crop',
        'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1200&h=800&fit=crop'
      ],
      Montreal: [
        'https://cdn.pixabay.com/photo/2017/04/04/22/20/montreal-2204102_1280.jpg',
        'https://images.unsplash.com/photo-1523632913763-5f765fb37a4f?w=1200&h=800&fit=crop',
        'https://images.unsplash.com/photo-1449452198679-05c7fd30f416?w=1200&h=800&fit=crop'
      ],
      Vienna: [
        'https://cdn.pixabay.com/photo/2015/09/19/20/48/schonbrunn-palace-947340_1280.jpg',
        'https://images.unsplash.com/photo-1516152097086-502d7f618e70?w=1200&h=800&fit=crop',
        'https://images.unsplash.com/photo-1471879832106-c7ab9e0cee23?w=1200&h=800&fit=crop'
      ],
      Prague: [
        'https://cdn.pixabay.com/photo/2014/02/27/16/00/prague-274852_1280.jpg',
        'https://images.unsplash.com/photo-1508602912369-cf0f3a3b5601?w=1200&h=800&fit=crop',
        'https://images.unsplash.com/photo-1449452198679-05c7fd30f416?w=1200&h=800&fit=crop'
      ],
      Budapest: [
        'https://cdn.pixabay.com/photo/2015/04/11/21/06/budapest-718770_1280.jpg',
        'https://images.unsplash.com/photo-1517623407522-67d69e7127a3?w=1200&h=800&fit=crop',
        'https://images.unsplash.com/photo-1471879832106-c7ab9e0cee23?w=1200&h=800&fit=crop'
      ],
      Madrid: [
        'https://cdn.pixabay.com/photo/2016/04/21/15/05/madrid-1344076_1280.jpg',
        'https://images.unsplash.com/photo-1515728289063-d5dc12a5e3db?w=1200&h=800&fit=crop',
        'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1200&h=800&fit=crop'
      ],
      Athens: [
        'https://cdn.pixabay.com/photo/2015/09/30/14/43/greece-963779_1280.jpg',
        'https://images.unsplash.com/photo-1522100205226-994b219c77d3?w=1200&h=800&fit=crop',
        'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1200&h=800&fit=crop'
      ],
      Bali: [
        'https://cdn.pixabay.com/photo/2017/10/11/19/40/bali-2840926_1280.jpg',
        'https://images.unsplash.com/photo-1511920170033-f8396924c348?w=1200&h=800&fit=crop',
        'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1200&h=800&fit=crop'
      ],
      'Ho Chi Minh City': [
        'https://cdn.pixabay.com/photo/2016/04/15/09/11/ben-thanh-market-1330441_1280.jpg',
        'https://images.unsplash.com/photo-1514432324607-2e467f4af445?w=1200&h=800&fit=crop',
        'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1200&h=800&fit=crop'
      ],
      Hanoi: [
        'https://cdn.pixabay.com/photo/2016/02/19/11/46/hoan-kiem-lake-1208801_1280.jpg',
        'https://images.unsplash.com/photo-1527529482837-4698179dc6ce?w=1200&h=800&fit=crop',
        'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1200&h=800&fit=crop'
      ],
      Phuket: [
        'https://cdn.pixabay.com/photo/2016/04/28/07/07/patong-beach-1357598_1280.jpg',
        'https://images.unsplash.com/photo-1503896614597-7f6a7c1d8e4f?w=1200&h=800&fit=crop',
        'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&h=800&fit=crop'
      ],
      'Chiang Mai': [
        'https://cdn.pixabay.com/photo/2015/10/04/10/10/wat-chedi-luang-971560_1280.jpg',
        'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=800&fit=crop',
        'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1200&h=800&fit=crop'
      ],
      Krabi: [
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&h=800&fit=crop',
        'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&h=800&fit=crop',
        'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1200&h=800&fit=crop'
      ],
      Boracay: [
        'https://cdn.pixabay.com/photo/2017/03/24/10/26/boracay-2169268_1280.jpg',
        'https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=1200&h=800&fit=crop',
        'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&h=800&fit=crop'
      ],
      Manila: [
        'https://cdn.pixabay.com/photo/2018/07/14/11/10/manila-3537382_1280.jpg',
        'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1200&h=800&fit=crop',
        'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1200&h=800&fit=crop'
      ],
      'Kuala Lumpur': [
        'https://cdn.pixabay.com/photo/2016/11/18/14/59/petronas-towers-1835917_1280.jpg',
        'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=1200&h=800&fit=crop',
        'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1200&h=800&fit=crop'
      ],
      Penang: [
        'https://cdn.pixabay.com/photo/2016/04/17/15/13/penang-bridge-1334658_1280.jpg',
        'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe3e?w=1200&h=800&fit=crop',
        'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1200&h=800&fit=crop'
      ]
    };

    const signatureHighlightsMap = {
      Paris: [
        'Sunrise views from the Eiffel Tower and the Seine',
        'Guided walk through Montmartre and Sacre-Coeur',
        'Louvre Museum skip-the-line entry',
        'Evening cruise with city skyline views'
      ],
      Tokyo: [
        'Shibuya Crossing nightlife walk',
        'Asakusa temple district and food stalls',
        'Day trip to Mount Fuji viewpoints',
        'Sushi-making experience with a local chef'
      ],
      'New York': [
        'Statue of Liberty and Ellis Island tour',
        'Sunset views from the Top of the Rock',
        'Food crawl through Brooklyn neighborhoods',
        'Broadway show night experience'
      ],
      London: [
        'Changing of the Guard at Buckingham Palace',
        'Tower Bridge and Thames river cruise',
        'West End theater night',
        'Guided walk through Notting Hill'
      ],
      Dubai: [
        'Burj Khalifa observation deck experience',
        'Desert safari with dune bashing',
        'Old Dubai souk and creek tour',
        'Dubai Marina dhow cruise'
      ],
      Barcelona: [
        'Gaudi architecture walk with local guide',
        'Tapas tasting in the Gothic Quarter',
        'Sunset at Barceloneta Beach',
        'Park Guell skip-the-line entry'
      ],
      Rome: [
        'Colosseum and Roman Forum guided entry',
        'Vatican Museums and Sistine Chapel visit',
        'Trastevere evening food walk',
        'Trevi Fountain and Spanish Steps stroll'
      ],
      Amsterdam: [
        'Canal cruise through the historic ring',
        'Rijksmuseum and Van Gogh Museum time',
        'Jordaan district bike ride',
        'Albert Cuyp market food tasting'
      ],
      Sydney: [
        'Sydney Opera House guided tour',
        'Bondi to Coogee coastal walk',
        'Harbor cruise at sunset',
        'Manly Beach day trip'
      ],
      Bangkok: [
        'Grand Palace and Wat Pho tour',
        'Chao Phraya river boat ride',
        'Street food tasting in Chinatown',
        'Floating market morning visit'
      ],
      Venice: [
        'Gondola ride through the Grand Canal',
        'St Marks Basilica and Doges Palace tour',
        'Murano glass artisan visit',
        'Sunset walk across Rialto Bridge'
      ],
      Singapore: [
        'Gardens by the Bay evening lights',
        'Marina Bay skyline walk',
        'Hawker center tasting tour',
        'Sentosa Island beach time'
      ],
      Berlin: [
        'Berlin Wall memorial and East Side Gallery',
        'Museum Island day pass entry',
        'Street art walk in Kreuzberg',
        'Checkpoint Charlie and historic sites'
      ],
      Istanbul: [
        'Hagia Sophia and Blue Mosque tour',
        'Grand Bazaar shopping time',
        'Bosphorus sunset cruise',
        'Spice market tasting stops'
      ],
      Montreal: [
        'Old Montreal walking tour',
        'Jean-Talon Market tastings',
        'Mount Royal lookout views',
        'Old Port riverfront evening stroll'
      ],
      Vienna: [
        'Schonbrunn Palace guided tour',
        'Vienna State Opera evening option',
        'Coffeehouse tasting experience',
        'Historic Ringstrasse walk'
      ],
      Prague: [
        'Charles Bridge sunrise walk',
        'Prague Castle and cathedral tour',
        'Old Town Square clocktower visit',
        'River cruise at dusk'
      ],
      Budapest: [
        'Thermal baths relaxation session',
        'Buda Castle district walk',
        'Danube river evening cruise',
        'Central Market Hall tasting'
      ],
      Madrid: [
        'Royal Palace and Plaza Mayor visit',
        'Retiro Park lakeside stroll',
        'Tapas crawl in La Latina',
        'Golden hour at Gran Via'
      ],
      Athens: [
        'Acropolis sunrise or sunset visit',
        'Plaka neighborhood walking tour',
        'Ancient Agora and temple ruins',
        'Rooftop dinner with skyline views'
      ],
      Bali: [
        'Temple hopping in Uluwatu and Tanah Lot',
        'Ubud rice terrace sunrise walk',
        'Beach day with surf or snorkel time',
        'Traditional Balinese spa ritual'
      ],
      'Ho Chi Minh City': [
        'Ben Thanh Market and street food tour',
        'French colonial landmarks walk',
        'Saigon River sunset cruise',
        'War Remnants Museum visit'
      ],
      Hanoi: [
        'Old Quarter walking tour',
        'Hoan Kiem Lake sunrise stroll',
        'Egg coffee tasting stop',
        'Temple of Literature visit'
      ],
      Phuket: [
        'Island hopping day cruise',
        'Old Town cultural walk',
        'Sunset viewpoints on the coast',
        'Beach club evening experience'
      ],
      'Chiang Mai': [
        'Mountain temple sunrise visit',
        'Night bazaar shopping time',
        'Thai cooking class experience',
        'Elephant sanctuary ethical visit'
      ],
      Krabi: [
        'Railay Beach limestone cliffs',
        'Four Islands longtail boat tour',
        'Emerald Pool and hot springs stop',
        'Sunset beach walk'
      ],
      Boracay: [
        'White Beach sunset experience',
        'Island hopping day cruise',
        'Snorkeling with coral reefs',
        'Seaside dining night'
      ],
      Manila: [
        'Intramuros heritage tour',
        'Rizal Park cultural stops',
        'Binondo food crawl',
        'Manila Bay sunset walk'
      ],
      'Kuala Lumpur': [
        'Petronas Towers skyline photo stop',
        'Batu Caves temple visit',
        'Jalan Alor food street tasting',
        'Bukit Bintang shopping time'
      ],
      Penang: [
        'Georgetown street art walk',
        'Hawker food tasting tour',
        'Penang Hill viewpoints',
        'Clan jetties waterfront stroll'
      ]
    };

    const regionTemplates = {
      'Europe-nordics': {
        highlights: ['Waterfront or fjord viewpoints', 'Design district or museum visit', 'Cozy cafe or sauna stop', 'Scenic nature walk'],
        includes: {
          included: ['Hotel stay', 'City walking tour', 'Museum entry', 'Daily breakfast'],
          excluded: ['International flights', 'Personal expenses', 'Airport transfers']
        },
        importantInfo: {
          whatToBring: ['Warm layers', 'Waterproof jacket', 'Comfortable shoes'],
          notAllowed: ['Drones near protected areas', 'Oversized luggage on tours']
        },
        cancellationPolicy: 'Free cancellation up to 48 hours before departure'
      },
      'Europe-baltics': {
        highlights: ['Old town walking tour', 'Local craft market stop', 'Riverfront or harbor stroll', 'Cultural heritage museum visit'],
        includes: {
          included: ['Hotel stay', 'Local guide', 'Museum entry', 'Daily breakfast'],
          excluded: ['International flights', 'Personal expenses', 'Airport transfers']
        },
        importantInfo: {
          whatToBring: ['Comfortable shoes', 'Light layers', 'Photo ID or passport'],
          notAllowed: ['Drones near historic centers', 'Oversized luggage on tours']
        },
        cancellationPolicy: 'Free cancellation up to 24 hours before departure'
      },
      'Europe-southern': {
        highlights: ['Historic plazas and cathedral visit', 'Coastal or seaside time', 'Local cuisine tasting', 'Sunset viewpoint walk'],
        includes: {
          included: ['Hotel stay', 'City walking tour', 'Local tasting', 'Daily breakfast'],
          excluded: ['International flights', 'Personal expenses', 'Airport transfers']
        },
        importantInfo: {
          whatToBring: ['Sunscreen', 'Light layers', 'Comfortable shoes'],
          notAllowed: ['Glass bottles on tours', 'Drones near landmarks']
        },
        cancellationPolicy: 'Free cancellation up to 24 hours before departure'
      },
      'Europe-central': {
        highlights: ['Historic district walking tour', 'Palace or castle visit', 'Local market tasting', 'Riverfront or park stroll'],
        includes: {
          included: ['Hotel stay', 'Guided tour', 'Museum pass', 'Daily breakfast'],
          excluded: ['International flights', 'Personal expenses', 'Airport transfers']
        },
        importantInfo: {
          whatToBring: ['Comfortable shoes', 'Light jacket', 'Photo ID or passport'],
          notAllowed: ['Tripods in museums', 'Oversized luggage on tours']
        },
        cancellationPolicy: 'Free cancellation up to 24 hours before departure'
      },
      'Europe-western': {
        highlights: ['Iconic landmark visit', 'Museum or gallery experience', 'Food market tasting', 'Evening city lights walk'],
        includes: {
          included: ['Hotel stay', 'City walking tour', 'Museum entry pass', 'Daily breakfast'],
          excluded: ['International flights', 'Personal expenses', 'Airport transfers']
        },
        importantInfo: {
          whatToBring: ['Comfortable walking shoes', 'Light layers', 'Photo ID or passport'],
          notAllowed: ['Oversized luggage on tours', 'Drones near landmarks']
        },
        cancellationPolicy: 'Free cancellation up to 24 hours before departure'
      },
      Europe: {
        highlights: ['Historic landmarks and old town walks', 'Museum or palace guided visit', 'Local market tasting experience', 'Evening city lights stroll'],
        includes: {
          included: ['Hotel stay', 'City walking tour', 'Museum entry pass', 'Daily breakfast'],
          excluded: ['International flights', 'Personal expenses', 'Airport transfers']
        },
        importantInfo: {
          whatToBring: ['Comfortable walking shoes', 'Light layers', 'Photo ID or passport'],
          notAllowed: ['Oversized luggage on tours', 'Drones near landmarks']
        },
        cancellationPolicy: 'Free cancellation up to 24 hours before departure'
      },
      Asia: {
        highlights: ['Temple or heritage district visit', 'Street food tasting tour', 'Evening market experience', 'Scenic viewpoint or skyline stop'],
        includes: {
          included: ['Hotel stay', 'Local transport card', 'Guided cultural tour', 'Daily breakfast'],
          excluded: ['International flights', 'Personal expenses', 'Optional excursions']
        },
        importantInfo: {
          whatToBring: ['Comfortable shoes', 'Light breathable clothing', 'Cash for markets'],
          notAllowed: ['Drones near temples', 'Large luggage on tours']
        },
        cancellationPolicy: 'Free cancellation up to 24 hours before departure'
      },
      MiddleEast: {
        highlights: ['Iconic skyline or heritage site visit', 'Souk or bazaar shopping time', 'Sunset viewpoint experience', 'Cultural dinner option'],
        includes: {
          included: ['Hotel stay', 'City tour', 'Airport transfers', 'Daily breakfast'],
          excluded: ['International flights', 'Personal expenses', 'Travel insurance']
        },
        importantInfo: {
          whatToBring: ['Light modest clothing', 'Sunscreen', 'Photo ID or passport'],
          notAllowed: ['Drones in city centers', 'Outside food on tours']
        },
        cancellationPolicy: 'Free cancellation up to 48 hours before departure'
      },
      Africa: {
        highlights: ['Historic sites or heritage tour', 'Local market experience', 'Scenic lookout or coastal time', 'Traditional cuisine tasting'],
        includes: {
          included: ['Hotel stay', 'Local guide', 'Daily breakfast', 'City tour'],
          excluded: ['International flights', 'Personal expenses', 'Travel insurance']
        },
        importantInfo: {
          whatToBring: ['Sun protection', 'Comfortable shoes', 'Reusable water bottle'],
          notAllowed: ['Drones near heritage sites', 'Large luggage on tours']
        },
        cancellationPolicy: 'Free cancellation up to 48 hours before departure'
      },
      NorthAmerica: {
        highlights: ['Iconic landmark visit', 'Neighborhood food crawl', 'Skyline viewpoint experience', 'Local guide walking tour'],
        includes: {
          included: ['Hotel stay', 'City pass attractions', 'Local guide', 'Daily breakfast'],
          excluded: ['International flights', 'Personal expenses', 'Travel insurance']
        },
        importantInfo: {
          whatToBring: ['Comfortable shoes', 'Weather-ready layers', 'Photo ID'],
          notAllowed: ['Large backpacks in museums', 'Tripods at landmarks']
        },
        cancellationPolicy: 'Free cancellation up to 24 hours before departure'
      },
      SouthAmerica: {
        highlights: ['Historic district walking tour', 'Local cuisine tasting', 'Scenic viewpoint stop', 'Cultural show or market visit'],
        includes: {
          included: ['Hotel stay', 'Local guide', 'Daily breakfast', 'City tour'],
          excluded: ['International flights', 'Personal expenses', 'Travel insurance']
        },
        importantInfo: {
          whatToBring: ['Comfortable shoes', 'Light layers', 'Photo ID'],
          notAllowed: ['Drones in historic centers', 'Oversized luggage on tours']
        },
        cancellationPolicy: 'Free cancellation up to 48 hours before departure'
      },
      Oceania: {
        highlights: ['Coastal walk or harbor cruise', 'Landmark guided visit', 'Beach or nature time', 'Local food tasting'],
        includes: {
          included: ['Hotel stay', 'Harbor cruise or tour', 'Daily breakfast', 'Local transport pass'],
          excluded: ['International flights', 'Personal expenses', 'Travel insurance']
        },
        importantInfo: {
          whatToBring: ['Sunscreen', 'Reusable water bottle', 'Light jacket for evenings'],
          notAllowed: ['Drones near protected areas', 'Large luggage on tours']
        },
        cancellationPolicy: 'Free cancellation up to 72 hours before departure'
      },
      Global: {
        highlights: ['Top landmarks and cultural spots', 'Guided city experience', 'Local market stop', 'Flexible time for exploration'],
        includes: {
          included: ['Hotel stay', 'Local transport', 'Guided tour', 'Daily breakfast'],
          excluded: ['International flights', 'Personal expenses', 'Travel insurance']
        },
        importantInfo: {
          whatToBring: ['Photo ID or passport', 'Comfortable walking shoes', 'Weather-appropriate clothing'],
          notAllowed: ['Pets', 'Oversized luggage on tours', 'Drones at landmarks']
        },
        cancellationPolicy: 'Free cancellation up to 24 hours before departure'
      }
    };

    const addDetails = (destination) => {
      const templateKey = getTemplateKey(destination.country);
      const regionTemplate = regionTemplates[templateKey] || regionTemplates.Global;
      const highlightSeed = hashString(`${destination.name}-${destination.country}`);
      const highlightPatterns = regionHighlightPatterns[templateKey] || regionHighlightPatterns.Global;
      const signatureHighlights = signatureHighlightsMap[destination.name]
        || pickHighlights(highlightPatterns, highlightSeed).map((pattern) =>
          pattern(destination.name, destination.country)
        );
      const originalPrice = Math.round(destination.price * 1.2);
      const famousFoods = buildDefaultFoods(destination);
      return {
        ...destination,
        galleryImages: destination.galleryImages?.length
          ? destination.galleryImages
          : (galleryMap[destination.name] || buildGalleryImages(destination.name, destination.country)),
        fullDescription: destination.fullDescription || `${destination.longDescription} Enjoy curated experiences and flexible time to explore at your own pace.`,
        highlights: destination.highlights?.length ? destination.highlights : signatureHighlights,
        includes: destination.includes || regionTemplate.includes,
        importantInfo: destination.importantInfo || regionTemplate.importantInfo,
        bookingInfo: destination.bookingInfo || {
          duration: `${destination.duration} days`,
          cancellationPolicy: regionTemplate.cancellationPolicy,
          reserveNowPayLater: destination.price >= 2000,
          originalPrice,
          discountedPrice: destination.price,
          mealsIncluded: buildDefaultMealsIncluded(destination, famousFoods)
        },
        famousFoods,
        topRestaurants: buildDefaultRestaurants(destination)
      };
    };

    const destinations = [
      {
        name: 'Paris',
        country: 'France',
        description: 'City of Lights',
        longDescription: 'Paris, the capital of France, is one of the most iconic cities in the world. Known for its art, fashion, gastronomy, and culture.',
        fullDescription: 'Paris blends timeless elegance with modern energy. Wander through grand boulevards, discover art-filled museums, and enjoy bistro dining that defines French culture.',
        image: imageMap['Paris'] || 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&h=500&fit=crop',
        galleryImages: [
          'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1200&h=800&fit=crop',
          'https://images.unsplash.com/photo-1508057198894-247b23fe5ade?w=800&h=600&fit=crop',
          'https://images.unsplash.com/photo-1500043357865-c6b8827edf8b?w=800&h=600&fit=crop'
        ],
        highlights: [
          'Sunrise views from the Eiffel Tower and the Seine',
          'Guided walk through Montmartre and Sacre-Coeur',
          'Louvre Museum skip-the-line entry',
          'Evening cruise with city skyline views'
        ],
        includes: {
          included: ['4-star hotel stay', 'Airport transfers', 'Museum passes', 'Daily breakfast'],
          excluded: ['International flights', 'Personal expenses', 'Travel insurance']
        },
        importantInfo: {
          whatToBring: ['Comfortable walking shoes', 'Photo ID or passport', 'Light jacket'],
          notAllowed: ['Oversized luggage on tours', 'Pets', 'Drones at landmarks']
        },
        bookingInfo: {
          duration: '7 days / 6 nights',
          cancellationPolicy: 'Free cancellation up to 24 hours before departure',
          reserveNowPayLater: true,
          originalPrice: 2950,
          discountedPrice: 2500
        },
        price: 2500,
        duration: 7
      },
      {
        name: 'Tokyo',
        country: 'Japan',
        description: 'Land of the Rising Sun',
        longDescription: 'Tokyo is a bustling metropolis that seamlessly blends ancient traditions with modern technology. Experience incredible food and vibrant neighborhoods.',
        fullDescription: 'Tokyo delivers a sensory rush of neon, temples, and world-class dining. Explore historic shrines, shop in Shibuya, and take a day trip to Fuji viewpoints.',
        image: imageMap['Tokyo'] || 'https://images.unsplash.com/photo-1540959375944-7049f642e9a4?w=800&h=500&fit=crop',
        galleryImages: [
          'https://images.unsplash.com/photo-1549693578-d683be217e58?w=1200&h=800&fit=crop',
          'https://images.unsplash.com/photo-1505060895960-2f3a55f7c12b?w=800&h=600&fit=crop',
          'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&h=600&fit=crop'
        ],
        highlights: [
          'Shibuya Crossing nightlife walk',
          'Asakusa temple district and food stalls',
          'Day trip to Mount Fuji viewpoints',
          'Sushi-making experience with a local chef'
        ],
        includes: {
          included: ['Central hotel stay', 'Metro passes', 'Temple district tour', 'Welcome dinner'],
          excluded: ['International flights', 'Optional day trips', 'Personal shopping']
        },
        importantInfo: {
          whatToBring: ['Reusable transit card', 'Comfortable sneakers', 'Cash for markets'],
          notAllowed: ['Large luggage on metro tours', 'Smoking in public areas']
        },
        bookingInfo: {
          duration: '10 days / 9 nights',
          cancellationPolicy: 'Free cancellation up to 48 hours before departure',
          reserveNowPayLater: true,
          originalPrice: 3650,
          discountedPrice: 3200
        },
        price: 3200,
        duration: 10
      },
      {
        name: 'New York',
        country: 'USA',
        description: 'The Big Apple',
        longDescription: 'New York City is the city that never sleeps. From Times Square to Central Park, Broadway shows to world-class museums.',
        fullDescription: 'New York is a mosaic of neighborhoods, skyline views, and iconic culture. See the city from the top of a skyscraper, catch a Broadway show, and explore food scenes from Brooklyn to Harlem.',
        image: imageMap['New York'] || 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800&h=500&fit=crop',
        galleryImages: [
          'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=1200&h=800&fit=crop',
          'https://images.unsplash.com/photo-1468436139062-f60a71c5c892?w=800&h=600&fit=crop',
          'https://images.unsplash.com/photo-1485871981521-5b1fd3805eee?w=800&h=600&fit=crop'
        ],
        highlights: [
          'Statue of Liberty and Ellis Island tour',
          'Sunset views from the Top of the Rock',
          'Food crawl through Brooklyn neighborhoods',
          'Broadway show night experience'
        ],
        includes: {
          included: ['Hotel in Midtown', 'Ferry tickets', 'City pass attractions', 'Local guide'],
          excluded: ['International flights', 'Broadway tickets', 'Travel insurance']
        },
        importantInfo: {
          whatToBring: ['Comfortable shoes', 'Photo ID', 'Weather-ready layers'],
          notAllowed: ['Large backpacks on tours', 'Tripods in museums']
        },
        bookingInfo: {
          duration: '5 days / 4 nights',
          cancellationPolicy: 'Free cancellation up to 24 hours before departure',
          reserveNowPayLater: false,
          originalPrice: 3350,
          discountedPrice: 2800
        },
        price: 2800,
        duration: 5
      },
      {
        name: 'London',
        country: 'UK',
        description: 'The Capital of England',
        longDescription: 'London combines centuries of history with cutting-edge innovation. Visit Buckingham Palace and explore world-renowned museums.',
        fullDescription: 'London is a city of royal landmarks, leafy parks, and creative neighborhoods. Cruise along the Thames, explore historic towers, and end the evening with theater or live music.',
        image: imageMap['London'] || 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&h=500&fit=crop',
        galleryImages: [
          'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1200&h=800&fit=crop',
          'https://images.unsplash.com/photo-1473959383413-c5d12c1db1f8?w=800&h=600&fit=crop',
          'https://images.unsplash.com/photo-1448906654166-444d494666b3?w=800&h=600&fit=crop'
        ],
        highlights: [
          'Changing of the Guard at Buckingham Palace',
          'Tower Bridge and Thames river cruise',
          'West End theater night',
          'Guided walk through Notting Hill'
        ],
        includes: {
          included: ['Hotel stay', 'Oyster card credits', 'Thames cruise', 'Guided walking tour'],
          excluded: ['International flights', 'Theater tickets', 'Personal expenses']
        },
        importantInfo: {
          whatToBring: ['Umbrella or raincoat', 'Contactless payment card', 'Comfortable shoes'],
          notAllowed: ['Large luggage on underground', 'Drones near landmarks']
        },
        bookingInfo: {
          duration: '6 days / 5 nights',
          cancellationPolicy: 'Free cancellation up to 24 hours before departure',
          reserveNowPayLater: true,
          originalPrice: 2700,
          discountedPrice: 2200
        },
        price: 2200,
        duration: 6
      },
      {
        name: 'Dubai',
        country: 'UAE',
        description: 'City of Gold',
        longDescription: 'Dubai is a futuristic city in the desert, known for luxury shopping, ultramodern architecture, and lively nightlife.',
        fullDescription: 'Dubai delivers ultra-modern architecture, desert adventures, and glamorous waterfronts. Visit the Burj Khalifa, explore souks, and take a sunset desert safari.',
        image: imageMap['Dubai'] || 'https://images.unsplash.com/photo-1512453693020-ce7e46f9e4c9?w=800&h=500&fit=crop',
        galleryImages: [
          'https://images.unsplash.com/photo-1496417263034-38ec4f0b665a?w=1200&h=800&fit=crop',
          'https://images.unsplash.com/photo-1526481280695-3c687fd643ed?w=800&h=600&fit=crop',
          'https://images.unsplash.com/photo-1496560736447-4f4a3e00b27b?w=800&h=600&fit=crop'
        ],
        highlights: [
          'Burj Khalifa observation deck experience',
          'Desert safari with dune bashing',
          'Old Dubai souk and creek tour',
          'Dubai Marina dhow cruise'
        ],
        includes: {
          included: ['Hotel stay', 'Airport transfers', 'Desert safari', 'Daily breakfast'],
          excluded: ['International flights', 'Personal shopping', 'Travel insurance']
        },
        importantInfo: {
          whatToBring: ['Sunglasses and sunscreen', 'Light breathable clothing', 'Photo ID'],
          notAllowed: ['Drones in city center', 'Outside food on tours']
        },
        bookingInfo: {
          duration: '8 days / 7 nights',
          cancellationPolicy: 'Free cancellation up to 72 hours before departure',
          reserveNowPayLater: true,
          originalPrice: 4100,
          discountedPrice: 3500
        },
        price: 3500,
        duration: 8
      },
      {
        name: 'Barcelona',
        country: 'Spain',
        description: 'City by the Sea',
        longDescription: 'Barcelona offers stunning architecture, beautiful beaches, delicious cuisine, and vibrant cultural scene.',
        fullDescription: 'Barcelona pairs Gaudi masterpieces with golden beaches and buzzing tapas bars. Discover the Gothic Quarter, enjoy seaside afternoons, and admire Sagrada Familia at golden hour.',
        image: imageMap['Barcelona'] || 'https://images.unsplash.com/photo-1562883676-8c6fbdf495c0?w=800&h=500&fit=crop',
        galleryImages: [
          'https://images.unsplash.com/photo-1464790719320-516ecd75af6c?w=1200&h=800&fit=crop',
          'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=600&fit=crop',
          'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=800&h=600&fit=crop'
        ],
        highlights: [
          'Gaudi architecture walk with local guide',
          'Tapas tasting in the Gothic Quarter',
          'Sunset at Barceloneta Beach',
          'Park Guell skip-the-line entry'
        ],
        includes: {
          included: ['Boutique hotel stay', 'City walking tour', 'Tapas tasting', 'Museum entry'],
          excluded: ['International flights', 'Personal expenses', 'Beach equipment rental']
        },
        importantInfo: {
          whatToBring: ['Light layers', 'Comfortable shoes', 'Reusable water bottle'],
          notAllowed: ['Glass bottles on the beach', 'Drones near landmarks']
        },
        bookingInfo: {
          duration: '5 days / 4 nights',
          cancellationPolicy: 'Free cancellation up to 24 hours before departure',
          reserveNowPayLater: false,
          originalPrice: 2150,
          discountedPrice: 1800
        },
        price: 1800,
        duration: 5
      },
      {
        name: 'Rome',
        country: 'Italy',
        description: 'Eternal City',
        longDescription: 'Rome is a living museum with ancient history at every corner. The Colosseum, Vatican, and Roman Forum await exploration.',
        fullDescription: 'Rome layers ancient ruins, Renaissance art, and lively piazzas into one unforgettable journey. Wander cobblestone lanes, savor trattoria dinners, and explore centuries of history on every block.',
        image: imageMap['Rome'] || 'https://images.unsplash.com/photo-1552832860-cfb67165eaf0?w=800&h=500&fit=crop',
        galleryImages: [
          'https://images.unsplash.com/photo-1552832860-cfb67165eaf0?w=1200&h=800&fit=crop',
          'https://images.unsplash.com/photo-1529154036614-a60975f5c760?w=800&h=600&fit=crop',
          'https://images.unsplash.com/photo-1526481280695-3c687fd643ed?w=800&h=600&fit=crop'
        ],
        highlights: [
          'Colosseum and Roman Forum guided entry',
          'Vatican Museums and Sistine Chapel visit',
          'Trastevere evening food walk',
          'Trevi Fountain and Spanish Steps stroll'
        ],
        includes: {
          included: ['Hotel stay', 'Skip-the-line Colosseum', 'Vatican guided tour', 'Daily breakfast'],
          excluded: ['International flights', 'City transport', 'Personal expenses']
        },
        importantInfo: {
          whatToBring: ['Comfortable shoes', 'Photo ID', 'Light scarf for churches'],
          notAllowed: ['Large backpacks in museums', 'Drones near monuments']
        },
        bookingInfo: {
          duration: '6 days / 5 nights',
          cancellationPolicy: 'Free cancellation up to 24 hours before departure',
          reserveNowPayLater: true,
          originalPrice: 2500,
          discountedPrice: 2100
        },
        price: 2100,
        duration: 6
      },
      {
        name: 'Amsterdam',
        country: 'Netherlands',
        description: 'City of Canals',
        longDescription: 'Amsterdam is known for its picturesque canals, historic architecture, world-class museums, and bicycle culture.',
        fullDescription: 'Amsterdam blends canal-side charm with cutting-edge design and art. Cruise the waterways, explore museum masterpieces, and cycle through leafy neighborhoods filled with cafes and markets.',
        image: imageMap['Amsterdam'] || 'https://images.unsplash.com/photo-1503784915596-c1581d0b3a19?w=800&h=500&fit=crop',
        galleryImages: [
          'https://images.unsplash.com/photo-1503784915596-c1581d0b3a19?w=1200&h=800&fit=crop',
          'https://images.unsplash.com/photo-1471899236350-e3016bf1e69c?w=800&h=600&fit=crop',
          'https://images.unsplash.com/photo-1449452198679-05c7fd30f416?w=800&h=600&fit=crop'
        ],
        highlights: [
          'Canal cruise through the historic ring',
          'Rijksmuseum and Van Gogh Museum time',
          'Jordaan district bike ride',
          'Albert Cuyp market food tasting'
        ],
        includes: {
          included: ['Hotel stay', 'Canal cruise tickets', 'Museum pass', 'Bike rental'],
          excluded: ['International flights', 'Personal expenses', 'Airport transfers']
        },
        importantInfo: {
          whatToBring: ['Light raincoat', 'Comfortable shoes', 'Photo ID'],
          notAllowed: ['Open alcohol on tours', 'Drones over canals']
        },
        bookingInfo: {
          duration: '4 days / 3 nights',
          cancellationPolicy: 'Free cancellation up to 24 hours before departure',
          reserveNowPayLater: false,
          originalPrice: 2300,
          discountedPrice: 1900
        },
        price: 1900,
        duration: 4
      },
      {
        name: 'Sydney',
        country: 'Australia',
        description: 'Harbor City',
        longDescription: 'Sydney is famous for its iconic Opera House, beautiful beaches, and vibrant harbor views.',
        fullDescription: 'Sydney offers harbor cruises, coastal walks, and golden beaches. From the Opera House to Bondi, the city mixes outdoorsy adventure with world-class dining and culture.',
        image: imageMap['Sydney'] || 'https://images.unsplash.com/photo-1506973404872-a4a41e1d267e?w=800&h=500&fit=crop',
        galleryImages: [
          'https://images.unsplash.com/photo-1506973404872-a4a41e1d267e?w=1200&h=800&fit=crop',
          'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=800&h=600&fit=crop',
          'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=800&h=600&fit=crop'
        ],
        highlights: [
          'Sydney Opera House guided tour',
          'Bondi to Coogee coastal walk',
          'Harbor cruise at sunset',
          'Manly Beach day trip'
        ],
        includes: {
          included: ['Hotel stay', 'Harbor cruise', 'Opera House tour', 'Daily breakfast'],
          excluded: ['International flights', 'Personal expenses', 'Travel insurance']
        },
        importantInfo: {
          whatToBring: ['Sunscreen', 'Reusable water bottle', 'Light jacket for evenings'],
          notAllowed: ['Drones near the harbor', 'Large luggage on tours']
        },
        bookingInfo: {
          duration: '8 days / 7 nights',
          cancellationPolicy: 'Free cancellation up to 48 hours before departure',
          reserveNowPayLater: true,
          originalPrice: 4550,
          discountedPrice: 3800
        },
        price: 3800,
        duration: 8
      },
      {
        name: 'Bangkok',
        country: 'Thailand',
        description: 'City of Angels',
        longDescription: 'Bangkok is a vibrant city with ornate temples, bustling street markets, and delicious street food.',
        fullDescription: 'Bangkok delivers golden temples, floating markets, and a street-food scene that never sleeps. Balance temple visits with rooftop views and late-night markets.',
        image: imageMap['Bangkok'] || 'https://images.unsplash.com/photo-1505953490908-58f5ab2e8f87?w=800&h=500&fit=crop',
        galleryImages: [
          'https://images.unsplash.com/photo-1505953490908-58f5ab2e8f87?w=1200&h=800&fit=crop',
          'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=800&h=600&fit=crop',
          'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=800&h=600&fit=crop'
        ],
        highlights: [
          'Grand Palace and Wat Pho tour',
          'Chao Phraya river boat ride',
          'Street food tasting in Chinatown',
          'Floating market morning visit'
        ],
        includes: {
          included: ['Hotel stay', 'Temple tour', 'River boat tickets', 'Street food tasting'],
          excluded: ['International flights', 'Personal expenses', 'Optional excursions']
        },
        importantInfo: {
          whatToBring: ['Modest clothing for temples', 'Comfortable sandals', 'Cash for markets'],
          notAllowed: ['Shorts inside temples', 'Drones near the palace']
        },
        bookingInfo: {
          duration: '5 days / 4 nights',
          cancellationPolicy: 'Free cancellation up to 24 hours before departure',
          reserveNowPayLater: false,
          originalPrice: 1800,
          discountedPrice: 1500
        },
        price: 1500,
        duration: 5
      },
      {
        name: 'Venice',
        country: 'Italy',
        description: 'City of Canals',
        longDescription: 'Venice is a magical city built on water with stunning Renaissance architecture and romantic gondola rides.',
        fullDescription: 'Venice is a floating maze of canals, palazzos, and hidden courtyards. Glide on gondolas, sip espresso in historic cafes, and explore artisan workshops.',
        image: imageMap['Venice'] || 'https://images.unsplash.com/photo-1495576066215-137a3bf13a5f?w=800&h=500&fit=crop',
        galleryImages: [
          'https://images.unsplash.com/photo-1495576066215-137a3bf13a5f?w=1200&h=800&fit=crop',
          'https://images.unsplash.com/photo-1501876725168-00c445821c9e?w=800&h=600&fit=crop',
          'https://images.unsplash.com/photo-1470123808288-1e59739bedd8?w=800&h=600&fit=crop'
        ],
        highlights: [
          'Gondola ride through the Grand Canal',
          'St Marks Basilica and Doges Palace tour',
          'Murano glass artisan visit',
          'Sunset walk across Rialto Bridge'
        ],
        includes: {
          included: ['Hotel stay', 'Gondola ride', 'Walking tour', 'Daily breakfast'],
          excluded: ['International flights', 'Museum tickets', 'Personal expenses']
        },
        importantInfo: {
          whatToBring: ['Comfortable shoes', 'Light raincoat', 'Photo ID'],
          notAllowed: ['Large luggage on boats', 'Drones in historic center']
        },
        bookingInfo: {
          duration: '5 days / 4 nights',
          cancellationPolicy: 'Free cancellation up to 24 hours before departure',
          reserveNowPayLater: true,
          originalPrice: 2750,
          discountedPrice: 2300
        },
        price: 2300,
        duration: 5
      },
      {
        name: 'Singapore',
        country: 'Singapore',
        description: 'Lion City',
        longDescription: 'Singapore is a modern metropolis with futuristic architecture, diverse culture, and world-class infrastructure.',
        fullDescription: 'Singapore pairs skyline views with lush gardens and legendary hawker food. Explore Marina Bay, discover cultural enclaves, and enjoy seamless transit across the city.',
        image: imageMap['Singapore'] || 'https://images.unsplash.com/photo-1515731566361-fdb1e7cecb84?w=800&h=500&fit=crop',
        galleryImages: [
          'https://images.unsplash.com/photo-1515731566361-fdb1e7cecb84?w=1200&h=800&fit=crop',
          'https://images.unsplash.com/photo-1494526585095-c41746248156?w=800&h=600&fit=crop',
          'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&h=600&fit=crop'
        ],
        highlights: [
          'Gardens by the Bay evening lights',
          'Marina Bay skyline walk',
          'Hawker center tasting tour',
          'Sentosa Island beach time'
        ],
        includes: {
          included: ['Hotel stay', 'Gardens tickets', 'Metro card', 'Food tasting'],
          excluded: ['International flights', 'Personal expenses', 'Travel insurance']
        },
        importantInfo: {
          whatToBring: ['Light breathable clothing', 'Travel adapter', 'Photo ID'],
          notAllowed: ['Chewing gum import', 'Drones near airport']
        },
        bookingInfo: {
          duration: '4 days / 3 nights',
          cancellationPolicy: 'Free cancellation up to 24 hours before departure',
          reserveNowPayLater: true,
          originalPrice: 2850,
          discountedPrice: 2400
        },
        price: 2400,
        duration: 4
      },
      {
        name: 'Berlin',
        country: 'Germany',
        description: 'City of Culture',
        longDescription: 'Berlin is a vibrant city with rich history, street art, museums, and a thriving nightlife scene.',
        fullDescription: 'Berlin mixes storied history with a bold creative scene. Explore the Berlin Wall, museum collections, and neighborhood food spots that define its modern edge.',
        image: imageMap['Berlin'] || 'https://images.unsplash.com/photo-1579537193181-5c79c4ed3a19?w=800&h=500&fit=crop',
        galleryImages: [
          'https://images.unsplash.com/photo-1579537193181-5c79c4ed3a19?w=1200&h=800&fit=crop',
          'https://images.unsplash.com/photo-1471879832106-c7ab9e0cee23?w=800&h=600&fit=crop',
          'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=800&h=600&fit=crop'
        ],
        highlights: [
          'Berlin Wall memorial and East Side Gallery',
          'Museum Island day pass entry',
          'Street art walk in Kreuzberg',
          'Checkpoint Charlie and historic sites'
        ],
        includes: {
          included: ['Hotel stay', 'Museum pass', 'Walking tour', 'Transit day pass'],
          excluded: ['International flights', 'Personal expenses', 'Nightlife tickets']
        },
        importantInfo: {
          whatToBring: ['Comfortable shoes', 'Weather layers', 'Cash for smaller cafes'],
          notAllowed: ['Tripods in museums', 'Drones near memorials']
        },
        bookingInfo: {
          duration: '4 days / 3 nights',
          cancellationPolicy: 'Free cancellation up to 24 hours before departure',
          reserveNowPayLater: false,
          originalPrice: 2100,
          discountedPrice: 1700
        },
        price: 1700,
        duration: 4
      },
      {
        name: 'Istanbul',
        country: 'Turkey',
        description: 'Bridge Between Continents',
        longDescription: 'Istanbul straddles Europe and Asia with stunning mosques, bustling bazaars, and rich Ottoman heritage.',
        fullDescription: 'Istanbul blends layers of empire with buzzing markets and waterfront promenades. Discover iconic mosques, sip tea along the Bosphorus, and wander historic bazaars.',
        image: imageMap['Istanbul'] || 'https://images.unsplash.com/photo-1495845842352-d6c1b2e6f37d?w=800&h=500&fit=crop',
        galleryImages: [
          'https://images.unsplash.com/photo-1495845842352-d6c1b2e6f37d?w=1200&h=800&fit=crop',
          'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=800&h=600&fit=crop',
          'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&h=600&fit=crop'
        ],
        highlights: [
          'Hagia Sophia and Blue Mosque tour',
          'Grand Bazaar shopping time',
          'Bosphorus sunset cruise',
          'Spice market tasting stops'
        ],
        includes: {
          included: ['Hotel stay', 'Old city tour', 'Bosphorus cruise', 'Daily breakfast'],
          excluded: ['International flights', 'Personal expenses', 'Museum tickets']
        },
        importantInfo: {
          whatToBring: ['Scarf for mosque visits', 'Comfortable shoes', 'Cash for bazaars'],
          notAllowed: ['Large bags in mosques', 'Drones near historic sites']
        },
        bookingInfo: {
          duration: '5 days / 4 nights',
          cancellationPolicy: 'Free cancellation up to 24 hours before departure',
          reserveNowPayLater: true,
          originalPrice: 1950,
          discountedPrice: 1600
        },
        price: 1600,
        duration: 5
      },
      {
        name: 'Montreal',
        country: 'Canada',
        description: 'Paris of North America',
        longDescription: 'Montreal is a vibrant city with European charm, world-class restaurants, and diverse cultural attractions.',
        fullDescription: 'Montreal blends historic streets with a thriving food scene and creative festivals. Explore Old Montreal, sample local cuisine, and enjoy waterfront views.',
        image: imageMap['Montreal'] || 'https://images.unsplash.com/photo-1523632913763-5f765fb37a4f?w=800&h=500&fit=crop',
        galleryImages: [
          'https://images.unsplash.com/photo-1523632913763-5f765fb37a4f?w=1200&h=800&fit=crop',
          'https://images.unsplash.com/photo-1449452198679-05c7fd30f416?w=800&h=600&fit=crop',
          'https://images.unsplash.com/photo-1471899236350-e3016bf1e69c?w=800&h=600&fit=crop'
        ],
        highlights: [
          'Old Montreal walking tour',
          'Jean-Talon Market tastings',
          'Mount Royal lookout views',
          'Old Port riverfront evening stroll'
        ],
        includes: {
          included: ['Boutique hotel stay', 'Food tasting', 'Local guide', 'Transit day pass'],
          excluded: ['International flights', 'Personal expenses', 'Museum tickets']
        },
        importantInfo: {
          whatToBring: ['Layered clothing', 'Comfortable shoes', 'Photo ID'],
          notAllowed: ['Large luggage on tours', 'Drones in old port']
        },
        bookingInfo: {
          duration: '4 days / 3 nights',
          cancellationPolicy: 'Free cancellation up to 24 hours before departure',
          reserveNowPayLater: true,
          originalPrice: 2450,
          discountedPrice: 2000
        },
        price: 2000,
        duration: 4
      },
      {
        name: 'Vienna',
        country: 'Austria',
        description: 'City of Music',
        longDescription: 'Vienna is the elegant capital of Austria, famous for its classical music, imperial palaces, and coffee culture.',
        fullDescription: 'Vienna pairs imperial palaces with refined cafes and music halls. Explore Schonbrunn Palace, stroll grand boulevards, and savor classic pastries.',
        image: imageMap['Vienna'] || 'https://images.unsplash.com/photo-1516152097086-502d7f618e70?w=800&h=500&fit=crop',
        galleryImages: [
          'https://images.unsplash.com/photo-1516152097086-502d7f618e70?w=1200&h=800&fit=crop',
          'https://images.unsplash.com/photo-1471879832106-c7ab9e0cee23?w=800&h=600&fit=crop',
          'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=800&h=600&fit=crop'
        ],
        highlights: [
          'Schonbrunn Palace guided tour',
          'Vienna State Opera evening option',
          'Coffeehouse tasting experience',
          'Historic Ringstrasse walk'
        ],
        includes: {
          included: ['Hotel stay', 'Palace entry tickets', 'Coffee tasting', 'Daily breakfast'],
          excluded: ['International flights', 'Concert tickets', 'Personal expenses']
        },
        importantInfo: {
          whatToBring: ['Smart casual attire', 'Comfortable shoes', 'Photo ID'],
          notAllowed: ['Flash photography in museums', 'Drones near palaces']
        },
        bookingInfo: {
          duration: '5 days / 4 nights',
          cancellationPolicy: 'Free cancellation up to 24 hours before departure',
          reserveNowPayLater: true,
          originalPrice: 2500,
          discountedPrice: 2000
        },
        price: 2000,
        duration: 5
      },
      { name: 'Prague', country: 'Czech Republic', description: 'City of 100 Spires', longDescription: 'Prague is a picturesque city with medieval architecture, Gothic bridges, and vibrant beer culture.', image: imageMap['Prague'] || 'https://images.unsplash.com/photo-1508602912369-cf0f3a3b5601?w=800&h=500&fit=crop', price: 1400, duration: 4 },
      { name: 'Budapest', country: 'Hungary', description: 'Pearl of the Danube', longDescription: 'Budapest offers thermal baths, stunning architecture, and romantic views of the Danube River.', image: imageMap['Budapest'] || 'https://images.unsplash.com/photo-1517623407522-67d69e7127a3?w=800&h=500&fit=crop', price: 1300, duration: 4 },
      { name: 'Madrid', country: 'Spain', description: 'City of Art', longDescription: 'Madrid is a lively capital with world-class museums, parks, and vibrant nightlife and tapas culture.', image: imageMap['Madrid'] || 'https://images.unsplash.com/photo-1515728289063-d5dc12a5e3db?w=800&h=500&fit=crop', price: 1900, duration: 4 },
      { name: 'Athens', country: 'Greece', description: 'Ancient Wonder', longDescription: 'Athens is home to ancient Greek ruins, including the Acropolis, and vibrant contemporary culture.', image: imageMap['Athens'] || 'https://images.unsplash.com/photo-1522100205226-994b219c77d3?w=800&h=500&fit=crop', price: 1500, duration: 4 },
      { name: 'Bali', country: 'Indonesia', description: 'Island Paradise', longDescription: 'Bali offers stunning beaches, ancient temples, lush rice terraces, and affordable luxury resorts.', image: imageMap['Bali'] || 'https://images.unsplash.com/photo-1511920170033-f8396924c348?w=800&h=500&fit=crop', price: 1200, duration: 7 },
      { name: 'Ho Chi Minh City', country: 'Vietnam', description: 'Saigon Spirit', longDescription: 'Ho Chi Minh City is a bustling metropolis with colonial architecture, temples, and vibrant street life.', image: imageMap['Ho Chi Minh City'] || 'https://images.unsplash.com/photo-1514432324607-2e467f4af445?w=800&h=500&fit=crop', price: 900, duration: 5 },
      { name: 'Hanoi', country: 'Vietnam', description: 'Red River Capital', longDescription: 'Hanoi is Vietnam\'s ancient capital with traditional pagodas, bustling markets, and rich cultural heritage.', image: imageMap['Hanoi'] || 'https://images.unsplash.com/photo-1527529482837-4698179dc6ce?w=800&h=500&fit=crop', price: 800, duration: 5 },
      { name: 'Bangkok', country: 'Thailand', description: 'Temple Capital', longDescription: 'Bangkok dazzles with golden temples, floating markets, and extraordinary street food experiences.', image: imageMap['Bangkok'] || 'https://images.unsplash.com/photo-1506595046336-338483c9a407?w=800&h=500&fit=crop', price: 1400, duration: 5 },
      { name: 'Phuket', country: 'Thailand', description: 'Tropical Haven', longDescription: 'Phuket offers pristine beaches, island hopping, water sports, and vibrant nightlife.', image: imageMap['Phuket'] || 'https://images.unsplash.com/photo-1503896614597-7f6a7c1d8e4f?w=800&h=500&fit=crop', price: 1100, duration: 6 },
      { name: 'Chiang Mai', country: 'Thailand', description: 'Rose of the North', longDescription: 'Chiang Mai is home to over 300 temples and offers authentic Thai culture away from crowds.', image: imageMap['Chiang Mai'] || 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=500&fit=crop', price: 700, duration: 5 },
      { name: 'Krabi', country: 'Thailand', description: 'Limestone Cliffs', longDescription: 'Krabi features dramatic limestone formations, pristine beaches, and paradise islands.', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=500&fit=crop', price: 950, duration: 5 },
      { name: 'Boracay', country: 'Philippines', description: 'White Sand Paradise', longDescription: 'Boracay is renowned for its stunning white-sand beaches and exciting water sports activities.', image: 'https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=800&h=500&fit=crop', price: 1000, duration: 5 },
      { name: 'Manila', country: 'Philippines', description: 'Pearl of the Orient', longDescription: 'Manila is the vibrant capital with historic sites, museums, shopping, and delicious food.', image: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&h=500&fit=crop', price: 800, duration: 4 },
      { name: 'Kuala Lumpur', country: 'Malaysia', description: 'Twin Towers City', longDescription: 'Kuala Lumpur is known for its Petronas Twin Towers, diverse culture, and excellent shopping.', image: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=800&h=500&fit=crop', price: 1200, duration: 4 },
      { name: 'Penang', country: 'Malaysia', description: 'Pearl of the Orient', longDescription: 'Penang offers heritage sites, street food paradise, temples, and beautiful coastal views.', image: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe3e?w=800&h=500&fit=crop', price: 800, duration: 4 },
      { name: 'Mumbai', country: 'India', description: 'Bollywood City', longDescription: 'Mumbai is India\'s dynamic financial hub with historic monuments, museums, and vibrant culture.', image: 'https://images.unsplash.com/photo-1489749798305-4fea3ba63d60?w=800&h=500&fit=crop', price: 1000, duration: 4 },
      { name: 'Delhi', country: 'India', description: 'Capital of Empires', longDescription: 'Delhi combines ancient history with modern development, featuring monuments, museums, and markets.', image: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=800&h=500&fit=crop', price: 900, duration: 4 },
      { name: 'Jaipur', country: 'India', description: 'Pink City', longDescription: 'Jaipur is famous for its pink-colored architecture, palaces, and proximity to Taj Mahal.', image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&h=500&fit=crop', price: 700, duration: 3 },
      { name: 'Agra', country: 'India', description: 'Taj Mahal City', longDescription: 'Agra is home to the magnificent Taj Mahal and offers historical monuments and cultural experiences.', image: 'https://images.unsplash.com/photo-1487180144351-b8472da7d491?w=800&h=500&fit=crop', price: 600, duration: 2 },
      { name: 'Bangkok', country: 'Thailand', description: 'The Grand Palace', longDescription: 'Explore the stunning Grand Palace and ancient temples in the heart of Bangkok.', image: 'https://images.unsplash.com/photo-1506704720897-c6b0b8ef6dba?w=800&h=500&fit=crop', price: 1200, duration: 4 },
      { name: 'Goa', country: 'India', description: 'Beach Paradise', longDescription: 'Goa offers beautiful beaches, Portuguese heritage, water sports, and vibrant nightlife.', image: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=800&h=500&fit=crop', price: 800, duration: 5 },
      { name: 'Varanasi', country: 'India', description: 'Spiritual Heart', longDescription: 'Varanasi is one of the world\'s oldest cities and is deeply sacred in Hinduism with ghats and temples.', image: 'https://images.unsplash.com/photo-1512453695157-3189715a6ede?w=800&h=500&fit=crop', price: 500, duration: 3 },
      { name: 'Bangkok', country: 'Thailand', description: 'Floating Markets', longDescription: 'Experience Bangkok\'s unique floating markets with traditional wooden boats and local commerce.', image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=500&fit=crop', price: 1100, duration: 3 },
      { name: 'Seoul', country: 'South Korea', description: 'Modern Metropolis', longDescription: 'Seoul blends traditional temples with ultramodern skyscrapers, K-pop culture, and street food.', image: 'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?w=800&h=500&fit=crop', price: 1600, duration: 5 },
      { name: 'Busan', country: 'South Korea', description: 'Coastal Beauty', longDescription: 'Busan is South Korea\'s major port city with beaches, temples, and vibrant nightlife.', image: 'https://images.unsplash.com/photo-1552883361-0ceea2bfb6a6?w=800&h=500&fit=crop', price: 1300, duration: 4 },
      { name: 'Jeju', country: 'South Korea', description: 'Island Paradise', longDescription: 'Jeju is a volcanic island with natural beauty, beaches, hiking, and unique cultural attractions.', image: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=800&h=500&fit=crop', price: 1200, duration: 4 },
      { name: 'Beijing', country: 'China', description: 'Forbidden City', longDescription: 'Beijing is home to the Great Wall, Forbidden City, and is a center of Chinese culture and history.', image: 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=800&h=500&fit=crop', price: 1500, duration: 5 },
      { name: 'Shanghai', country: 'China', description: 'Oriental Pearl', longDescription: 'Shanghai is a modern metropolis with futuristic architecture, shopping, and vibrant nightlife.', image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&h=500&fit=crop', price: 1700, duration: 4 },
      { name: 'Xi\'an', country: 'China', description: 'Terracotta Army', longDescription: 'Xi\'an is home to the famous Terracotta Army and was the ancient capital of China.', image: 'https://images.unsplash.com/photo-1532606612682-5d1e4d4dbc5a?w=800&h=500&fit=crop', price: 1000, duration: 3 },
      { name: 'Guilin', country: 'China', description: 'Karst Mountains', longDescription: 'Guilin is famous for its stunning karst mountains, Li River cruises, and picturesque landscapes.', image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=500&fit=crop', price: 1200, duration: 4 },
      { name: 'Hong Kong', country: 'China', description: 'Harbor City', longDescription: 'Hong Kong is a vibrant metropolis with stunning harbor views, shopping, food, and culture.', image: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=800&h=500&fit=crop', price: 2000, duration: 4 },
      { name: 'Macau', country: 'China', description: 'Las Vegas of Asia', longDescription: 'Macau is known for its casinos, Portuguese heritage architecture, and luxury shopping.', image: 'https://images.unsplash.com/photo-1452971377150-8e3f94a04fe5?w=800&h=500&fit=crop', price: 1500, duration: 3 },
      { name: 'Moscow', country: 'Russia', description: 'Red Square Capital', longDescription: 'Moscow is the capital of Russia featuring Red Square, the Kremlin, and traditional Russian culture.', image: 'https://images.unsplash.com/photo-1510606267537-b50d2eca5b25?w=800&h=500&fit=crop', price: 1800, duration: 5 },
      { name: 'St. Petersburg', country: 'Russia', description: 'Venice of the North', longDescription: 'St. Petersburg is a beautiful city with palaces, canals, museums, and rich imperial history.', image: 'https://images.unsplash.com/photo-1501785888041-af3ee9c470a0?w=800&h=500&fit=crop', price: 1600, duration: 5 },
      { name: 'Lisbon', country: 'Portugal', description: 'City of 7 Hills', longDescription: 'Lisbon is a charming city with historic tiles, pastéis de nata, riverside views, and vibrant culture.', image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=500&fit=crop', price: 1500, duration: 4 },
      { name: 'Porto', country: 'Portugal', description: 'Port Wine City', longDescription: 'Porto is famous for its port wine, riverside ribeira district, and picturesque old town.', image: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=800&h=500&fit=crop', price: 1200, duration: 3 },
      { name: 'Marseille', country: 'France', description: 'Mediterranean Port', longDescription: 'Marseille offers Mediterranean beaches, seafood cuisine, and vibrant Provençal culture.', image: 'https://images.unsplash.com/photo-1506704720897-c6b0b8ef6dba?w=800&h=500&fit=crop', price: 1400, duration: 4 },
      { name: 'Lyon', country: 'France', description: 'Gastronomic Capital', longDescription: 'Lyon is a UNESCO World Heritage city known for Renaissance architecture and fine cuisine.', image: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=800&h=500&fit=crop', price: 1300, duration: 3 },
      { name: 'Nice', country: 'France', description: 'French Riviera', longDescription: 'Nice offers beautiful beaches, Mediterranean climate, and Belle Époque architecture.', image: 'https://images.unsplash.com/photo-1512453695157-3189715a6ede?w=800&h=500&fit=crop', price: 1600, duration: 4 },
      { name: 'Geneva', country: 'Switzerland', description: 'Peace City', longDescription: 'Geneva is a cosmopolitan city with the United Nations, lake views, and international culture.', image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=500&fit=crop', price: 2500, duration: 4 },
      { name: 'Zurich', country: 'Switzerland', description: 'Financial Hub', longDescription: 'Zurich is a prosperous city with museums, shopping, and beautiful lakeside setting.', image: 'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?w=800&h=500&fit=crop', price: 2400, duration: 4 },
      { name: 'Interlaken', country: 'Switzerland', description: 'Alpine Adventure', longDescription: 'Interlaken is an adventure hub in the Swiss Alps, perfect for hiking, skiing, and scenic beauty.', image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=500&fit=crop', price: 2200, duration: 5 },
      { name: 'Lucerne', country: 'Switzerland', description: 'Alpine Gem', longDescription: 'Lucerne features a picturesque old town, Chapel Bridge, and views of Swiss mountains.', image: 'https://images.unsplash.com/photo-1506704720897-c6b0b8ef6dba?w=800&h=500&fit=crop', price: 2100, duration: 4 },
      { name: 'Barcelona', country: 'Spain', description: 'Gaudí Architecture', longDescription: 'Barcelona is famous for Sagrada Familia, Park Güell, and Mediterranean beaches.', image: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=800&h=500&fit=crop', price: 1900, duration: 5 },
      { name: 'Valencia', country: 'Spain', description: 'City of Arts', longDescription: 'Valencia features the futuristic City of Arts and Sciences and is a beach resort destination.', image: 'https://images.unsplash.com/photo-1512453695157-3189715a6ede?w=800&h=500&fit=crop', price: 1500, duration: 4 },
      { name: 'Seville', country: 'Spain', description: 'Flamenco City', longDescription: 'Seville is the birthplace of flamenco with historic architecture, Cathedral, and vibrant culture.', image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=500&fit=crop', price: 1300, duration: 4 },
      { name: 'Granada', country: 'Spain', description: 'Alhambra Palace', longDescription: 'Granada is home to the stunning Alhambra Palace and offers Moorish heritage and tapas.', image: 'https://images.unsplash.com/photo-1506704720897-c6b0b8ef6dba?w=800&h=500&fit=crop', price: 1100, duration: 3 },
      { name: 'Brussels', country: 'Belgium', description: 'Capital of Europe', longDescription: 'Brussels features Grand Place, Belgian chocolate, beer, and serves as the EU capital.', image: 'https://images.unsplash.com/photo-1506704720897-c6b0b8ef6dba?w=800&h=500&fit=crop', price: 1400, duration: 3 },
      { name: 'Bruges', country: 'Belgium', description: 'Medieval Venice', longDescription: 'Bruges is a fairy-tale town with medieval architecture, canals, and charming cobblestone streets.', image: 'https://images.unsplash.com/photo-1506704720897-c6b0b8ef6dba?w=800&h=500&fit=crop', price: 1200, duration: 2 },
      { name: 'Antwerp', country: 'Belgium', description: 'Diamond City', longDescription: 'Antwerp is known for diamonds, fashion, museums, and Renaissance architecture.', image: 'https://images.unsplash.com/photo-1506704720897-c6b0b8ef6dba?w=800&h=500&fit=crop', price: 1300, duration: 3 },
      { name: 'Copenhagen', country: 'Denmark', description: 'Little Mermaid City', longDescription: 'Copenhagen is known for hygge, colorful Nyhavn, Tivoli Gardens, and Scandinavian design.', image: 'https://images.unsplash.com/photo-1506704720897-c6b0b8ef6dba?w=800&h=500&fit=crop', price: 1800, duration: 4 },
      { name: 'Stockholm', country: 'Sweden', description: 'Venice of the North', longDescription: 'Stockholm is built on 14 islands with historic Old Town, museums, and beautiful archipelago.', image: 'https://images.unsplash.com/photo-1506704720897-c6b0b8ef6dba?w=800&h=500&fit=crop', price: 2000, duration: 4 },
      { name: 'Oslo', country: 'Norway', description: 'Viking City', longDescription: 'Oslo offers Viking ships, museums, modern architecture, and views of fjords and forests.', image: 'https://images.unsplash.com/photo-1506704720897-c6b0b8ef6dba?w=800&h=500&fit=crop', price: 1900, duration: 4 },
      { name: 'Bergen', country: 'Norway', description: 'Gateway to Fjords', longDescription: 'Bergen is a charming port city with colorful Bryggen district and access to Norwegian fjords.', image: 'https://images.unsplash.com/photo-1506704720897-c6b0b8ef6dba?w=800&h=500&fit=crop', price: 1700, duration: 4 },
      { name: 'Helsinki', country: 'Finland', description: 'Baltic Beauty', longDescription: 'Helsinki offers modern architecture, museums, saunas, and beautiful coastal setting.', image: 'https://images.unsplash.com/photo-1506704720897-c6b0b8ef6dba?w=800&h=500&fit=crop', price: 1600, duration: 4 },
      { name: 'Tallinn', country: 'Estonia', description: 'Medieval Old Town', longDescription: 'Tallinn features a perfectly preserved medieval Old Town and offers digital innovation.', image: 'https://images.unsplash.com/photo-1506704720897-c6b0b8ef6dba?w=800&h=500&fit=crop', price: 1000, duration: 3 },
      { name: 'Riga', country: 'Latvia', description: 'Art Nouveau Capital', longDescription: 'Riga is famous for Art Nouveau architecture, old town charm, and vibrant cultural scene.', image: 'https://images.unsplash.com/photo-1506704720897-c6b0b8ef6dba?w=800&h=500&fit=crop', price: 1000, duration: 3 },
      { name: 'Vilnius', country: 'Lithuania', description: 'Baroque Beauty', longDescription: 'Vilnius features Baroque architecture, hillside castles, and a charming historic old town.', image: 'https://images.unsplash.com/photo-1506704720897-c6b0b8ef6dba?w=800&h=500&fit=crop', price: 900, duration: 3 },
      { name: 'Krakow', country: 'Poland', description: 'Historic Treasure', longDescription: 'Krakow is a beautiful medieval city with historic square, Wawel Castle, and rich Polish culture.', image: 'https://images.unsplash.com/photo-1506704720897-c6b0b8ef6dba?w=800&h=500&fit=crop', price: 1100, duration: 4 },
      { name: 'Warsaw', country: 'Poland', description: 'Phoenix City', longDescription: 'Warsaw is Poland\'s dynamic capital with museums, historic sites, and thriving modern culture.', image: 'https://images.unsplash.com/photo-1506704720897-c6b0b8ef6dba?w=800&h=500&fit=crop', price: 1200, duration: 4 },
      { name: 'Dubrovnik', country: 'Croatia', description: 'Pearl of the Adriatic', longDescription: 'Dubrovnik is a stunning medieval city on the Adriatic coast with red-tiled roofs and ancient walls.', image: 'https://images.unsplash.com/photo-1506704720897-c6b0b8ef6dba?w=800&h=500&fit=crop', price: 1400, duration: 4 },
      { name: 'Split', country: 'Croatia', description: 'Roman Palace City', longDescription: 'Split features Diocletian\'s Palace and is a gateway to Croatian islands and beaches.', image: 'https://images.unsplash.com/photo-1506704720897-c6b0b8ef6dba?w=800&h=500&fit=crop', price: 1200, duration: 4 },
      { name: 'Zadar', country: 'Croatia', description: 'Dalmatian Gem', longDescription: 'Zadar is an ancient port city with Sea Organ, museums, and beautiful Adriatic views.', image: 'https://images.unsplash.com/photo-1506704720897-c6b0b8ef6dba?w=800&h=500&fit=crop', price: 900, duration: 3 },
      { name: 'Cairo', country: 'Egypt', description: 'Pyramids City', longDescription: 'Cairo is home to the Pyramids of Giza, Sphinx, museums, and the vibrant Nile culture.', image: 'https://images.unsplash.com/photo-1506704720897-c6b0b8ef6dba?w=800&h=500&fit=crop', price: 1200, duration: 5 },
      { name: 'Alexandria', country: 'Egypt', description: 'Mediterranean Pearl', longDescription: 'Alexandria is an ancient Mediterranean port city with Pharaonic heritage and coastal beauty.', image: 'https://images.unsplash.com/photo-1506704720897-c6b0b8ef6dba?w=800&h=500&fit=crop', price: 1000, duration: 3 },
      { name: 'Marrakech', country: 'Morocco', description: 'Red City', longDescription: 'Marrakech features vibrant medinas, stunning palaces, souks, and is a gateway to Sahara.', image: 'https://images.unsplash.com/photo-1506704720897-c6b0b8ef6dba?w=800&h=500&fit=crop', price: 1100, duration: 4 },
      { name: 'Fez', country: 'Morocco', description: 'Medieval Medina', longDescription: 'Fez has the world\'s oldest university and features a labyrinthine medieval medina.', image: 'https://images.unsplash.com/photo-1506704720897-c6b0b8ef6dba?w=800&h=500&fit=crop', price: 800, duration: 3 },
      { name: 'Casablanca', country: 'Morocco', description: 'White City', longDescription: 'Casablanca is a modern Moroccan city with Hassan II Mosque, beaches, and cultural blend.', image: 'https://images.unsplash.com/photo-1506704720897-c6b0b8ef6dba?w=800&h=500&fit=crop', price: 1000, duration: 3 },
      { name: 'Tangier', country: 'Morocco', description: 'Gateway City', longDescription: 'Tangier is a coastal city where Africa and Europe meet, with beaches and historic medina.', image: 'https://images.unsplash.com/photo-1506704720897-c6b0b8ef6dba?w=800&h=500&fit=crop', price: 900, duration: 3 },
      { name: 'Cape Town', country: 'South Africa', description: 'Mother City', longDescription: 'Cape Town offers Table Mountain views, beautiful beaches, wine country, and vibrant culture.', image: 'https://images.unsplash.com/photo-1506704720897-c6b0b8ef6dba?w=800&h=500&fit=crop', price: 1800, duration: 5 },
      { name: 'Johannesburg', country: 'South Africa', description: 'City of Gold', longDescription: 'Johannesburg is South Africa\'s largest city with museums, galleries, and cultural heritage.', image: 'https://images.unsplash.com/photo-1506704720897-c6b0b8ef6dba?w=800&h=500&fit=crop', price: 1500, duration: 4 },
      { name: 'Los Angeles', country: 'USA', description: 'City of Angels', longDescription: 'Los Angeles is famous for Hollywood, beaches, entertainment, and year-round sunshine.', image: 'https://images.unsplash.com/photo-1506704720897-c6b0b8ef6dba?w=800&h=500&fit=crop', price: 2500, duration: 5 },
      { name: 'San Francisco', country: 'USA', description: 'Golden Gate City', longDescription: 'San Francisco is known for the Golden Gate Bridge, fog, tech scene, and vibrant neighborhoods.', image: 'https://images.unsplash.com/photo-1506704720897-c6b0b8ef6dba?w=800&h=500&fit=crop', price: 2400, duration: 4 },
      { name: 'Las Vegas', country: 'USA', description: 'Sin City', longDescription: 'Las Vegas is famous for casinos, shows, nightlife, and entertainment in the Nevada desert.', image: 'https://images.unsplash.com/photo-1506704720897-c6b0b8ef6dba?w=800&h=500&fit=crop', price: 1800, duration: 4 },
      { name: 'Miami', country: 'USA', description: 'Magic City', longDescription: 'Miami offers beautiful beaches, Art Deco architecture, Latin culture, and vibrant nightlife.', image: 'https://images.unsplash.com/photo-1506704720897-c6b0b8ef6dba?w=800&h=500&fit=crop', price: 2000, duration: 4 },
      { name: 'Boston', country: 'USA', description: 'Cradle of Liberty', longDescription: 'Boston is known for its rich history, universities, sports, and Northeast charm.', image: 'https://images.unsplash.com/photo-1506704720897-c6b0b8ef6dba?w=800&h=500&fit=crop', price: 1900, duration: 4 },
      { name: 'Chicago', country: 'USA', description: 'Windy City', longDescription: 'Chicago features stunning architecture, museums, deep-dish pizza, and Lake Michigan beaches.', image: 'https://images.unsplash.com/photo-1506704720897-c6b0b8ef6dba?w=800&h=500&fit=crop', price: 1800, duration: 4 },
      { name: 'New Orleans', country: 'USA', description: 'Jazz City', longDescription: 'New Orleans is famous for jazz, Mardi Gras, Creole cuisine, and vibrant street culture.', image: 'https://images.unsplash.com/photo-1506704720897-c6b0b8ef6dba?w=800&h=500&fit=crop', price: 1500, duration: 4 },
      { name: 'Washington DC', country: 'USA', description: 'Capital City', longDescription: 'Washington DC offers free museums, monuments, historic sites, and political heritage.', image: 'https://images.unsplash.com/photo-1506704720897-c6b0b8ef6dba?w=800&h=500&fit=crop', price: 1600, duration: 3 },
      { name: 'Toronto', country: 'Canada', description: 'City of Diversity', longDescription: 'Toronto is Canada\'s largest city with CN Tower, museums, diverse neighborhoods, and culture.', image: 'https://images.unsplash.com/photo-1506704720897-c6b0b8ef6dba?w=800&h=500&fit=crop', price: 1900, duration: 4 },
      { name: 'Vancouver', country: 'Canada', description: 'Rainier City', longDescription: 'Vancouver combines mountains, oceans, and city life with beautiful outdoor recreation.', image: 'https://images.unsplash.com/photo-1506704720897-c6b0b8ef6dba?w=800&h=500&fit=crop', price: 1700, duration: 4 },
      { name: 'Rio de Janeiro', country: 'Brazil', description: 'Marvelous City', longDescription: 'Rio is famous for Christ the Redeemer statue, Carnival, beaches, and vibrant carioca culture.', image: 'https://images.unsplash.com/photo-1506704720897-c6b0b8ef6dba?w=800&h=500&fit=crop', price: 1800, duration: 5 },
      { name: 'São Paulo', country: 'Brazil', description: 'Brazilian Metropolis', longDescription: 'São Paulo is Brazil\'s largest city with art museums, restaurants, nightlife, and urban energy.', image: 'https://images.unsplash.com/photo-1506704720897-c6b0b8ef6dba?w=800&h=500&fit=crop', price: 1600, duration: 4 },
      { name: 'Salvador', country: 'Brazil', description: 'Bahian Culture', longDescription: 'Salvador is Brazil\'s historic capital with colonial architecture, beaches, and Afro-Brazilian culture.', image: 'https://images.unsplash.com/photo-1506704720897-c6b0b8ef6dba?w=800&h=500&fit=crop', price: 1200, duration: 4 },
      { name: 'Recife', country: 'Brazil', description: 'Venice of Brazil', longDescription: 'Recife is a historic port city with waterways, beaches, and distinctive pernambuco culture.', image: 'https://images.unsplash.com/photo-1506704720897-c6b0b8ef6dba?w=800&h=500&fit=crop', price: 1100, duration: 4 },
      { name: 'Buenos Aires', country: 'Argentina', description: 'Paris of South America', longDescription: 'Buenos Aires is elegant with European architecture, tango, steaks, and vibrant nightlife.', image: 'https://images.unsplash.com/photo-1506704720897-c6b0b8ef6dba?w=800&h=500&fit=crop', price: 1500, duration: 5 },
      { name: 'Mendoza', country: 'Argentina', description: 'Wine Country', longDescription: 'Mendoza is Argentina\'s premier wine region with vineyards, mountain views, and outdoor activities.', image: 'https://images.unsplash.com/photo-1506704720897-c6b0b8ef6dba?w=800&h=500&fit=crop', price: 1000, duration: 4 },
      { name: 'Lima', country: 'Peru', description: 'Culinary Capital', longDescription: 'Lima is known for world-class restaurants, colonial architecture, museums, and coastal views.', image: 'https://images.unsplash.com/photo-1506704720897-c6b0b8ef6dba?w=800&h=500&fit=crop', price: 1300, duration: 4 },
      { name: 'Cusco', country: 'Peru', description: 'Gateway to Machu Picchu', longDescription: 'Cusco is the ancient Inca capital with cobblestone streets and is the base for Machu Picchu visits.', image: 'https://images.unsplash.com/photo-1506704720897-c6b0b8ef6dba?w=800&h=500&fit=crop', price: 1200, duration: 4 },
      { name: 'Machu Picchu', country: 'Peru', description: 'Lost City', longDescription: 'Machu Picchu is an ancient Inca citadel and one of the world\'s most iconic archaeological sites.', image: 'https://images.unsplash.com/photo-1506704720897-c6b0b8ef6dba?w=800&h=500&fit=crop', price: 1500, duration: 3 },
      { name: 'Santiago', country: 'Chile', description: 'Capital of the Andes', longDescription: 'Santiago offers Andes mountains, wineries, museums, and vibrant cosmopolitan atmosphere.', image: 'https://images.unsplash.com/photo-1506704720897-c6b0b8ef6dba?w=800&h=500&fit=crop', price: 1400, duration: 4 },
      { name: 'Atacama', country: 'Chile', description: 'Driest Desert', longDescription: 'Atacama Desert offers stargazing, salt flats, flamingos, and otherworldly landscapes.', image: 'https://images.unsplash.com/photo-1506704720897-c6b0b8ef6dba?w=800&h=500&fit=crop', price: 1600, duration: 4 },
      { name: 'Mexico City', country: 'Mexico', description: 'Ancient Capital', longDescription: 'Mexico City has Aztec ruins, world-class museums, street food, and vibrant cultural scene.', image: 'https://images.unsplash.com/photo-1506704720897-c6b0b8ef6dba?w=800&h=500&fit=crop', price: 1200, duration: 4 },
      { name: 'Cancun', country: 'Mexico', description: 'Caribbean Paradise', longDescription: 'Cancun is a beach resort with turquoise waters, Mayan ruins, and all-inclusive resorts.', image: 'https://images.unsplash.com/photo-1506704720897-c6b0b8ef6dba?w=800&h=500&fit=crop', price: 1400, duration: 5 },
      { name: 'Playa del Carmen', country: 'Mexico', description: 'Caribbean Beach', longDescription: 'Playa del Carmen is a beautiful beach town with Caribbean charm, diving, and cenotes.', image: 'https://images.unsplash.com/photo-1506704720897-c6b0b8ef6dba?w=800&h=500&fit=crop', price: 1300, duration: 5 },
      { name: 'Oaxaca', country: 'Mexico', description: 'Cultural Heart', longDescription: 'Oaxaca is known for indigenous culture, colorful markets, traditional crafts, and cuisine.', image: 'https://images.unsplash.com/photo-1506704720897-c6b0b8ef6dba?w=800&h=500&fit=crop', price: 900, duration: 4 },
      { name: 'Istanbul', country: 'Turkey', description: 'Blue Mosque City', longDescription: 'Istanbul is transcontinental with stunning mosques, Grand Bazaar, and rich Ottoman heritage.', image: 'https://images.unsplash.com/photo-1506704720897-c6b0b8ef6dba?w=800&h=500&fit=crop', price: 1500, duration: 5 },
      { name: 'Cappadocia', country: 'Turkey', description: 'Fairy Chimneys', longDescription: 'Cappadocia features unique rock formations, hot air balloon rides, and cave hotels.', image: 'https://images.unsplash.com/photo-1506704720897-c6b0b8ef6dba?w=800&h=500&fit=crop', price: 1200, duration: 4 },
      { name: 'Antalya', country: 'Turkey', description: 'Turquoise Coast', longDescription: 'Antalya is a Mediterranean resort with beautiful beaches, ancient ruins, and turquoise waters.', image: 'https://images.unsplash.com/photo-1506704720897-c6b0b8ef6dba?w=800&h=500&fit=crop', price: 1100, duration: 4 },
      { name: 'Ephesus', country: 'Turkey', description: 'Ancient City', longDescription: 'Ephesus is an ancient Roman city with Temple of Artemis and well-preserved archaeological ruins.', image: 'https://images.unsplash.com/photo-1506704720897-c6b0b8ef6dba?w=800&h=500&fit=crop', price: 1000, duration: 2 },
      { name: 'Amman', country: 'Jordan', description: 'City of the Seven Hills', longDescription: 'Amman is a modern Arab capital with Roman ruins, museums, and gateway to ancient sites.', image: 'https://images.unsplash.com/photo-1506704720897-c6b0b8ef6dba?w=800&h=500&fit=crop', price: 1000, duration: 4 },
      { name: 'Petra', country: 'Jordan', description: 'Rose-Red City', longDescription: 'Petra is an ancient Nabatean city carved from red rock cliffs and is a UNESCO World Heritage site.', image: 'https://images.unsplash.com/photo-1506704720897-c6b0b8ef6dba?w=800&h=500&fit=crop', price: 1300, duration: 3 },
      { name: 'Dead Sea', country: 'Jordan', description: 'Lowest Point on Earth', longDescription: 'The Dead Sea is the world\'s lowest point with mineral-rich waters and therapeutic mud.', image: 'https://images.unsplash.com/photo-1506704720897-c6b0b8ef6dba?w=800&h=500&fit=crop', price: 1100, duration: 2 },
      { name: 'Jerusalem', country: 'Israel', description: 'Holy City', longDescription: 'Jerusalem is sacred to three religions with the Western Wall, Old City, and rich history.', image: 'https://images.unsplash.com/photo-1506704720897-c6b0b8ef6dba?w=800&h=500&fit=crop', price: 1400, duration: 4 },
      { name: 'Tel Aviv', country: 'Israel', description: 'Mediterranean Modern', longDescription: 'Tel Aviv is a vibrant coastal city with beaches, nightlife, restaurants, and tech innovation.', image: 'https://images.unsplash.com/photo-1506704720897-c6b0b8ef6dba?w=800&h=500&fit=crop', price: 1600, duration: 4 },
      { name: 'Dubai', country: 'UAE', description: 'Desert Metropolis', longDescription: 'Dubai is a modern city with futuristic architecture, luxury shopping, and desert safaris.', image: 'https://images.unsplash.com/photo-1506704720897-c6b0b8ef6dba?w=800&h=500&fit=crop', price: 2000, duration: 5 },
      { name: 'Abu Dhabi', country: 'UAE', description: 'Oil Capital', longDescription: 'Abu Dhabi offers Sheikh Zayed Mosque, luxury shopping, museums, and cultural attractions.', image: 'https://images.unsplash.com/photo-1506704720897-c6b0b8ef6dba?w=800&h=500&fit=crop', price: 1800, duration: 4 },
      { name: 'Doha', country: 'Qatar', description: 'Modern Gulf City', longDescription: 'Doha is a cosmopolitan city with modern architecture, museums, and traditional souks.', image: 'https://images.unsplash.com/photo-1506704720897-c6b0b8ef6dba?w=800&h=500&fit=crop', price: 1700, duration: 4 },
      { name: 'Riyadh', country: 'Saudi Arabia', description: 'Modern Saudi Capital', longDescription: 'Riyadh is Saudi Arabia\'s capital with modern skyscrapers, museums, and traditional culture.', image: 'https://images.unsplash.com/photo-1506704720897-c6b0b8ef6dba?w=800&h=500&fit=crop', price: 1600, duration: 4 },
      { name: 'Jeddah', country: 'Saudi Arabia', description: 'Gateway City', longDescription: 'Jeddah is Saudi Arabia\'s main port city with Red Sea access, corniche, and Islamic sites.', image: 'https://images.unsplash.com/photo-1506704720897-c6b0b8ef6dba?w=800&h=500&fit=crop', price: 1400, duration: 4 },
      { name: 'Maldives', country: 'Maldives', description: 'Island Paradise', longDescription: 'The Maldives offer overwater bungalows, crystal-clear waters, and world-class snorkeling.', image: 'https://images.unsplash.com/photo-1506704720897-c6b0b8ef6dba?w=800&h=500&fit=crop', price: 3500, duration: 6 },
      { name: 'Mauritius', country: 'Mauritius', description: 'Island Escape', longDescription: 'Mauritius is a tropical paradise with diverse culture, beaches, and water sports.', image: 'https://images.unsplash.com/photo-1506704720897-c6b0b8ef6dba?w=800&h=500&fit=crop', price: 2500, duration: 6 },
      { name: 'Seychelles', country: 'Seychelles', description: 'Luxury Islands', longDescription: 'The Seychelles offer pristine beaches, granite islands, and exclusive luxury resorts.', image: 'https://images.unsplash.com/photo-1506704720897-c6b0b8ef6dba?w=800&h=500&fit=crop', price: 3200, duration: 6 },
      { name: 'Fiji', country: 'Fiji', description: 'Tropical Paradise', longDescription: 'Fiji offers tropical islands, coral reefs, friendly locals, and water activities.', image: 'https://images.unsplash.com/photo-1506704720897-c6b0b8ef6dba?w=800&h=500&fit=crop', price: 2800, duration: 7 },
      { name: 'New Zealand', country: 'New Zealand', description: 'Adventure Land', longDescription: 'New Zealand offers spectacular landscapes, adventure sports, and Lord of the Rings filming locations.', image: 'https://images.unsplash.com/photo-1506704720897-c6b0b8ef6dba?w=800&h=500&fit=crop', price: 3000, duration: 8 },
      { name: 'Auckland', country: 'New Zealand', description: 'City of Sails', longDescription: 'Auckland is New Zealand\'s largest city with harbors, islands, volcanoes, and culture.', image: 'https://images.unsplash.com/photo-1506704720897-c6b0b8ef6dba?w=800&h=500&fit=crop', price: 2500, duration: 5 },
      { name: 'Christchurch', country: 'New Zealand', description: 'Garden City', longDescription: 'Christchurch offers gardens, adventure access, and gateway to South Island attractions.', image: 'https://images.unsplash.com/photo-1506704720897-c6b0b8ef6dba?w=800&h=500&fit=crop', price: 2300, duration: 5 },
      { name: 'Melbourne', country: 'Australia', description: 'Cultural Capital', longDescription: 'Melbourne is known for street art, coffee culture, sports, museums, and vibrant nightlife.', image: 'https://images.unsplash.com/photo-1506704720897-c6b0b8ef6dba?w=800&h=500&fit=crop', price: 2500, duration: 5 },
      { name: 'Brisbane', country: 'Australia', description: 'Subtropical City', longDescription: 'Brisbane offers subtropical climate, rivers, cultural venues, and access to beaches.', image: 'https://images.unsplash.com/photo-1506704720897-c6b0b8ef6dba?w=800&h=500&fit=crop', price: 2200, duration: 4 },
      { name: 'Perth', country: 'Australia', description: 'Swan River City', longDescription: 'Perth is an isolated coastal city with stunning beaches, parks, and vibrant culture.', image: 'https://images.unsplash.com/photo-1506704720897-c6b0b8ef6dba?w=800&h=500&fit=crop', price: 2100, duration: 4 }
    ];

    const enrichedDestinations = destinations.map(addDetails);

    // Clear existing destinations
    await Destination.deleteMany({});
    
    // Insert new destinations
    const createdDestinations = await Destination.insertMany(enrichedDestinations);

    res.json({
      success: true,
      message: 'Destinations seeded successfully',
      count: createdDestinations.length,
      destinations: createdDestinations
    });
  } catch (error) {
    console.error('Seed destinations error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to seed destinations',
      error: error.message
    });
  }
};

module.exports = exports;
