import type { NextFunction, Request, Response } from "express";
import { TenderingService } from "./tendering.service";
import { parseIntIdParam } from "../../utils/id";
import { notFoundError } from "../../utils/AppError";
import { createPrismaErrorMapper } from "../../utils/prismaError";

const mapPrismaError = createPrismaErrorMapper("Tendering", {
    duplicate: {
        code: "TENDERING_ALREADY_EXISTS",
        message: "A Tendering record already exists for these Specifications",
    },
});

export const TenderingController = {
    async createTendering(
        req: Request,
        res: Response,
        next: NextFunction,
    ) {
        try {
            const tendering = await TenderingService.createTendering(
                req.body,
            );

            res.status(201).json(tendering);
        } catch (error: unknown) {
            next(mapPrismaError(error, "create"));
        }
    },

    async getTenderingById(
        req: Request,
        res: Response,
        next: NextFunction,
    ) {
        try {
            const id = parseIntIdParam(req.params.id);

            const tendering = await TenderingService.getTenderingById(id);

            if (!tendering) {
                return next(notFoundError("Tendering"));
            }

            res.status(200).json(tendering);
        } catch (error: unknown) {
            next(error);
        }
    },

    async getTenderingBySpecificationId(
        req: Request,
        res: Response,
        next: NextFunction,
    ) {
        try {
            const specificationsId = parseIntIdParam(
                req.params.specificationsId,
            );

            const tendering =
                await TenderingService.getTenderingBySpecificationId(
                    specificationsId,
                );

            if (!tendering) {
                return next(notFoundError("Tendering"));
            }

            res.status(200).json(tendering);
        } catch (error: unknown) {
            next(error);
        }
    },

    async updateTendering(
        req: Request,
        res: Response,
        next: NextFunction,
    ) {
        try {
            const id = parseIntIdParam(req.params.id);

            const tendering = await TenderingService.updateTendering(
                id,
                req.body,
            );

            res.status(200).json(tendering);
        } catch (error: unknown) {
            next(mapPrismaError(error, "update"));
        }
    },
};