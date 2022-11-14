import { UserProfileDto } from './user-profile.dto'
import UserProfileModel from './user-profile.model'

describe('User profile model', () => {
  const mockUserProfileModel: UserProfileDto = {
    userProfileId: 0,
    userId: 1,
    userSalutation: 'Mr.',
    profilePhotoUrl: 'www.google.com',
    userStreet: '123 Test St.',
    userCity: 'Test',
    userState: 'WI',
    userZip: '12345',
  }

  it(`should return user profiles on call of findAllUserProfiles`, done => {
    // Arrange / Act
    UserProfileModel.findAllUserProfiles((_, result) => {
      // Assert
      expect(result.length).toBeGreaterThan(1)
      done()
    })
  })

  it(`should return no user profiles on call of findUserProfileById with
    invalid data`, done => {
    // Arrange / Act
    UserProfileModel.findUserProfileById(9999999, (_, result) => {
      // Assert
      expect(result).toBeUndefined()
      done()
    })
  })

  it(`should return a user profile on call of findUserProfileById
    with valid data`, done => {
    // Arrange / Act
    UserProfileModel.findUserProfileById(1, (_, result) => {
      // Assert
      expect(result).toBeDefined()
      done()
    })
  })

  it(`should return no user profiles on call of findUserProfileByUserId with
    invalid data`, done => {
    // Arrange / Act
    UserProfileModel.findUserProfileByUserId(9999999, (_, result) => {
      // Assert
      expect(result).toBeUndefined()
      done()
    })
  })

  it(`should return a user profile on call of findUserProfileByUserId
    with valid data`, done => {
    // Arrange / Act
    UserProfileModel.findUserProfileByUserId(1, (_, result) => {
      // Assert
      expect(result).toBeDefined()
      done()
    })
  })

  let uid = 0

  it(`should create a new user profile`, done => {
    // Arrange / Act
    UserProfileModel.insertUserProfile(mockUserProfileModel, (_, result) => {
      // Assert
      uid = result
      expect(result).toBeTruthy()
      done()
    })
  })

  it(`should update the previously created user profile`, done => {
    mockUserProfileModel.userProfileId = uid
    mockUserProfileModel.userCity = 'Null Island'

    // Arrange / Act
    UserProfileModel.updateUserProfile(mockUserProfileModel, (_, result) => {
      // Assert
      expect(result).toBe(1)
      done()
    })
  })

  it(`should delete the previously created user profile`, done => {
    // preventing complete and total disaster
    if (uid === 0 || uid === undefined) {
      expect(true).toBeFalsy()
      done()
    }

    // Arrange / Act
    UserProfileModel.deleteUserProfile(uid, (_, result) => {
      // Assert
      expect(result).toBe(1)
      done()
    })
  })

  it(`should return no affected rows on call of updateUserProfile`, done => {
    // Arrange / Act
    UserProfileModel.updateUserProfile(mockUserProfileModel, (_, result) => {
      // Assert
      expect(result).toBe(0)
      done()
    })
  })

  it(`should return no affected rows on call of deleteUserProfile`, done => {
    // Arrange / Act
    UserProfileModel.deleteUserProfile(uid, (_, result) => {
      // Assert
      expect(result).toBe(0)
      done()
    })
  })
})
