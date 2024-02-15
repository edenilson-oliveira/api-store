import userController from '../controllers/UserController.ts';
import express from 'express';

const router = express.Router()
router.get('/users',userController.getUsers)

export default router