import { NextFunction, Request, Response } from "express";
import { DesignationService } from "./designation.service";
import { AppError } from "../../utils/AppError";



export const DesignationController = {
    createDesignation: async (req: Request, res: Response, next: NextFunction) => {
        // Logic to create a new designation
        try {
            const data = req.body;
            console.log('Received designation data:', data);
            console.log('Content-Type:', req.headers['content-type']);
            const designation = await DesignationService.createDesignation(data)
            res.status(201).json(designation);
        } catch (error) {
            next(error);
        }
    },

    getAllDesignations: async (req: Request, res: Response, next: NextFunction) => {
        // Logic to retrieve all designations
        try {
            const designations = await DesignationService.getAllDesignations();
            res.status(200).json(designations);
        } catch (error) {
            next(error);
        }
    },

    getDesignationById: async (req: Request, res: Response, next: NextFunction) => {
        // Logic to retrieve a designation by ID
        try {
            const { id } = req.params as { id: string };
            const designation = await DesignationService.getDesignationById(Number(id));
            if (!designation) {
                return next(new AppError({
                    statusCode: 404,
                    code: 'DESIGNATION_NOT_FOUND',
                    message: 'Designation not found',
                }));
            }
            res.status(200).json(designation);
        } catch (error) {
            next(error);
        }
    },

    updateDesignation: async (req: Request, res: Response, next: NextFunction) => {
        // Logic to update a designation
        try {            
            const { id } = req.params as { id: string };
            const data = req.body;
            console.log('Received designation data for update:', data);
            console.log('Content-Type:', req.headers['content-type']);
            const updatedDesignation = await DesignationService.updateDesignation(Number(id), data);
            res.status(200).json(updatedDesignation);
        } catch (error) {
            next(error);
        }
    },

    deleteDesignation: async (req: Request, res: Response, next: NextFunction) => {
        // Logic to delete a designation
        try {
            const { id } = req.params as { id: string };
            await DesignationService.deleteDesignation(Number(id));
            res.status(204).send();
        } catch (error) {   
            next(error);
        }
    }
}