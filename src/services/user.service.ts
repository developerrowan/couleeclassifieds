import { UserRoleDto } from './../models/user-role.dto'
import { AuthenticationCallback, LoginModel } from './../types/types'
import bcrypt from 'bcrypt'
import { UserDto } from '../models/user.dto'
import UserModel from '../models/user.model'
import * as jwt from 'jsonwebtoken'
import UserRoleModel from '../models/user-role.model'

export class UserService {
  public static async login(
    model: LoginModel,
    callback: AuthenticationCallback
  ) {
    UserModel.findUserByEmail(model.email, async (err, result) => {
      if (err) {
        callback('A user does not exist with this email.', false, null)
        return
      }

      const passwordMatches: boolean = await bcrypt.compare(
        model.password,
        result.password
      )

      if (!passwordMatches) {
        callback('Password does not match.', false, null)
        return
      }

      callback(null, true, this.generateJWT(model.email, model.rememberMe))
    })
  }

  public static register(
    model: UserDto,
    callback: AuthenticationCallback
  ): void {
    UserModel.findUserByEmail(model.email, async (err, result) => {
      if (err) {
        callback(err, false, null)
        return
      }

      // no salt necessary - bcrypt will automatically store a salt in the hash for us
      const encryptedPassword: string = await bcrypt.hash(model.password, 10)

      model.password = encryptedPassword

      UserModel.insertUser(model, (err, _) => {
        if (err) {
          callback(err, false, null)
          return
        }

        callback(null, true, this.generateJWT(model.email))
      })
    })
  }

  public static generateJWT(userEmail: string, rememberMe?: boolean): string {
    return jwt.sign({ email: userEmail }, process.env.JWT_SECRET, {
      expiresIn: rememberMe ? '360h' : '3600s',
    })
  }
}
