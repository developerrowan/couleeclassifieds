import { QueryCallback } from '../types/types'
import { ResumeEntryDto } from './resume-entry.dto'
import Database from '../db'
import { OkPacket, RowDataPacket } from 'mysql2'

export default abstract class ResumeEntryModel {
  /**
   * Inserts a Resume Entry into the database
   * @param model Resume Entry DTO
   * @param callback Callback
   * @returns (via callback) Insertion ID
   */
  public static insertResumeEntry(
    model: ResumeEntryDto,
    callback: QueryCallback
  ): void {
    const query = `INSERT INTO ResumeEntry
                            (ResumeId,
                            ResumeEntryType,
                            ResumeEntryTitle,
                            ResumeEntryOrganizationOrInstitution,
                            ResumeEntryLocationCity,
                            ResumeEntryLocationState,
                            ResumeEntryDateStarted,
                            ResumeEntryDateEnded,
                            ResumeEntryDescription)
                        VALUES (
                            ${model.resumeId},
                            ${Database.escape(model.resumeEntryType)},
                            ${Database.escape(model.resumeEntryTitle)},
                            ${Database.escape(
                              model.resumeEntryOrganizationOrInstitution
                            )},
                            ${Database.escape(model.resumeEntryLocationCity)},
                            ${Database.escape(model.resumeEntryLocationState)},
                            '${model.resumeEntryDateStarted}',
                            '${model.resumeEntryDateEnded}',
                            ${Database.escape(model.resumeEntryDescription)})`

    Database.query(query, (err, result) => {
      if (err) {
        callback(err)
        return
      }

      callback(null, (<OkPacket>result).insertId)
    })
  }

  /**
   * Updates a Resume entry based off a ResumeEntry DTO
   * @param model ResumeEntry DTO
   * @param callback Callback
   * @returns (via callback) Affected row count
   */
  public static updateResumeEntry(
    model: ResumeEntryDto,
    callback: QueryCallback
  ): void {
    const query = `UPDATE ResumeEntry
                         SET ResumeId = ${model.resumeId},
                             ResumeEntryType = ${Database.escape(
                               model.resumeEntryType
                             )},
                             ResumeEntryTitle = ${Database.escape(
                               model.resumeEntryTitle
                             )},
                             ResumeEntryOrganizationOrInstitution = ${Database.escape(
                               model.resumeEntryOrganizationOrInstitution
                             )},
                             ResumeEntryLocationCity = ${Database.escape(
                               model.resumeEntryLocationCity
                             )},
                             ResumeEntryLocationState = ${Database.escape(
                               model.resumeEntryLocationState
                             )},
                             ResumeEntryDateStarted = '${
                               model.resumeEntryDateStarted
                             }',
                             ResumeEntryDateEnded = '${
                               model.resumeEntryDateEnded
                             }',
                             ResumeEntryDescription = ${Database.escape(
                               model.resumeEntryDescription
                             )}
                         WHERE ResumeEntryId = ${model.resumeEntryId}`

    Database.query(query, (err, result) => {
      if (err) {
        callback(err)
        return
      }

      callback(null, (<OkPacket>result).affectedRows)
    })
  }

  /**
   * Deletes a Resume Entry based off its ID
   * @param id Resume Entry ID
   * @param callback Callback
   * @returns (via callback) Affected row count
   */
  public static deleteResumeEntry(id: number, callback: QueryCallback): void {
    const query = `DELETE FROM ResumeEntry WHERE ResumeEntryId = ${id}`

    Database.query(query, (err, result) => {
      if (err) {
        callback(err)
        return
      }

      callback(null, (<OkPacket>result).affectedRows)
    })
  }

  /**
   * Finds a Resume entry based on its ID
   * @param id Resume entry ID
   * @param callback Callback
   * @returns (via callback) ResumeEntryDto if it exists, else undefined
   */
  public static findResumeEntryById(id: number, callback: QueryCallback): void {
    const query = `SELECT * FROM ResumeEntry WHERE ResumeEntryId = ${id}`

    Database.query(query, (err, result) => {
      if (err) {
        callback(err)
        return
      }

      callback(null, this.mapRow((<RowDataPacket>result)[0]))
    })
  }

  /**
   * Finds Resume entries associated with a Resume ID
   * @param email Resume ID
   * @param callback Callback
   * @returns (via callback) Array of ResumeSkillDtos
   */
  public static findResumeEntriesByResumeId(
    id: number,
    callback: QueryCallback
  ): void {
    const query = `SELECT * FROM ResumeEntry WHERE ResumeEntryId = ${id}`

    Database.query(query, (err, result) => {
      if (err) {
        callback(err)
        return
      }

      callback(null, this.mapResult(<RowDataPacket[]>result))
    })
  }

  /**
   * Finds and returns all resume entries
   * @param callback Callback
   * @returns (via callback) Array of ResumeEntryDtos
   */
  public static findAllResumeEntries(callback: QueryCallback): void {
    const query = `SELECT * FROM ResumeEntry`

    Database.query(query, (err, result) => {
      if (err) {
        callback(err)
        return
      }

      callback(null, this.mapResult(<RowDataPacket[]>result))
    })
  }

  public static mapRow(row: RowDataPacket): ResumeEntryDto | undefined {
    return row
      ? {
          resumeEntryId: row.ResumeEntryId,
          resumeId: row.ResumeId,
          resumeEntryType: row.ResumeEntryType,
          resumeEntryTitle: row.ResumeEntryTitle,
          resumeEntryOrganizationOrInstitution:
            row.ResumeEntryOrganizationOrInstitution,
          resumeEntryLocationCity: row.ResumeEntryLocationCity,
          resumeEntryLocationState: row.ResumeEntryLocationState,
          resumeEntryDateStarted: row.ResumeEntryDateStarted,
          resumeEntryDateEnded: row.ResumeEntryDateEnded,
          resumeEntryDescription: row.ResumeEntryDescription,
        }
      : undefined
  }

  public static mapResult(result: RowDataPacket[]): ResumeEntryDto[] {
    const resumeEntries: ResumeEntryDto[] = []

    result.forEach((row: any) => {
      resumeEntries.push(this.mapRow(row))
    })

    return resumeEntries
  }
}
