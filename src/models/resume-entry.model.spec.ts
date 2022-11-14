import { ResumeEntryDto } from './resume-entry.dto'
import ResumeEntryModel from './resume-entry.model'

describe('Resume entry model', () => {
  const mockResumeEntryModel: ResumeEntryDto = {
    resumeEntryId: 0,
    resumeId: 1,
    resumeEntryType: 'WORK',
    resumeEntryTitle: 'Widget counter',
    resumeEntryOrganizationOrInstitution: 'Widget Inc.',
    resumeEntryLocationCity: 'Test',
    resumeEntryLocationState: 'WI',
    resumeEntryDateStarted: new Date('2022-01-01'),
    resumeEntryDateEnded: null,
    resumeEntryDescription: 'I counted widgets',
  }

  it(`should return resume skills on call of findAllResumeEntries`, done => {
    // Arrange / Act
    ResumeEntryModel.findAllResumeEntries((_, result) => {
      // Assert
      expect(result.length).toBeGreaterThanOrEqual(1)
      done()
    })
  })

  it(`should return no resume entry on call of findResumeEntryById with
        invalid data`, done => {
    // Arrange / Act
    ResumeEntryModel.findResumeEntryById(9999999, (_, result) => {
      // Assert
      expect(result).toBeUndefined()
      done()
    })
  })

  it(`should return a resume entry on call of findResumeEntryById
        with valid data`, done => {
    // Arrange / Act
    ResumeEntryModel.findResumeEntryById(1, (_, result) => {
      // Assert
      expect(result).toBeDefined()
      done()
    })
  })

  it(`should return no resume entries on call of findResumeEntriesByResumeId with
    invalid data`, done => {
    // Arrange / Act
    ResumeEntryModel.findResumeEntriesByResumeId(9999999, (_, result) => {
      // Assert
      expect(result.length).toBe(0)
      done()
    })
  })

  it(`should return resume entries on call of findResumeEntriesByResumeId
    with valid data`, done => {
    // Arrange / Act
    ResumeEntryModel.findResumeEntriesByResumeId(1, (_, result) => {
      // Assert
      expect(result.length).toBeGreaterThanOrEqual(1)
      done()
    })
  })

  let rid = 0

  it(`should create a new resume entry`, done => {
    // Arrange / Act
    ResumeEntryModel.insertResumeEntry(mockResumeEntryModel, (_, result) => {
      // Assert
      rid = result
      expect(result).toBeTruthy()
      done()
    })
  })

  it(`should update the previously created resume entry`, done => {
    mockResumeEntryModel.resumeEntryId = rid
    mockResumeEntryModel.resumeEntryDescription = 'AAAAAAA'

    // Arrange / Act
    ResumeEntryModel.updateResumeEntry(mockResumeEntryModel, (_, result) => {
      // Assert
      expect(result).toBe(1)
      done()
    })
  })

  it(`should delete the previously created resume entry`, done => {
    // preventing complete and total disaster
    if (rid === 0 || rid === undefined) {
      expect(true).toBeFalsy()
      done()
    }

    // Arrange / Act
    ResumeEntryModel.deleteResumeEntry(rid, (_, result) => {
      // Assert
      expect(result).toBe(1)
      done()
    })
  })

  it(`should return no affected rows on call of updateResumeEntry`, done => {
    // Arrange / Act
    ResumeEntryModel.updateResumeEntry(mockResumeEntryModel, (_, result) => {
      // Assert
      expect(result).toBe(0)
      done()
    })
  })

  it(`should return no affected rows on call of deleteResumeEntry`, done => {
    // Arrange / Act
    ResumeEntryModel.deleteResumeEntry(rid, (_, result) => {
      // Assert
      expect(result).toBe(0)
      done()
    })
  })
})
