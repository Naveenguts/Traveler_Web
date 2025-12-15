const express = require('express');
const router = express.Router();

// Placeholder for destination routes
// You can add destination-related endpoints here later

router.get('/', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Destinations endpoint - Coming soon',
    destinations: []
  });
});

module.exports = router;
