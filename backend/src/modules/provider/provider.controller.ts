import { Request, Response, NextFunction } from "express";
import { ProviderService } from "./provider.service";
import { AppError } from "../../utils/AppError";




export const ProviderController = {
    // Implement provider-related request handling here
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
            const { id } = req.params as { id: string };
            const provider = await ProviderService.getProviderById(id);
            if (!provider) {
                return next(new AppError({
                    statusCode: 404,
                    code: 'PROVIDER_NOT_FOUND',
                    message: 'Provider not found'
                }));
            }
            res.json(provider);
        } catch (error) {
            next(error);
        }
    },

    async createProvider(req: Request, res: Response, next: NextFunction) {
        try {
            const providerData = req.body;
            const newProvider = await ProviderService.createProvider(providerData);
            res.status(201).json(newProvider);
        } catch (error) {
            next(error);
        }
    },

    async updateProvider(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params as { id: string };
            const providerData = req.body;
            const updatedProvider = await ProviderService.updateProvider(id, providerData);
            res.json(updatedProvider);
        } catch (error) {
            next(error);
        }
    },

    async deleteProvider(req: Request, res: Response, next: NextFunction) {    
        try {
            const { id } = req.params as { id: string };
            await ProviderService.deleteProvider(id);
            res.status(204).send();
        } catch (error) {
            next(error);
        }
    }
}