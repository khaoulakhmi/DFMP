import { Router } from "express";
import { Role } from "../../generated/prisma/enums";
import { authenticate } from "../../middlewares/auth.middleware";
import { authorize } from "../../middlewares/role.middleware";
import { validate } from "../../middlewares/validate.middleware";
import { MarketController } from "./market.controller";
import {
    createMarketSchema,
    getMarketsSchema,
    marketIdSchema,
    updateMarketSchema,
    updateMarketStatusSchema,
} from "./market.validation";

const marketRouter = Router();

const canReadMarkets = authorize(
    Role.ADMIN,
    Role.FINANCE,
    Role.ACCOUNTANT,
    Role.SALES,
);

const canManageMarkets = authorize(
    Role.ADMIN,
    Role.SALES ,
);

marketRouter.use(authenticate);

marketRouter.get(
    "/",
    canReadMarkets,
    validate(getMarketsSchema),
    MarketController.getAllMarkets,
);

marketRouter.get(
    "/:id",
    canReadMarkets,
    validate(marketIdSchema),
    MarketController.getMarketById,
);

marketRouter.post(
    "/",
    canManageMarkets,
    validate(createMarketSchema),
    MarketController.createMarket,
);

marketRouter.patch(
    "/:id/status",
    canManageMarkets,
    validate(updateMarketStatusSchema),
    MarketController.updateMarketStatus,
);

marketRouter.patch(
    "/:id",
    canManageMarkets,
    validate(updateMarketSchema),
    MarketController.updateMarket,
);

marketRouter.delete(
    "/:id",
    canManageMarkets,
    validate(marketIdSchema),
    MarketController.deleteMarket,
);

export default marketRouter; 