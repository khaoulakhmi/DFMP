import prisma from "../../config/prisma";
import { CreateDesignationDTO, UpdateDesignationDTO } from './designation.types';


export const DesignationService = {
    createDesignation: async (designationData: CreateDesignationDTO) => {
        // Implementation for creating a designation
        return await prisma.designation.create({ data: designationData });
    },

    getAllDesignations: async () => {
        // Implementation for retrieving all designations
        return await prisma.designation.findMany();
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