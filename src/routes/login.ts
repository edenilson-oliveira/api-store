import express from 'express';
import loginUserController from '../controllers/LoginUserController';
import rateLimit from '../middleware/rateLimit';

const router = express.Router()

router.post('/users/sign-up/',rateLimit('sign-up',20),loginUserController.signUp)
router.post('/users/login/',rateLimit('login',10), loginUserController.login)
router.post('/users/sign-up/confirm',rateLimit('confirm',3),loginUserController.confirmEmail)

export default router