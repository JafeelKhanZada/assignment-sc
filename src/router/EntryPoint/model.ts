import { IInsertEntryPoint } from "@Controller/EntryPoint/model";
import { NextFunction, Request, Response } from "express";
import * as core from 'express-serve-static-core';

export interface IEntryPointRouter {
    getAll(_req: Request, res: Response): Promise<Response<any, Record<string, any>>>
    setupRoutes(): void
    insert(_req: Request<any, IInsertEntryPoint>, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | void>
    getRoutes(): core.Router
}