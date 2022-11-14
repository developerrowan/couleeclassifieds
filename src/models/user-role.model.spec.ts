import { UserRoleDto } from './user-role.dto'
import UserRoleModel from './user-role.model'

describe('User role model', () => {
  const mockUserRoleModel: UserRoleDto = {
    userRoleId: 0,
    name: 'TEST',
    description: 'Testing',
  }

  it(`should return user roles on call of findAllUserRoles`, done => {
    // Arrange / Act
    UserRoleModel.findAllUserRoles((_, result) => {
      // Assert
      expect(result.length).toBeGreaterThan(1)
      done()
    })
  })

  it(`should return no users on call of findUserRoleById with
    invalid data`, done => {
    // Arrange / Act
    UserRoleModel.findUserRoleById(9999999, (_, result) => {
      // Assert
      expect(result).toBeUndefined()
      done()
    })
  })

  it(`should return a user role on call of findUserRoleById
    with valid data`, done => {
    // Arrange / Act
    UserRoleModel.findUserRoleById(1, (_, result) => {
      // Assert
      expect(result).toBeDefined()
      done()
    })
  })

  let uid = 0

  it(`should create a new user role`, done => {
    // Arrange / Act
    UserRoleModel.insertUserRole(mockUserRoleModel, (_, result) => {
      // Assert
      uid = result
      expect(result).toBeTruthy()
      done()
    })
  })

  it(`should update the previously created user role`, done => {
    mockUserRoleModel.userRoleId = uid
    mockUserRoleModel.name = 'Admin'

    // Arrange / Act
    UserRoleModel.updateUserRole(mockUserRoleModel, (_, result) => {
      // Assert
      expect(result).toBe(1)
      done()
    })
  })

  it(`should delete the previously created user role`, done => {
    // preventing complete and total disaster
    if (uid === 0 || uid === undefined) {
      expect(true).toBeFalsy()
      done()
    }

    // Arrange / Act
    UserRoleModel.deleteUserRole(uid, (_, result) => {
      // Assert
      expect(result).toBe(1)
      done()
    })
  })

  it(`should return no affected rows on call of updateUserRole`, done => {
    // Arrange / Act
    UserRoleModel.updateUserRole(mockUserRoleModel, (_, result) => {
      // Assert
      expect(result).toBe(0)
      done()
    })
  })

  it(`should return no affected rows on call of deleteUserRole`, done => {
    // Arrange / Act
    UserRoleModel.deleteUserRole(uid, (_, result) => {
      // Assert
      expect(result).toBe(0)
      done()
    })
  })
})
