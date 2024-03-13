import express from 'express';
import login from './login'
import accountUser from './accoutUser'
import refreshToken from './refreshToken'

const router = express.Router()

router.use(login)
router.use(accountUser)
router.use(refreshToken)

export default router