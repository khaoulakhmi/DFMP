import { CreateLotDTO, UpdateLotDTO } from './lot.types';
import prisma from '../../config/prisma';

export const LotService = {
    createLot: async (lotData: CreateLotDTO) => {
        return await prisma.lot.create({
            data: {
                name: lotData.name,
                designationId: lotData.designationId,
                specificationsId: lotData.specificationsId ?? null,
                products: lotData.productIds ? {
                    connect: lotData.productIds.map(id => ({ id }))
                } : undefined
            }
        });
    },

    updateLot: async (lotId: number, lotData: UpdateLotDTO) => {
        return await prisma.lot.update({
            where: { id: lotId },
            data: {
                name: lotData.name,
                designationId: lotData.designationId,
                specificationsId: lotData.specificationsId,
                products: lotData.productIds ? {
                    set: lotData.productIds.map(id => ({ id }))
                } : undefined
            }
        });
    },

    deleteLot: async (lotId: number) => {
        // Logic to delete a lot
        return await prisma.lot.delete({ where: { id: lotId } });
    },

    getLotById: async (lotId: number) => {
        // Logic to get a lot by ID
        return await prisma.lot.findUnique({
            where: { id: lotId },
            include: {
                designation: true,
                products: true,
                specifications: {
                    include: {
                        tendering: true,
                    },
                },
            },
        });
    },

    getAllLots: async () => {
        // Logic to get all lots
        return await prisma.lot.findMany({
            include: {
                designation: true,
                products: true,
                specifications: {
                    include: {
                        tendering: true,
                    },
                },
            },
            orderBy: { id: "desc" }
        });
    }
}
