import express from 'express';
import loginUserController from '../controllers/LoginUserController';
import rateLimit from '../middleware/rateLimit';

const router = express.Router()

router.post('/users/sign-up/',loginUserController.signUp)
router.post('/users/login/',rateLimit('login',5), loginUserController.login)
router.post('/users/sign-up/confirm',loginUserController.confirmEmail)

export default router