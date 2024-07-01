import express from 'express';
import upload from '../middleware/upload'
import productsSellerActionsController from '../controllers/ProductSellerActionsController';

const router = express.Router()

router.get('/users/seller/products',productsSellerActionsController.getProductsOfStore)
router.post('/users/seller/product/add',productsSellerActionsController.addProduct)
router.post('/users/seller/product/add/images',upload,productsSellerActionsController.addImageProduct)
router.patch('/users/seller/product/edit',productsSellerActionsController.editInfoProduct)

export default router