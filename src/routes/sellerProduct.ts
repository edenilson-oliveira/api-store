import express from 'express';
import upload from '../middleware/upload'
import productsSellerActionsController from '../controllers/ProductSellerActionsController';

const router = express.Router()

router.get('/users/seller/products',productsSellerActionsController.getAllProductsOfStore)
router.get('/users/seller/product/:id',productsSellerActionsController.getProductById)
router.post('/users/seller/product/add',productsSellerActionsController.addProduct)
router.post('/users/seller/product/add/images',upload(''),productsSellerActionsController.addImageProduct)
router.patch('/users/seller/product/edit/:id',productsSellerActionsController.editInfoProduct)
router.post('/users/seller/product/edit/add/image/:id',upload('edit'),productsSellerActionsController.addMoreImagesProducts)
router.delete('/users/seller/products/edit/delete/image/:publicId',productsSellerActionsController.deleteImage)
router.delete('/users/seller/products/delete/:id',productsSellerActionsController.deleteProduct)

export default router