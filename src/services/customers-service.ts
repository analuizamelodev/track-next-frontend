import { apiClient } from "../libs/api";
import {
  CreateCustomerDto,
  Customer,
  UpdateCustomerDto,
} from "../types/customers-types";

export async function create(data: CreateCustomerDto): Promise<Customer> {
  const response = await apiClient.post<Customer>("/customers", data);
  return response.data;
}

export async function findAll(): Promise<Customer[]> {
  const response = await apiClient.get<Customer[]>("/customers");
  return response.data;
}

export async function findOne(id: string): Promise<Customer> {
  const response = await apiClient.get<Customer>(`/customers/${id}`);
  return response.data;
}

export async function update(
  id: string,
  data: UpdateCustomerDto,
): Promise<Customer> {
  const response = await apiClient.patch<Customer>(`/customers/${id}`, data);
  return response.data;
}

export async function remove(id: string): Promise<void> {
  await apiClient.delete(`/customers/${id}`);
}
