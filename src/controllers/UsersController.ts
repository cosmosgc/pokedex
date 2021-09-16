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
}

export default UsersController