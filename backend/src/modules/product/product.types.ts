import { Designation } from "../../generated/prisma/client";
import { TVA } from "../../generated/prisma/enums";



export type createProductDTO = {
    name: string;
    unit: string;
    unitPrice: number;
    tva: TVA;
    designation: Designation;
}


export type updateProductDTO = {
    name?: string;
    unit?: string;
    unitPrice?: number;
    tva?: TVA;
    quantityMax?: number;
    quantityMin?: number;
    evaluationPrice?: number;
    providerPrice?: number;
    designation?: Designation;
}