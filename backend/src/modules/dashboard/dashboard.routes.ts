import { Router } from "express";
import { Role } from "../../generated/prisma/enums";
import { authenticate } from "../../middlewares/auth.middleware";
import { authorize } from "../../middlewares/role.middleware";
import { validate } from "../../middlewares/validate.middleware";
import { DashboardController } from "./dashboard.controller";
import { getDashboardSummarySchema } from "./dashboard.validation";

const dashboardRouter = Router();

// Global counts across every module, so only admins can read them.
dashboardRouter.get(
    "/summary",
    authenticate,
    authorize(Role.ADMIN),
    validate(getDashboardSummarySchema),
    DashboardController.getSummary,
);

export default dashboardRouter;
