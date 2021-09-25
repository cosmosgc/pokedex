import { Router } from 'express'
import LocationController from '../controllers/LocationController'

const pokemonRouter = Router()
const locationController = new LocationController() 

pokemonRouter.get('/', (request, response) => {
  response.status(200).json({ message: 'Hello Location' })
})

pokemonRouter.get('/:name', locationController.get)

export default pokemonRouter