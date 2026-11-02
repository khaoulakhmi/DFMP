export type createProviderDTO = {
    name: string;
    company: string;
    email: string;
    phone: string;
    bankAccountNumber: string;
    bankName: string;
    NIF: string;
    NIS: string;
    address: string;
    commercialRegisterNumber: string;
    articleNumber: string;
}

export type updateProviderDTO = {
    name?: string;
    company?: string;
    email?: string;
    phone?: string;
    bankAccountNumber?: string;
    bankName?: string;
    NIF?: string;
    NIS?: string;
    address?: string;
    commercialRegisterNumber?: string;
    articleNumber?: string;
}