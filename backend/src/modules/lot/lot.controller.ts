import { Request, Response } from "express";
import { LotService } from "./lot.service";


export const LotController = {
    createLot: async (req: Request, res: Response) => {
        try {
            const lotData = req.body;
            const newLot = await LotService.createLot(lotData);
            res.status(201).json(newLot);
        } catch (error) {
            res.status(500).json({ error: 'Failed to create lot' });
        }
    },

    updateLot: async (req: Request, res: Response) => {
        try {
            const lotId = Number (req.params.id);
            const lotData = req.body;
            const updatedLot = await LotService.updateLot(lotId, lotData);
            res.status(200).json(updatedLot);
        } catch (error) {
            res.status(500).json({ error: 'Failed to update lot' });
        }
    },

    deleteLot: async (req: Request, res: Response) => {
        try {
            const lotId = Number(req.params.id);
            await LotService.deleteLot(lotId);
            res.status(204).send();
        } catch (error) {
            res.status(500).json({ error: 'Failed to delete lot' });
        }
    },

    getLotById: async (req: Request, res: Response) => {
        try {
            const lotId = Number(req.params.id);
            const lot = await LotService.getLotById(lotId);
            if (lot) {
                res.status(200).json(lot);
            } else {
                res.status(404).json({ error: 'Lot not found' });
            }
        } catch (error) {
            res.status(500).json({ error: 'Failed to retrieve lot' });
        }
    },

    getAllLots: async (req: Request, res: Response) => {
        try {
            const lots = await LotService.getAllLots();
            res.status(200).json(lots);
        } catch (error) {
            res.status(500).json({ error: 'Failed to retrieve lots' });
        }
    }
}