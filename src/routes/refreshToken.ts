import express from 'express';
import refreshTokenController from '../controllers/RefreshTokenController';

const router = express.Router()

router.get('/refreshToken', refreshTokenController.refreshToken)

export default router