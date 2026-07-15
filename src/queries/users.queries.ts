import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as usersService from "@/src/services/users-service";
import {
  ChangePasswordDto,
  CreateUserDto,
  UpdateUserDto,
} from "@/src/types/users-types";
import { onMutationError } from "@/src/libs/toast";

export const usersKeys = {
  all: ["users"] as const,
};

export function useUsers(enabled = true) {
  return useQuery({
    queryKey: usersKeys.all,
    queryFn: usersService.findAll,
    enabled,
  });
}

export function useCreateUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateUserDto) => usersService.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: usersKeys.all }),
    onError: onMutationError("Erro ao criar usuário."),
  });
}

export function useUpdateUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateUserDto }) =>
      usersService.update(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: usersKeys.all }),
    onError: onMutationError("Não foi possível atualizar o usuário."),
  });
}

export function useResetPassword() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => usersService.resetPassword(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: usersKeys.all }),
    onError: onMutationError("Não foi possível redefinir a senha."),
  });
}

export function useChangePassword() {
  return useMutation({
    mutationFn: (data: ChangePasswordDto) => usersService.changePassword(data),
    onError: onMutationError("Erro ao alterar senha."),
  });
}
