export interface Customer {
  id: string;
  name: string;
  email?: string | null;
  document?: string | null;
  phone?: string | null;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateCustomerDto {
  name: string;
  email?: string;
  document?: string;
  phone?: string;
}

export interface UpdateCustomerDto {
  name?: string;
  email?: string;
  document?: string;
  phone?: string;
}
