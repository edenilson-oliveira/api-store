import express from 'express';
import upload from '../middleware/upload'
import productsSellerActionsController from '../controllers/ProductSellerActionsController';

const router = express.Router()

router.get('/users/seller/products',productsSellerActionsController.getProductsOfStore)
router.post('/users/seller/product/add',productsSellerActionsController.addProduct)
router.post('/users/seller/product/add/images',upload,productsSellerActionsController.addImageProduct)
router.patch('/users/seller/product/edit/:id',productsSellerActionsController.editInfoProduct)
router.post('/users/seller/product/edit/add/image/:id',upload('edit'),productsSellerActionsController.addMoreImagesProducts)

export default router