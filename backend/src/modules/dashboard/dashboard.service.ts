import prisma from "../../config/prisma";

export type DashboardSummary = {
    users: { total: number; active: number };
    providers: { total: number };
    designations: { total: number };
    lots: { total: number; withSpecification: number; withoutSpecification: number };
    products: { total: number; withoutLot: number };
    specifications: { total: number };
};

export const DashboardService = {
    // All counts are taken from one snapshot so they agree with each other.
    getSummary: async (): Promise<DashboardSummary> => {
        const [
            users,
            activeUsers,
            providers,
            designations,
            lots,
            lotsWithSpecification,
            products,
            productsWithoutLot,
            specifications,
        ] = await prisma.$transaction(
            [
                prisma.user.count(),
                prisma.user.count({ where: { status: true } }),
                prisma.provider.count(),
                prisma.designation.count(),
                prisma.lot.count(),
                prisma.lot.count({ where: { specificationsId: { not: null } } }),
                prisma.product.count(),
                prisma.product.count({ where: { lotId: null } }),
                prisma.specifications.count(),
            ],
            { isolationLevel: "RepeatableRead" },
        );

        return {
            users: { total: users, active: activeUsers },
            providers: { total: providers },
            designations: { total: designations },
            lots: {
                total: lots,
                withSpecification: lotsWithSpecification,
                withoutSpecification: lots - lotsWithSpecification,
            },
            products: { total: products, withoutLot: productsWithoutLot },
            specifications: { total: specifications },
        };
    },
};
