import { CreateLotDTO, UpdateLotDTO } from './lot.types';
import prisma from '../../config/prisma';
import {
    invalidReferenceError,
    notFoundError,
} from "../../utils/AppError";
import { runSerializableTransaction } from "../../utils/transaction";


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
        return runSerializableTransaction(async tx => {
            // First check the record being updated.
            const lot = await tx.lot.findUnique({
                where: { id: lotId },
                select: { id: true },
            });

            if (!lot) {
                throw notFoundError("Lot");
            }

            // Check a new designation, if supplied.
            if (lotData.designationId !== undefined) {
                const designation = await tx.designation.findUnique({
                    where: { id: lotData.designationId },
                    select: { id: true },
                });

                if (!designation) {
                    throw invalidReferenceError();
                }
            }

            // null means disconnect; only check an actual ID.
            if (
                lotData.specificationsId !== undefined &&
                lotData.specificationsId !== null
            ) {
                const specification = await tx.specifications.findUnique({
                    where: { id: lotData.specificationsId },
                    select: { id: true },
                });

                if (!specification) {
                    throw invalidReferenceError();
                }
            }

            // Every supplied product must exist.
            if (lotData.productIds !== undefined) {
                const ids = [...new Set(lotData.productIds)];

                const count = await tx.product.count({
                    where: { id: { in: ids } },
                });

                if (count !== ids.length) {
                    throw invalidReferenceError();
                }
            }

            return tx.lot.update({
                where: { id: lotId },
                data: {
                    name: lotData.name,
                    designationId: lotData.designationId,
                    specificationsId: lotData.specificationsId,
                    products: lotData.productIds !== undefined
                        ? {
                            set: lotData.productIds.map(id => ({ id })),
                        }
                        : undefined,
                },
            });
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
