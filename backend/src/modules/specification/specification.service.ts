import prisma from "../../config/prisma";
import type { CreateSpecificationDTO, TenderingDTO, UpdateSpecificationDTO } from "./specification.types";

const toDate = (value?: string | Date | null) => {
    if (!value) return null;
    return value instanceof Date ? value : new Date(value);
};

const tenderingData = (tendering?: TenderingDTO) => {
    if (!tendering) return undefined;

    return {
        openingDate: toDate(tendering.openingDate),
        techEvalDate: toDate(tendering.techEvalDate),
        finEvalDate: toDate(tendering.finEvalDate),
        attributionDate: toDate(tendering.attributionDate),
        delayPeriodDays: tendering.delayPeriodDays ?? 10,
        appealDate: toDate(tendering.appealDate),
        appealDepositDate: toDate(tendering.appealDepositDate),
        appealResult: tendering.appealResult ?? null,
        programmingDate: toDate(tendering.programmingDate),
        avsStatus: tendering.avsStatus ?? null,
    };
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

    getAllSpecifications: async () => {
        return prisma.specifications.findMany({
            include,
            orderBy: [
                { year: "desc" },
                { id: "desc" },
            ],
        });
    },

    getSpecificationById: async (id: number) => {
        return prisma.specifications.findUnique({
            where: { id },
            include,
        });
    },

    updateSpecification: async (id: number, data: UpdateSpecificationDTO) => {
        const tendering = tenderingData(data.tendering);

        return prisma.specifications.update({
            where: { id },
            data: {
                type: data.type,
                designationId: data.designationId,
                minAmount: data.minAmount,
                maxAmount: data.maxAmount,
                year: data.year,
                depositDateCM: data.depositDateCM === undefined ? undefined : toDate(data.depositDateCM),
                sessionDate: data.sessionDate === undefined ? undefined : toDate(data.sessionDate),
                visaDate: data.visaDate === undefined ? undefined : toDate(data.visaDate),
                visaNumber: data.visaNumber,
                pubArabicDate: data.pubArabicDate === undefined ? undefined : toDate(data.pubArabicDate),
                pubArabicJournal: data.pubArabicJournal,
                pubFrenchDate: data.pubFrenchDate === undefined ? undefined : toDate(data.pubFrenchDate),
                pubFrenchJournal: data.pubFrenchJournal,
                pubArElecJournal: data.pubArElecJournal,
                pubFrElecJournal: data.pubFrElecJournal,
                lots: data.lotIds ? {
                    set: data.lotIds.map(lotId => ({ id: lotId })),
                } : undefined,
                tendering: tendering ? {
                    upsert: {
                        create: tendering,
                        update: tendering,
                    },
                } : undefined,
            },
            include,
        });
    },

    deleteSpecification: async (id: number) => {
        return prisma.specifications.delete({ where: { id } });
    },
};
