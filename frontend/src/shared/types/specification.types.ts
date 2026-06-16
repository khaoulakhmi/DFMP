import type { Designation } from "./designation.types"
import type { Lot } from "./lot.types"

export const AVSStatus = {
    FONDU: "FONDU",
    NON_FONDU: "NON_FONDU",
} as const

export type AVSStatus = typeof AVSStatus[keyof typeof AVSStatus]

export type Tendering = {
    id: number
    specificationsId: number
    openingDate: string | null
    techEvalDate: string | null
    finEvalDate: string | null
    attributionDate: string | null
    delayPeriodDays: number
    appealDate: string | null
    appealDepositDate: string | null
    appealResult: string | null
    programmingDate: string | null
    avsStatus: AVSStatus | null
}

export type Specification = {
    id: number
    type: string
    designationId: number
    minAmount: number
    maxAmount: number
    year: number
    depositDateCM: string | null
    sessionDate: string | null
    visaDate: string | null
    visaNumber: string | null
    pubArabicDate: string | null
    pubArabicJournal: string | null
    pubFrenchDate: string | null
    pubFrenchJournal: string | null
    pubArElecJournal: string | null
    pubFrElecJournal: string | null
    designation?: Designation
    lots?: Lot[]
    tendering?: Tendering | null
}

export type TenderingPayload = {
    openingDate?: string | null
    techEvalDate?: string | null
    finEvalDate?: string | null
    attributionDate?: string | null
    delayPeriodDays?: number
    appealDate?: string | null
    appealDepositDate?: string | null
    appealResult?: string | null
    programmingDate?: string | null
    avsStatus?: AVSStatus | null
}

export type CreateSpecificationDTO = {
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
    lotIds?: number[]
    tendering?: TenderingPayload
}

export type UpdateSpecificationDTO = Partial<CreateSpecificationDTO>
