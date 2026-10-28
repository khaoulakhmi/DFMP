import z from "zod";
import { intIdParams, intIdParamsSchema, intIdSchema } from "../../utils/id";

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
