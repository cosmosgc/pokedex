import { Request, Response } from 'express'
import { compare } from 'bcryptjs'
import connection from '../database/connection'
import AppError from '../errors/AppError'
import {v4 as uuid} from 'uuid'
import userApi from '../utils/api'
import { sign } from 'jsonwebtoken'

class SessionController{
    public async create(request:Request,response:Response){
        const { email, password } = request.body;
        
        const registeredUser = await connection("users")
            .where({
                email
            })
            .select("*")
            .first();
        console.log(registeredUser);

        if(!registeredUser){
            throw new AppError("Usuario não existe", 401);
        }
        
        const passwordMatched = await compare(password, registeredUser.password)

        if(!passwordMatched){
            throw new AppError("Senha incorreta", 401);
        }

        const token = sign({},'f5cd205538e15a0259a2c21d3c9f1164', {
            subject: registeredUser.id,
            expiresIn: '1w'
        })

        delete(registeredUser.password)

        response.status(200).json({
            user:registeredUser,
            token
        })
    }
}
export default SessionController