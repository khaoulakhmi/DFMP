import type { Designation, SpecificationSummary } from "./designation.types"
import type { Product } from "./product.types"

export type Lot = {
    id: number
    name: string
    designationId: number
    specificationsId: number | null
    createdAt: string
    updatedAt: string
    designation?: Designation
    products?: Product[]
    specifications?: SpecificationSummary | null
}

export type CreateLotDTO = {
    name: string
    designationId: number
    productIds?: number[]
    specificationsId?: number | null
}

export type UpdateLotDTO = Partial<CreateLotDTO>
