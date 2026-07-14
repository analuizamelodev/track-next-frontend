import { Customer } from "./customers-types";

export interface AddressDto {
  street: string;
  number: string;
  neighborhood: string;
  city: string;
  state: string;
  cep: string;
}

export interface ShipmentItemDto {
  name: string;
  quantity: number;
  description?: string;
}

export interface CreateShipmentDto {
  customerId: string;
  senderName: string;
  origin: AddressDto;
  recipientName: string;
  destination: AddressDto;
  weight: number;
  serviceType: string;
  notes?: string;
  items: ShipmentItemDto[];
}

export interface UpdateShipmentStatusDto {
  status: number;
  location?: string;
  description?: string;
}

export interface FinishShipmentDto {
  signedName: string;
  deliveryCep: string;
  phone?: string;
  location?: string;
}

export interface ShipmentItem {
  id: string;
  shipmentId: string;
  name: string;
  quantity: number;
  description?: string | null;
}

export interface TrackingEvent {
  id?: string;
  shipmentId?: string;
  status: number;
  description?: string | null;
  location?: string | null;
  changedByName?: string | null;
  createdAt: string;
}

export interface Recipient {
  id: string;
  shipmentId: string;
  signedName: string;
  deliveryCep: string;
  phone?: string | null;
}

export interface Shipment {
  id: string;
  trackingCode: string;
  status: number;
  serviceType: string;
  weight: number;
  estimatedDelivery?: string | null;
  senderName: string;
  originStreet: string;
  originNumber: string;
  originNeighborhood: string;
  originCity: string;
  originState: string;
  originCep: string;
  recipientName: string;
  destinationStreet: string;
  destinationNumber: string;
  destinationNeighborhood: string;
  destinationCity: string;
  destinationState: string;
  destinationCep: string;
  userId: string;
  customerId: string;
  createdAt: string;
  updatedAt?: string;
  customer?: Customer;
  items?: ShipmentItem[];
  recipient?: Recipient | null;
  trackingEvents?: TrackingEvent[];
  user?: { id: string; name: string; email: string };
}

export interface PublicTrackingTimelineItem {
  status: number;
  statusLabel: string;
  description: string | null;
  location: string | null;
  changedByName: string | null;
  date: string;
}

export interface PublicTracking {
  trackingCode: string;
  status: number;
  statusLabel: string;
  serviceType: string;
  weight: number;
  estimatedDelivery: string | null;
  senderName: string;
  origin: string;
  recipientName: string;
  destination: string;
  createdAt: string;
  deliveredAt: string | null;
  signedByName: string | null;
  timeline: PublicTrackingTimelineItem[];
}
