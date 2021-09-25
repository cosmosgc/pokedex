import { Router } from 'express'
import pokemonRouter from './pokemon.router'
import userRouter from './user.router'
import regionRouter from './region.router'
import locationRouter from './location.router'
import areaRouter from './area.router'
import sessionRouter from './session.router'


const routes = Router()

routes.use('/pokemons', pokemonRouter)
routes.use('/users', userRouter)
routes.use('/regions', regionRouter)
routes.use('/locations', locationRouter)
routes.use('/areas', areaRouter)
routes.use('/sessions', sessionRouter)

export default routes