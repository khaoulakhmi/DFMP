import z from "zod";

const positiveId = z.coerce.number().int().positive();
const productIds = z.array(positiveId).refine(
    (ids) => new Set(ids).size === ids.length,
    { message: "Product IDs must be unique" },
);

const lotBodyFields = {
    name: z.string().trim().min(1, "Name is required"),
    designationId: positiveId,
    productIds: productIds.optional(),
    specificationsId: positiveId.nullable().optional(),
};

export const lotIdSchema = z.object({
    params: z.object({
        id: positiveId,
    }).strict(),
});

export const createLotSchema = z.object({
    body: z.object(lotBodyFields).strict(),
});

export const updateLotSchema = z.object({
    params: z.object({
        id: positiveId,
    }).strict(),
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
