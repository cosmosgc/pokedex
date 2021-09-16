import { Router } from 'express'
import PokemonsController from '../controllers/PokemonsController'

const pokemonRouter = Router()
const pokemonsController = new PokemonsController() 

pokemonRouter.get('/', (request, response) => {
  response.status(200).json({ message: 'Hello World' })
})

pokemonRouter.get('/:name', pokemonsController.getByName)

export default pokemonRouter