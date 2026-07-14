import { apiClient } from "../libs/api";
import {
  CreateShipmentDto,
  FinishShipmentDto,
  PublicTracking,
  Shipment,
  UpdateShipmentStatusDto,
} from "../types/shipments-types";

export async function create(data: CreateShipmentDto): Promise<Shipment> {
  const response = await apiClient.post<Shipment>("/shipments", data);
  return response.data;
}

export async function findAll(params?: {
  status?: number;
  customerId?: string;
}): Promise<Shipment[]> {
  const response = await apiClient.get<Shipment[]>("/shipments", { params });
  return response.data;
}

export async function findOne(id: string): Promise<Shipment> {
  const response = await apiClient.get<Shipment>(`/shipments/${id}`);
  return response.data;
}

export async function updateStatus(
  id: string,
  data: UpdateShipmentStatusDto,
): Promise<Shipment> {
  const response = await apiClient.patch<Shipment>(
    `/shipments/${id}/status`,
    data,
  );
  return response.data;
}

export async function finish(
  id: string,
  data: FinishShipmentDto,
): Promise<Shipment> {
  const response = await apiClient.patch<Shipment>(
    `/shipments/${id}/finish`,
    data,
  );
  return response.data;
}

export async function cancel(id: string): Promise<Shipment> {
  const response = await apiClient.patch<Shipment>(`/shipments/${id}/cancel`);
  return response.data;
}

export async function findByTrackingCode(
  trackingCode: string,
): Promise<PublicTracking> {
  const response = await apiClient.get<PublicTracking>(
    `/shipments/tracking/${trackingCode}`,
  );
  return response.data;
}
