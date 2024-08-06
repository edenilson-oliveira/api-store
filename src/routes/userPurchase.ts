import express from 'express';
import UserPurchaseController from '../controllers/UserPurchaseController';

const router = express.Router()

router.post('/users/store/add/order', UserPurchaseController.createOrder)

export default router