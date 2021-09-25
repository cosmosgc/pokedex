import { Router } from 'express'
import AreaController from '../controllers/AreaController'

const pokemonRouter = Router()
const areaController = new AreaController() 

pokemonRouter.get('/', (request, response) => {
  response.status(200).json({ message: 'Hello area' })
})

pokemonRouter.get('/:name', areaController.get)

export default pokemonRouter