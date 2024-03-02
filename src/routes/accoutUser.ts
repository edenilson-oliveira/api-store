import express from 'express';
import userController from '../controllers/UserController';

const router = express.Router()

router.get('/users/account',userController.getUser)
router.delete('/users/account',userController.deleteAccount)
router.patch('/users/account',userController.editAccount)

export default router