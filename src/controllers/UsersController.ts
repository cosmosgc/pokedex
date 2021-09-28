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
        return response.status(201).json(userReg);
    }
    public async getByName(request: Request, response: Response): Promise<void> {
        const { params } = request
        const userResponse = await userApi.getUserByName(`${params.name}`)
    
        response.status(200).json(userResponse)
    }

    public async getCapturedPokemons(request:Request,response:Response): Promise<void> {
        const pokemons = await connection("inventory")
            .where({
                "fk_userID": request.user.id,
            })
            .select("*");

        if(!pokemons.length){
            throw new AppError("não tem pokemons", 401);
        }
        response.status(200).json(pokemons);
    }

    public async getSeenPokemons(request:Request,response:Response){
        const pokemons = await connection("pokemon")
            .where({
                "fk_userID": request.user.id,
                "Seen": true
            })
            .select("*")
            .groupBy("pokeID");

        if(!pokemons.length){
            throw new AppError("não viu pokemons", 401);
        }
        response.status(200).json(pokemons);
    }

    public async setCapturePokemon(request:Request,response:Response){
        const { pokemon, nickname = 'default', location, area } = request.body;
        
        const pokemons = await connection("pokemon").insert({
            id:uuid(),
            pokeID: pokemon,
            Seen: true,
            Captured: true,
            Favorite: false,
            fk_userID: request.user.id
        }).then(function () {
            const pokeCatch = connection('inventory').insert({
                id:uuid(),
                pokeID: pokemon,
                nickname,
                location,
                area,
                fk_userID: request.user.id
            })
            return pokeCatch
        })
        response.status(200).json(pokemons);
    }

    public async setFavoritePokemon(request:Request,response:Response){
        const { pokemon } = request.body;
        const pokemons = await connection("pokemon")
        .where({
            id: pokemon
        })
        .update({
            Favorite: true
        })
        response.status(200).json(pokemons);
    }

    public async setPokemonNickname(request:Request,response:Response){
        const { pokemon, nickname } = request.body;
        const pokemons = await connection("inventory")
        .where({
            id: pokemon
        })
        .update({
            nickname
        })
        response.status(200).json(pokemons);
    }

    public async releasePokemon(request:Request,response:Response){
        const { pokemon } = request.body;
        const pokemons = await connection("inventory")
        .where({
            id: pokemon
        })
        .del()
        response.status(200).json(pokemons);
    }

    public async setUnfavoritePokemon(request:Request,response:Response){
        const { pokemon } = request.body;
        const pokemons = await connection("pokemon")
        .where({
            id: pokemon
        })
        .update({
            Favorite: false
        })
        response.status(200).json(pokemons);
    }
}

export default UsersController