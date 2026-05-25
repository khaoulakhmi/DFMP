import prisma from "../../config/prisma";
 

 const ProductService = {
   createProduct: async(data: any) => {
    // Implement product creation logic here
    return await prisma.product.create({ data });
  },

     getProductById: async(id: number) => {
        return await prisma.product.findUnique({
            where: { id },
            include: { designation: true, lot: true }
        });
    },

    updateProduct: async(id: number, data: any) => {
        // Implement product update logic here
        return await prisma.product.update({ where: { id }, data });
    },

    deleteProduct: async(id: number) => {
        // Implement product deletion logic here
        return await prisma.product.delete({ where: { id } });
    },

    listProducts: async() => {
        return await prisma.product.findMany({
            include: { designation: true, lot: true },
            orderBy: { id: "desc" }
        });
    }

};

export default ProductService;
