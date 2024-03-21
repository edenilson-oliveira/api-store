import express from 'express';
import userAccountController from '../controllers/UserAccountController';
import rateLimit from '../middleware/rateLimit';

const router = express.Router()

router.get('/users/account',rateLimit('getAccount',15),userAccountController.getUser)
router.delete('/users/account',userAccountController.deleteAccount)
router.patch('/users/account',userAccountController.editAccount)
router.post('/users/account/edit',rateLimit('accountEdit',4),userAccountController.confirmEmailEdit)
router.post('/users/account/delete',rateLimit('accountDelete',4),userAccountController.confirmDeleteAccount)
export default router