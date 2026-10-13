import { NextFunction, Request, Response } from "express";
import { LotService } from "./lot.service";
import { hasErrorCode } from "../../utils/error";
import { AppError } from "../../utils/AppError";


export const LotController = {
    createLot: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const lotData = req.body;
            const newLot = await LotService.createLot(lotData);
            res.status(201).json(newLot);
        } catch (error: unknown) {
            if (hasErrorCode(error, 'P2003') || hasErrorCode(error, 'P2025')) {
                return next(new AppError({
                    statusCode: 400,
                    code: 'INVALID_LOT_RELATIONSHIP',
                    message: 'Invalid lot relationship',
                }));
            }
            next(error);
        }
    },

    updateLot: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const lotId = Number (req.params.id);
            const lotData = req.body;
            const updatedLot = await LotService.updateLot(lotId, lotData);
            res.status(200).json(updatedLot);
        } catch (error: unknown) {
            if (hasErrorCode(error, 'P2025')) {
                return next(new AppError({
                    statusCode: 404,
                    code: 'LOT_NOT_FOUND',
                    message: 'Lot not found',
                }));
            }
            if (hasErrorCode(error, 'P2003')) {
                return next(new AppError({
                    statusCode: 400,
                    code: 'INVALID_LOT_RELATIONSHIP',
                    message: 'Invalid lot relationship',
                }));
            }
            next(error);
        }
    },

    deleteLot: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const lotId = Number(req.params.id);
            await LotService.deleteLot(lotId);
            res.status(204).send();
        } catch (error: unknown) {
            if (hasErrorCode(error, 'P2025')) {
                return next(new AppError({
                    statusCode: 404,
                    code: 'LOT_NOT_FOUND',
                    message: 'Lot not found',
                }));
            }
            next(error);
        }
    },

    getLotById: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const lotId = Number(req.params.id);
            const lot = await LotService.getLotById(lotId);
            if (lot) {
                res.status(200).json(lot);
            } else {
                return next(new AppError({
                    statusCode: 404,
                    code: 'LOT_NOT_FOUND',
                    message: 'Lot not found',
                }));
            }
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
    }
}
