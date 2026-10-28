import type { RequestHandler } from "express";
import type { ZodType } from "zod";

export const validate = (schema: ZodType): RequestHandler => {
    return (req, res, next) => {
        try {
            const parsed = schema.parse({
                body: req.body,
                params: req.params,
                query: req.query,
            });

            if (
                typeof parsed === "object" &&
                parsed !== null &&
                "body" in parsed
            ) {
                req.body = parsed.body;
            }

            next();
        } catch (error: unknown) {
            next(error);
        }
    };
};