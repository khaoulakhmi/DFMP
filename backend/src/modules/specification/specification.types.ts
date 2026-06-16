import { AVSStatus } from "../../generated/prisma/enums";

export type TenderingDTO = {
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
}

export type CreateSpecificationDTO = {
    type: string;
    designationId: number;
    minAmount: number;
    maxAmount: number;
    year: number;
    depositDateCM?: string | Date | null;
    sessionDate?: string | Date | null;
    visaDate?: string | Date | null;
    visaNumber?: string | null;
    pubArabicDate?: string | Date | null;
    pubArabicJournal?: string | null;
    pubFrenchDate?: string | Date | null;
    pubFrenchJournal?: string | null;
    pubArElecJournal?: string | null;
    pubFrElecJournal?: string | null;
    lotIds?: number[];
    tendering?: TenderingDTO;
}

export type UpdateSpecificationDTO = Partial<CreateSpecificationDTO>
