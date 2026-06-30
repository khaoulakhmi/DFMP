import type { CreateSpecificationDTO, Specification, UpdateSpecificationDTO } from "@/shared/types/specification.types"
import { optionalDate, optionalString } from "../specification.utils"
import type { SpecificationForm } from "./types"

export const required = (label: string) => `${label} is required`

export const toInputDate = (value?: string | null) => {
    if (!value) return ""
    const date = new Date(value)
    if (Number.isNaN(date.getTime())) return ""
    return date.toISOString().slice(0, 10)
}

export const toFormValues = (specification: Specification): SpecificationForm => ({
    type: specification.type,
    designationId: String(specification.designationId),
    minAmount: specification.minAmount,
    maxAmount: specification.maxAmount,
    year: specification.year,
    depositDateCM: toInputDate(specification.depositDateCM),
    sessionDate: toInputDate(specification.sessionDate),
    visaDate: toInputDate(specification.visaDate),
    visaNumber: specification.visaNumber ?? "",
    pubArabicDate: toInputDate(specification.pubArabicDate),
    pubArabicJournal: specification.pubArabicJournal ?? "",
    pubFrenchDate: toInputDate(specification.pubFrenchDate),
    pubFrenchJournal: specification.pubFrenchJournal ?? "",
    pubArElecJournal: specification.pubArElecJournal ?? "",
    pubFrElecJournal: specification.pubFrElecJournal ?? "",
    lotIds: specification.lots?.map(lot => String(lot.id)) ?? [],
    openingDate: toInputDate(specification.tendering?.openingDate),
    techEvalDate: toInputDate(specification.tendering?.techEvalDate),
    finEvalDate: toInputDate(specification.tendering?.finEvalDate),
    attributionDate: toInputDate(specification.tendering?.attributionDate),
    delayPeriodDays: specification.tendering?.delayPeriodDays ?? 10,
    appealDate: toInputDate(specification.tendering?.appealDate),
    appealDepositDate: toInputDate(specification.tendering?.appealDepositDate),
    appealResult: specification.tendering?.appealResult ?? "",
    programmingDate: toInputDate(specification.tendering?.programmingDate),
    avsStatus: specification.tendering?.avsStatus ?? "",
})

export const toSpecificationPayload = (data: SpecificationForm): CreateSpecificationDTO => ({
    type: data.type.trim(),
    designationId: Number(data.designationId),
    minAmount: Number(data.minAmount),
    maxAmount: Number(data.maxAmount),
    year: Number(data.year),
    depositDateCM: optionalDate(data.depositDateCM),
    sessionDate: optionalDate(data.sessionDate),
    visaDate: optionalDate(data.visaDate),
    visaNumber: optionalString(data.visaNumber),
    pubArabicDate: optionalDate(data.pubArabicDate),
    pubArabicJournal: optionalString(data.pubArabicJournal),
    pubFrenchDate: optionalDate(data.pubFrenchDate),
    pubFrenchJournal: optionalString(data.pubFrenchJournal),
    pubArElecJournal: optionalString(data.pubArElecJournal),
    pubFrElecJournal: optionalString(data.pubFrElecJournal),
    lotIds: data.lotIds?.map(Number) ?? [],
    tendering: {
        openingDate: optionalDate(data.openingDate),
        techEvalDate: optionalDate(data.techEvalDate),
        finEvalDate: optionalDate(data.finEvalDate),
        attributionDate: optionalDate(data.attributionDate),
        delayPeriodDays: Number(data.delayPeriodDays || 10),
        appealDate: optionalDate(data.appealDate),
        appealDepositDate: optionalDate(data.appealDepositDate),
        appealResult: optionalString(data.appealResult),
        programmingDate: optionalDate(data.programmingDate),
        avsStatus: data.avsStatus || null,
    },
})

export const toUpdateSpecificationPayload = (data: SpecificationForm): UpdateSpecificationDTO => toSpecificationPayload(data)
