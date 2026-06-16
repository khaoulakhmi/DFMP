import { Router } from "express";
import { Role } from "../../generated/prisma/enums";
import { authenticate } from "../../middlewares/auth.middleware";
import { authorize } from "../../middlewares/role.middleware";
import { validate } from "../../middlewares/validate.middleware";
import { SpecificationController } from "./specification.controller";
import { createSpecificationSchema, updateSpecificationSchema } from "./specification.validation";

const SpecificationRouter = Router();

SpecificationRouter.post(
    "/",
    authenticate,
    authorize(Role.ADMIN, Role.FINANCE, Role.ACCOUNTANT),
    validate(createSpecificationSchema),
    SpecificationController.createSpecification,
);
SpecificationRouter.get(
    "/:id",
    authenticate,
    authorize(Role.ADMIN, Role.FINANCE, Role.ACCOUNTANT, Role.SALES),
    SpecificationController.getSpecificationById,
);
SpecificationRouter.put(
    "/:id",
    authenticate,
    authorize(Role.ADMIN, Role.FINANCE, Role.ACCOUNTANT),
    validate(updateSpecificationSchema),
    SpecificationController.updateSpecification,
);
SpecificationRouter.delete(
    "/:id",
    authenticate,
    authorize(Role.ADMIN, Role.FINANCE),
    SpecificationController.deleteSpecification,
);
SpecificationRouter.get(
    "/",
    authenticate,
    authorize(Role.ADMIN, Role.FINANCE, Role.ACCOUNTANT, Role.SALES),
    SpecificationController.getAllSpecifications,
);

export default SpecificationRouter;
