import { NextFunction, Request, Response } from "express";
import ProductService from "./product.service";
import { notFoundError } from "../../utils/AppError";
import { parseIntIdParam } from "../../utils/id";
import { createPrismaErrorMapper } from "../../utils/prismaError";
import { CreateProductDTO, UpdateProductDTO } from "./product.types";

const mapPrismaError = createPrismaErrorMapper("Product");

export const ProductController = {
    createProduct: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const data: CreateProductDTO = req.body;
            const product = await ProductService.createProduct(data);
            res.status(201).json(product);
        } catch (error) {
            next(mapPrismaError(error, "create"));
        }
    },

    getProductById: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = parseIntIdParam(req.params.id);
            const product = await ProductService.getProductById(id);
            if (!product) {
                return next(notFoundError("Product"));
            }
            res.json(product);
        } catch (error) {
            next(error);
        }
    },

    updateProduct: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = parseIntIdParam(req.params.id);
            const data: UpdateProductDTO = req.body;
            const updatedProduct = await ProductService.updateProduct(id, data);
            res.json(updatedProduct);
        } catch (error) {
            next(mapPrismaError(error, "update"));
        }
    },

    deleteProduct: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = parseIntIdParam(req.params.id);
            await ProductService.deleteProduct(id);
            res.status(204).send();
        } catch (error) {
            next(mapPrismaError(error, "delete"));
        }
    },

    listProducts: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const products = await ProductService.listProducts();
            res.json(products);
        } catch (error) {
            next(error);
        }
    },
};
