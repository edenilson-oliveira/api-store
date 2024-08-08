import express from 'express';
import UserPurchaseController from '../controllers/UserPurchaseController';

const router = express.Router()

router.post('/users/store/add/order/', UserPurchaseController.addOrder)
router.post('/users/store/add/order/cart', UserPurchaseController.addOrderOfProductsOnCart)
router.delete('/users/store/delete/order/:id', UserPurchaseController.removeOrder)

export default router