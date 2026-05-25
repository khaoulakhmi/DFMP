import z from 'zod';
import { TVA } from '../../generated/prisma/enums';

export const createProductSchema = z.object({
    name: z.string().min(3, "Name is required"),
    unit: z.string().min(2, "Unit is required"),
    unitPrice: z.number().positive("Unit price must be a positive number"),
    tva: z.enum(TVA, "Invalid TVA value"),
    designationId: z.number().positive("Designation ID must be a positive number"),
});

export const updateProductSchema = z.object({
    name: z.string().min(3, "Name is required").optional(),
    unit: z.string().min(2, "Unit is required").optional(),
    unitPrice: z.number().positive("Unit price must be a positive number").optional(),
    tva: z.enum(TVA, "Invalid TVA value").optional(),
    quantityMax: z.number().positive("Quantity max must be a positive number").optional(),
    quantityMin: z.number().positive("Quantity min must be a positive number").optional(),
    evaluationPrice: z.number().positive("Evaluation price must be a positive number").optional(),
    providerPrice: z.number().positive("Provider price must be a positive number").optional(),
    designationId: z.number().positive("Designation ID must be a positive number").optional(),
});