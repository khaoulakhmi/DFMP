import { z } from "zod";
import { intIdParams, intIdParamsSchema } from "../../utils/id";
import { paginationQueryShape, sortOrderSchema } from "../../utils/pagination";

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

export const designationListQuerySchema = z.object({
    ...paginationQueryShape,
    sortBy: z.enum(["id", "name"]).default("name"),
    sortOrder: sortOrderSchema.default("asc"),
}).strict();

export const getDesignationsSchema = z.object({
    query: designationListQuerySchema,
});

export type DesignationListQuery =
    z.infer<typeof designationListQuerySchema>;