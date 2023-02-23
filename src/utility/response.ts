import { Response } from "express";

class ResponseModel {
    private message: string;
    private status: number;
    private data: any;
    constructor(msg: string, statusCode: number, data: any) {
        this.message = msg;
        this.status = statusCode;
        this.data = data
    }

    init(res: Response) {
        return res.json({
            data: this.data,
            status: this.status,
            message: this.message
        })
    }
}

export default ResponseModel