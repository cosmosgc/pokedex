import { Request, Response } from 'express'

import pokemonApi from '../utils/api'


class RegionController {
  public async get(request: Request, response: Response): Promise<void> {
    const { params } = request

    const pokeResponse = await pokemonApi.getRegion(String(params.name))

    response.status(200).json(pokeResponse)
  }
}

export default RegionController