import { Request, Response } from 'express'

import pokemonApi from '../utils/api'

import connection from '../database/connection'

class PokemonsController {
  public async get(request: Request, response: Response): Promise<void> {
    const { params } = request

    const pokeResponse = await pokemonApi.getPokemonByID(Number(params.id))

    response.status(200).json(pokeResponse)
  }

  public async getByName(request: Request, response: Response): Promise<void> {
    const { params } = request
    const pokeResponse = await pokemonApi.getPokemonByName(`${params.name}`)

    response.status(200).json(pokeResponse)
  }
}

export default PokemonsController