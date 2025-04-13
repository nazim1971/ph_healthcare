import { NextFunction } from 'express';
import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import router from './app/routes';
import  httpStatus  from 'http-status';
import { globalErrorHandler } from './middlewires/globalErrorHandler';
import { notFoundError } from './middlewires/notFoundError';

const app: Application = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}))


app.get('/', (req: Request, res: Response) => {
    res.send({
        Message: "Ph health server is on fire..."
    })
})

app.use('/api/v1', router);

app.use(globalErrorHandler);
app.use(notFoundError)

export default app;