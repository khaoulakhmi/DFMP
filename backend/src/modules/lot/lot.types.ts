export type CreateLotDTO = {
    name: string;
    designationId: number;
    productIds?: number[];
    specificationsId?: number | null;
}

export type UpdateLotDTO = {
    name?: string;
    designationId?: number;
    productIds?: number[];
    specificationsId?: number | null;
}
