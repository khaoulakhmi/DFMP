import { Request, Response } from "express";
import { SpecificationService } from "./specification.service";

const parseId = (value: string) => Number(value);

export const SpecificationController = {
    createSpecification: async (req: Request, res: Response) => {
        try {
            const specification = await SpecificationService.createSpecification(req.body);
            res.status(201).json(specification);
        } catch (error) {
            console.error("Error creating specification:", error);
            res.status(500).json({ error: "Failed to create specification" });
        }
    },

    getAllSpecifications: async (_req: Request, res: Response) => {
        try {
            const specifications = await SpecificationService.getAllSpecifications();
            res.status(200).json(specifications);
        } catch (error) {
            res.status(500).json({ error: "Failed to retrieve specifications" });
        }
    },

    getSpecificationById: async (req: Request, res: Response) => {
        try {
            const specification = await SpecificationService.getSpecificationById(parseId(String(req.params.id)));
            if (!specification) {
                res.status(404).json({ error: "Specification not found" });
                return;
            }
            res.status(200).json(specification);
        } catch (error) {
            res.status(500).json({ error: "Failed to retrieve specification" });
        }
    },

    updateSpecification: async (req: Request, res: Response) => {
        try {
            const specification = await SpecificationService.updateSpecification(parseId(String(req.params.id)), req.body);
            res.status(200).json(specification);
        } catch (error) {
            res.status(500).json({ error: "Failed to update specification" });
        }
    },

    deleteSpecification: async (req: Request, res: Response) => {
        try {
            await SpecificationService.deleteSpecification(parseId(String(req.params.id)));
            res.status(204).send();
        } catch (error) {
            res.status(500).json({ error: "Failed to delete specification" });
        }
    },
};
