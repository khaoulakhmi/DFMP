import type { AVSStatus } from "../../generated/prisma/enums";

export type TenderingFieldsDTO = {
    openingDate?: string | Date | null;
    techEvalDate?: string | Date | null;
    finEvalDate?: string | Date | null;
    attributionDate?: string | Date | null;

    delayPeriodDays?: number;

    appealDate?: string | Date | null;
    appealDepositDate?: string | Date | null;
    appealResult?: string | null;
    programmingDate?: string | Date | null;

    avsStatus?: AVSStatus | null;
};

export type CreateTenderingDTO = TenderingFieldsDTO & {
    specificationsId: number;
};

export type UpdateTenderingDTO = TenderingFieldsDTO;