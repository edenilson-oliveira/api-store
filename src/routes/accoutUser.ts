import express from 'express';
import userAccountController from '../controllers/UserAccountController';
import rateLimit from '../middleware/rateLimit';

const router = express.Router()

router.get('/users/account',rateLimit('getAccount',15,true),userAccountController.getUser)
router.delete('/users/account',userAccountController.deleteAccount)
router.patch('/users/account',userAccountController.editAccount)
router.post('/users/account/edit',rateLimit('accountEdit',4,true),userAccountController.confirmEmailEdit)
router.post('/users/account/delete',rateLimit('accountDelete',4,true),userAccountController.confirmDeleteAccount)
export default router