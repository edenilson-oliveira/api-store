import express from 'express';
import loginUserController from '../controllers/LoginUserController';
import rateLimit from '../middleware/rateLimit';

const router = express.Router()

router.post('/users/sign-up/',rateLimit('sign-up',20),loginUserController.signUp)
router.post('/users/login/',rateLimit('login',10), loginUserController.login)
router.post('/users/sign-up/confirm',rateLimit('confirm',3),loginUserController.confirmEmail)
router.post('/users/login/change-password/send-code',rateLimit('send-code-change-password',10),loginUserController.SendCodeForChangePassword)
router.post('/users/login/change-password/confirm',rateLimit('confirm-code-change-password',3),loginUserController.confirmCodeForChangePassword)
router.patch('/users/login/create-new-password/',rateLimit('create-new-password',3),loginUserController.changePassword)

export default router