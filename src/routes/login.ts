import express from 'express';
import userController from '../controllers/UserController';

const router = express.Router()

router.get('/users',userController.getUser)
router.post('/users/create/',userController.signUp)
router.post('/users/login/',userController.login)

export default router