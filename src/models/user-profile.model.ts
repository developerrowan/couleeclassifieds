import { UserProfileDto } from './user-profile.dto'
import { QueryCallback } from '../types/types'
import Database from '../db'
import { OkPacket, RowDataPacket } from 'mysql2'

export default abstract class UserProfileModel {
  /**
   * Inserts a User Profile into the database
   * @param model User Profile Model
   * @param callback Callback
   * @returns (via callback) Insertion ID
   */
  public static insertUserProfile(
    model: UserProfileDto,
    callback: QueryCallback
  ): void {
    const query = `INSERT INTO UserProfiles
                                    (UserId,
                                    UserSalutation,
                                    ProfilePhotoUrl,
                                    UserStreet,
                                    UserCity,
                                    UserState,
                                    UserZip)
                                   VALUES
                                    (${model.userId},
                                    ${Database.escape(model.userSalutation)},
                                    ${Database.escape(model.profilePhotoUrl)},
                                    ${Database.escape(model.userStreet)},
                                    ${Database.escape(model.userCity)},
                                    ${Database.escape(model.userState)},
                                    ${Database.escape(model.userZip)})`

    Database.query(query, (err, result) => {
      if (err) {
        callback(err)
        return
      }

      callback(null, (<OkPacket>result).insertId)
    })
  }

  /**
   * Updates a User Profile based off a User Profile DTO
   * @param model User Profile DTO
   * @param callback Callback
   * @returns (via callback) Affected row count
   */
  public static updateUserProfile(
    model: UserProfileDto,
    callback: QueryCallback
  ): void {
    const query = `UPDATE UserProfiles
                        SET UserId = ${model.userId},
                            UserSalutation = ${Database.escape(
                              model.userSalutation
                            )},
                            ProfilePhotoUrl = ${Database.escape(
                              model.profilePhotoUrl
                            )},
                            UserStreet = ${Database.escape(model.userStreet)},
                            UserCity = ${Database.escape(model.userCity)},
                            UserState = ${Database.escape(model.userState)},
                            UserZip = ${Database.escape(model.userZip)}
                        WHERE UserProfileId = ${model.userProfileId}`

    Database.query(query, (err, result) => {
      if (err) {
        callback(err)
        return
      }

      callback(null, (<OkPacket>result).affectedRows)
    })
  }

  /**
   * Deletes a User Profile based off its ID
   * @param id User Profile ID
   * @param callback Callback
   * @returns (via callback) Affected row count
   */
  public static deleteUserProfile(id: number, callback: QueryCallback): void {
    const query = `DELETE FROM UserProfiles WHERE UserProfileId = ${id}`

    Database.query(query, (err, result) => {
      if (err) {
        callback(err)
        return
      }

      callback(null, (<OkPacket>result).affectedRows)
    })
  }

  /**
   * Finds a User Profile based off a provided ID
   * @param id User Profile ID
   * @param callback Callback
   * @returns (via callback) UserProfileDto if it exists, else undefined
   */
  public static findUserProfileById(id: number, callback: QueryCallback): void {
    const query = `SELECT * FROM UserProfiles WHERE UserProfileId = ${id}`

    Database.query(query, (err, result) => {
      if (err) {
        callback(err)
        return
      }

      callback(null, this.mapRow((<RowDataPacket>result)[0]))
    })
  }

  /**
   * Finds a User Profile based off a user ID
   * @param id User ID
   * @param callback Callback
   * @returns (via callback) UserProfileDto if it exists, else undefined
   */
  public static findUserProfileByUserId(
    id: number,
    callback: QueryCallback
  ): void {
    const query = `SELECT * FROM UserProfiles WHERE UserId = ${id}`

    Database.query(query, (err, result) => {
      if (err) {
        callback(err)
        return
      }

      callback(null, this.mapRow((<RowDataPacket>result)[0]))
    })
  }

  /**
   * Finds and returns all user profiles
   * @param callback Callback
   * @returns (via callback) Array of UserProfileDtos
   */
  public static findAllUserProfiles(callback: QueryCallback): void {
    const query = `SELECT * FROM UserProfiles`

    Database.query(query, (err, result) => {
      if (err) {
        callback(err)
        return
      }

      callback(null, this.mapResult(<RowDataPacket[]>result))
    })
  }

  public static mapRow(row: RowDataPacket): UserProfileDto | undefined {
    return row
      ? {
          userProfileId: row.UserProfileId,
          userId: row.UserId,
          userSalutation: row.UserSalutation,
          profilePhotoUrl: row.ProfilePhotoUrl,
          userStreet: row.UserStreet,
          userCity: row.UserCity,
          userState: row.UserState,
          userZip: row.UserZip,
        }
      : undefined
  }

  public static mapResult(result: RowDataPacket[]): UserProfileDto[] {
    const users: UserProfileDto[] = []

    result.forEach((row: any) => {
      users.push(this.mapRow(row))
    })

    return users
  }
}
