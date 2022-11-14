/**
 * Checks if object is null or empty
 * @param object Any object
 * @returns True if null or empty, false if not
 */
export function isNullOrEmpty(object: any): boolean {
  return (
    object === null || object.length <= 0 || Object.keys(object).length === 0
  )
}

/**
 * Checks if string's length is greater than a number
 * @param object String to check
 * @param length Length
 * @returns True if greater than, false if not
 */
export function isLengthGreaterThan(object: string, length: number): boolean {
  return object.toString().length > length
}

/**
 * Checks if string's length is less than a number
 * @param object String to check
 * @param length Length
 * @returns True if less than, false if not
 */
export function isLengthLessThan(object: string, length: number): boolean {
  return object.toString().length < length
}
