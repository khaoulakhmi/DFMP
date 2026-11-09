import prisma from "../../config/prisma";
import type { CreateSpecificationDTO, UpdateSpecificationDTO } from "./specification.types";
import type { TenderingFieldsDTO } from "../tendering/tendering.types";
import {
    invalidReferenceError,
    notFoundError,
} from "../../utils/AppError";
import { runSerializableTransaction } from "../../utils/transaction";
import type { Prisma } from "../../generated/prisma/client";
import { pageToSkip, paginate } from "../../utils/pagination";
import type { SpecificationListQuery } from "./specification.validation";
import { toTenderingData } from "../tendering/tendering.data";

const toDate = (value?: string | Date | null) => {
    if (!value) return null;
    return value instanceof Date ? value : new Date(value);
};

const tenderingData = (tendering?: TenderingFieldsDTO) => {
    if (tendering === undefined) return undefined;

    return toTenderingData(tendering);
};

const include = {
    designation: true,
    lots: {
        include: {
            designation: true,
            products: true,
        },
    },
    tendering: true,
};

export const SpecificationService = {
    createSpecification: async (data: CreateSpecificationDTO) => {
        return prisma.specifications.create({
            data: {
                type: data.type,
                designationId: data.designationId,
                minAmount: data.minAmount,
                maxAmount: data.maxAmount,
                year: data.year,
                depositDateCM: toDate(data.depositDateCM),
                sessionDate: toDate(data.sessionDate),
                visaDate: toDate(data.visaDate),
                visaNumber: data.visaNumber ?? null,
                pubArabicDate: toDate(data.pubArabicDate),
                pubArabicJournal: data.pubArabicJournal ?? null,
                pubFrenchDate: toDate(data.pubFrenchDate),
                pubFrenchJournal: data.pubFrenchJournal ?? null,
                pubArElecJournal: data.pubArElecJournal ?? null,
                pubFrElecJournal: data.pubFrElecJournal ?? null,
                lots: data.lotIds?.length ? {
                    connect: data.lotIds.map(id => ({ id })),
                } : undefined,
                tendering: data.tendering ? {
                    create: tenderingData(data.tendering),
                } : undefined,
            },
            include,
        });
    },

    getAllSpecifications: async (query: SpecificationListQuery) => {
        const {
            page,
            pageSize,
            search,
            designationId,
            year,
            type,
            hasTendering,
            sortBy,
            sortOrder,
        } = query;

        const where: Prisma.SpecificationsWhereInput = {};

        if (search) {
            where.OR = [
                { type: { contains: search, mode: "insensitive" } },
                { visaNumber: { contains: search, mode: "insensitive" } },
                { designation: { name: { contains: search, mode: "insensitive" } } },
            ];
        }

        if (designationId !== undefined) {
            where.designationId = designationId;
        }

        if (year !== undefined) {
            where.year = year;
        }

        if (type !== undefined) {
            where.type = type;
        }

        if (hasTendering !== undefined) {
            where.tendering = hasTendering ? { isNot: null } : { is: null };
        }

        const orderBy: Prisma.SpecificationsOrderByWithRelationInput[] =
            sortBy === "id"
                ? [{ id: sortOrder }]
                : [{ [sortBy]: sortOrder }, { id: "asc" }];

        const [data, total] = await prisma.$transaction(
            [
                prisma.specifications.findMany({
                    where,
                    orderBy,
                    skip: pageToSkip(page, pageSize),
                    take: pageSize,
                    // The list shows counts; the detail endpoint returns lots.
                    include: {
                        designation: true,
                        tendering: true,
                        _count: { select: { lots: true } },
                    },
                }),
                prisma.specifications.count({ where }),
            ],
            { isolationLevel: "RepeatableRead" },
        );

        return paginate(data, total, page, pageSize);
    },

    getSpecificationById: async (id: number) => {
        return prisma.specifications.findUnique({
            where: { id },
            include,
        });
    },

    updateSpecification: async (
        id: number,
        data: UpdateSpecificationDTO
    ) => {
        return runSerializableTransaction(async tx => {
            const specification = await tx.specifications.findUnique({
                where: { id },
                select: { id: true },
            });

            if (!specification) {
                throw notFoundError("Specification");
            }

            if (data.designationId !== undefined) {
                const designation = await tx.designation.findUnique({
                    where: { id: data.designationId },
                    select: { id: true },
                });

                if (!designation) {
                    throw invalidReferenceError();
                }
            }

            if (data.lotIds !== undefined) {
                const ids = [...new Set(data.lotIds)];

                const count = await tx.lot.count({
                    where: { id: { in: ids } },
                });

                if (count !== ids.length) {
                    throw invalidReferenceError();
                }
            }

            const tendering = tenderingData(data.tendering);

            return tx.specifications.update({
                where: { id },
                data: {
                    type: data.type,
                    designationId: data.designationId,
                    minAmount: data.minAmount,
                    maxAmount: data.maxAmount,
                    year: data.year,

                    depositDateCM: data.depositDateCM === undefined
                        ? undefined : toDate(data.depositDateCM),
                    sessionDate: data.sessionDate === undefined
                        ? undefined : toDate(data.sessionDate),
                    visaDate: data.visaDate === undefined
                        ? undefined : toDate(data.visaDate),
                    visaNumber: data.visaNumber,

                    pubArabicDate: data.pubArabicDate === undefined
                        ? undefined : toDate(data.pubArabicDate),
                    pubArabicJournal: data.pubArabicJournal,
                    pubFrenchDate: data.pubFrenchDate === undefined
                        ? undefined : toDate(data.pubFrenchDate),
                    pubFrenchJournal: data.pubFrenchJournal,
                    pubArElecJournal: data.pubArElecJournal,
                    pubFrElecJournal: data.pubFrElecJournal,

                    lots: data.lotIds !== undefined
                        ? {
                            set: data.lotIds.map(lotId => ({ id: lotId })),
                        }
                        : undefined,

                    tendering: tendering
                        ? {
                            upsert: {
                                create: tendering,
                                update: tendering,
                            },
                        }
                        : undefined,
                },
                include,
            });
        });
    },

    deleteSpecification: async (id: number) => {
        return prisma.specifications.delete({ where: { id } });
    },
};
