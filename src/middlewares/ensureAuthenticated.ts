import { verify } from 'jsonwebtoken'
import { Request, Response, NextFunction } from 'express'

// import authConfig from '...'
import AppError from '../errors/AppError'
  
interface ITokenPayload {
  iat: number
  exp: number
  sub: string
}

export function ensureAuthenticated(
  request: Request,
  _response: Response,
  next: NextFunction,
): void {
  const authHeader = request.headers.authorization

  if (!authHeader) {
    throw new AppError('JWT token is missing', 401)
  }

  const token = authHeader.split(' ')[1]

  try {
    const decoded = verify(token, 'f5cd205538e15a0259a2c21d3c9f1164') as ITokenPayload;

    const { sub } = decoded

    request.user = {
      id: sub,
    }

    return next()
  } catch (err) {
    throw new AppError('Invalid JWT Token', 401)
  }
}