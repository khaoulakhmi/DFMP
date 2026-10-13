import { NextFunction, Request, Response } from "express";
import { SpecificationService } from "./specification.service";
import { AppError } from "../../utils/AppError";

const parseId = (value: string) => Number(value);

export const SpecificationController = {
    createSpecification: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const specification = await SpecificationService.createSpecification(req.body);
            res.status(201).json(specification);
        } catch (error) {
            next(error);
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
            const specification = await SpecificationService.getSpecificationById(parseId(String(req.params.id)));
            if (!specification) {
                return next(new AppError({
                    statusCode: 404,
                    code: 'SPECIFICATION_NOT_FOUND',
                    message: 'Specification not found'
                }));
            }
            res.status(200).json(specification);
        } catch (error) {
            next(error);
        }
    },

    updateSpecification: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const specification = await SpecificationService.updateSpecification(parseId(String(req.params.id)), req.body);
            res.status(200).json(specification);
        } catch (error) {
            next(error);
        }
    },

    deleteSpecification: async (req: Request, res: Response, next: NextFunction) => {
        try {
            await SpecificationService.deleteSpecification(parseId(String(req.params.id)));
            res.status(204).send();
        } catch (error) {
            next(error);
        }
    },
};
