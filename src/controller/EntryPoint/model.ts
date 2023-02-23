export interface IEntryPointController {
    getAll(): Promise<any[]>
    insert(payload: IInsertEntryPoint): Promise<any>
}

export interface IInsertEntryPoint {
    name: string
    distance: number;
}