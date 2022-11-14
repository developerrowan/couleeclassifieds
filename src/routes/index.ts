import { Router } from 'express'
import UserRouter from './user'
import AuthRouter from './auth'

const router = Router()

router.use('/users', UserRouter)
router.use('/auth', AuthRouter)

export default router
