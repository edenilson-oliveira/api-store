import express from 'express';
import userAccountController from '../controllers/UserAccountController';
import rateLimit from '../middleware/rateLimit';

const router = express.Router()

router.get('/users/account',rateLimit('get-account',15),userAccountController.getUser)
router.delete('/users/account',userAccountController.deleteAccount)
router.patch('/users/account',userAccountController.editAccount)
router.post('/users/account/edit',rateLimit('account-edit',4),userAccountController.confirmEmailEdit)
router.post('/users/account/delete',rateLimit('account-delete',4),userAccountController.confirmDeleteAccount)
export default router