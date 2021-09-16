import { Router } from 'express'
import pokemonRouter from './pokemon.router'
import userRouter from './user.router'

const routes = Router()

routes.use('/pokemons', pokemonRouter)
routes.use('/users', userRouter)

export default routes