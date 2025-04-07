import express, { Application, Request, Response } from 'express';
import cors from 'cors';

const app: Application = express();
app.use(cors());


app.get('/', (req: Request, res: Response) => {
    res.send({
        Message: "Ph health server is on fire..."
    })
})

export default app;