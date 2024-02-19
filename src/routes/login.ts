import userController from '../controllers/UserController';
import express from 'express';

const router = express.Router()
router.get('/',userController.getUsers)

export default router