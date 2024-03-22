import express from 'express';
import salesController from '../controllers/SalesController';
import rateLimit from '../middleware/rateLimit';

const router = express.Router()

router.post('/users/sales/sign-up',salesController.AddEmailStore)

export default router