import { Router, Response, Request, NextFunction } from 'express';
import { MongoClient, Collection, Document, ObjectId } from 'mongodb'
import { NotFoundError } from '../utils/ErrorHandlerUtils'
import { SuccessfullyCreated, Success } from '../utils/successHandlerUtils';
import { ResponseHandler } from '../utils/ResponseHandler';

export class RecipesController {
    static readonly PATH = '/recipes';
    static mongoClient: MongoClient;
    static collection: Collection<Document>;

    static registerRouter(mongoClient: MongoClient) {
        RecipesController.mongoClient = mongoClient;
        RecipesController.collection = RecipesController.mongoClient.db('tutorial').collection('recipes');
        
        const router = Router();
        router.get(RecipesController.PATH, this.getAll);
        router.post(RecipesController.PATH , this.createOne);
        router.get(RecipesController.PATH  + '/:id', this.getById);
        router.delete(RecipesController.PATH + '/:id', this.deleteById);
        router.put(RecipesController.PATH + '/:id', this.updateById);
        return router;
    }

    static async getAll(_ : any, res: Response) {
        const response = new ResponseHandler(res);
        const result = await RecipesController.collection.find().toArray()
        response.send(new Success(result));
    }

    static async getById(req : Request, res: Response, next: NextFunction) {
        const { id } = req.params;
        const result = await RecipesController.collection.findOne({_id : new ObjectId(id)})

        if (!result) {
            return next(new NotFoundError());
        }
        
        res.json(result);
    }

    static async deleteById(req : Request, res: Response) {
        const result = await RecipesController.collection.deleteOne({_id : new ObjectId(req.params.id)})
        return res.send(result);
    }

    static async updateById(req : Request, res: Response) {
        const result = await RecipesController.collection.updateOne({_id : new ObjectId(req.params.id)}, {$set : req.body})
        return res.send(result);
    }

    static async createOne(req : Request, res: Response) {
        const response = new ResponseHandler(res);
        const result = await RecipesController.collection.insertOne(req.body)
        response.send(new SuccessfullyCreated(result));
    }
}