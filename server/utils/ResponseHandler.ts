import {Response} from 'express';
import {Success} from './successHandlerUtils';

export class ResponseHandler {
    constructor(private res: Response) {}

    send(success: Success) {
        this.res.status(success.status).json(success);
    }
}
