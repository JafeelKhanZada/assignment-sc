import bodyParser from 'body-parser';
import express from 'express';
import ApiError from '@utility/API.error';
import { StatusCodes } from 'http-status-codes';
import * as core from 'express-serve-static-core';
import * as util from 'util';
import logger from './logger';


class Middleware {
    private readonly app: core.Application
    static _instance: Middleware;

    private constructor(app: core.Application) {
        this.app = app
    }

    static getInstance(app: core.Application): Middleware {
        return this._instance || (this._instance = new this(app));
    }

    init = () => {
        this.app.use(bodyParser.urlencoded({ extended: true }))
        this.app.use(bodyParser.json())
    }
    addErrorHandler(
        err: ApiError,
        req: express.Request,
        res: express.Response,
        next: express.NextFunction,
    ): void {
        console.log("ERROR", err)
        if (err) {
            const status: number = err.status || StatusCodes.INTERNAL_SERVER_ERROR;
            logger.debug(`REQUEST HANDLING ERROR:
            \nERROR:\n${JSON.stringify(err)}
            \nREQUEST HEADERS:\n${util.inspect(req.headers)}
            \nREQUEST PARAMS:\n${util.inspect(req.params)}
            \nREQUEST QUERY:\n${util.inspect(req.query)}
            \nBODY:\n${util.inspect(req.body)}`);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            let body: any = {
                fields: err.fields,
                message: err.message || 'An error occurred during the request.',
                name: err.name,
                status,
                stack: '',
            };
            res.status(status);
            res.send(body);
        }
        next();
    };

}

export default Middleware