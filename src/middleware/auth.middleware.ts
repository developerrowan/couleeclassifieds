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
  const token = authHeader && authHeader.split(' ')[1]

  if (!token) {
    return res.sendStatus(401)
  }

  jwt.verify(token, process.env.JWT_SECRET as string, (err: any, user: any) => {
    if (err) {
      return res.sendStatus(403)
    }

    /* @ts-ignore */
    req.user = user

    next()
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
    active: 1,
  }

  UserModel.validate(model, (err, valid) => {
    if (err && !valid) {
      return res.status(400).send(err)
    }

    next()
  })
}
