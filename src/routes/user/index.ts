import { UserService } from '../../services/user.service'
import express from 'express'
import authenticateJWT from '../../middleware/auth.middleware'
import UserModel from '../../models/user.model'

const router = express.Router()

router.get(
  `/`,
  authenticateJWT,
  (req: express.Request, res: express.Response) => {
    UserModel.findAllUsers((err, result) => {
      if (err) {
        res.sendStatus(500)
      }

      res.json(result)
    })
  }
)

export default router
