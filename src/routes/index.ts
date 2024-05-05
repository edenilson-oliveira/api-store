import express from 'express';
import login from './login'
import accountUser from './accoutUser'
import refreshToken from './refreshToken'
import seller from './seller'
import sellerAccount from './sellerAccount'

const router = express.Router()

router.use(login)
router.use(accountUser)
router.use(refreshToken)
router.use(seller)
router.use(sellerAccount)

export default router