import { NextFunction, Request, Response, Router } from "express";
import { Collection, MongoClient, ObjectId, Document } from "mongodb";
import { ResponseHandler } from "../utils/ResponseHandler";
import { NotFoundError } from "../utils/ErrorHandlerUtils";
import { Success, SuccessfullyCreated } from "../utils/successHandlerUtils";

export class UsersController {
  static readonly PATH = "/users";
  static mongoClient: MongoClient;
  static collection: Collection<Document>;

  static userRouter(mongoClient: MongoClient) {
    UsersController.mongoClient = mongoClient;
    UsersController.collection = UsersController.mongoClient
      .db("recipes")
      .collection("users");

    const router = Router();
    router.get(UsersController.PATH, this.getAll);
    router.get(UsersController.PATH + "/:id", this.getById);
    router.post(UsersController.PATH, this.createOne)
    router.put(UsersController.PATH + '/:id', this.updateById)
    router.delete(UsersController.PATH + '/:id', this.deleteById)
    return router;
  }

  static async getAll(_: any, res: Response) {
    const response = new ResponseHandler(res);
    const result = await UsersController.collection.find().toArray();
    response.send(new Success(result));
  }

  static async getById(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    const result = await UsersController.collection.findOne({
      _id: new ObjectId(id),
    });

    if (!result) {
      return next(new NotFoundError('User Not Found!'));
    }

    res.json(result);
  }

  static async createOne(req: Request, res: Response){
    const response = new ResponseHandler(res);
    const result = await UsersController.collection.insertOne(req.body);
    response.send(new SuccessfullyCreated(result));
  }

  static async updateById(req: Request, res: Response){
    const result = await UsersController.collection.updateOne({_id : new ObjectId(req.params.id)}, {$set : req.body})
    return res.send(result);

  }

  static async deleteById(req : Request, res: Response){
    const result = await UsersController.collection.deleteOne({_id : new ObjectId(req.params.id)})
    return res.send(result);
  }
}