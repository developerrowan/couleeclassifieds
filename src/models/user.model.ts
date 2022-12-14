import { QueryCallback } from '../types/types'
import { UserDto } from './user.dto'
import Database from '../db'
import { OkPacket, RowDataPacket } from 'mysql2'
import {
  isLengthGreaterThan,
  isLengthLessThan,
  isNonZero,
  isNullOrEmpty,
} from '../helpers/validation'
import bcrypt from 'bcrypt'

/**
 * Within this stack, the model acts as both the data access and model classes.
 * The Dto (data transfer object) is what acts as the "model" in this case.
 */
export default abstract class UserModel {
  /**
   * Inserts a User into the database
   * @param model User DTO
   * @param callback Callback
   * @returns (via callback) Insertion ID
   */
  public static async insertUser(
    model: UserDto,
    callback: QueryCallback
  ): Promise<void> {
    // no salt necessary - bcrypt will automatically store a salt in the hash for us
    const encryptedPassword: string = await bcrypt.hash(model.password, 10)

    model.password = encryptedPassword

    const query = `INSERT INTO Users
                            (UserFirstName,
                            UserLastName,
                            UserEmail,
                            UserPassword)
                        VALUES (
                            ${Database.escape(model.firstName)},
                            ${Database.escape(model.lastName)},
                            ${Database.escape(model.email)},
                            ${Database.escape(model.password)})`

    Database.query(query, (err, result) => {
      if (err) {
        callback(err)
        return
      }

      callback(null, (<OkPacket>result).insertId)
    })
  }

  /**
   * Updates a User based off a User DTO
   * @param model User DTO
   * @param callback Callback
   * @returns (via callback) Affected row count
   */
  public static async updateUser(
    model: UserDto,
    callback: QueryCallback
  ): Promise<void> {
    const newHash: string = await bcrypt.hash(model.password, 10)
    let shouldUpdatePassword: boolean = false

    await UserModel.findUserById(model.userId, async (err, result) => {
      if (err || !result) {
        callback(err)
        return
      }

      const passwordMatches: boolean = await bcrypt.compare(
        model.password,
        result.password
      )

      if (!passwordMatches && !(model.password === result.password)) {
        shouldUpdatePassword = true
      }

      /* Client did not provide a role (an expected behaviour at times) */
      if (model.role === 99) {
        model.role = result.role
      }

      const query = `UPDATE Users
                         SET UserFirstName = ${Database.escape(
                           model.firstName
                         )},
                             UserLastName =  ${Database.escape(model.lastName)},
                             UserEmail = ${Database.escape(model.email)},
                             ${
                               shouldUpdatePassword
                                 ? `UserPassword = ${Database.escape(newHash)},`
                                 : ''
                             }
                             UserRole = ${model.role},
                             UserActive = ${model.active ? '1' : '0'}
                         WHERE UserId = ${model.userId}`

      Database.query(query, (err, result) => {
        if (err) {
          callback(err)
          return
        }

        callback(null, (<OkPacket>result).affectedRows)
      })
    })
  }

  /**
   * Deletes a User based off their ID
   * @param id User ID
   * @param callback Callback
   * @returns (via callback) Affected row count
   */
  public static deleteUser(id: number, callback: QueryCallback): void {
    const query = `DELETE FROM Users WHERE UserId = ${id}`

    Database.query(query, (err, result) => {
      if (err) {
        callback(err)
        return
      }

      callback(null, (<OkPacket>result).affectedRows)
    })
  }

  /**
   * Finds a User based off a provided ID
   * @param id User ID
   * @param callback Callback
   * @returns (via callback) UserDto if it exists, else undefined
   */
  public static findUserById(id: number, callback: QueryCallback): void {
    const query = `SELECT * FROM Users WHERE UserId = ${id}`

    Database.query(query, (err, result) => {
      if (err) {
        callback(err)
        return
      }

      callback(null, this.mapRow((<RowDataPacket>result)[0]))
    })
  }

  /**
   * Finds a User based off a provided email
   * @param email User email
   * @param callback Callback
   * @returns (via callback) UserDto if it exists, else undefined
   */
  public static findUserByEmail(email: string, callback: QueryCallback): void {
    const query = `SELECT * FROM Users WHERE UserEmail = ${Database.escape(
      email
    )}`

    Database.query(query, (err, result) => {
      if (err) {
        callback(err)
        return
      }

      callback(null, this.mapRow((<RowDataPacket>result)[0]))
    })
  }

  /**
   * Finds and returns all users
   * @param callback Callback
   * @returns (via callback) Array of UserDtos
   */
  public static findAllUsers(callback: QueryCallback): void {
    const query = `SELECT * FROM Users`

    Database.query(query, (err, result) => {
      if (err) {
        callback(err)
        return
      }

      callback(null, this.mapResult(<RowDataPacket[]>result))
    })
  }

  public static validate(
    model: UserDto,
    callback: (err: string, valid: boolean) => void
  ): void {
    if (isLengthGreaterThan(model.firstName, 64)) {
      callback('First name must not exceed 64 characters', false)
      return
    } else if (isNullOrEmpty(model.firstName)) {
      callback('First name cannot be empty', false)
      return
    } else if (isLengthGreaterThan(model.lastName, 64)) {
      callback('Last name must not exceed 64 characters', false)
      return
    } else if (isNullOrEmpty(model.lastName)) {
      callback('Last name cannot be empty', false)
      return
    } else if (isLengthGreaterThan(model.email, 64)) {
      callback('Email must not exceed 64 characters', false)
      return
    } else if (isNullOrEmpty(model.email)) {
      callback('Email cannot be empty', false)
      return
    } else if (isLengthLessThan(model.password, 8)) {
      callback('Password must be at least 8 characters', false)
      return
    } else if (isLengthGreaterThan(model.password, 128)) {
      callback('Password length must not exceed 128 characters', false)
      return
    } else if (isNullOrEmpty(model.password)) {
      callback('Password cannot be empty', false)
      return
    } else if (!isNonZero(model.role)) {
      callback('User must have a role', false)
      return
    }

    callback(null, true)
  }

  public static mapRow(row: RowDataPacket): UserDto | undefined {
    return row
      ? {
          userId: row.UserId,
          firstName: row.UserFirstName,
          lastName: row.UserLastName,
          email: row.UserEmail,
          password: row.UserPassword,
          role: row.UserRole,
          active: Boolean(Buffer.from(row.UserActive).readInt8()),
        }
      : undefined
  }

  public static mapResult(result: RowDataPacket[]): UserDto[] {
    const users: UserDto[] = []

    result.forEach((row: any) => {
      users.push(this.mapRow(row))
    })

    return users
  }
}
