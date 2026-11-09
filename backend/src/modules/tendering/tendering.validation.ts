import { z } from "zod";
import { AVSStatus } from "../../generated/prisma/enums";
import {
    intIdParamSchema,
    intIdParams,
    intIdParamsSchema,
    intIdSchema,
    MAX_DB_INT,
} from "../../utils/id";

// Accept a date-only string, an ISO timestamp with timezone,
// or a valid Date object from internal code.
const optionalDate = z.union([
    z.iso.date(),
    z.iso.datetime({ offset: true }),
    z.date(),
]).nullable().optional();

export const tenderingFieldsSchema = z.object({
    openingDate: optionalDate,
    techEvalDate: optionalDate,
    finEvalDate: optionalDate,
    attributionDate: optionalDate,

    delayPeriodDays: z.number()
        .int("Delay must be a whole number")
        .nonnegative("Delay cannot be negative")
        .max(MAX_DB_INT)
        .optional(),

    appealDate: optionalDate,
    appealDepositDate: optionalDate,
    appealResult: z.string().trim().nullable().optional(),
    programmingDate: optionalDate,

    avsStatus: z.enum(AVSStatus).nullable().optional(),
}).strict();

// POST /api/tenderings
export const createTenderingSchema = z.object({
    body: tenderingFieldsSchema.extend({
        specificationsId: intIdSchema,
    }),
});

// PATCH /api/tenderings/:id
export const updateTenderingSchema = z.object({
    params: intIdParams,
    body: tenderingFieldsSchema.refine(
        body => Object.values(body).some(value => value !== undefined),
        { message: "Provide at least one field to update" },
    ),
});

// GET /api/tenderings/:id
export const tenderingIdSchema = intIdParamsSchema;

// GET /api/tenderings/by-specification/:specificationsId
export const tenderingBySpecificationSchema = z.object({
    params: z.object({
        specificationsId: intIdParamSchema,
    }),
});