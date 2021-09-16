import express, { Request, Response, NextFunction} from 'express';
import axios from 'axios';
import cors from 'cors';
import path from 'path';

import 'express-async-errors'

import AppError from './errors/AppError'

import routes from './routes'

const app = express();
app.use(cors());
app.use(express.json());

app.use('/', express.static(path.join(__dirname,"..","public")));
app.use('/api', routes);

app.use(
    (err: Error, _request: Request, response: Response, _next: NextFunction) => {
        if (err instanceof AppError) {
            return response.status(err.statusCode).json({
                status: 'error',
                error: err.message,
            });
        }

        if (axios.isAxiosError(err)) {
            return response.status((err.code && Number(err.code)) || 500).json({
                status: 'error',
                error: `[PokemonAPI] ${err.message}`,
            });
        }
    
        console.log({ ...err });
    
        return response.status(500).json({
            status: 'error',
            message: 'Internal Server Error',
        });
    },
)



app.listen(3000, () => {
    console.log('🚛 Server started on port 3000');
});


