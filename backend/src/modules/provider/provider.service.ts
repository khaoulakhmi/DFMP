
import prisma from "../../config/prisma";

import { createProviderDTO, updateProviderDTO } from "./provider.types";

const toCreateProviderData = (data: createProviderDTO) => {
    const { articleNumber, NIF, NIS, ...providerData } = data;

    return {
        ...providerData,
        NIF: Number(NIF),
        NIS: Number(NIS),
    };
};

const toUpdateProviderData = (data: updateProviderDTO) => {
    const { articleNumber, NIF, NIS, ...providerData } = data;

    return {
        ...providerData,
        ...(NIF !== undefined && { NIF: Number(NIF) }),
        ...(NIS !== undefined && { NIS: Number(NIS) }),
    };
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
