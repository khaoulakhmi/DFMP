import { Router } from "express";
import { ProductController } from "./product.controller";
import { authenticate } from "../../middlewares/auth.middleware";
import { authorize } from "../../middlewares/role.middleware";
import { Role } from "../../generated/prisma/enums";


export const ProductRouter = Router();


ProductRouter.post("/", authenticate, authorize(Role.ADMIN), ProductController.createProduct);
ProductRouter.get("/:id", authenticate, authorize(Role.ADMIN), ProductController.getProductById);
ProductRouter.put("/:id", authenticate, authorize(Role.ADMIN), ProductController.updateProduct);
ProductRouter.delete("/:id", authenticate, authorize(Role.ADMIN), ProductController.deleteProduct);
ProductRouter.get("/", authenticate, authorize(Role.ADMIN), ProductController.listProducts);