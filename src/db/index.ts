import { QueryCallback } from './../types/types'
import mysql from 'mysql2'
import * as dotenv from 'dotenv'

export default class Database {
  private static connection: mysql.Connection = null

  private static try_connection(): void {
    if (Database.connection === null) {
      dotenv.config()

      console.info('Establishing connection to database')

      Database.connection = mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DATABASE,
      })
    }
  }

  /**
   * Queries the database
   * @param sql SQL query to execute
   * @param callback Query callback (error, result)
   */
  public static async query(
    sql: string,
    callback: QueryCallback
  ): Promise<void> {
    Database.try_connection()

    console.info(`Executing query ${sql}`)

    Database.connection.query(sql, (err, result) => {
      if (err) {
        callback(err)
        return
      }

      callback(null, result)
    })
  }

  /**
   * Sanitizes a string to prevent SQL injection
   * @param str Input string
   * @returns Escaped string
   */
  public static escape(str: string): string {
    Database.try_connection()

    return Database.connection.escape(str)
  }
}
