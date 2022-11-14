import {
  isNullOrEmpty,
  isLengthGreaterThan,
  isLengthLessThan,
} from './validation'

describe('Validation methods', () => {
  it(`should return true when object is null on call of isNullOrEmpty`, () => {
    // Arrange / Act
    const result = isNullOrEmpty(null)

    // Assert
    expect(result).toBeTruthy()
  })

  it(`should return true when object has length of 0 on call of isNullOrEmpty`, () => {
    // Arrange / Act
    const result = isNullOrEmpty({})

    // Assert
    expect(result).toBeTruthy()
  })

  it(`should return true when string has length of 0 on call of isNullOrEmpty`, () => {
    // Arrange / Act
    const result = isNullOrEmpty('')

    // Assert
    expect(result).toBeTruthy()
  })

  it(`should return false when object is not null or empty on
    call of isNullOrEmpty`, () => {
    // Arrange / Act
    const result = isNullOrEmpty('Hello, world!')

    // Assert
    expect(result).toBeFalsy()
  })

  it(`should return true when object's length is greater than 5 on
    call of isLengthGreaterThan`, () => {
    // Arrange / Act
    const result = isLengthGreaterThan('Hello, world!', 5)

    // Assert
    expect(result).toBeTruthy()
  })

  it(`should return false when object's length is less than 5 on
    call of isLengthGreaterThan`, () => {
    // Arrange / Act
    const result = isLengthGreaterThan('Test', 5)

    // Assert
    expect(result).toBeFalsy()
  })

  it(`should return true when object's length is less than 5 on
    call is lengthLessThan`, () => {
    // Arrange / Act
    const result = isLengthLessThan('Test', 5)

    // Assert
    expect(result).toBeTruthy()
  })

  it(`should return false when object's length is greater than 5 on
    call is lengthLessThan`, () => {
    // Arrange / Act
    const result = isLengthLessThan('Hello, world!', 5)

    // Assert
    expect(result).toBeFalsy()
  })
})
