import { Router } from "express";
import { ProviderController } from "./provider.controller";



const providerRouter = Router();

providerRouter.get("/", ProviderController.getAllProviders);
providerRouter.get("/:id", ProviderController.getProviderById);
providerRouter.post("/", ProviderController.createProvider);
providerRouter.put("/:id", ProviderController.updateProvider);
providerRouter.delete("/:id", ProviderController.deleteProvider);

export default providerRouter;