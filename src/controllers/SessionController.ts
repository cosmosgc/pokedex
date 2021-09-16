import { Request, Response } from 'express'
import { compare } from 'bcryptjs'
import connection from '../database/connection'
import AppError from '../errors/AppError'
import {v4 as uuid} from 'uuid'
import userApi from '../utils/api'
//import * as jose from 'jose'

class SessionController{
    public async create(request:Request,response:Response){
        const { email, password } = request.body.user;
        
        const registeredUser = await connection("users")
            .where({
                email
            })
            .select("*")
            .first();
        console.log("registeredUser: " + registeredUser);

        if(!registeredUser){
            throw new AppError("Usuario não existe", 401);
        }
        
        const passwordMatched = await compare(password, registeredUser.password)

        if(!passwordMatched){
            throw new AppError("Senha incorreta", 401);
        }
    }
}