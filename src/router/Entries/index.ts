import express, { Request, Response } from 'express';
import EntriesController from "@Controller/Entries";
import { IEntriesRouter } from "./model";
import * as core from 'express-serve-static-core';
import { ParsedQs } from 'qs';
import { IExitEntiteries, IInsertEntiteries } from '@Controller/Entries/model';
import ApiError from '@utility/API.error';
import ResponseModel from '@utility/response';
import { makeValidateBody } from 'express-class-validator';
import { InsertEntryDTO, InsertExitDTO } from './dto';

class EntriesRouter implements IEntriesRouter {
    static _instance: EntriesRouter;
    private readonly routes: core.Router

    private constructor() {
        this.routes = express.Router()
        this.setupRoutes()
    }

    static getInstance(): EntriesRouter {
        return this._instance || (this._instance = new this());
    }

    getAll(_req: Request, res: Response): Promise<Response<any, Record<string, any>>> {
        return EntriesController.getInstance().getAll().then((result: any[]) => {
            return res.json(result)
        })
    }

    entry(_req: express.Request<core.ParamsDictionary, IInsertEntiteries, any, ParsedQs, Record<string, any>>, res: express.Response<any, Record<string, any>>, next: express.NextFunction): Promise<express.Response<any, Record<string, any>> | void> {
        const body = _req?.body
        return EntriesController.getInstance().entry(body).then((result) => {
            return new ResponseModel("Entry Created!", 200, result).init(res)
        }).catch((e) => {
            next(new ApiError(e?.message, 400))
        })
    }

    exit(_req: express.Request<core.ParamsDictionary, IExitEntiteries, any, ParsedQs, Record<string, any>>, res: express.Response<any, Record<string, any>>, next: express.NextFunction): Promise<void | express.Response<any, Record<string, any>> | void> {
        const body = _req.body
        return EntriesController.getInstance().exit(body).then((result) => {
            return new ResponseModel("Entry Exits!", 200, result).init(res)
        }).catch((e) => {
            next(new ApiError(e?.message, 400))
        })
    }


    setupRoutes(): void {
        this.routes.get("/", this.getAll)
        this.routes.post("/", makeValidateBody(InsertEntryDTO), this.entry)
        this.routes.patch("/", makeValidateBody(InsertExitDTO), this.exit)
    }

    getRoutes = (): core.Router => {
        return this.routes
    }

}
export default EntriesRouter;