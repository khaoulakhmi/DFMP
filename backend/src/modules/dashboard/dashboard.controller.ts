import { NextFunction, Request, Response } from "express";
import { DashboardService } from "./dashboard.service";

export const DashboardController = {
    getSummary: async (_req: Request, res: Response, next: NextFunction) => {
        try {
            const summary = await DashboardService.getSummary();
            res.status(200).json(summary);
        } catch (error: unknown) {
            next(error);
        }
    },
};
