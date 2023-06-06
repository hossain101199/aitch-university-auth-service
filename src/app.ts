import express, { Application, Request, Response } from 'express'
import cors from 'cors'
import userRouter from './app/modules/user/user.route'

const app: Application = express()

app.use(cors())

// parser
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Application routes
app.use('/api/v1/user', userRouter)

app.get('/', async (req: Request, res: Response) => {
  res.send('hey from Aitch university auth')
})

export default app
