import express from 'express';
import productController from '../controllers/ProductController';

const router = express.Router()

router.get('/users/products', productController.getProducts)

export default router