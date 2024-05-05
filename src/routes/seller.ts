import express from 'express';
import sellerController from '../controllers/SellerSignUpController';
import rateLimit from '../middleware/rateLimit';

const router = express.Router()

router.post('/users/seller/sign-up/email',sellerController.AddEmailStore)
router.post('/users/seller/sign-up/phone',sellerController.AddPhoneStore)
router.post('/users/seller/confirm/email',rateLimit('seller-email',4),sellerController.confirmEmailSeller)
router.post('/users/seller/confirm/phone',rateLimit('seller-phone',4),sellerController.confirmPhoneSeller)
router.post('/users/seller/sign-up/info',rateLimit('seller-infos'),sellerController.AddInfoStore)

export default router