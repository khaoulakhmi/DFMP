import { NextFunction, Request, Response } from "express";
import { LotService } from "./lot.service";
import { notFoundError } from "../../utils/AppError";
import { parseIntIdParam } from "../../utils/id";
import { createPrismaErrorMapper } from "../../utils/prismaError";

const mapPrismaError = createPrismaErrorMapper("Lot");

export const LotController = {
    createLot: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const newLot = await LotService.createLot(req.body);
            res.status(201).json(newLot);
        } catch (error) {
            next(mapPrismaError(error, "create"));
        }
    },

    updateLot: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = parseIntIdParam(req.params.id);
            const updatedLot = await LotService.updateLot(id, req.body);
            res.status(200).json(updatedLot);
        } catch (error) {
            next(mapPrismaError(error, "update"));
        }
    },

    deleteLot: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = parseIntIdParam(req.params.id);
            await LotService.deleteLot(id);
            res.status(204).send();
        } catch (error) {
            next(mapPrismaError(error, "delete"));
        }
    },

    getLotById: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = parseIntIdParam(req.params.id);
            const lot = await LotService.getLotById(id);
            if (!lot) {
                return next(notFoundError("Lot"));
            }
            res.status(200).json(lot);
        } catch (error) {
            next(error);
        }
    },

    getAllLots: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const lots = await LotService.getAllLots();
            res.status(200).json(lots);
        } catch (error) {
            next(error);
        }
    },
};
