import PrismaService from "../../services/prisma";
import { IEntryPointController, IInsertEntryPoint } from "./model";

class EntryPointsController implements IEntryPointController {
    static _instance: EntryPointsController;
    private readonly _PrismaService: PrismaService

    private constructor() {
        this._PrismaService = PrismaService.getInstance()
    }

    static getInstance(): EntryPointsController {
        if (!EntryPointsController._instance)
            EntryPointsController._instance = new EntryPointsController()
        return EntryPointsController._instance;
    }

    getAll(): Promise<any[]> {
        return this._PrismaService.Prisma.entryPoints.findMany()
    }

    insert(payload: IInsertEntryPoint): Promise<any> {
        return this._PrismaService.Prisma.entryPoints.create({
            data: payload
        })
    }

}
export default EntryPointsController;