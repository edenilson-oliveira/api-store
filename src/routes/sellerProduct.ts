import express from 'express';
import multer from '../config/multerConfig'
import productsSellerActionsController from '../controllers/ProductSellerActionsController';

const router = express.Router()

router.get('/users/seller/products',productsSellerActionsController.getProductsOfStore)
router.post('/users/seller/products', multer.getUpload.single('image'),productsSellerActionsController.addProduct)

export default router