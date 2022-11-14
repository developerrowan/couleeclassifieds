import { QueryCallback } from '../types/types'
import { ResumeDto } from './resume.dto'
import Database from '../db'
import { OkPacket, RowDataPacket } from 'mysql2'

export default abstract class ResumeModel {
  /**
   * Inserts a Resume into the database
   * @param model Resume DTO
   * @param callback Callback
   * @returns (via callback) Insertion ID
   */
  public static insertResume(model: ResumeDto, callback: QueryCallback): void {
    const query = `INSERT INTO Resumes
                            (ResumeBelongsToUser)
                        VALUES (${model.resumeBelongsToUser})`

    Database.query(query, (err, result) => {
      if (err) {
        callback(err)
        return
      }

      callback(null, (<OkPacket>result).insertId)
    })
  }

  /**
   * Updates a Resume based off a Resume DTO
   * @param model Resume DTO
   * @param callback Callback
   * @returns (via callback) Affected row count
   */
  public static updateResume(model: ResumeDto, callback: QueryCallback): void {
    const query = `UPDATE Resumes
                         SET ResumeBelongsToUser = ${model.resumeBelongsToUser}
                         WHERE ResumeId = ${model.resumeId}`

    Database.query(query, (err, result) => {
      if (err) {
        callback(err)
        return
      }

      callback(null, (<OkPacket>result).affectedRows)
    })
  }

  /**
   * Deletes a Resume based off its ID
   * @param id Resume ID
   * @param callback Callback
   * @returns (via callback) Affected row count
   */
  public static deleteResume(id: number, callback: QueryCallback): void {
    const query = `DELETE FROM Resumes WHERE ResumeId = ${id}`

    Database.query(query, (err, result) => {
      if (err) {
        callback(err)
        return
      }

      callback(null, (<OkPacket>result).affectedRows)
    })
  }

  /**
   * Finds a Resume based off a provided ID
   * @param id Resume ID
   * @param callback Callback
   * @returns (via callback) ResumeDto if it exists, else undefined
   */
  public static findResumeById(id: number, callback: QueryCallback): void {
    const query = `SELECT * FROM Resumes WHERE ResumeId = ${id}`

    Database.query(query, (err, result) => {
      if (err) {
        callback(err)
        return
      }

      callback(null, this.mapRow((<RowDataPacket>result)[0]))
    })
  }

  /**
   * Finds a Resume based off a provided user ID
   * @param email Resume ID
   * @param callback Callback
   * @returns (via callback) ResumeDto if it exists, else undefined
   */
  public static findResumeByUserId(id: number, callback: QueryCallback): void {
    const query = `SELECT * FROM Resumes WHERE ResumeBelongsToUser = ${id}`

    Database.query(query, (err, result) => {
      if (err) {
        callback(err)
        return
      }

      callback(null, this.mapRow((<RowDataPacket>result)[0]))
    })
  }

  /**
   * Finds and returns all resumes
   * @param callback Callback
   * @returns (via callback) Array of ResumeDtos
   */
  public static findAllResumes(callback: QueryCallback): void {
    const query = `SELECT * FROM Resumes`

    Database.query(query, (err, result) => {
      if (err) {
        callback(err)
        return
      }

      callback(null, this.mapResult(<RowDataPacket[]>result))
    })
  }

  public static mapRow(row: RowDataPacket): ResumeDto | undefined {
    return row
      ? {
          resumeId: row.ResumeId,
          resumeBelongsToUser: row.ResumeBelongsToUser,
        }
      : undefined
  }

  public static mapResult(result: RowDataPacket[]): ResumeDto[] {
    const resumes: ResumeDto[] = []

    result.forEach((row: any) => {
      resumes.push(this.mapRow(row))
    })

    return resumes
  }
}
