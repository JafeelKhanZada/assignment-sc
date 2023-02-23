export interface IEntriesController {
    getAll(): Promise<any[]>
    entry(payload: IInsertEntiteries): Promise<any>
    exit(payload: IExitEntiteries): Promise<any>
}

export interface IInsertEntiteries {
    entryId: number
    entryDate: Date
    plate: string
}

export interface IExitEntiteries {
    exitId: number
    exitDate: Date
    plate: string
}

