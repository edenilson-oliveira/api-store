import express from 'express';
import userController from '../controllers/UserController';

const router = express.Router()

router.get('/users',userController.getUsers)
router.post('/users/create/',userController.createUser)
router.post('/users/login/',userController.login)

export default router