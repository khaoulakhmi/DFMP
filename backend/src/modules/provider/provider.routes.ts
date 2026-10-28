import { Router } from "express";
import { ProviderController } from "./provider.controller";
import { authenticate } from "../../middlewares/auth.middleware";
import { authorize } from "../../middlewares/role.middleware";
import { Role } from "../../generated/prisma/enums";
import { validate } from "../../middlewares/validate.middleware";
import { createProviderSchema, getProvidersSchema, providerIdSchema, updateProviderSchema } from "./provider.validation";



const providerRouter = Router();

providerRouter.get("/", authenticate, authorize(Role.ADMIN, Role.SALES), validate(getProvidersSchema), ProviderController.getAllProviders);
providerRouter.get("/:id", authenticate, authorize(Role.ADMIN, Role.SALES), validate(providerIdSchema), ProviderController.getProviderById);
providerRouter.post("/", authenticate, authorize(Role.ADMIN, Role.SALES), validate(createProviderSchema), ProviderController.createProvider);
providerRouter.put("/:id", authenticate, authorize(Role.ADMIN, Role.SALES), validate(updateProviderSchema), ProviderController.updateProvider);
providerRouter.delete("/:id", authenticate, authorize(Role.ADMIN, Role.SALES), validate(providerIdSchema), ProviderController.deleteProvider);

export default providerRouter;