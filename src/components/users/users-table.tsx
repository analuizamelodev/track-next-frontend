"use client";

import { KeyRound, Loader2, Pencil, UserCheck, UserX } from "lucide-react";
import { UserRole } from "@/src/libs/auth";
import { User } from "@/src/types/users-types";
import {
  useResetPassword,
  useUpdateUser,
} from "@/src/queries/users.queries";
import {
  ActiveBadge,
  RoleBadge,
  TempBadge,
} from "@/src/components/ui/badges";
import { toastSuccess } from "@/src/libs/toast";

export function UsersTable({
  users,
  loading,
  onEdit,
}: {
  users: User[];
  loading: boolean;
  onEdit: (user: User) => void;
}) {
  const updateUser = useUpdateUser();
  const resetPassword = useResetPassword();

  function toggleActive(user: User) {
    updateUser.mutate({
      id: user.id,
      data: { active: !user.active },
    });
  }

  function handleResetPassword(id: string) {
    if (!confirm("Enviar nova senha temporária por e-mail?")) return;
    resetPassword.mutate(id, {
      onSuccess: (res) => toastSuccess(res.message),
    });
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-[#E5E7EB] bg-[#F8FAFC]">
            <tr>
              <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wide text-[#6B7280]">
                Usuário
              </th>
              <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wide text-[#6B7280]">
                Perfil
              </th>
              <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wide text-[#6B7280]">
                Status
              </th>
              <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wide text-[#6B7280]">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E5E7EB]">
            {loading ? (
              <tr>
                <td colSpan={4} className="px-5 py-10 text-center">
                  <div className="flex items-center justify-center gap-2 text-[#6B7280]">
                    <Loader2 className="h-4 w-4 animate-spin text-[#16A34A]" />
                    Carregando...
                  </div>
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user.id} className="transition hover:bg-[#F8FAFC]">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#DCFCE7] text-sm font-bold text-[#15803D]">
                        {user.name[0]?.toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold text-[#111827]">
                          {user.name}
                        </p>
                        <p className="text-xs text-[#6B7280]">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex flex-wrap gap-1.5">
                      <RoleBadge role={user.role} />
                      {user.isTempPassword && <TempBadge />}
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <ActiveBadge active={user.active} />
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex flex-wrap items-center gap-2">
                      {user.role !== UserRole.ADMIN && (
                        <button
                          type="button"
                          onClick={() => toggleActive(user)}
                          className={`flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-medium transition ${
                            user.active
                              ? "border-red-200 text-red-600 hover:bg-red-50"
                              : "border-green-200 text-[#15803D] hover:bg-green-50"
                          }`}
                        >
                          {user.active ? (
                            <>
                              <UserX className="h-3.5 w-3.5" /> Desativar
                            </>
                          ) : (
                            <>
                              <UserCheck className="h-3.5 w-3.5" /> Ativar
                            </>
                          )}
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => onEdit(user)}
                        className="flex items-center gap-1.5 rounded-lg border border-[#E5E7EB] px-2.5 py-1.5 text-xs font-medium text-[#6B7280] transition hover:border-[#16A34A] hover:text-[#16A34A]"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                        Editar
                      </button>
                      <button
                        type="button"
                        onClick={() => handleResetPassword(user.id)}
                        className="flex items-center gap-1.5 rounded-lg border border-[#E5E7EB] px-2.5 py-1.5 text-xs font-medium text-[#6B7280] transition hover:border-amber-300 hover:text-amber-700"
                      >
                        <KeyRound className="h-3.5 w-3.5" />
                        Reset senha
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
