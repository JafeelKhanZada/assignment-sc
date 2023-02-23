import { NextFunction, Request, Response } from "express";
import * as core from 'express-serve-static-core';

export interface IEntriesRouter {
    getAll(_req: Request, res: Response): Promise<Response<any, Record<string, any>>>
    entry(_req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | void>
    setupRoutes(): void
    getRoutes(): core.Router
    exit(_req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | void>
}