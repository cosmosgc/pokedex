import { Request, Response } from 'express'
import { hash } from 'bcryptjs'
import connection from '../database/connection'
import AppError from '../errors/AppError'
import {v4 as uuid} from 'uuid'
import userApi from '../utils/api'

class UsersController {
    public async create(request: Request, response: Response): Promise<Response> {
        const { name, email, password } = request.body.user;
        const registeredUser = await connection("users")
            .where("name", name)
            .orWhere("email", email)
            .select("*")
            .first();
        console.log("registeredUser: " + registeredUser);

        const hashedPassword = await hash(password, 8)
        if(registeredUser){
            throw new AppError("usuario já existe", 400);
        }

        const userReg = await connection("users").insert({
            id:uuid(),
            name,
            email,
            password: hashedPassword
        })
        
        console.log("userReg: " + userReg);
        return response.status(201).json(userReg);
    }
    public async getByName(request: Request, response: Response): Promise<void> {
        const { params } = request
        const userResponse = await userApi.getUserByName(`${params.name}`)
    
        response.status(200).json(userResponse)
    }

    public async getCapturedPokemons(request:Request,response:Response): Promise<void> {
        const { params } = request;
        const user = await userApi.getUserByName(`${params.name}`)
        const pokemons = await connection("pokemon")
            .where({
                "fk_userID": user.id,
                "Captured": true
            })
            .select("*");
        console.log("poke: " + pokemons);

        if(!pokemons.length){
            throw new AppError("não tem pokemons", 401);
        }
        response.status(200).json(pokemons);
    }

    public async getSeenPokemons(request:Request,response:Response){
        const { params } = request;
        const user = await userApi.getUserByName(`${params.name}`)
        const pokemons = await connection("pokemon")
            .where({
                "fk_userID": user.id,
                "Seen": true
            })
            .select("*");
        console.log(pokemons);

        if(!pokemons.length){
            throw new AppError("não viu pokemons", 401);
        }
        response.status(200).json(pokemons);
    }
}

export default UsersController