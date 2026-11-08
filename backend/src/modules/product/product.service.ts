import prisma from "../../config/prisma";
import { CreateProductDTO, UpdateProductDTO } from "./product.types";
import type { Prisma } from "../../generated/prisma/client";
import type { ProductListQuery } from "./product.validation";
import { pageToSkip, paginate } from "../../utils/pagination";


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

    listProducts: async (query: ProductListQuery) => {
        const {
            page,
            pageSize,
            search,
            designationId,
            lotId,
            notInLotId,
            tva,
            sortBy,
            sortOrder,
        } = query;

        const conditions: Prisma.ProductWhereInput[] = [];

        if (search) {
            conditions.push({
                OR: [
                    { name: { contains: search, mode: "insensitive" } },
                    { unit: { contains: search, mode: "insensitive" } },
                ],
            });
        }

        if (notInLotId !== undefined) {
            conditions.push({
                OR: [{ lotId: null }, { lotId: { not: notInLotId } }],
            });
        }

        const where: Prisma.ProductWhereInput = conditions.length ? { AND: conditions } : {};

        if (designationId !== undefined) {
            where.designationId = designationId;
        }

        if (lotId !== undefined) {
            where.lotId = lotId;
        }

        if (tva !== undefined) {
            where.tva = tva;
        }

        const orderBy: Prisma.ProductOrderByWithRelationInput[] = [
            { [sortBy]: sortOrder },
            { id: "asc" },
        ];

        const [data, total] = await prisma.$transaction(
            [
                prisma.product.findMany({
                    where,
                    orderBy,
                    skip: pageToSkip(page, pageSize),
                    take: pageSize,
                    include: {
                        designation: true,
                        lot: true,
                    },
                }),
                prisma.product.count({ where }),
            ],
            { isolationLevel: "RepeatableRead" },
        );

        return paginate(data, total, page, pageSize);
    },
};

export default ProductService;
