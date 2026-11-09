import type { TenderingFieldsDTO } from "./tendering.types";

const toDate = (value: string | Date | null): Date | null => {
    if (value === null) return null;

    return value instanceof Date ? value : new Date(value);
};

export const toTenderingData = (data: TenderingFieldsDTO) => ({
    ...(data.openingDate !== undefined && {
        openingDate: toDate(data.openingDate),
    }),

    ...(data.techEvalDate !== undefined && {
        techEvalDate: toDate(data.techEvalDate),
    }),

    ...(data.finEvalDate !== undefined && {
        finEvalDate: toDate(data.finEvalDate),
    }),

    ...(data.attributionDate !== undefined && {
        attributionDate: toDate(data.attributionDate),
    }),

    ...(data.delayPeriodDays !== undefined && {
        delayPeriodDays: data.delayPeriodDays,
    }),

    ...(data.appealDate !== undefined && {
        appealDate: toDate(data.appealDate),
    }),

    ...(data.appealDepositDate !== undefined && {
        appealDepositDate: toDate(data.appealDepositDate),
    }),

    ...(data.appealResult !== undefined && {
        appealResult: data.appealResult,
    }),

    ...(data.programmingDate !== undefined && {
        programmingDate: toDate(data.programmingDate),
    }),

    ...(data.avsStatus !== undefined && {
        avsStatus: data.avsStatus,
    }),
});