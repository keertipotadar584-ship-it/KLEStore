
const mongoose = require('mongoose');
const cartSchema = new mongoose.Schema({

products: [{ type: mongoose.Schema.ObjectId, ref: 'Product' }],  // array of product refs
total:  { type: Number }  
});

const Cart = mongoose.model('Cart', cartSchema);
module.exports = { Cart };
