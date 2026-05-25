
export type Provider = {
    id: string
    name: string
    email: string
    phone: string
    address: string
    company: string
    bankAccountNumber: number
    bankName: string
    NIF: string
    NIS: string
    commercialRegisterNumber: number
    articleNumber: string
    createdAt: string
    updatedAt: string
}


export type CreateProviderDTO = {
    name: string
    email: string
    phone: string
    address: string
    company: string
    bankAccountNumber: number
    bankName: string
    NIF: string
    NIS: string
    commercialRegisterNumber: number
    articleNumber: string
}


export type UpdateProviderDTO = {
    name?: string
    email?: string
    phone?: string
    contactEmail?: string
    contactPhone?: string
    address?: string
    company?: string
    bankAccountNumber?: number
    bankName?: string
    NIF?: string
    NIS?: string
    commercialRegisterNumber?: number
    articleNumber?: string
}

