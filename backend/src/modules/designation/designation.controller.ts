import { NextFunction, Request, Response } from "express";
import { DesignationService } from "./designation.service";
import { notFoundError } from "../../utils/AppError";
import { parseIntIdParam } from "../../utils/id";
import { createPrismaErrorMapper } from "../../utils/prismaError";

const mapPrismaError = createPrismaErrorMapper("Designation");

export const DesignationController = {
    createDesignation: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const designation = await DesignationService.createDesignation(req.body);
            res.status(201).json(designation);
        } catch (error) {
            next(mapPrismaError(error, "create"));
        }
    },

    getAllDesignations: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const designations = await DesignationService.getAllDesignations();
            res.status(200).json(designations);
        } catch (error) {
            next(error);
        }
    },

    getDesignationById: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = parseIntIdParam(req.params.id);
            const designation = await DesignationService.getDesignationById(id);
            if (!designation) {
                return next(notFoundError("Designation"));
            }
            res.status(200).json(designation);
        } catch (error) {
            next(error);
        }
    },

    updateDesignation: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = parseIntIdParam(req.params.id);
            const updatedDesignation = await DesignationService.updateDesignation(id, req.body);
            res.status(200).json(updatedDesignation);
        } catch (error) {
            next(mapPrismaError(error, "update"));
        }
    },

    deleteDesignation: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = parseIntIdParam(req.params.id);
            await DesignationService.deleteDesignation(id);
            res.status(204).send();
        } catch (error) {
            next(mapPrismaError(error, "delete"));
        }
    },
};
