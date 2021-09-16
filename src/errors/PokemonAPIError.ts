import AppError from './AppError'

class PokemonAPIError extends AppError {
  public constructor(message: string, statusCode = 400) {
    super(message, statusCode)
  }
}

export default PokemonAPIError