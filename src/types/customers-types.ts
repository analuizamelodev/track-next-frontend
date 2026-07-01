export interface CreateCustomerDto {
    name: string;
    document?: string;
    phone?: string;
}

export interface UpdateCustomerDto {
    name?: string;
    document?: string;
    phone?: string;
}