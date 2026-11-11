import prisma from "../../config/prisma";
import type { Prisma } from "../../generated/prisma/client";
import type { MarketListQuery } from "./market.validation";
import { toMarketUpdateData } from "./market.data";
import { pageToSkip, paginate } from "../../utils/pagination";
import type {
    CreateMarketDTO,
    UpdateMarketDTO,
    UpdateMarketStatusDTO,
} from "./market.types";

import {
    conflictError,
    notFoundError,
    resourceInUseError,
} from "../../utils/AppError";
import { runSerializableTransaction } from "../../utils/transaction";

// Return small relationship summaries instead of entire related records.
const marketInclude = {
    provider: {
        select: {
            id: true,
            name: true,
            company: true,
        },
    },
    lot: {
        select: {
            id: true,
            name: true,
        },
    },
    _count: {
        select: {
            invoices: true,
        },
    },
} satisfies Prisma.MarketInclude;

export const MarketService = {
    async createMarket(data: CreateMarketDTO) {
        return prisma.market.create({
            data: {
                ...toMarketUpdateData(data),

                // Explicit required fields preserve Prisma's required types.
                marketNumber: data.marketNumber,
                providerId: data.providerId,
                lotId: data.lotId,
                date: data.date instanceof Date
                    ? data.date
                    : new Date(data.date),
            },
            include: marketInclude,
        });
    },

    async getMarketById(id: number) {
        return prisma.market.findUnique({
            where: { id },
            include: marketInclude,
        });
    },

    async getAllMarkets(query: MarketListQuery) {
        const {
            page,
            pageSize,
            search,
            providerId,
            lotId,
            status,
            sortBy,
            sortOrder,
        } = query;

        const where: Prisma.MarketWhereInput = {};

        if (search) {
            where.OR = [
                {
                    marketNumber: {
                        contains: search,
                        mode: "insensitive",
                    },
                },
                {
                    provider: {
                        name: {
                            contains: search,
                            mode: "insensitive",
                        },
                    },
                },
                {
                    lot: {
                        name: {
                            contains: search,
                            mode: "insensitive",
                        },
                    },
                },
            ];
        }

        if (providerId !== undefined) {
            where.providerId = providerId;
        }

        if (lotId !== undefined) {
            where.lotId = lotId;
        }

        if (status !== undefined) {
            where.status = status;
        }

        const orderBy: Prisma.MarketOrderByWithRelationInput[] = [
            { [sortBy]: sortOrder },
        ];

        // Resolve ties consistently so pagination has a stable order.
        if (sortBy !== "id") {
            orderBy.push({ id: "asc" });
        }

        const [data, total] = await prisma.$transaction(
            [
                prisma.market.findMany({
                    where,
                    orderBy,
                    skip: pageToSkip(page, pageSize),
                    take: pageSize,
                    include: marketInclude,
                }),
                prisma.market.count({ where }),
            ],
            { isolationLevel: "RepeatableRead" },
        );

        return paginate(data, total, page, pageSize);
    },

    async updateMarket(id: number, data: UpdateMarketDTO) {
        return runSerializableTransaction(async tx => {
            const market = await tx.market.findUnique({
                where: { id },
                select: {
                    status: true,
                    providerId: true,
                    lotId: true,
                    _count: {
                        select: { invoices: true },
                    },
                },
            });

            if (!market) {
                throw notFoundError("Market");
            }

            if (market.status !== "PENDING") {
                throw conflictError(
                    "MARKET_NOT_EDITABLE",
                    "Only pending Markets can be edited",
                );
            }

            const providerChanged =
                data.providerId !== undefined &&
                data.providerId !== market.providerId;

            const lotChanged =
                data.lotId !== undefined &&
                data.lotId !== market.lotId;

            if (
                market._count.invoices > 0 &&
                (providerChanged || lotChanged)
            ) {
                throw conflictError(
                    "MARKET_RELATION_LOCKED",
                    "Cannot change the Provider or Lot of a Market with invoices",
                );
            }

            return tx.market.update({
                where: { id },
                data: toMarketUpdateData(data),
                include: marketInclude,
            });
        });
    },

    async updateMarketStatus(id: number, data: UpdateMarketStatusDTO) {
        return runSerializableTransaction(async tx => {
            const market = await tx.market.findUnique({
                where: { id },
                select: { status: true },
            });

            if (!market) {
                throw notFoundError("Market");
            }

            if (market.status !== "PENDING") {
                throw conflictError(
                    "INVALID_MARKET_TRANSITION",
                    "Only pending Markets can be approved or rejected",
                );
            }

            return tx.market.update({
                where: { id },
                data: {
                    status: data.status,
                },
                include: marketInclude,
            });
        });
    },

    async deleteMarket(id: number) {
        return runSerializableTransaction(async tx => {
            const market = await tx.market.findUnique({
                where: { id },
                select: {
                    status: true,
                    _count: {
                        select: { invoices: true },
                    },
                },
            });

            if (!market) {
                throw notFoundError("Market");
            }

            if (market.status !== "PENDING") {
                throw conflictError(
                    "MARKET_NOT_DELETABLE",
                    "Only pending Markets can be deleted",
                );
            }

            if (market._count.invoices > 0) {
                throw resourceInUseError("Market");
            }

            return tx.market.delete({
                where: { id },
            });
        });
    },
};