import { Request, Response } from "express";
import { DesignationService } from "./designation.service";



export const DesignationController = {
    createDesignation: async (req: Request, res: Response) => {
        // Logic to create a new designation
        try {
            const data = req.body;
            console.log('Received designation data:', data);
            console.log('Content-Type:', req.headers['content-type']);
            const designation = await DesignationService.createDesignation(data)
            res.status(201).json(designation);
        } catch (error) {
            console.error('Error creating designation:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },

    getAllDesignations: async (req: Request, res: Response) => {
        // Logic to retrieve all designations
        try {
            const designations = await DesignationService.getAllDesignations();
            res.status(200).json(designations);
        } catch (error) {
            console.error('Error retrieving designations:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },

    getDesignationById: async (req: Request, res: Response) => {
        // Logic to retrieve a designation by ID
        try {
            const { id } = req.params as { id: string };
            const designation = await DesignationService.getDesignationById(Number(id));
            if (!designation) {
                return res.status(404).json({ error: 'Designation not found' });
            }
            res.status(200).json(designation);
        } catch (error) {
            console.error('Error retrieving designation by ID:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },

    updateDesignation: async (req: Request, res: Response) => {
        // Logic to update a designation
        try {            
            const { id } = req.params as { id: string };
            const data = req.body;
            console.log('Received designation data for update:', data);
            console.log('Content-Type:', req.headers['content-type']);
            const updatedDesignation = await DesignationService.updateDesignation(Number(id), data);
            res.status(200).json(updatedDesignation);
        } catch (error) {
            console.error('Error updating designation:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },

    deleteDesignation: async (req: Request, res: Response) => {
        // Logic to delete a designation
        try {
            const { id } = req.params as { id: string };
            await DesignationService.deleteDesignation(Number(id));
            res.status(204).send();
        } catch (error) {   
            console.error('Error deleting designation:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
}