import { QueryError, RowDataPacket, OkPacket, ResultSetHeader } from 'mysql2'

export type NullableAny = any | null | undefined
export type NullableDate = Date | null | undefined
export type NullableString = string | null | undefined
export type NullableNumber = number | null | undefined
export type NullableBoolean = boolean | null | undefined

export type QueryCallback = (err: any, result?: any) => void

export type AuthenticationCallback = (
  err: any,
  result?: any,
  authToken?: any
) => void

export type LoginModel = {
  email: string
  password: string
  rememberMe?: boolean
}
