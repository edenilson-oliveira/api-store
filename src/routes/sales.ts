import express from 'express';
import salesController from '../controllers/SalesController';
import rateLimit from '../middleware/rateLimit';

const router = express.Router()

router.post('/users/sales/sign-up/email',salesController.AddEmailStore)
router.post('/users/sales/sign-up/phone',salesController.AddPhoneStore)
router.post('/users/sales/confirm/email',rateLimit('sales-email',4),salesController.confirmEmailSales)
router.post('/users/sales/confirm/phone',rateLimit('sales-phone',4),salesController.confirmPhoneSales)
router.post('/users/sales/sign-up/info',rateLimit('sales-infos'),salesController.AddInfoStore)
export default router