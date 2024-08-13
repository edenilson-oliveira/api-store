import express from 'express';
import UserPurchaseController from '../controllers/UserPurchaseController';

const router = express.Router()

router.post('/users/store/add/order/', UserPurchaseController.addOrder)
router.post('/users/store/add/order/cart', UserPurchaseController.addOrderOfProductsOnCart)
router.delete('/users/store/delete/order/:id', UserPurchaseController.removeOrder)
router.get('/users/store/get/orders',UserPurchaseController.getOrders)
router.post('/users/store/finalize/order/:id',UserPurchaseController.finalizeOrder)

export default router