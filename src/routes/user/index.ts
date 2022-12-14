import { UserService } from '../../services/user.service'
import express from 'express'
import authenticateJWT, {
  validateUserDto,
} from '../../middleware/auth.middleware'
import UserModel from '../../models/user.model'

const router = express.Router()

router.get(
  `/`,
  authenticateJWT,
  (_: express.Request, res: express.Response) => {
    UserModel.findAllUsers((err, result) => {
      if (err) {
        res.sendStatus(500)
      }

      res.json(result)
    })
  }
)

router.post(
  `/`,
  authenticateJWT,
  validateUserDto,
  (req: express.Request, res: express.Response) => {
    UserModel.insertUser(req.body, (err, result) => {
      if (err) {
        res.sendStatus(400)
      }

      res.status(200).json({ userId: result })
    })
  }
)

router.get(
  /^\/(.+?@\w+.\w+)/,
  (req: express.Request, res: express.Response) => {
    UserModel.findUserByEmail(req.params[0], (err, result) => {
      if (err) {
        res.sendStatus(500)
      }

      res.json(result)
    })
  }
)

router.get(
  `/:userId(\\d+)`,
  authenticateJWT,
  (req: express.Request, res: express.Response) => {
    UserModel.findUserById(+req.params.userId, (err, result) => {
      if (err) {
        res.sendStatus(500)
      }

      res.json(result)
    })
  }
)

router.put(
  `/:userId(\\d+)`,
  authenticateJWT,
  validateUserDto,
  (req: express.Request, res: express.Response) => {
    // User ID is the primary key - we don't want to change that
    if (+req.body.userId !== +req.params.userId) {
      return res.sendStatus(400)
    }

    UserModel.updateUser(req.body, (err, _) => {
      if (err) {
        return res.sendStatus(500)
      }

      return res.status(200).send('User updated successfully')
    })
  }
)

router.delete(
  `/:userId(\\d+)`,
  authenticateJWT,
  (req: express.Request, res: express.Response) => {
    UserModel.deleteUser(+req.params.userId, (err, result) => {
      if (err) {
        return res.sendStatus(500)
      } else if (result === 0) {
        return res.status(200).send('User does not exist')
      }

      res.status(200).send('User deleted successfully')
    })
  }
)

export default router
