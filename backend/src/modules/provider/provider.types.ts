export type createProviderDTO = {
    name: string;
    company: string;
    email: string;
    phone: string;
    bankAccountNumber: number;
    bankName: string;
    NIF: string;
    NIS: string;
    address: string;
    commercialRegisterNumber: number;
    articleNumber: string;
}

export type updateProviderDTO = {
    name?: string;
    company?: string;
    email?: string;
    phone?: string;
    bankAccountNumber?: number;
    bankName?: string;
    NIF?: string;
    NIS?: string;
    address?: string;
    commercialRegisterNumber?: number;
    articleNumber?: string;
}