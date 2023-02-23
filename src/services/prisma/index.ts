import { IPrismaService } from "./model";
import { PrismaClient } from '@prisma/client'

class PrismaService implements IPrismaService {
    readonly Prisma: PrismaClient
    static _instance: PrismaService
    private constructor() {
        this.Prisma = new PrismaClient()
    }
    async destroy(): Promise<void> {
        await this.Prisma.$disconnect()
        console.log("====== DB DISCOUNT ======")
    }
    static getInstance(): PrismaService {
        if (!PrismaService._instance)
            PrismaService._instance = new PrismaService()
        return PrismaService._instance;
    }
}

export default PrismaService