import { UserService } from './../../services/user.service'
import express from 'express'
import authenticateJWT, {
  validateUserDto,
} from '../../middleware/auth.middleware'
import { UserDto } from '../../models/user.dto'
import { LoginModel } from '../../types/types'
import UserModel from '../../models/user.model'

const router = express.Router()

// TODO: Move auth stuff into its own controller
router.post('/login', (req, res) => {
  const body = req.body

  const model: LoginModel = {
    email: body.email,
    password: body.password,
    rememberMe: body.rememberMe || false,
  }

  UserService.login(model, (err, result, authToken) => {
    if (err) {
      return res.status(500).send(err)
    }

    return res.status(200).json({ token: authToken })
  })
})

router.get('/verify', authenticateJWT, (req, res) => {
  return res.sendStatus(200)
})

router.post('/register', validateUserDto, (req, res) => {
  const body = req.body

  const model: UserDto = {
    userId: 0,
    firstName: body.firstName,
    lastName: body.lastName,
    email: body.email,
    password: body.password,
    role: body.role,
    active: false,
  }

  UserService.register(model, (err, result, authToken) => {
    if (err) {
      return res.status(500).send(err)
    }

    if (result) {
      return res.status(200).json({ token: authToken })
    }
  })
})

export default router
