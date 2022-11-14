import { Response } from 'express'
import { ResumeDto } from './resume.dto'
import ResumeModel from './resume.model'

describe('Resume model', () => {
  const mockResumeModel: ResumeDto = {
    resumeId: 0,
    resumeBelongsToUser: 1,
  }

  it(`should return resumes on call of findAllResumes`, done => {
    // Arrange / Act
    ResumeModel.findAllResumes((_, result) => {
      // Assert
      expect(result.length).toBeGreaterThanOrEqual(1)
      done()
    })
  })

  it(`should return no users on call of findResumeById with
        invalid data`, done => {
    // Arrange / Act
    ResumeModel.findResumeById(9999999, (_, result) => {
      // Assert
      expect(result).toBeUndefined()
      done()
    })
  })

  it(`should return a resume on call of findResumeById
        with valid data`, done => {
    // Arrange / Act
    ResumeModel.findResumeById(1, (_, result) => {
      // Assert
      expect(result).toBeDefined()
      done()
    })
  })

  it(`should return no resumes on call of findResumeByUserId with
    invalid data`, done => {
    // Arrange / Act
    ResumeModel.findResumeByUserId(9999999, (_, result) => {
      // Assert
      expect(result).toBeUndefined()
      done()
    })
  })

  it(`should return a resume on call of findResumeByUserId
    with valid data`, done => {
    // Arrange / Act
    ResumeModel.findResumeByUserId(1, (_, result) => {
      // Assert
      expect(result).toBeDefined()
      done()
    })
  })

  let rid = 0

  it(`should create a new resume`, done => {
    // Arrange / Act
    ResumeModel.insertResume(mockResumeModel, (_, result) => {
      // Assert
      rid = result
      expect(result).toBeTruthy()
      done()
    })
  })

  it(`should update the previously created resume`, done => {
    mockResumeModel.resumeId = rid
    mockResumeModel.resumeBelongsToUser = 2

    // Arrange / Act
    ResumeModel.updateResume(mockResumeModel, (_, result) => {
      // Assert
      expect(result).toBe(1)
      done()
    })
  })

  it(`should delete the previously created resume`, done => {
    // preventing complete and total disaster
    if (rid === 0 || rid === undefined) {
      expect(true).toBeFalsy()
      done()
    }

    // Arrange / Act
    ResumeModel.deleteResume(rid, (_, result) => {
      // Assert
      expect(result).toBe(1)
      done()
    })
  })

  it(`should return no affected rows on call of updateResume`, done => {
    // Arrange / Act
    ResumeModel.updateResume(mockResumeModel, (_, result) => {
      // Assert
      expect(result).toBe(0)
      done()
    })
  })

  it(`should return no affected rows on call of deleteResume`, done => {
    // Arrange / Act
    ResumeModel.deleteResume(rid, (_, result) => {
      // Assert
      expect(result).toBe(0)
      done()
    })
  })
})
