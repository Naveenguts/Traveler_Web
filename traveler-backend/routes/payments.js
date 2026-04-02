const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const ctrl = require('../controllers/paymentController');

router.post('/intent', ctrl.createPaymentIntent);
router.use(auth);
router.post('/setup-intent', ctrl.createSetupIntent);
router.post('/add', ctrl.addPaymentMethod);
router.get('/', ctrl.listPaymentMethods);
router.put('/default/:id', ctrl.setDefault);
router.delete('/:id', ctrl.deleteMethod);

module.exports = router;
