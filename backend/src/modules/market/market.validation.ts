import { z } from "zod";
import { DealStatus } from "../../generated/prisma/enums";
import {
    cuidParamSchema,
    intIdParams,
    intIdParamsSchema,
    intIdSchema,
} from "../../utils/id";
import {
    paginationQueryShape,
    positiveIntegerQuery,
    sortOrderSchema,
} from "../../utils/pagination";

// Accept YYYY-MM-DD, an ISO datetime with timezone, or a Date.
const dateSchema = z.union([
    z.iso.date(),
    z.iso.datetime({ offset: true }),
    z.date(),
]);

const optionalDate = dateSchema.nullable().optional();
const optionalText = z.string().trim().min(1).nullable().optional();

const marketBodySchema = z.object({
    marketNumber: z.string().trim().min(1, "Market number is required"),
    providerId: cuidParamSchema,
    lotId: intIdSchema,
    date: dateSchema,

    depositDate: optionalDate,
    visaNumberCM: optionalText,
    visaDateCM: optionalDate,
    visaNumberCF: optionalText,
    visaDateCF: optionalDate,
}).strict();

export const createMarketSchema = z.object({
    body: marketBodySchema,
});

export const updateMarketSchema = z.object({
    params: intIdParams,
    body: marketBodySchema.partial().refine(
        body => Object.values(body).some(value => value !== undefined),
        { message: "Provide at least one field to update" },
    ),
});

export const marketIdSchema = intIdParamsSchema;

export const marketListQuerySchema = z.object({
    ...paginationQueryShape,

    providerId: cuidParamSchema.optional(),
    lotId: positiveIntegerQuery.optional(),
    status: z.enum(DealStatus).optional(),

    sortBy: z.enum([
        "id",
        "marketNumber",
        "date",
        "status",
        "createdAt",
        "updatedAt",
    ]).default("createdAt"),

    sortOrder: sortOrderSchema.default("desc"),
}).strict();

export const getMarketsSchema = z.object({
    query: marketListQuerySchema,
});

export type MarketListQuery = z.infer<typeof marketListQuerySchema>;

export const updateMarketStatusSchema = z.object({
    params: intIdParams,
    body: z.object({
        status: z.enum(["APPROVED", "REJECTED"]),
    }).strict(),
});