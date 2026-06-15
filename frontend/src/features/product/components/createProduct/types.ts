import { TVA } from "@/shared/types/product.types"

export type ProductForm = {
    name: string
    unit: string
    unitPrice: number
    providerPrice?: number
    evaluationPrice?: number
    quantityMin: number
    quantityMax: number
    tva: TVA
    designationId: string
    lotId?: string
}
