import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as customersService from "@/src/services/customers-service";
import {
  CreateCustomerDto,
  UpdateCustomerDto,
} from "@/src/types/customers-types";
import { onMutationError } from "@/src/libs/toast";

export const customersKeys = {
  all: ["customers"] as const,
};

export function useCustomers(enabled = true) {
  return useQuery({
    queryKey: customersKeys.all,
    queryFn: customersService.findAll,
    enabled,
  });
}

export function useCreateCustomer() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateCustomerDto) => customersService.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: customersKeys.all }),
    onError: onMutationError("Erro ao cadastrar cliente."),
  });
}

export function useUpdateCustomer() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCustomerDto }) =>
      customersService.update(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: customersKeys.all }),
    onError: onMutationError("Erro ao atualizar cliente."),
  });
}

export function useDeleteCustomer() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => customersService.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: customersKeys.all }),
    onError: onMutationError("Não foi possível excluir o cliente."),
  });
}
