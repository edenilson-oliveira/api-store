import express from 'express';
import loginUserController from '../controllers/LoginUserController';

const router = express.Router()

router.post('/users/sign-up/',loginUserController.signUp)
router.post('/users/login/',loginUserController.login)
router.post('/users/sign-up/confirm',loginUserController.confirmEmail)

export default router