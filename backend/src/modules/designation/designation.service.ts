import prisma from "../../config/prisma";
import { CreateDesignationDTO, UpdateDesignationDTO } from './designation.types';
import type { Prisma } from "../../generated/prisma/client";
import type { DesignationListQuery } from "./designation.validation";
import { pageToSkip, paginate } from "../../utils/pagination";

export const DesignationService = {
    createDesignation: async (designationData: CreateDesignationDTO) => {
        // Implementation for creating a designation
        return await prisma.designation.create({ data: designationData });
    },

    getAllDesignations: async (query: DesignationListQuery) => {
        const { page, pageSize, search, sortBy, sortOrder } = query;

        const where: Prisma.DesignationWhereInput = {};

        if (search) {
            where.OR = [
                { name: { contains: search, mode: "insensitive" } },
                { description: { contains: search, mode: "insensitive" } },
            ];
        }

        const orderBy: Prisma.DesignationOrderByWithRelationInput[] =
            sortBy === "id"
                ? [{ id: sortOrder }]
                : [{ name: sortOrder }, { id: "asc" }];

        const [data, total] = await prisma.$transaction(
            [
                prisma.designation.findMany({
                    where,
                    orderBy,
                    skip: pageToSkip(page, pageSize),
                    take: pageSize,
                    include: {
                        _count: {
                            select: { lots: true, products: true, specifications: true },
                        },
                    },
                }),
                prisma.designation.count({ where }),
            ],
            { isolationLevel: "RepeatableRead" },
        );

        return paginate(data, total, page, pageSize);
    },

    getDesignationById: async (id: number) => {
        // Implementation for retrieving a designation by ID
        return await prisma.designation.findUnique({ where: { id } });
    },

    updateDesignation: async (id: number, designationData: UpdateDesignationDTO) => {
        // Implementation for updating a designation
        return await prisma.designation.update({ where: { id }, data: designationData });
    },

    deleteDesignation: async (id: number) => {
        // Implementation for deleting a designation
        return await prisma.designation.delete({ where: { id } });
    }   
}