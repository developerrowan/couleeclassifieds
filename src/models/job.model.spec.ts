import { JobDto } from './job.dto'
import JobModel from './job.model'

describe('Job model', () => {
  const mockJobModel: JobDto = {
    jobId: 0,
    jobPostedByUser: 1,
    jobPayRangeMin: 30000,
    jobPayRangeMax: 64000,
    jobCity: 'Test',
    jobState: 'WI',
    jobZip: '12345',
    jobDescription: 'This is a test job',
    jobCompanyName: 'Test Inc.',
    jobPostedDate: new Date('2022-01-01'),
  }

  it(`should return jobs on call of findAllJobs`, done => {
    // Arrange / Act
    JobModel.findAllJobs((_, result) => {
      // Assert
      expect(result.length).toBeGreaterThanOrEqual(1)
      done()
    })
  })

  it(`should return no jobs on call of findJobById with invalid data`, done => {
    // Arrange / Act
    JobModel.findJobById(9999999, (_, result) => {
      // Assert
      expect(result).toBeUndefined()
      done()
    })
  })

  it(`should return a job on call of findJobById with valid data`, done => {
    // Arrange / Act
    JobModel.findJobById(1, (_, result) => {
      // Assert
      expect(result).toBeDefined()
      done()
    })
  })

  it(`should return no jobs on call of findJobsPostedByUser with invalid data`, done => {
    // Arrange / Act
    JobModel.findJobsPostedByUser(9999999, (_, result) => {
      // Assert
      expect(result.length).toBe(0)
      done()
    })
  })

  it(`should return jobs on call of findJobsPostedByUser with valid data`, done => {
    // Arrange / Act
    JobModel.findJobsPostedByUser(1, (_, result) => {
      // Assert
      expect(result.length).toBeGreaterThanOrEqual(1)
      done()
    })
  })

  let jid = 0

  it(`should create a new job`, done => {
    // Arrange / Act
    JobModel.insertJob(mockJobModel, (_, result) => {
      // Assert
      jid = result
      expect(result).toBeTruthy()
      done()
    })
  })

  it(`should update the previously created job`, done => {
    mockJobModel.jobId = jid
    mockJobModel.jobCity = 'Null Island'

    // Arrange / Act
    JobModel.updateJob(mockJobModel, (_, result) => {
      // Assert
      expect(result).toBe(1)
      done()
    })
  })

  it(`should delete the previously created user`, done => {
    // preventing complete and total disaster
    if (jid === 0 || jid === undefined) {
      expect(true).toBeFalsy()
      done()
    }

    // Arrange / Act
    JobModel.deleteJob(jid, (_, result) => {
      // Assert
      expect(result).toBe(1)
      done()
    })
  })

  it(`should return no affected rows on call of updateJob`, done => {
    // Arrange / Act
    JobModel.updateJob(mockJobModel, (_, result) => {
      // Assert
      expect(result).toBe(0)
      done()
    })
  })

  it(`should return no affected rows on call of deleteUser`, done => {
    // Arrange / Act
    JobModel.deleteJob(jid, (_, result) => {
      // Assert
      expect(result).toBe(0)
      done()
    })
  })
})
