import express from 'express';
import sellerAccountController from '../controllers/SellerAccountController';
import rateLimit from '../middleware/rateLimit';

const router = express.Router()

router.get('/users/seller/account',sellerAccountController.GetInfoSellerAccount)

export default router