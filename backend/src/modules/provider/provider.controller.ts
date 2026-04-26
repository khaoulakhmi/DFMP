import { Request, Response } from "express";
import { ProviderService } from "./provider.service";




export const ProviderController = {
    // Implement provider-related request handling here
    async getAllProviders(req: Request, res: Response) {
        try {
            const providers = await ProviderService.getAllProviders();
            console.log(providers);
            res.json(providers);
        } catch (error) {
            console.error('Error fetching providers:', error);
            res.status(500).json({ error: 'Failed to fetch providers.' });
        }
    },

    async getProviderById(req: Request, res: Response) {
        try {
            const { id } = req.params as { id: string };
            const provider = await ProviderService.getProviderById(id);
            if (!provider) {
                return res.status(404).json({ error: 'Provider not found.' });
            }   
            res.json(provider);
        } catch (error) {
            console.error('Error fetching provider by ID:', error);
            res.status(500).json({ error: 'Failed to fetch provider by ID.' });
        }
    },

    async createProvider(req: Request, res: Response) {
        try {
            const providerData = req.body;
            console.log('Received provider data:', providerData);
            console.log('Content-Type:', req.headers['content-type']);
            const newProvider = await ProviderService.createProvider(providerData);
            res.status(201).json(newProvider);
        } catch (error) {
            console.error('Error creating provider:', error);
            res.status(500).json({ error: 'Failed to create provider.' });
        }
    },

    async updateProvider(req: Request, res: Response) {
        try {
            const { id } = req.params as { id: string };
            const providerData = req.body;
            console.log('Received provider data for update:', providerData);
            console.log('Content-Type:', req.headers['content-type']);
            const updatedProvider = await ProviderService.updateProvider(id, providerData);
            res.json(updatedProvider);
        } catch (error) {
            console.error('Error updating provider:', error);
            res.status(500).json({ error: 'Failed to update provider.' });
        }
    },

    async deleteProvider(req: Request, res: Response) {    
        try {
            const { id } = req.params as { id: string };
            await ProviderService.deleteProvider(id);
            res.status(204).send();
        } catch (error) {
            console.error('Error deleting provider:', error);
            res.status(500).json({ error: 'Failed to delete provider.' });
        }
    }
}