import z from "zod";
import { intIdParams, intIdParamsSchema, intIdSchema } from "../../utils/id";
import {
    booleanQuery,
    paginationQueryShape,
    positiveIntegerQuery,
    sortOrderSchema,
} from "../../utils/pagination";

const productIds = z.array(intIdSchema).refine(
    (ids) => new Set(ids).size === ids.length,
    { message: "Product IDs must be unique" },
);

const lotBodyFields = {
    name: z.string().trim().min(1, "Name is required"),
    designationId: intIdSchema,
    productIds: productIds.optional(),
    specificationsId: intIdSchema.nullable().optional(),
};

export const lotIdSchema = intIdParamsSchema;

export const createLotSchema = z.object({
    body: z.object(lotBodyFields).strict(),
});

export const updateLotSchema = z.object({
    params: intIdParams,
    body: z.object({
        name: lotBodyFields.name.optional(),
        designationId: lotBodyFields.designationId.optional(),
        productIds: lotBodyFields.productIds,
        specificationsId: lotBodyFields.specificationsId,
    }).strict().refine(
        (data) => Object.keys(data).length > 0,
        { message: "Provide at least one field to update" },
    ),
});

export const lotListQuerySchema = z.object({
    ...paginationQueryShape,

    designationId: positiveIntegerQuery.optional(),
    specificationsId: positiveIntegerQuery.optional(),
    hasSpecification: booleanQuery.optional(),

    sortBy: z
        .enum(["name", "createdAt"])
        .default("createdAt"),
    sortOrder: sortOrderSchema.default("desc"),
}).strict().refine(
    query => query.specificationsId === undefined || query.hasSpecification === undefined,
    { message: "Use either specificationsId or hasSpecification", path: ["hasSpecification"] },
);

export const getLotsSchema = z.object({
    query: lotListQuerySchema,
});

export type LotListQuery = z.infer<typeof lotListQuerySchema>;