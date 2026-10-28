import z from "zod"

export const createDesignationSchema = z.object({
    name: z.string().min(1, "Name is required"),
    description: z.string().min(1, "Description is required"),
})

export const updateDesignationSchema = z.object({
    name: z.string().min(1, "Name is required").optional(),
    description: z.string().min(1, "Description is required").optional(),
})

export const designationIdSchema = z.object({
    params: z.object({
        id: z.string().cuid("Invalid designation ID"),
    }),
});

export const getDesignationsSchema = z.object({
    query: z.object({}).strict(),
});