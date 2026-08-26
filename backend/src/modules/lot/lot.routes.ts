import { Router } from "express";
import { LotController } from "./lot.controller";
import { Role } from "../../generated/prisma/enums";
import { authenticate } from "../../middlewares/auth.middleware";
import { authorize } from "../../middlewares/role.middleware";
import { validate } from "../../middlewares/validate.middleware";
import { createLotSchema, lotIdSchema, updateLotSchema } from "./lot.validation";


const LotRouter = Router();


const authorizeLotAccess = authorize(Role.ADMIN, Role.SALES);

LotRouter.post(
    '/',
    authenticate,
    authorizeLotAccess,
    validate(createLotSchema),
    LotController.createLot,
);
LotRouter.put(
    '/:id',
    authenticate,
    authorizeLotAccess,
    validate(updateLotSchema),
    LotController.updateLot,
);
LotRouter.delete(
    '/:id',
    authenticate,
    authorizeLotAccess,
    validate(lotIdSchema),
    LotController.deleteLot,
);
LotRouter.get(
    '/:id',
    authenticate,
    authorizeLotAccess,
    validate(lotIdSchema),
    LotController.getLotById,
);
LotRouter.get(
    '/',
    authenticate,
    authorizeLotAccess,
    LotController.getAllLots,
);

export default LotRouter;
