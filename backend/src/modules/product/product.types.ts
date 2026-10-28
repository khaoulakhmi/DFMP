import { z } from "zod";
import { createProductSchema, updateProductSchema } from "./product.validation";

// DTOs are derived from the Zod schemas so they always match what the
// validate middleware puts on req.body.
export type CreateProductDTO = z.infer<typeof createProductSchema>["body"];

export type UpdateProductDTO = z.infer<typeof updateProductSchema>["body"];
