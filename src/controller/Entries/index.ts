import ApiError from "@utility/API.error";
import PrismaService from "../../services/prisma";
import { IEntriesController, IExitEntiteries, IInsertEntiteries } from "./model";

class EntriesController implements IEntriesController {
    static _instance: EntriesController;
    private readonly _PrismaService: PrismaService
    private readonly BASE_RATE = 20;
    private readonly DISTANCE_RATE = 0.2;
    private readonly WEEKEND_RATE = 1.5;

    private constructor() {
        this._PrismaService = PrismaService.getInstance()
    }

    static getInstance(): EntriesController {
        if (!EntriesController._instance)
            EntriesController._instance = new EntriesController()
        return EntriesController._instance;
    }

    getAll(): Promise<any[]> {
        return this._PrismaService.Prisma.entries.findMany()
    }

    entry(payload: IInsertEntiteries): Promise<any> {
        return this._PrismaService.Prisma.entries.create({
            data: payload
        })
    }

    exit = async (payload: IExitEntiteries): Promise<any> => {
        const exists = await this._PrismaService.Prisma.entries.findFirst({
            where: {
                plate: payload?.plate
            },
            include: {
                entry: true,
                exit: true
            },
            orderBy: {
                entryDate: "desc"
            }
        })
        if (!exists)
            throw new ApiError("Plate Not Exists in Record", 400)
        if (exists?.exitDate)
            throw new ApiError(`Vehicle Already Exit At ${exists?.exit?.name}`, 400)

        const exitPoint = await this._PrismaService.Prisma.entryPoints.findFirst({
            where: {
                id: payload?.exitId
            }
        })
        if (exitPoint) {
            const DISTANCE = Math.abs(exists.entry.distance - exitPoint.distance)
            const DAY = new Date(payload.exitDate).getDay()
            const result = this.calculateToll(DISTANCE, DAY, payload?.plate)
            return this._PrismaService.Prisma.entries.update({
                where: {
                    id: exists?.id
                },
                data: {
                    distance: DISTANCE,
                    amount: result?.amount,
                    discount: result?.discount,
                    peak: result?.peak,
                    exitDate: payload?.exitDate,
                    exitId: payload?.exitId
                }
            })
        }
    }

    getDiscountRate(numberPlate: string, dayOfWeek: number): number {
        const plate = numberPlate.split("-")[1]
        const lastDigit = Number(plate[plate.length - 1]);
        if ((dayOfWeek === 2 || dayOfWeek === 4) && lastDigit % 2 === 0) {
            return 0.1;
        } else if ((dayOfWeek === 3 || dayOfWeek === 5) && lastDigit % 2 !== 0) {
            return 0.1;
        } else {
            return 0;
        }
    }

    isSpecialDiscountDay(date: Date): boolean {
        const specialDays = [
            new Date(date.getFullYear(), 2, 23),
            new Date(date.getFullYear(), 7, 14),
            new Date(date.getFullYear(), 11, 25),
        ];
        return specialDays.some(specialDay => date.toDateString() === specialDay.toDateString());
    }

    calculateToll = (distance: number, day: number, numberPlate: string): any => {
        const weekendRate = day === 0 || day === 1 ? this.WEEKEND_RATE : 1
        const distanceRate = this.DISTANCE_RATE * weekendRate * distance
        const discountRate = this.getDiscountRate(numberPlate, day);
        const specialDiscount = this.isSpecialDiscountDay(new Date()) ? 0.5 : 0;
        let amount = this.BASE_RATE + distanceRate
        amount = amount - (discountRate * amount)
        amount = amount - (specialDiscount * amount)
        return {
            amount,
            discount: (specialDiscount * amount) + (discountRate * amount),
            peak: weekendRate
        };
    }

}
export default EntriesController;