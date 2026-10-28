import { Request, Response, NextFunction } from "express";
import { ProviderService } from "./provider.service";
import { notFoundError } from "../../utils/AppError";
import { parseCuidParam } from "../../utils/id";
import { createPrismaErrorMapper } from "../../utils/prismaError";

// Email is the only unique field on Provider.
const mapPrismaError = createPrismaErrorMapper("Provider", {
    duplicate: { code: "PROVIDER_EMAIL_EXISTS", message: "A provider with this email already exists" },
});

export const ProviderController = {
    async getAllProviders(req: Request, res: Response, next: NextFunction) {
        try {
            const providers = await ProviderService.getAllProviders();
            res.json(providers);
        } catch (error) {
            next(error);
        }
    },

    async getProviderById(req: Request, res: Response, next: NextFunction) {
        try {
            const id = parseCuidParam(req.params.id);
            const provider = await ProviderService.getProviderById(id);
            if (!provider) {
                return next(notFoundError("Provider"));
            }
            res.json(provider);
        } catch (error) {
            next(error);
        }
    },

    async createProvider(req: Request, res: Response, next: NextFunction) {
        try {
            const newProvider = await ProviderService.createProvider(req.body);
            res.status(201).json(newProvider);
        } catch (error) {
            next(mapPrismaError(error, "create"));
        }
    },

    async updateProvider(req: Request, res: Response, next: NextFunction) {
        try {
            const id = parseCuidParam(req.params.id);
            const updatedProvider = await ProviderService.updateProvider(id, req.body);
            res.json(updatedProvider);
        } catch (error) {
            next(mapPrismaError(error, "update"));
        }
    },

    async deleteProvider(req: Request, res: Response, next: NextFunction) {
        try {
            const id = parseCuidParam(req.params.id);
            await ProviderService.deleteProvider(id);
            res.status(204).send();
        } catch (error) {
            next(mapPrismaError(error, "delete"));
        }
    },
};
