const express = require('express');
const router  = express.Router();
const {protectAuth}=require('../middleware/auth')
const { getCart, addToCart, removeFromCart } = require('../controllers/cartController');

router.get('/',            protectAuth, getCart);         // GET    /cart
router.post('/add',        protectAuth, addToCart);       // POST   /cart/add
router.delete('/remove',   protectAuth, removeFromCart);  // DELETE /cart/remove

module.exports = router;