import { z } from "zod";
import { TVA } from "../../generated/prisma/enums";

const MAX_INT = 2147483647;

const idSchema = z.string()
    .regex(/^[1-9]\d*$/, "ID must be a positive integer")
    .refine(
        value => Number(value) <= MAX_INT,
        "ID is too large"
    );

const databaseIdSchema = z.number().int().positive().max(MAX_INT);

const quantitySchema = z.number()
    .int("Quantity must be a whole number")
    .nonnegative("Quantity cannot be negative")
    .max(MAX_INT);

const priceSchema = z.number()
    .finite()
    .nonnegative("Price cannot be negative");

const productBodySchema = z.object({
    name: z.string().trim().min(1, "Name is required"),
    unit: z.string().trim().min(1, "Unit is required"),
    unitPrice: priceSchema,
    tva: z.enum(TVA),

    quantityMin: quantitySchema,
    quantityMax: quantitySchema,

    evaluationPrice: priceSchema.nullable().optional(),
    providerPrice: priceSchema.nullable().optional(),

    designationId: databaseIdSchema,
    lotId: databaseIdSchema.nullable().optional(),
}).strict();

export const createProductSchema = z.object({
    body: productBodySchema.refine(
        body => body.quantityMin <= body.quantityMax,
        {
            message: "Minimum quantity cannot exceed maximum quantity",
            path: ["quantityMin"],
        }
    ),
});

export const updateProductSchema = z.object({
    params: z.object({
        id: idSchema,
    }),

    body: productBodySchema.partial()
        .refine(
            body => Object.keys(body).length > 0,
            "Provide at least one field to update"
        )
        .superRefine((body, ctx) => {
            const hasMin = body.quantityMin !== undefined;
            const hasMax = body.quantityMax !== undefined;

            if (hasMin !== hasMax) {
                ctx.addIssue({
                    code: "custom",
                    message: "Send quantityMin and quantityMax together",
                    path: [hasMin ? "quantityMax" : "quantityMin"],
                });
            }

            if (
                body.quantityMin !== undefined &&
                body.quantityMax !== undefined &&
                body.quantityMin > body.quantityMax
            ) {
                ctx.addIssue({
                    code: "custom",
                    message: "Minimum quantity cannot exceed maximum quantity",
                    path: ["quantityMin"],
                });
            }
        }),
});

export const productIdSchema = z.object({
    params: z.object({
        id: idSchema,
    }),
});

export const getProductsSchema = z.object({
    query: z.object({}).strict(),
});