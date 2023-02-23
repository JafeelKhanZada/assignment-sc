import * as core from 'express-serve-static-core';
import EntriesRouter from './Entries/index';
import EntryPointRouter from './EntryPoint/index';


class Router {
    private readonly app: core.Application
    static _instance: Router;

    private constructor(app: core.Application) {
        this.app = app
    }

    static getInstance(app: core.Application): Router {
        return this._instance || (this._instance = new this(app));
    }

    init() {
        this.app.use("/entry-point", EntryPointRouter.getInstance().getRoutes())
        this.app.use("/entry", EntriesRouter.getInstance().getRoutes())
    }
}

export default Router