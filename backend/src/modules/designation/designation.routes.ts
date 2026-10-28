import { Router } from "express";
import { DesignationController } from "./designation.controller";
import { authenticate } from "../../middlewares/auth.middleware";
import { authorize } from "../../middlewares/role.middleware";
import { Role } from "../../generated/prisma/enums";
import { validate } from "../../middlewares/validate.middleware";
import { createDesignationSchema, designationIdSchema, getDesignationsSchema, updateDesignationSchema } from "./designation.validation";


const designationRouter = Router();

designationRouter.get("/", authenticate, authorize(Role.ADMIN, Role.SALES), validate(getDesignationsSchema), DesignationController.getAllDesignations);
designationRouter.get("/:id", authenticate, authorize(Role.ADMIN, Role.SALES), validate(designationIdSchema), DesignationController.getDesignationById);
designationRouter.post("/", authenticate, authorize(Role.ADMIN), validate(createDesignationSchema), DesignationController.createDesignation);
designationRouter.put("/:id", authenticate, authorize(Role.ADMIN), validate(updateDesignationSchema), DesignationController.updateDesignation);
designationRouter.delete("/:id", authenticate, authorize(Role.ADMIN), validate(designationIdSchema), DesignationController.deleteDesignation);

export default designationRouter;