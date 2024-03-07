import express from 'express';
import userController from '../controllers/UserController';

const router = express.Router()

router.post('/users/sign-up/',userController.signUp)
router.post('/users/login/',userController.login)
router.post('/users/sign-up/confirm',userController.confirmEmail)

export default router