import dotenv from 'dotenv'
import express from 'express'
import * as http from 'http'
import cors from 'cors'

import routes from './routes'

dotenv.config()

const app: express.Application = express()
const port = process.env.PORT
const server: http.Server = http.createServer(app)

app.use(express.json())
app.use(cors())

app.use('/api/v1', routes)

server.listen(port, () => {
  console.log(`Server listening at port ${port}`)
})
