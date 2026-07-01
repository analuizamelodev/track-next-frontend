import { apiClient } from "../libs/api";
import { CreateCustomerDto, UpdateCustomerDto } from "../types/customers-types";

export function create(data: CreateCustomerDto) {
    return apiClient.post("/customers", data);
}

export function findAll() {
    return apiClient.get("/customers");
}

export function findOne(id: string) {
    return apiClient.get(`/customers/${id}`);
}

export function update(
    id: string,
    data: UpdateCustomerDto,
) {
    return apiClient.patch(`/customers/${id}`, data);
}

export function remove(id: string) {
    return apiClient.delete(`/customers/${id}`);
}