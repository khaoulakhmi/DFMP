
import prisma from "../../config/prisma";

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

    getAllProviders: async () => {
        // Logic to retrieve all providers
        return await prisma.provider.findMany();
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
