import { QueryCallback } from '../types/types'
import { ResumeSkillDto } from './resume-skill.dto'
import Database from '../db'
import { OkPacket, RowDataPacket } from 'mysql2'

export default abstract class ResumeSkillModel {
  /**
   * Inserts a Resume Skill into the database
   * @param model Resume Skill DTO
   * @param callback Callback
   * @returns (via callback) Insertion ID
   */
  public static insertResumeSkill(
    model: ResumeSkillDto,
    callback: QueryCallback
  ): void {
    const query = `INSERT INTO ResumeSkill
                            (ResumeId, ResumeSkillDescription)
                        VALUES (${model.resumeId}, ${Database.escape(
      model.resumeSkillDescription
    )})`

    Database.query(query, (err, result) => {
      if (err) {
        callback(err)
        return
      }

      callback(null, (<OkPacket>result).insertId)
    })
  }

  /**
   * Updates a Resume Skill based off a Resume Skill DTO
   * @param model Resume Skill DTO
   * @param callback Callback
   * @returns (via callback) Affected row count
   */
  public static updateResumeSkill(
    model: ResumeSkillDto,
    callback: QueryCallback
  ): void {
    const query = `UPDATE ResumeSkill
                         SET ResumeId = ${model.resumeId},
                             ResumeSkillDescription = ${Database.escape(
                               model.resumeSkillDescription
                             )}
                         WHERE ResumeSkillId = ${model.resumeSkillId}`

    Database.query(query, (err, result) => {
      if (err) {
        callback(err)
        return
      }

      callback(null, (<OkPacket>result).affectedRows)
    })
  }

  /**
   * Deletes a Resume Skill based off its ID
   * @param id Resume Skill ID
   * @param callback Callback
   * @returns (via callback) Affected row count
   */
  public static deleteResumeSkill(id: number, callback: QueryCallback): void {
    const query = `DELETE FROM ResumeSkill WHERE ResumeSkillId = ${id}`

    Database.query(query, (err, result) => {
      if (err) {
        callback(err)
        return
      }

      callback(null, (<OkPacket>result).affectedRows)
    })
  }

  /**
   * Finds a Resume Skill based off a provided ID
   * @param id Resume Skill ID
   * @param callback Callback
   * @returns (via callback) ResumeSkillDto if it exists, else undefined
   */
  public static findResumeSkillById(id: number, callback: QueryCallback): void {
    const query = `SELECT * FROM ResumeSkill WHERE ResumeSkillId = ${id}`

    Database.query(query, (err, result) => {
      if (err) {
        callback(err)
        return
      }

      callback(null, this.mapRow((<RowDataPacket>result)[0]))
    })
  }

  /**
   * Finds Resume Skills associated with a Resume ID
   * @param email Resume ID
   * @param callback Callback
   * @returns (via callback) Array of ResumeSkillDtos
   */
  public static findResumeSkillsByResumeId(
    id: number,
    callback: QueryCallback
  ): void {
    const query = `SELECT * FROM ResumeSkill WHERE ResumeId = ${id}`

    Database.query(query, (err, result) => {
      if (err) {
        callback(err)
        return
      }

      callback(null, this.mapResult(<RowDataPacket[]>result))
    })
  }

  /**
   * Finds and returns all resume skills
   * @param callback Callback
   * @returns (via callback) Array of ResumeSkillDtos
   */
  public static findAllResumeSkills(callback: QueryCallback): void {
    const query = `SELECT * FROM ResumeSkill`

    Database.query(query, (err, result) => {
      if (err) {
        callback(err)
        return
      }

      callback(null, this.mapResult(<RowDataPacket[]>result))
    })
  }

  public static mapRow(row: RowDataPacket): ResumeSkillDto | undefined {
    return row
      ? {
          resumeSkillId: row.ResumeSkillId,
          resumeId: row.ResumeId,
          resumeSkillDescription: row.ResumeSkillDescription,
        }
      : undefined
  }

  public static mapResult(result: RowDataPacket[]): ResumeSkillDto[] {
    const resumeSkills: ResumeSkillDto[] = []

    result.forEach((row: any) => {
      resumeSkills.push(this.mapRow(row))
    })

    return resumeSkills
  }
}
