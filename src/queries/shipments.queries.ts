import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as shipmentsService from "@/src/services/shipments-service";
import {
  CreateShipmentDto,
  FinishShipmentDto,
  UpdateShipmentStatusDto,
} from "@/src/types/shipments-types";
import { onMutationError } from "@/src/libs/toast";

export const shipmentsKeys = {
  all: ["shipments"] as const,
};

export function useShipments(enabled = true) {
  return useQuery({
    queryKey: shipmentsKeys.all,
    queryFn: () => shipmentsService.findAll(),
    enabled,
  });
}

export function useCreateShipment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateShipmentDto) => shipmentsService.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: shipmentsKeys.all }),
    onError: onMutationError("Erro ao criar entrega."),
  });
}

export function useUpdateShipmentStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateShipmentStatusDto }) =>
      shipmentsService.updateStatus(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: shipmentsKeys.all }),
    onError: onMutationError("Erro ao atualizar status."),
  });
}

export function useCancelShipment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data?: { description?: string; location?: string };
    }) => shipmentsService.cancel(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: shipmentsKeys.all }),
    onError: onMutationError("Erro ao cancelar."),
  });
}

export function useFinishShipment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: FinishShipmentDto }) =>
      shipmentsService.finish(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: shipmentsKeys.all }),
    onError: onMutationError("Erro ao finalizar entrega."),
  });
}
