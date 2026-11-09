import { Router } from "express";
import { Role } from "../../generated/prisma/enums";
import { authenticate } from "../../middlewares/auth.middleware";
import { authorize } from "../../middlewares/role.middleware";
import { validate } from "../../middlewares/validate.middleware";
import { TenderingController } from "./tendering.controller";
import {
    createTenderingSchema,
    updateTenderingSchema,
    tenderingIdSchema,
    tenderingBySpecificationSchema,
} from "./tendering.validation";

const tenderingRouter = Router();

const canReadTendering = authorize(
    Role.ADMIN,
    Role.FINANCE,
    Role.ACCOUNTANT,
    Role.SALES,
);

const canWriteTendering = authorize(
    Role.ADMIN,
    Role.FINANCE,
    Role.ACCOUNTANT,
);

// Every route below requires authentication.
tenderingRouter.use(authenticate);

tenderingRouter.post(
    "/",
    canWriteTendering,
    validate(createTenderingSchema),
    TenderingController.createTendering,
);

tenderingRouter.get(
    "/by-specification/:specificationsId",
    canReadTendering,
    validate(tenderingBySpecificationSchema),
    TenderingController.getTenderingBySpecificationId,
);

tenderingRouter.get(
    "/:id",
    canReadTendering,
    validate(tenderingIdSchema),
    TenderingController.getTenderingById,
);

tenderingRouter.patch(
    "/:id",
    canWriteTendering,
    validate(updateTenderingSchema),
    TenderingController.updateTendering,
);

export default tenderingRouter;