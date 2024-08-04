import express from 'express';
import userActionsCartController from '../controllers/UserActionsCartController';

const router = express.Router()

router.post('/users/store/cart/add/product', userActionsCartController.addProductOnCart)
router.get('/users/store/cart/get',userActionsCartController.getProductsOnCart)
router.patch('/users/store/cart/increase/quantity/product/:id', userActionsCartController.increaseQuantityOfProductOnCart)
router.patch('/users/store/cart/decrease/quantity/product/:id', userActionsCartController.decreaseQuantityOfProductOnCart)
router.delete('/users/store/cart/remove/product/:id', userActionsCartController.removeProductOnCart)

export default router