import express from 'express'
import { validateJobDto } from '../../middleware/job.middleware'
import authenticateJWT from '../../middleware/auth.middleware'
import JobModel from '../../models/job.model'

const router = express.Router()

router.get(`/`, (req: express.Request, res: express.Response) => {
  const limit = parseInt(req.query.limit as string)

  JobModel.findAllJobs((err, result) => {
    if (err) {
      res.sendStatus(500)
    }

    res.json(result)
  }, limit)
})

router.post(
  `/`,
  authenticateJWT,
  validateJobDto,
  (req: express.Request, res: express.Response) => {
    JobModel.insertJob(req.body, (err, result) => {
      if (err) {
        res.sendStatus(400)
      }

      res.status(200).json({ userId: result })
    })
  }
)

router.get(
  `/:jobId(\\d+)`,
  authenticateJWT,
  (req: express.Request, res: express.Response) => {
    JobModel.findJobById(+req.params.jobId, (err, result) => {
      if (err) {
        res.sendStatus(500)
      }

      res.json(result)
    })
  }
)

router.get(
  `/u/:userId(\\d+)`,
  authenticateJWT,
  (req: express.Request, res: express.Response) => {
    JobModel.findJobsPostedByUser(+req.params.userId, (err, result) => {
      if (err) {
        res.sendStatus(500)
      }

      res.json(result)
    })
  }
)

router.put(
  `/:jobId(\\d+)`,
  authenticateJWT,
  validateJobDto,
  (req: express.Request, res: express.Response) => {
    // Job ID is the primary key - we don't want to change that
    if (req.body.jobId !== req.params.jobId) {
      res.sendStatus(400)
    }

    JobModel.updateJob(req.body, (err, _) => {
      if (err) {
        res.sendStatus(500)
      }

      res.status(200).send('Job updated successfully')
    })
  }
)

router.delete(
  `/:jobId(\\d+)`,
  authenticateJWT,
  (req: express.Request, res: express.Response) => {
    JobModel.deleteJob(+req.params.jobId, (err, result) => {
      if (err) {
        return res.sendStatus(500)
      } else if (result === 0) {
        return res.status(200).send('Job does not exist')
      }

      res.status(200).send('Job deleted successfully')
    })
  }
)

export default router
