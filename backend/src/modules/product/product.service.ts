import prisma from "../../config/prisma";
import { CreateProductDTO, UpdateProductDTO } from "./product.types";

const ProductService = {
    createProduct: async (data: CreateProductDTO) => {
        return await prisma.product.create({ data });
    },

    getProductById: async (id: number) => {
        return await prisma.product.findUnique({
            where: { id },
            include: { designation: true, lot: true },
        });
    },

    updateProduct: async (id: number, data: UpdateProductDTO) => {
        return await prisma.product.update({ where: { id }, data });
    },

    deleteProduct: async (id: number) => {
        return await prisma.product.delete({ where: { id } });
    },

    listProducts: async () => {
        return await prisma.product.findMany({
            include: { designation: true, lot: true },
            orderBy: { id: "desc" },
        });
    },
};

export default ProductService;
