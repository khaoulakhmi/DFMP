import type { Designation } from "./designation.types"
import type { Lot } from "./lot.types"

export const TVA = {
    ZERO: "ZERO",
    NINE: "NINE",
    NINETEEN: "NINETEEN",
} as const

export type TVA = typeof TVA[keyof typeof TVA]

export type Product = {
    id: number
    name: string
    unit: string
    unitPrice: number
    evaluationPrice: number
    tva: TVA
    providerPrice: number
    quantityMin: number
    quantityMax: number
    designationId: number
    lotId: number
    createdAt: string
    updatedAt: string
    designation?: Designation
    lot?: Lot
}

export type CreateProductDTO = {
    name: string
    unit: string
    unitPrice: number
    evaluationPrice: number
    tva: TVA
    providerPrice: number
    quantityMin: number
    quantityMax: number
    designationId: number
    lotId?: number
}

export type UpdateProductDTO = Partial<CreateProductDTO>
