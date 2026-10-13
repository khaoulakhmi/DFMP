import { Request, Response, NextFunction } from "express";
import { ProviderService } from "./provider.service";
import { AppError } from "../../utils/AppError";




export const ProviderController = {
    // Implement provider-related request handling here
    async getAllProviders(req: Request, res: Response, next: NextFunction) {
        try {
            const providers = await ProviderService.getAllProviders();
            console.log(providers);
            res.json(providers);
        } catch (error) {
            console.error('Error fetching providers:', error);
            next(new AppError({
                statusCode: 500,
                code: 'FAILED_TO_FETCH_PROVIDERS',
                message: 'Failed to fetch providers.'
            }));
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
            console.log('Received provider data:', providerData);
            console.log('Content-Type:', req.headers['content-type']);
            const newProvider = await ProviderService.createProvider(providerData);
            res.status(201).json(newProvider);
        } catch (error) {
            next(new AppError({
                statusCode: 500,
                code: 'FAILED_TO_CREATE_PROVIDER',
                message: 'Failed to create provider.'
            }));
        }
    },

    async updateProvider(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params as { id: string };
            const providerData = req.body;
            console.log('Received provider data for update:', providerData);
            console.log('Content-Type:', req.headers['content-type']);
            const updatedProvider = await ProviderService.updateProvider(id, providerData);
            res.json(updatedProvider);
        } catch (error) {
            next(new AppError({
                statusCode: 500,
                code: 'FAILED_TO_UPDATE_PROVIDER',
                message: 'Failed to update provider.'
            }));
        }
    },

    async deleteProvider(req: Request, res: Response, next: NextFunction) {    
        try {
            const { id } = req.params as { id: string };
            await ProviderService.deleteProvider(id);
            res.status(204).send();
        } catch (error) {
            next(new AppError({
                statusCode: 500,
                code: 'FAILED_TO_DELETE_PROVIDER',
                message: 'Failed to delete provider.'
            }));
        }
    }
}