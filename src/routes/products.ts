import express from 'express';
import productController from '../controllers/ProductController';

const router = express.Router()

router.get('/users/products', productController.getProducts)
router.get('/users/products/search/:search', productController.getProductBySearch)
router.get('/users/products/category/:category', productController.getProductsByCategory)

export default router