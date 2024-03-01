import express from 'express';
import login from './login'
import accountUser from './accoutUser'

const router = express.Router()

router.use(login)
router.use(accountUser)

export default router