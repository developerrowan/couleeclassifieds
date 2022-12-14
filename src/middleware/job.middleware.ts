import { Response, Request, NextFunction } from 'express'
import { JobDto } from '../models/job.dto'
import JobModel from '../models/job.model'

export function validateJobDto(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const body = req.body

  const model: JobDto = {
    jobId: 0,
    jobPostedByUser: body.jobPostedByUser,
    jobPayRangeMin: body.jobPayRangeMin,
    jobPayRangeMax: body.jobPayRangeMax,
    jobCity: body.jobCity,
    jobState: body.jobState,
    jobZip: body.jobZip,
    jobDescription: body.jobDescription,
    jobCompanyName: body.jobCompanyName,
    jobPostedDate: body.jobPostedDate,
  }

  JobModel.validate(model, (err, valid) => {
    if (err && !valid) {
      return res.status(400).send(err)
    }

    next()
  })
}
