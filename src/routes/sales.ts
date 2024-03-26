import express from 'express';
import salesController from '../controllers/SalesController';
import rateLimit from '../middleware/rateLimit';

const router = express.Router()

router.post('/users/sales/sign-up/email',salesController.AddEmailStore)
router.post('/users/sales/confirm/email',rateLimit('sales-email',4),salesController.confirmEmailSales)
router.post('/users/sales/sign-up/phone',salesController.AddPhoneStore)

export default router