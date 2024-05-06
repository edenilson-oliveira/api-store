import express from 'express';
import productsSellerActionsController from '../controllers/ProductSellerActionsController';

const router = express.Router()

router.get('/users/seller/products',productsSellerActionsController.getProductsOfStore)
router.post('/users/seller/products',productsSellerActionsController.addProduct)

export default router