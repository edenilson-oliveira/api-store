import express from 'express';
import upload from '../middleware/multer'
import productsSellerActionsController from '../controllers/ProductSellerActionsController';

const router = express.Router()

router.get('/users/seller/products',productsSellerActionsController.getProductsOfStore)
router.post('/users/seller/product',productsSellerActionsController.addProduct)
router.post('/users/seller/product/add/images',upload.array('images'),productsSellerActionsController.addImageProduct)

export default router