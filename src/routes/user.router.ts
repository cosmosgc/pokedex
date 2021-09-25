import { Router } from 'express'
import UsersController from '../controllers/UsersController'
import { ensureAuthenticated } from '../middlewares/ensureAuthenticated'

const userRouter = Router()
const usersController = new UsersController() 

userRouter.get('/', (request, response) => {
  response.status(200).json({ message: 'Hello World' })
})

userRouter.get('/:name', usersController.getByName)
userRouter.get('/:name/caught', ensureAuthenticated, usersController.getCapturedPokemons)
userRouter.post('/:name/catch', ensureAuthenticated, usersController.setCapturePokemon)
userRouter.get('/:name/seen', ensureAuthenticated, usersController.getSeenPokemons)
userRouter.post('/', usersController.create)

export default userRouter