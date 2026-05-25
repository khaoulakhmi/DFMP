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
}

export type CreateDesignationDTO = {
    name: string
    description: string
}

export type UpdateDesignationDTO = Partial<CreateDesignationDTO>
