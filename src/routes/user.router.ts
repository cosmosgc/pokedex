import { Router } from 'express'
import UsersController from '../controllers/UsersController'

const userRouter = Router()
const usersController = new UsersController() 

userRouter.get('/', (request, response) => {
  response.status(200).json({ message: 'Hello World' })
})

userRouter.get('/:name', usersController.getByName)
userRouter.post('/', usersController.create)

export default userRouter