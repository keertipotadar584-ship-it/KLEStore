const express  = require('express');
const router   = express.Router();
const {protectAuth} = require('../middleware/auth')
const { placeOrder } = require('../controllers/orderController');

router.post('/place', protectAuth, placeOrder);   // POST /orders/place

module.exports = router;