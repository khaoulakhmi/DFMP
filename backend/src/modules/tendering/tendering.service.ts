import prisma from "../../config/prisma";
import type {
    CreateTenderingDTO,
    UpdateTenderingDTO,
} from "./tendering.types";
import { toTenderingData } from "./tendering.data";

export const TenderingService = {
    async createTendering(data: CreateTenderingDTO) {
        return prisma.tendering.create({
            data: {
                specificationsId: data.specificationsId,
                ...toTenderingData(data),
            },
        });
    },

    async getTenderingById(id: number) {
        return prisma.tendering.findUnique({
            where: { id },
        });
    },

    async getTenderingBySpecificationId(specificationsId: number) {
        return prisma.tendering.findUnique({
            where: { specificationsId },
        });
    },

    async updateTendering(id: number, data: UpdateTenderingDTO) {
        return prisma.tendering.update({
            where: { id },
            data: toTenderingData(data),
        });
    },
};