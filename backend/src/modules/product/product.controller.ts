import { Request, Response } from "express";
import ProductService from "./product.service";



export const ProductController = {
    createProduct: async (req: Request, res: Response) => {
        
        const data = req.body;
        try {
            const product = await ProductService.createProduct(data);
            res.status(201).json(product);
        } catch (error) {
            res.status(500).json({ error: "Failed to create product" });
        } 
    },

    getProductById: async (req: Request, res: Response) => {
        const id = Number(req.params.id);
        try {
            const product = await ProductService.getProductById(id);
            if (product) {
                res.json(product);
            } else {
                res.status(404).json({ error: "Product not found" });
            }
        } catch (error) {
            res.status(500).json({ error: "Failed to retrieve product" });
        }
    },

    updateProduct: async (req: Request, res: Response) => {
        const id = Number(req.params.id);
        const data = req.body;
        try {
            const updatedProduct = await ProductService.updateProduct(id, data);
            res.json(updatedProduct);
        } catch (error) {
            res.status(500).json({ error: "Failed to update product" });
        }
    },

    deleteProduct: async (req: Request, res: Response) => {
        const id = Number(req.params.id);
        try {            
            await ProductService.deleteProduct(id);
            res.status(204).send();
        } catch (error) {
            res.status(500).json({ error: "Failed to delete product" });
        }
    },

    listProducts: async (req: Request, res: Response) => {
        try {
            const products = await ProductService.listProducts();
            res.json(products);
        }
        catch (error) {
            res.status(500).json({ error: "Failed to list products" });
        }
    }
};