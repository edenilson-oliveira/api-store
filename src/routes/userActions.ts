import express from 'express';
import userActionsController from '../controllers/UserActionsController';

const router = express.Router()

router.post('/users/store/cart/add/product', userActionsController.addProductOnCart)
router.patch('/users/store/cart/increase/quantity/product/:id', userActionsController.increaseQuantityOfProductOnCart)
router.patch('/users/store/cart/decrease/quantity/product/:id', userActionsController.decreaseQuantityOfProductOnCart)
router.delete('/users/store/cart/remove/product/:id', userActionsController.removeProductOnCart)

export default router