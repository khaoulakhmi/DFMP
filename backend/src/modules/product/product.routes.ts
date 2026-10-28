import { Router } from "express";
import { ProductController } from "./product.controller";
import { authenticate } from "../../middlewares/auth.middleware";
import { authorize } from "../../middlewares/role.middleware";
import { Role } from "../../generated/prisma/enums";
import { validate } from "../../middlewares/validate.middleware";
import { createProductSchema, getProductsSchema, productIdSchema, updateProductSchema } from "./product.validation";

export const ProductRouter = Router();


ProductRouter.post("/", authenticate, authorize(Role.ADMIN), validate(createProductSchema), ProductController.createProduct);
ProductRouter.get("/:id", authenticate, authorize(Role.ADMIN), validate(productIdSchema), ProductController.getProductById);
ProductRouter.put("/:id", authenticate, authorize(Role.ADMIN), validate(updateProductSchema), ProductController.updateProduct);
ProductRouter.delete("/:id", authenticate, authorize(Role.ADMIN), validate(productIdSchema), ProductController.deleteProduct);
ProductRouter.get("/", authenticate, authorize(Role.ADMIN), validate(getProductsSchema), ProductController.listProducts);