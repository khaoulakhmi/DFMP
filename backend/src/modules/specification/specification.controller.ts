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
            next(new AppError({
                statusCode: 500,
                code: 'FAILED_TO_CREATE_SPECIFICATION',
                message: 'Failed to create specification'
            }));
        }
    },

    getAllSpecifications: async (_req: Request, res: Response, next: NextFunction) => {
        try {
            const specifications = await SpecificationService.getAllSpecifications();
            res.status(200).json(specifications);
        } catch (error) {
            next(new AppError({
                statusCode: 500,
                code: 'FAILED_TO_RETRIEVE_SPECIFICATIONS',
                message: 'Failed to retrieve specifications'
            }));
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
            next(new AppError({
                statusCode: 500,
                code: 'FAILED_TO_RETRIEVE_SPECIFICATION',
                message: 'Failed to retrieve specification'
            }));
        }
    },

    updateSpecification: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const specification = await SpecificationService.updateSpecification(parseId(String(req.params.id)), req.body);
            res.status(200).json(specification);
        } catch (error) {
            next(new AppError({
                statusCode: 500,
                code: 'FAILED_TO_UPDATE_SPECIFICATION',
                message: 'Failed to update specification'
            }));
        }
    },

    deleteSpecification: async (req: Request, res: Response, next: NextFunction) => {
        try {
            await SpecificationService.deleteSpecification(parseId(String(req.params.id)));
            res.status(204).send();
        } catch (error) {
            next(new AppError({
                statusCode: 500,
                code: 'FAILED_TO_DELETE_SPECIFICATION',
                message: 'Failed to delete specification'
            }));
        }
    },
};
