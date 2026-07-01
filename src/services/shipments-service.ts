import { apiClient } from "../libs/api";
import { CreateShipmentDto, FinishShipmentDto, UpdateShipmentStatusDto } from "../types/shipments-types";

export function create(data: CreateShipmentDto) {
    return apiClient.post("/shipments", data);
}

export function update(
    id: string,
    data: UpdateShipmentStatusDto,
) {
    return apiClient.patch(`/shipments/${id}/status`, data);
}

export function finish(
    id: string,
    data: FinishShipmentDto,
) {
    return apiClient.patch(`/shipments/${id}/finish`, data);
}

export function findByTrackingCode(
    trackingCode: string,
) {
    return apiClient.get(`/shipments/tracking/${trackingCode}`);
}