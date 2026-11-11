import type { NextFunction, Request, Response } from "express";
import { MarketService } from "./market.service";
import type { MarketListQuery } from "./market.validation";
import { parseIntIdParam } from "../../utils/id";
import { notFoundError } from "../../utils/AppError";
import { createPrismaErrorMapper } from "../../utils/prismaError";

const mapPrismaError = createPrismaErrorMapper("Market", {
    duplicate: {
        code: "MARKET_ALREADY_EXISTS",
        message: "A Market with this number already exists",
    },
});

export const MarketController = {
    async createMarket(
        req: Request,
        res: Response,
        next: NextFunction,
    ) {
        try {
            const market = await MarketService.createMarket(req.body);

            res.status(201).json(market);
        } catch (error: unknown) {
            next(mapPrismaError(error, "create"));
        }
    },

    async getAllMarkets(
        _req: Request,
        res: Response<unknown, { validatedQuery: MarketListQuery }>,
        next: NextFunction,
    ) {
        try {
            const result = await MarketService.getAllMarkets(
                res.locals.validatedQuery,
            );

            res.status(200).json(result);
        } catch (error: unknown) {
            next(error);
        }
    },

    async getMarketById(
        req: Request,
        res: Response,
        next: NextFunction,
    ) {
        try {
            const id = parseIntIdParam(req.params.id);
            const market = await MarketService.getMarketById(id);

            if (!market) {
                return next(notFoundError("Market"));
            }

            res.status(200).json(market);
        } catch (error: unknown) {
            next(error);
        }
    },

    async updateMarket(
        req: Request,
        res: Response,
        next: NextFunction,
    ) {
        try {
            const id = parseIntIdParam(req.params.id);
            const market = await MarketService.updateMarket(id, req.body);

            res.status(200).json(market);
        } catch (error: unknown) {
            next(mapPrismaError(error, "update"));
        }
    },

    async updateMarketStatus(
        req: Request,
        res: Response,
        next: NextFunction,
    ) {
        try {
            const id = parseIntIdParam(req.params.id);

            const market = await MarketService.updateMarketStatus(
                id,
                req.body,
            );

            res.status(200).json(market);
        } catch (error: unknown) {
            next(mapPrismaError(error, "update"));
        }
    },

    async deleteMarket(
        req: Request,
        res: Response,
        next: NextFunction,
    ) {
        try {
            const id = parseIntIdParam(req.params.id);

            await MarketService.deleteMarket(id);

            res.status(204).send();
        } catch (error: unknown) {
            next(mapPrismaError(error, "delete"));
        }
    },
};