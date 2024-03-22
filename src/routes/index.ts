import express from 'express';
import login from './login'
import accountUser from './accoutUser'
import refreshToken from './refreshToken'
import sales from './sales'

const router = express.Router()

router.use(login)
router.use(accountUser)
router.use(refreshToken)
router.use(sales)

export default router