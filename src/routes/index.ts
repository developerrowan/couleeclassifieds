import { Router } from 'express'
import UserRouter from './user'
import AuthRouter from './auth'
import UserRoleRouter from './role'
import JobRouter from './job'

const router = Router()

router.use('/users', UserRouter)
router.use('/auth', AuthRouter)
router.use('/roles', UserRoleRouter)
router.use('/jobs', JobRouter)

export default router
