import express from 'express';
import upload from '../middleware/upload'
import productsSellerActionsController from '../controllers/ProductSellerActionsController';

const router = express.Router()

router.get('/users/seller/products',productsSellerActionsController.getProductsOfStore)
router.post('/users/seller/products',productsSellerActionsController.addProduct)
//router.post('/users/seller/product/add/image',productsSellerActionsController.addImageProduct)
export default router