import express from 'express';
import userAccountController from '../controllers/UserAccountController';

const router = express.Router()

router.get('/users/account',userAccountController.getUser)
router.delete('/users/account',userAccountController.deleteAccount)
router.patch('/users/account',userAccountController.editAccount)

export default router