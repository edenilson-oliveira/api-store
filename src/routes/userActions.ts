import express from 'express';
import userActionsController from '../controllers/UserActionsController';

const router = express.Router()

router.post('/users/store/add/product/cart', userActionsController.addProductOnCart)

export default router