import type { UpdateMarketDTO } from "./market.types";

const toDate = (value: string | Date): Date =>
    value instanceof Date ? value : new Date(value);

const toNullableDate = (value: string | Date | null): Date | null =>
    value === null ? null : toDate(value);

export const toMarketUpdateData = (data: UpdateMarketDTO) => ({
    ...(data.marketNumber !== undefined && {
        marketNumber: data.marketNumber,
    }),

    ...(data.providerId !== undefined && {
        providerId: data.providerId,
    }),

    ...(data.lotId !== undefined && {
        lotId: data.lotId,
    }),

    ...(data.date !== undefined && {
        date: toDate(data.date),
    }),

    ...(data.depositDate !== undefined && {
        depositDate: toNullableDate(data.depositDate),
    }),

    ...(data.visaNumberCM !== undefined && {
        visaNumberCM: data.visaNumberCM,
    }),

    ...(data.visaDateCM !== undefined && {
        visaDateCM: toNullableDate(data.visaDateCM),
    }),

    ...(data.visaNumberCF !== undefined && {
        visaNumberCF: data.visaNumberCF,
    }),

    ...(data.visaDateCF !== undefined && {
        visaDateCF: toNullableDate(data.visaDateCF),
    }),
});