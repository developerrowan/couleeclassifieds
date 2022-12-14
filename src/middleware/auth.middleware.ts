import { Response, Request, NextFunction } from 'express'
import * as jwt from 'jsonwebtoken'
import { UserDto } from '../models/user.dto'
import UserModel from '../models/user.model'

export default function authenticateJWT(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authHeader: string = req.headers['authorization']
  const requiredRole: number = +req.headers['x-user-role-level'] || -1
  const token = authHeader && authHeader.split(' ')[1]

  if (!token) {
    return res.sendStatus(401)
  }

  jwt.verify(token, process.env.JWT_SECRET as string, (err: any, user: any) => {
    let verified: boolean = true

    if (err) {
      verified = false
    }
    /* Client sends a role of -1 to specify we don't care about the role */
    if (requiredRole !== -1) {
      UserModel.findUserByEmail(user.email, (error, result) => {
        if (error || !result || result.role !== requiredRole) {
          verified = false
        }

        if (!verified) {
          return res.sendStatus(403)
        }

        next()
      })
    } else {
      if (!verified) {
        return res.sendStatus(403)
      }

      next()
    }
  })
}

export function validateUserDto(
  req: Request,
  res: Response,
  next: NextFunction
) {
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

  UserModel.validate(model, (err, valid) => {
    if (err && !valid) {
      return res.status(400).send(err)
    }

    next()
  })
}
