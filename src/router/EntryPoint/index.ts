import express, { NextFunction, Request, Response } from 'express';
import { IEntryPointRouter } from "./model";
import * as core from 'express-serve-static-core';
import EntryPointsController from '@Controller/EntryPoint/index';
import { IInsertEntryPoint } from '@Controller/EntryPoint/model';
import { makeValidateBody } from 'express-class-validator';
import InsertEntryPointDTO from './dto';
import ApiError from '@utility/API.error';
import ResponseModel from '@utility/response';

class EntryPointRouter implements IEntryPointRouter {
    static _instance: EntryPointRouter;
    private readonly routes: core.Router

    private constructor() {
        this.routes = express.Router()
        this.setupRoutes()
    }

    static getInstance(): EntryPointRouter {
        return this._instance || (this._instance = new this());
    }

    getAll(_req: Request, res: Response): Promise<Response<any, Record<string, any>>> {
        return EntryPointsController.getInstance().getAll().then((result: any[]) => {
            return new ResponseModel("Entry Point Fetched!", 200, result).init(res)
        })
    }

    insert(_req: Request<any, IInsertEntryPoint>, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | void> {
        const body = _req?.body
        return EntryPointsController.getInstance().insert(body).then((result) => {
            return new ResponseModel("Entry Point Created!", 200, result).init(res)
        }).catch((e) => {
            next(new ApiError(e?.message, 400))
        })
    }

    setupRoutes(): void {
        this.routes.get("/", this.getAll)
        this.routes.post('/', makeValidateBody(InsertEntryPointDTO), this.insert)
    }

    getRoutes = (): core.Router => {
        return this.routes
    }

}
export default EntryPointRouter;