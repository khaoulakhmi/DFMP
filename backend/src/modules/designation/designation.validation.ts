import { z } from "zod";
import { intIdParams, intIdParamsSchema } from "../../utils/id";

const designationBodySchema = z.object({
    name: z.string().trim().min(1, "Name is required"),
    description: z.string().trim().nullable().optional(),
}).strict();

export const createDesignationSchema = z.object({
    body: designationBodySchema,
});

export const updateDesignationSchema = z.object({
    params: intIdParams,
    body: designationBodySchema.partial().refine(
        body => Object.keys(body).length > 0,
        "Provide at least one field to update"
    ),
});

export const designationIdSchema = intIdParamsSchema;

export const getDesignationsSchema = z.object({
    query: z.object({}).strict(),
});