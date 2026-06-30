import type { AVSStatus } from "@/shared/types/specification.types"

export type SpecificationForm = {
    type: string
    designationId: string
    minAmount: number
    maxAmount: number
    year: number
    depositDateCM: string
    sessionDate: string
    visaDate: string
    visaNumber: string
    pubArabicDate: string
    pubArabicJournal: string
    pubFrenchDate: string
    pubFrenchJournal: string
    pubArElecJournal: string
    pubFrElecJournal: string
    lotIds: string[]
    openingDate: string
    techEvalDate: string
    finEvalDate: string
    attributionDate: string
    delayPeriodDays: number
    appealDate: string
    appealDepositDate: string
    appealResult: string
    programmingDate: string
    avsStatus: "" | AVSStatus
}

export type SpecificationFormField = keyof SpecificationForm
