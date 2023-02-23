import Router from "@Router/index";
import Middleware from "@utility/middleware";
import express from "express";
import * as core from 'express-serve-static-core';

class Main {
    private readonly PORT: number
    private readonly app: core.Application
    constructor() {
        this.app = express()
        this.PORT = Number(process.env.SERVER_PORT) || 4000;
        this.beforeInit()
    }

    beforeInit() {
        Middleware.getInstance(this.app).init()
        Router.getInstance(this.app).init()
    }

    bootstrap() {
        this.app.listen(this.PORT, () => {
            console.log(`server started at http://localhost:${this.PORT}`);
        });
        this.afterInit()
    }

    afterInit() {
        this.app.use(Middleware.getInstance(this.app).addErrorHandler)
    }
}
new Main().bootstrap()