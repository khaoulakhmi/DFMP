export type CreateSpecificationDTO = {
    name: string,
    description: string,
    providerId: string,
    marketIds: string[],
}


export type UpdateSpecificationDTO = {
    name?: string,
    description?: string,
    providerId?: string,
    marketIds?: string[],
}

