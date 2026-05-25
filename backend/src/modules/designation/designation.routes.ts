import { Router } from "express";
import { DesignationController } from "./designation.controller";
import { authenticate } from "../../middlewares/auth.middleware";
import { authorize } from "../../middlewares/role.middleware";
import { Role } from "../../generated/prisma/enums";



const designationRouter = Router();

designationRouter.get("/", authenticate, authorize(Role.ADMIN, Role.SALES), DesignationController.getAllDesignations);
designationRouter.get("/:id", authenticate, authorize(Role.ADMIN, Role.SALES), DesignationController.getDesignationById);
designationRouter.post("/", authenticate, authorize(Role.ADMIN), DesignationController.createDesignation);
designationRouter.put("/:id", authenticate, authorize(Role.ADMIN), DesignationController.updateDesignation);
designationRouter.delete("/:id", authenticate, authorize(Role.ADMIN), DesignationController.deleteDesignation);

export default designationRouter;