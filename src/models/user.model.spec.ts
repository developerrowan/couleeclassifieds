import { UserDto } from './user.dto'
import UserModel from './user.model'

/**
 * Note: If you one day plan on TS / NodeJS, etc, this is NOT the ideal way to
 * test the database.
 *
 * Currently, I am doing this via integration testing, which means I am performing
 * operations on a live (presumably dummy) database. This is not ideal for multiple reasons:
 *  * the data within the database is not guaranteed to be accurate for the tests
 *  * this method requires a live database (separate from prod)
 *
 * The BEST way to do this, in my opinion, is through unit tests. However, unit tests
 * require extensive mocking to be done to make it work. It provides the most accurate picture,
 * but the most complex test setup (this can take weeks to get right).
 *
 * Typically, I would mock and do unit tests, but time is not on my side here. But, a note!
 */
describe('User model', () => {
  const mockUserModel: UserDto = {
    userId: 0,
    firstName: 'TEST',
    lastName: 'USER',
    email: 'test@testttt.com',
    password: 'asdc241254dsad$',
    role: 3,
    active: true,
  }

  it(`should return users on call of findAllUsers`, done => {
    // Arrange / Act
    UserModel.findAllUsers((_, result) => {
      // Assert
      expect(result.length).toBeGreaterThan(1)
      done()
    })
  })

  it(`should return no users on call of findUserById with
    invalid data`, done => {
    // Arrange / Act
    UserModel.findUserById(9999999, (_, result) => {
      // Assert
      expect(result).toBeUndefined()
      done()
    })
  })

  it(`should return a user on call of findUserById
    with valid data`, done => {
    // Arrange / Act
    UserModel.findUserById(1, (_, result) => {
      // Assert
      expect(result).toBeDefined()
      done()
    })
  })

  it(`should return no users on call of findUserByEmail with
    invalid data`, done => {
    // Arrange / Act
    UserModel.findUserByEmail('jeff@amazon.com', (_, result) => {
      // Assert
      expect(result).toBeUndefined()
      done()
    })
  })

  it(`should return a user on call of findUserByEmail
    with valid data`, done => {
    // Arrange / Act
    UserModel.findUserByEmail('john@doe.com', (_, result) => {
      // Assert
      expect(result).toBeDefined()
      done()
    })
  })

  let uid = 0

  it(`should create a new user`, done => {
    // Arrange / Act
    UserModel.insertUser(mockUserModel, (_, result) => {
      // Assert
      uid = result
      expect(result).toBeTruthy()
      done()
    })
  })

  it(`should update the previously created user`, done => {
    mockUserModel.userId = uid
    mockUserModel.firstName = 'Jimmy'

    // Arrange / Act
    UserModel.updateUser(mockUserModel, (_, result) => {
      // Assert
      expect(result).toBe(1)
      done()
    })
  })

  /**
   * andddd this is why I'm not entirely comfortable with integration tests...
   */
  it(`should delete the previously created user`, done => {
    // preventing complete and total disaster
    if (uid === 0 || uid === undefined) {
      expect(true).toBeFalsy()
      done()
    }

    // Arrange / Act
    UserModel.deleteUser(uid, (_, result) => {
      // Assert
      expect(result).toBe(1)
      done()
    })
  })

  it(`should return no affected rows on call of updateUser`, done => {
    // Arrange / Act
    UserModel.updateUser(mockUserModel, (_, result) => {
      // Assert
      expect(result).toBeFalsy()
      done()
    })
  })

  it(`should return no affected rows on call of deleteUser`, done => {
    // Arrange / Act
    UserModel.deleteUser(uid, (_, result) => {
      // Assert
      expect(result).toBe(0)
      done()
    })
  })

  it(`should return false with an error message when model is invalid`, () => {
    mockUserModel.password = ''

    UserModel.validate(mockUserModel, (err, valid) => {
      expect(err).toBe('Password must be at least 8 characters')
      expect(valid).toBeFalsy()
    })
  })
})
