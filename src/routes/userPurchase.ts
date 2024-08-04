import express from 'express';
import UserPurchaseController from '../controllers/UserPurchaseController';

const router = express.Router()

router.post('/users/store/finalize/order', UserPurchaseController.finalizeOrder)

export default router