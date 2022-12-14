import express from 'express'
import authenticateJWT from '../../middleware/auth.middleware'
import UserRoleModel from '../../models/user-role.model'

const router = express.Router()

router.get(`/`, (_: express.Request, res: express.Response) => {
  UserRoleModel.findAllUserRoles((err, result) => {
    if (err) {
      res.sendStatus(500)
    }

    res.json(result)
  })
})

router.post(
  `/`,
  authenticateJWT,
  (req: express.Request, res: express.Response) => {
    UserRoleModel.insertUserRole(req.body, (err, result) => {
      if (err) {
        res.sendStatus(400)
      }

      res.status(200).json({ userRoleId: result })
    })
  }
)

router.get(
  `/:roleId(\\d+)`,
  authenticateJWT,
  (req: express.Request, res: express.Response) => {
    UserRoleModel.findUserRoleById(+req.params.roleId, (err, result) => {
      if (err) {
        res.sendStatus(500)
      }

      res.json(result)
    })
  }
)

router.put(
  `/:roleId(\\d+)`,
  authenticateJWT,
  (req: express.Request, res: express.Response) => {
    // Role ID is the primary key - we don't want to change that
    if (+req.body.userRoleId !== +req.params.roleId) {
      return res.sendStatus(400)
    }

    UserRoleModel.updateUserRole(req.body, (err, _) => {
      if (err) {
        return res.sendStatus(500)
      }

      return res.status(200).send('Role updated successfully')
    })
  }
)

export default router
