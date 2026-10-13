import { NextFunction, Request, Response } from "express";
import ProductService from "./product.service";
import { AppError } from "../../utils/AppError";



export const ProductController = {
    createProduct: async (req: Request, res: Response, next: NextFunction) => {
        
        const data = req.body;
        try {
            const product = await ProductService.createProduct(data);
            res.status(201).json(product);
        } catch (error) {
            next(error);
        } 
    },

    getProductById: async (req: Request, res: Response, next: NextFunction) => {
        const id = Number(req.params.id);
        try {
            const product = await ProductService.getProductById(id);
            if (product) {
                res.json(product);
            } else {
                return next(new AppError({
                    statusCode: 404,
                    code: 'PRODUCT_NOT_FOUND',
                    message: 'Product not found',
                }));
            }
        } catch (error) {
            next(error);
        }
    },

    updateProduct: async (req: Request, res: Response, next: NextFunction) => {
        const id = Number(req.params.id);
        const data = req.body;
        try {
            const updatedProduct = await ProductService.updateProduct(id, data);
            res.json(updatedProduct);
        } catch (error) {
            next(error);
        }
    },

    deleteProduct: async (req: Request, res: Response, next: NextFunction) => {
        const id = Number(req.params.id);
        try {            
            await ProductService.deleteProduct(id);
            res.status(204).send();
        } catch (error) {
            next(error);
        }
    },

    listProducts: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const products = await ProductService.listProducts();
            res.json(products);
        }
        catch (error) {
            next(error);
        }                   
    }
}
