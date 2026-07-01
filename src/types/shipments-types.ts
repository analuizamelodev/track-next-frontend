export interface ShipmentItemDto {
    name: string;
    quantity: number;
    description?: string;
}

export interface CreateShipmentDto {
    customerId: string;
    origin: string;
    destination: string;
    notes?: string;
    items: ShipmentItemDto[];
}

export interface UpdateShipmentStatusDto {
    status: number;
}

export interface FinishShipmentDto {
    name: string;
    address: string;
    phone?: string;
}