
import prisma from "../../config/prisma";
import type { Prisma } from "../../generated/prisma/client";
import type { ProviderListQuery } from "./provider.validation";
import { pageToSkip, paginate } from "../../utils/pagination";
import { createProviderDTO, updateProviderDTO } from "./provider.types";

// articleNumber is not a Provider column, so it is dropped before saving.
const toCreateProviderData = (data: createProviderDTO) => {
    const { articleNumber, ...providerData } = data;
    return providerData;
};

const toUpdateProviderData = (data: updateProviderDTO) => {
    const { articleNumber, ...providerData } = data;
    return providerData;
};


export const ProviderService = {
    createProvider: async (data: createProviderDTO) => {
        // Logic to create a new provider
        return await prisma.provider.create({ data: toCreateProviderData(data) });
    },

    getAllProviders: async (query: ProviderListQuery) => {
        const {
            page,
            pageSize,
            search,
            company,
            sortBy,
            sortOrder,
        } = query;

        const where: Prisma.ProviderWhereInput = {};

        if (search) {
            where.OR = [
                { name: { contains: search, mode: "insensitive" } },
                { company: { contains: search, mode: "insensitive" } },
                { email: { contains: search, mode: "insensitive" } },
                { phone: { contains: search, mode: "insensitive" } },
                { NIF: { contains: search, mode: "insensitive" } },
                { NIS: { contains: search, mode: "insensitive" } },
            ];
        }

        if (company) {
            where.company = { equals: company };
        }

        const orderBy: Prisma.ProviderOrderByWithRelationInput[] = [
            { [sortBy]: sortOrder },
            { id: "asc" },
        ];

        const [data, total] = await prisma.$transaction(
            [
                prisma.provider.findMany({
                    where,
                    orderBy,
                    skip: pageToSkip(page, pageSize),
                    take: pageSize,
                }),
                prisma.provider.count({ where }),
            ],
            { isolationLevel: "RepeatableRead" },
        );

        return paginate(data, total, page, pageSize);
    },

    getProviderById: async (id: string) => {
        // Logic to retrieve a provider by ID
        return await prisma.provider.findUnique({ where: { id } });
    },

    updateProvider: async (id: string, data: updateProviderDTO) => {
        // Logic to update a provider
        return await prisma.provider.update({ where: { id }, data: toUpdateProviderData(data) });
    },

    deleteProvider: async (id: string) => {
        // Logic to delete a provider
        return await prisma.provider.delete({ where: { id } });
    }

}
