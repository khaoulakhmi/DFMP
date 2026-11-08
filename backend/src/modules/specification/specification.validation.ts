import z from "zod";
import { AVSStatus } from "../../generated/prisma/enums";
import { intIdParams, intIdParamsSchema, intIdSchema } from "../../utils/id";
import { amountSchema } from "../../utils/amount";
import {
    booleanQuery,
    paginationQueryShape,
    positiveIntegerQuery,
    sortOrderSchema,
} from "../../utils/pagination";

const optionalDate = z.union([z.string(), z.date()]).nullable().optional();
const nullableText = z.string().trim().nullable().optional();

const tenderingSchema = z.object({
    openingDate: optionalDate,
    techEvalDate: optionalDate,
    finEvalDate: optionalDate,
    attributionDate: optionalDate,
    delayPeriodDays: z.number().int().positive().optional(),
    appealDate: optionalDate,
    appealDepositDate: optionalDate,
    appealResult: nullableText,
    programmingDate: optionalDate,
    avsStatus: z.enum(AVSStatus).nullable().optional(),
}).optional();

// 1. Base object schema, no refinements
const specificationBodySchema = z.object({
    type: z.string().trim().min(2, "Type is required"),
    designationId: intIdSchema,
    minAmount: amountSchema,
    maxAmount: amountSchema,
    year: z.number().int().min(2000).max(2100),
    depositDateCM: optionalDate,
    sessionDate: optionalDate,
    visaDate: optionalDate,
    visaNumber: nullableText,
    pubArabicDate: optionalDate,
    pubArabicJournal: nullableText,
    pubFrenchDate: optionalDate,
    pubFrenchJournal: nullableText,
    pubArElecJournal: nullableText,
    pubFrElecJournal: nullableText,
    lotIds: z.array(intIdSchema).optional(),
    tendering: tenderingSchema,
});

// 2. Create schema = base + refinement
export const createSpecificationSchema = z.object({
    body: specificationBodySchema.refine(
        data => data.maxAmount >= data.minAmount,
        {
            message: "Maximum amount must be greater than or equal to minimum amount",
            path: ["maxAmount"],
        }
    ),
});

// 3. Update schema = partial of the base (no refinement issue), with its own conditional check
export const updateSpecificationSchema = z.object({
    params: intIdParams,
    body: specificationBodySchema.partial().refine(
        data => {
            if (data.minAmount !== undefined && data.maxAmount !== undefined) {
                return data.maxAmount >= data.minAmount;
            }
            return true;
        },
        {
            message: "Maximum amount must be greater than or equal to minimum amount",
            path: ["maxAmount"],
        }
    ),
});

export const specificationIdSchema = intIdParamsSchema;

export const specificationListQuerySchema = z.object({
    ...paginationQueryShape,

    designationId: positiveIntegerQuery.optional(),
    year: positiveIntegerQuery.pipe(z.number().min(2000).max(2100)).optional(),
    type: z.string().trim().min(1).max(20).optional(),
    hasTendering: booleanQuery.optional(),

    sortBy: z
        .enum(["year", "type", "minAmount", "maxAmount", "id"])
        .default("year"),
    sortOrder: sortOrderSchema.default("desc"),
}).strict();

export const getSpecificationsSchema = z.object({
    query: specificationListQuerySchema,
});

export type SpecificationListQuery =
    z.infer<typeof specificationListQuerySchema>;
