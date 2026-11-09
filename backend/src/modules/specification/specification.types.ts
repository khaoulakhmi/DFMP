import type { TenderingFieldsDTO } from "../tendering/tendering.types";

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
    tendering?: TenderingFieldsDTO;
}

export type UpdateSpecificationDTO = Partial<CreateSpecificationDTO>
