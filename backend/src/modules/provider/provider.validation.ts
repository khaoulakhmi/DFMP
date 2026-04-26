import z from "zod"

export const createProviderSchema = z.object({
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


export const updateProviderSchema = z.object({
    name: z.string().min(1, "Name is required").optional(),
    company: z.string().min(1, "Company is required").optional(),
    email: z.string().email("Invalid email format").optional(),
    phone: z.string().min(1, "Phone is required").optional(),
    bankAccountNumber: z.number().optional(),   
    bankName: z.string().min(1, "Bank name is required").optional(),
    NIF: z.number().optional(),
    NIS: z.number().optional(),
    address: z.string().min(1, "Address is required").optional(),
    commercialRegisterNumber: z.number().optional(),
    articleNumber: z.string().min(1, "Article number is required").optional(),
})