import { Router } from 'express'
import SessionController from '../controllers/SessionController'

const sessionRouter = Router()
const sessionController = new SessionController() 

sessionRouter.get('/', (request, response) => {
  response.status(200).json({ message: 'Hello World' })
})

sessionRouter.post('/new', sessionController.create)

export default sessionRouter