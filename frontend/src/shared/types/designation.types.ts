import type { Lot } from "./lot.types"
import type { Product } from "./product.types"

export type Designation = {
    id: number
    name: string
    description: string | null
    products?: Product[]
    lots?: Lot[]
    specifications?: SpecificationSummary[]
}

export type SpecificationSummary = {
    id: number
    type: string
    designationId: number
    minAmount: number
    maxAmount: number
    year: number
    depositDateCM?: string | null
    sessionDate?: string | null
    visaDate?: string | null
    visaNumber?: string | null
    pubArabicDate?: string | null
    pubArabicJournal?: string | null
    pubFrenchDate?: string | null
    pubFrenchJournal?: string | null
    pubArElecJournal?: string | null
    pubFrElecJournal?: string | null
    tendering?: {
        openingDate: string | null
        techEvalDate: string | null
        finEvalDate: string | null
        attributionDate: string | null
        delayPeriodDays: number
        appealDate: string | null
        appealDepositDate: string | null
        appealResult: string | null
        programmingDate: string | null
        avsStatus: string | null
    } | null
}

export type CreateDesignationDTO = {
    name: string
    description: string
}

export type UpdateDesignationDTO = Partial<CreateDesignationDTO>
