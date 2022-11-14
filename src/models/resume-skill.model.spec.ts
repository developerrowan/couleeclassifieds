import { ResumeSkillDto } from './resume-skill.dto'
import ResumeSkillModel from './resume-skill.model'

describe('Resume skill model', () => {
  const mockResumeSkillModel: ResumeSkillDto = {
    resumeSkillId: 0,
    resumeId: 1,
    resumeSkillDescription: 'I can count widgets',
  }

  it(`should return resume skills on call of findAllResumeSkills`, done => {
    // Arrange / Act
    ResumeSkillModel.findAllResumeSkills((_, result) => {
      // Assert
      expect(result.length).toBeGreaterThanOrEqual(1)
      done()
    })
  })

  it(`should return no resumes on call of findResumeSkillById with
        invalid data`, done => {
    // Arrange / Act
    ResumeSkillModel.findResumeSkillById(9999999, (_, result) => {
      // Assert
      expect(result).toBeUndefined()
      done()
    })
  })

  it(`should return a resume skill on call of findResumeSkillById
        with valid data`, done => {
    // Arrange / Act
    ResumeSkillModel.findResumeSkillById(1, (_, result) => {
      // Assert
      expect(result).toBeDefined()
      done()
    })
  })

  it(`should return no resume skills on call of findResumeSkillsByResumeId with
    invalid data`, done => {
    // Arrange / Act
    ResumeSkillModel.findResumeSkillsByResumeId(9999999, (_, result) => {
      // Assert
      expect(result.length).toBe(0)
      done()
    })
  })

  it(`should return resume skills on call of findResumeSkillsByResumeId
    with valid data`, done => {
    // Arrange / Act
    ResumeSkillModel.findResumeSkillsByResumeId(1, (_, result) => {
      // Assert
      expect(result.length).toBeGreaterThanOrEqual(1)
      done()
    })
  })

  let rid = 0

  it(`should create a new resume skill`, done => {
    // Arrange / Act
    ResumeSkillModel.insertResumeSkill(mockResumeSkillModel, (_, result) => {
      // Assert
      rid = result
      expect(result).toBeTruthy()
      done()
    })
  })

  it(`should update the previously created resume skill`, done => {
    mockResumeSkillModel.resumeSkillId = rid
    mockResumeSkillModel.resumeSkillDescription = 'AAAAAAA'

    // Arrange / Act
    ResumeSkillModel.updateResumeSkill(mockResumeSkillModel, (_, result) => {
      // Assert
      expect(result).toBe(1)
      done()
    })
  })

  it(`should delete the previously created resume skill`, done => {
    // preventing complete and total disaster
    if (rid === 0 || rid === undefined) {
      expect(true).toBeFalsy()
      done()
    }

    // Arrange / Act
    ResumeSkillModel.deleteResumeSkill(rid, (_, result) => {
      // Assert
      expect(result).toBe(1)
      done()
    })
  })

  it(`should return no affected rows on call of updateResumeSkill`, done => {
    // Arrange / Act
    ResumeSkillModel.updateResumeSkill(mockResumeSkillModel, (_, result) => {
      // Assert
      expect(result).toBe(0)
      done()
    })
  })

  it(`should return no affected rows on call of deleteResumeSkill`, done => {
    // Arrange / Act
    ResumeSkillModel.deleteResumeSkill(rid, (_, result) => {
      // Assert
      expect(result).toBe(0)
      done()
    })
  })
})
