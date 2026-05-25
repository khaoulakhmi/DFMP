import { Router } from "express";
import { ProviderController } from "./provider.controller";
import { authenticate } from "../../middlewares/auth.middleware";
import { authorize } from "../../middlewares/role.middleware";
import { Role } from "../../generated/prisma/enums";



const providerRouter = Router();

providerRouter.get("/", authenticate, authorize(Role.ADMIN, Role.SALES), ProviderController.getAllProviders);
providerRouter.get("/:id", authenticate, authorize(Role.ADMIN, Role.SALES), ProviderController.getProviderById);
providerRouter.post("/", authenticate, authorize(Role.ADMIN, Role.SALES), ProviderController.createProvider);
providerRouter.put("/:id", authenticate, authorize(Role.ADMIN, Role.SALES), ProviderController.updateProvider);
providerRouter.delete("/:id", authenticate, authorize(Role.ADMIN, Role.SALES), ProviderController.deleteProvider);

export default providerRouter;