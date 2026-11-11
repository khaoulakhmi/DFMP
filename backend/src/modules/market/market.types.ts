export type CreateMarketDTO = {
    marketNumber: string;
    providerId: string;
    lotId: number;
    date: string | Date;

    depositDate?: string | Date | null;
    visaNumberCM?: string | null;
    visaDateCM?: string | Date | null;
    visaNumberCF?: string | null;
    visaDateCF?: string | Date | null;
};

export type UpdateMarketDTO = Partial<CreateMarketDTO>;

export type UpdateMarketStatusDTO = {
    status: "APPROVED" | "REJECTED";
};