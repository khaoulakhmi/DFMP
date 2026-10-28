import { NextFunction, Request, Response } from "express";
import { SpecificationService } from "./specification.service";
import { notFoundError } from "../../utils/AppError";
import { parseIntIdParam } from "../../utils/id";
import { createPrismaErrorMapper } from "../../utils/prismaError";

const mapPrismaError = createPrismaErrorMapper("Specification");

export const SpecificationController = {
    createSpecification: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const specification = await SpecificationService.createSpecification(req.body);
            res.status(201).json(specification);
        } catch (error) {
            next(mapPrismaError(error, "create"));
        }
    },

    getAllSpecifications: async (_req: Request, res: Response, next: NextFunction) => {
        try {
            const specifications = await SpecificationService.getAllSpecifications();
            res.status(200).json(specifications);
        } catch (error) {
            next(error);
        }
    },

    getSpecificationById: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = parseIntIdParam(req.params.id);
            const specification = await SpecificationService.getSpecificationById(id);
            if (!specification) {
                return next(notFoundError("Specification"));
            }
            res.status(200).json(specification);
        } catch (error) {
            next(error);
        }
    },

    updateSpecification: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = parseIntIdParam(req.params.id);
            const specification = await SpecificationService.updateSpecification(id, req.body);
            res.status(200).json(specification);
        } catch (error) {
            next(mapPrismaError(error, "update"));
        }
    },

    deleteSpecification: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = parseIntIdParam(req.params.id);
            await SpecificationService.deleteSpecification(id);
            res.status(204).send();
        } catch (error) {
            next(mapPrismaError(error, "delete"));
        }
    },
};
