import { z } from "zod";

const idSchema = z.string()
    .regex(/^[1-9]\d*$/, "ID must be a positive integer")
    .refine(
        value => Number(value) <= 2147483647,
        "ID is too large"
    );

const designationBodySchema = z.object({
    name: z.string().trim().min(1, "Name is required"),
    description: z.string().trim().nullable().optional(),
}).strict();

export const createDesignationSchema = z.object({
    body: designationBodySchema,
});

export const updateDesignationSchema = z.object({
    params: z.object({
        id: idSchema,
    }),
    body: designationBodySchema.partial().refine(
        body => Object.keys(body).length > 0,
        "Provide at least one field to update"
    ),
});

export const designationIdSchema = z.object({
    params: z.object({
        id: idSchema,
    }),
});

export const getDesignationsSchema = z.object({
    query: z.object({}).strict(),
});