import z from "zod"
import { cuidParams, cuidParamsSchema } from "../../utils/id"

const providerBodySchema = z.object({
    name: z.string().min(1, "Name is required"),
    company: z.string().min(1, "Company is required"),
    email: z.string().email("Invalid email format"),
    phone: z.string().min(1, "Phone is required"),
    bankAccountNumber: z.number(),
    bankName: z.string().min(1, "Bank name is required"),
    NIF: z.number(),
    NIS: z.number(),
    address: z.string().min(1, "Address is required"),
    commercialRegisterNumber: z.number(),
    articleNumber: z.string().min(1, "Article number is required"),
})


export const createProviderSchema = z.object({
    body: providerBodySchema,
})

export const updateProviderSchema = z.object({
    params: cuidParams,
    body: providerBodySchema.partial(),
})

export const providerIdSchema = cuidParamsSchema;

export const getProvidersSchema = z.object({
    query: z.object({}).strict(),
});