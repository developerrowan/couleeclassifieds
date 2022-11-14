import { QueryCallback } from '../types/types'
import { JobDto } from './job.dto'
import Database from '../db'
import { OkPacket, RowDataPacket } from 'mysql2'

export default abstract class JobModel {
  /**
   * Inserts a Job into the database
   * @param model Job DTO
   * @param callback Callback
   * @returns (via callback) Insertion ID
   */
  public static insertJob(model: JobDto, callback: QueryCallback): void {
    const query = `INSERT INTO Jobs
                            (JobPostedByUser,
                            JobPayRangeMin,
                            JobPayRangeMax,
                            JobCity,
                            JobState,
                            JobZip,
                            JobDescription,
                            JobCompanyName,
                            JobPostedDate)
                        VALUES (
                            ${model.jobPostedByUser},
                            ${model.jobPayRangeMin},
                            ${model.jobPayRangeMax},
                            ${Database.escape(model.jobCity)},
                            ${Database.escape(model.jobState)},
                            ${Database.escape(model.jobZip)},
                            ${Database.escape(model.jobDescription)},
                            ${Database.escape(model.jobCompanyName)},
                            '${model.jobPostedDate}')`

    Database.query(query, (err, result) => {
      if (err) {
        callback(err)
        return
      }

      callback(null, (<OkPacket>result).insertId)
    })
  }

  /**
   * Updates a Job based off a Job DTO
   * @param model Job DTO
   * @param callback Callback
   * @returns (via callback) Insertion ID
   */
  public static updateJob(model: JobDto, callback: QueryCallback): void {
    const query = `UPDATE Jobs
                        SET JobPostedByUser = ${model.jobPostedByUser},
                            JobPayRangeMin = ${model.jobPayRangeMin},
                            JobPayRangeMax = ${model.jobPayRangeMax},
                            JobCity = ${Database.escape(model.jobCity)},
                            JobState = ${Database.escape(model.jobState)},
                            JobZip = ${Database.escape(model.jobZip)},
                            JobDescription = ${Database.escape(
                              model.jobDescription
                            )},
                            JobCompanyName = ${Database.escape(
                              model.jobCompanyName
                            )},
                            JobPostedDate = '${model.jobPostedDate}'
                        WHERE JobId = ${model.jobId}`

    Database.query(query, (err, result) => {
      if (err) {
        callback(err)
        return
      }

      callback(null, (<OkPacket>result).affectedRows)
    })
  }

  /**
   * Deletes a Job based off its ID
   * @param id Job ID
   * @param callback Callback
   * @returns (via callback) Affected row count
   */
  public static deleteJob(id: number, callback: QueryCallback): void {
    const query = `DELETE FROM Jobs WHERE JobId = ${id}`

    Database.query(query, (err, result) => {
      if (err) {
        callback(err)
        return
      }

      callback(null, (<OkPacket>result).affectedRows)
    })
  }

  /**
   * Finds a Job based off a provided ID
   * @param id Job ID
   * @param callback Callback
   * @returns (via callback) JobDto if it exists, else undefined
   */
  public static findJobById(id: number, callback: QueryCallback): void {
    const query = `SELECT * FROM Jobs WHERE JobId = ${id}`

    Database.query(query, (err, result) => {
      if (err) {
        callback(err)
        return
      }

      callback(null, this.mapRow((<RowDataPacket>result)[0]))
    })
  }

  /**
   * Finds a Job based off a provided User ID
   * @param id User ID
   * @param callback Callback
   * @returns (via callback) JobDto if it exists, else undefined
   */
  public static findJobsPostedByUser(
    id: number,
    callback: QueryCallback
  ): void {
    const query = `SELECT * FROM Jobs WHERE JobPostedByUser = ${id}`

    Database.query(query, (err, result) => {
      if (err) {
        callback(err)
        return
      }

      callback(null, this.mapResult(<RowDataPacket[]>result))
    })
  }

  /**
   * Finds and returns all jobs
   * @param callback Callback
   * @returns (via callback) Array of JobDtos
   */
  public static findAllJobs(callback: QueryCallback): void {
    const query = `SELECT * FROM Jobs`

    Database.query(query, (err, result) => {
      if (err) {
        callback(err)
        return
      }

      callback(null, this.mapResult(<RowDataPacket[]>result))
    })
  }

  public static mapRow(row: RowDataPacket): JobDto | undefined {
    return row
      ? {
          jobId: row.JobId,
          jobPostedByUser: row.JobPostedByUser,
          jobPayRangeMin: row.JobPayRangeMin,
          jobPayRangeMax: row.JobPayRangeMax,
          jobCity: row.JobCity,
          jobState: row.JobState,
          jobZip: row.JobZip,
          jobDescription: row.JobDescription,
          jobCompanyName: row.JobCompanyName,
          jobPostedDate: row.JobPostedDate,
        }
      : undefined
  }

  public static mapResult(result: RowDataPacket[]): JobDto[] {
    const jobs: JobDto[] = []

    result.forEach((row: any) => {
      jobs.push(this.mapRow(row))
    })

    return jobs
  }
}
