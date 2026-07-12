const express = require('express');
const router = express.Router();


const {getAllProducts,
    getMyProducts,
    getProductById,
    addProduct,
    updateProduct,
    deleteProduct,
    toggleLikeProduct,
    getwishlistProducts
}=require('../controllers/productController')  


const {protectAuth}=require('../middleware/auth');

router.get('/',getAllProducts);
router.get('/my',protectAuth,getMyProducts);
router.get('/wishlist',protectAuth,getwishlistProducts);
router.get('/:id',protectAuth,getProductById);
router.post('/',protectAuth,addProduct);
router.patch('/:id',protectAuth,updateProduct);
router.delete('/:id',protectAuth,deleteProduct);
router.post('/:id/like',protectAuth,toggleLikeProduct);

module.exports = router;