import { UserRoleDto } from './user-role.dto'
import { QueryCallback } from '../types/types'
import Database from '../db'
import { OkPacket, RowDataPacket } from 'mysql2'
import { isLengthGreaterThan, isNullOrEmpty } from '../helpers/validation'

export default abstract class UserRoleModel {
  /**
   * Inserts a User Role into the database
   * @param model User Role DTO
   * @param callback Callback
   * @returns (via callback) Insertion ID
   */
  public static insertUserRole(
    model: UserRoleDto,
    callback: QueryCallback
  ): void {
    const query = `INSERT INTO UserRoles (UserRoleName, UserRoleDesc)
                        VALUES (${Database.escape(
                          model.name
                        )}, ${Database.escape(model.description)})`

    Database.query(query, (err, result) => {
      if (err) {
        callback(err)
        return
      }

      callback(null, (<OkPacket>result).insertId)
    })
  }

  /**
   * Updates a User Role based off a UserRole DTO
   * @param id UserRole DTO
   * @param callback Callback
   * @returns (via callback) Affected row count
   */
  public static updateUserRole(
    model: UserRoleDto,
    callback: QueryCallback
  ): void {
    const query = `UPDATE UserRoles
                         SET UserRoleName = ${Database.escape(model.name)},
                             UserRoleDesc =  ${Database.escape(
                               model.description
                             )}
                         WHERE UserRoleId = ${model.userRoleId}`

    Database.query(query, (err, result) => {
      if (err) {
        callback(err)
        return
      }

      callback(null, (<OkPacket>result).affectedRows)
    })
  }

  /**
   * Deletes a User Role based off its ID
   * @param id User Role ID
   * @param callback Callback
   * @returns (via callback) Affected row count
   */
  public static deleteUserRole(id: number, callback: QueryCallback): void {
    const query = `DELETE FROM UserRoles WHERE UserRoleId = ${id}`

    Database.query(query, (err, result) => {
      if (err) {
        callback(err)
        return
      }

      callback(null, (<OkPacket>result).affectedRows)
    })
  }

  /**
   * Finds a User Role based off a provided ID
   * @param id User Role ID
   * @param callback Callback
   * @returns (via callback) UserRoleDto if it exists, else undefined
   */
  public static findUserRoleById(id: number, callback: QueryCallback): void {
    const query = `SELECT * FROM UserRoles WHERE UserRoleId = ${id}`

    Database.query(query, (err, result) => {
      if (err) {
        callback(err)
        return
      }

      callback(null, this.mapRow((<RowDataPacket>result)[0]))
    })
  }

  /**
   * Finds and returns all user roles
   * @param callback Callback
   * @returns (via callback) Array of UserRoleDtos
   */
  public static findAllUserRoles(callback: QueryCallback): void {
    const query = `SELECT * FROM UserRoles`

    Database.query(query, (err, result) => {
      if (err) {
        callback(err)
        return
      }

      callback(null, this.mapResult(<RowDataPacket[]>result))
    })
  }

  public static validate(
    model: UserRoleDto,
    callback: (err: string, valid: boolean) => void
  ): void {
    if (isLengthGreaterThan(model.name, 64)) {
      callback('Role name must not exceed 64 characters', false)
      return
    } else if (isNullOrEmpty(model.name)) {
      callback('Role name cannot be empty', false)
      return
    } else if (isLengthGreaterThan(model.description, 128)) {
      callback('Role description must not exceed 64 characters', false)
      return
    } else if (isNullOrEmpty(model.description)) {
      callback('Role description cannot be empty', false)
      return
    }

    callback(null, true)
  }

  public static mapRow(row: RowDataPacket): UserRoleDto | undefined {
    return row
      ? {
          userRoleId: row.UserRoleId,
          name: row.UserRoleName,
          description: row.UserRoleDesc,
        }
      : undefined
  }

  public static mapResult(result: RowDataPacket[]): UserRoleDto[] {
    const roles: UserRoleDto[] = []

    result.forEach((row: any) => {
      roles.push(this.mapRow(row))
    })

    return roles
  }
}
