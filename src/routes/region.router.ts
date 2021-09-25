import { Router } from 'express'
import RegionController from '../controllers/RegionController'

const pokemonRouter = Router()
const regionController = new RegionController() 

pokemonRouter.get('/', (request, response) => {
  response.status(200).json({ message: 'Hello Region' })
})

pokemonRouter.get('/:name', regionController.get)

export default pokemonRouter