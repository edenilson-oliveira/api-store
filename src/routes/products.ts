import express from 'express';
import productController from '../controllers/ProductController';

const router = express.Router()

router.get('/users/products', productController.getProducts)
router.get('/users/products/:search', productController.getProductFromSearch)

export default router