import express from 'express';
import sellerAccountController from '../controllers/SellerAccountController';
import rateLimit from '../middleware/rateLimit';

const router = express.Router()

router.get('/users/seller/account',sellerAccountController.GetInfoSellerAccount)
router.patch('/users/seller/account/info-store',sellerAccountController.EditInfoAccountSeller)
router.patch('/users/seller/account/email',sellerAccountController.EditEmailStore)
router.post('/users/seller/account/confirm-edit-email',sellerAccountController.confirmEditEmailStore)

export default router