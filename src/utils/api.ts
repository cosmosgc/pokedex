import axios, { AxiosInstance } from 'axios'
import PokemonAPIError from '../errors/PokemonAPIError'
import connection from '../database/connection'

type Searchable<T = {}> = T & {
  name: string
  url: string
}

interface IPokemonAbility {
  ability: Searchable
  is_hidden: boolean
  slot: number
}

type PokemonForm = Searchable

interface IPokemonGameIndice {
  game_index: number
  version: Searchable
}

interface IPokemonMoveVersionGroupDetail {
  level_learned_at: number
  move_learn_method: Searchable
  version_group: Searchable
}

interface IPokemonMove {
  move: Searchable
  version_group_details: Array<IPokemonMoveVersionGroupDetail>
}

interface IPokemonSprites {
  back_default: string | null
  back_female: string | null
  back_shiny: string | null
  back_shiny_female: string | null
  front_default: string | null
  front_female: string | null
  front_shiny: string | null
  front_shiny_female: string | null
  other: {
    dream_world: {
      front_default: string | null
      front_female: string | null
    }
    "official-artwork": {
      front_default: string | null
    }
  }
}

interface IPokemonStat {
  base_stat: number
  effort: number
  stat: Searchable
}

interface IPokemon {
  id: number
  name: string
  order: number
  height: number
  weight: number
  base_experience: number
  held_items: Array<unknown>
  is_default: boolean
  location_area_encounters: string
  past_type: Array<unknown>
  species: Searchable
  sprites: IPokemonSprites
  versions: object
  stats: IPokemonStat
  abilities: Array<IPokemonAbility>
  forms: Array<PokemonForm>
  game_indices: Array<IPokemonGameIndice>
  moves: Array<IPokemonMove>
}

interface IUser {
  id: string
  name: string
  email: string
}

export class PokemonAPI {
  protected api: AxiosInstance

  public constructor() {
    this.api = axios.create({
      baseURL: 'https://pokeapi.co/api/v2/'
    })
  }

  public async getPokemonByName(pokemonName: string): Promise<IPokemon> {
    const { data } = await this.api.get<IPokemon>(`pokemon/${pokemonName}`)

    return data
  }

  public async getUserByName(userName: string): Promise<IUser> {
    const registeredUser = await connection("users")
            .where("name", userName)
            .select(["id","name","email"])
            .first();

    return registeredUser
  }

  public async getPokemonByID(pokemonId: number): Promise<IPokemon> {
    if (Number.isNaN(pokemonId)) throw new PokemonAPIError('pokemon id is not a valid number', 400)

    const { data } = await this.api.get<IPokemon>(`${pokemonId}`)

    return data
  }
}

export default new PokemonAPI()