require('dotenv').config()
import express, { Request, Response, NextFunction } from "express";
import { MongoClient } from "mongodb";
import { UsersController } from "./controllers/UsersController";
import { RecipesController } from "./controllers/RecipesController";
import { Error } from './utils/ErrorHandlerUtils';

const app = express();
const port = process.env.PORT;
const connectionString: string | undefined = process.env.CONNECTIONSTRING
const client = new MongoClient(connectionString!);

client.connect().then(mongoClient => {
    console.log('Connection Successful');
    app.use(express.json())
    app.use(RecipesController.registerRouter(mongoClient));
    
    app.use('*', (error: Error, req: Request, res: Response, next: NextFunction) => {
        return res.status(error.status).json(error);   
    });

    app.listen(port, () => console.log(`App Running On Port ${port}`));
}).catch(error => console.error('Db connection failed > ', error));