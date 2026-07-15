"use client";

import { useState } from "react";
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Loader2,
  MapPin,
  Navigation,
  RefreshCw,
  XCircle,
} from "lucide-react";
import { Shipment } from "@/src/types/shipments-types";
import {
  canCancel,
  canFinish,
  canRepeatTransit,
  formatCep,
  getForwardStatuses,
  getProblemStatuses,
  getStatusLabel,
  isTerminal,
  REQUIRED_FOR_STATUS,
  ShipmentStatus,
} from "@/src/libs/status";
import {
  useCancelShipment,
  useFinishShipment,
  useUpdateShipmentStatus,
} from "@/src/queries/shipments.queries";
import { Dialog, DialogVariant } from "@/src/components/ui/dialog";
import { toastSuccess } from "@/src/libs/toast";

type ModalState =
  | { type: "status"; status: ShipmentStatus }
  | { type: "cancel" }
  | { type: "finish" }
  | null;

export function StatusActions({ shipment }: { shipment: Shipment }) {
  const updateStatus = useUpdateShipmentStatus();
  const cancelShipment = useCancelShipment();
  const finishShipment = useFinishShipment();

  const [modal, setModal] = useState<ModalState>(null);
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [finishForm, setFinishForm] = useState({
    signedName: "",
    deliveryCep: formatCep(shipment.destinationCep),
    phone: "",
    location: "",
  });

  const submitting =
    updateStatus.isPending || cancelShipment.isPending || finishShipment.isPending;

  const forward = getForwardStatuses(shipment.status);
  const problems = getProblemStatuses(shipment.status);
  const showRepeatTransit = canRepeatTransit(shipment.status);
  const showCancel = canCancel(shipment.status);
  const showFinish = canFinish(shipment.status);
  const terminal = isTerminal(shipment.status);

  function openModal(state: ModalState) {
    setLocation("");
    setDescription("");
    setModal(state);
  }

  function closeModal() {
    setModal(null);
    setLocation("");
    setDescription("");
  }

  function submitStatus(status: ShipmentStatus) {
    updateStatus.mutate(
      {
        id: shipment.id,
        data: {
          status,
          location: location.trim() || undefined,
          description: description.trim() || undefined,
        },
      },
      { onSuccess: () => closeModal() },
    );
  }

  function submitCancel() {
    cancelShipment.mutate(
      {
        id: shipment.id,
        data: description ? { description } : undefined,
      },
      { onSuccess: () => closeModal() },
    );
  }

  function submitFinish() {
    finishShipment.mutate(
      {
        id: shipment.id,
        data: {
          signedName: finishForm.signedName.trim(),
          deliveryCep: finishForm.deliveryCep.trim(),
          phone: finishForm.phone.trim() || undefined,
          location: finishForm.location.trim() || undefined,
        },
      },
      {
        onSuccess: () => {
          toastSuccess("Entrega confirmada com sucesso.");
          closeModal();
        },
      },
    );
  }

  if (terminal) {
    return (
      <p className="mt-3 text-xs text-[#6B7280]">
        Esta encomenda está encerrada.
      </p>
    );
  }

  const hasActions =
    showRepeatTransit ||
    forward.length > 0 ||
    problems.length > 0 ||
    showCancel ||
    showFinish;

  if (!hasActions) return null;

  function renderModal() {
    if (!modal) return null;

    if (modal.type === "status") {
      const status = modal.status;
      const isRepeat =
        status === ShipmentStatus.IN_TRANSIT &&
        shipment.status === ShipmentStatus.IN_TRANSIT;
      const needsLocation = (REQUIRED_FOR_STATUS[status] ?? []).includes(
        "location",
      );
      const needsDescription = (REQUIRED_FOR_STATUS[status] ?? []).includes(
        "description",
      );
      const isProblemStatus = problems.includes(status);
      const canSubmit =
        (!needsLocation || location.trim()) &&
        (!needsDescription || description.trim());

      const variant: DialogVariant = isProblemStatus ? "warning" : "default";
      const icon = isProblemStatus ? (
        <AlertTriangle className="h-5 w-5" />
      ) : isRepeat ? (
        <RefreshCw className="h-5 w-5" />
      ) : (
        <ArrowRight className="h-5 w-5" />
      );

      const title = isRepeat
        ? "Registrar movimentação em trânsito"
        : `Avançar para: ${getStatusLabel(status)}`;

      const subtitle = isRepeat
        ? "Um novo evento será adicionado ao histórico sem alterar o status atual."
        : isProblemStatus
          ? "Registre uma ocorrência e informe o motivo detalhado."
          : "Confirme a transição de status e informe a localização atual.";

      return (
        <Dialog
          title={title}
          subtitle={subtitle}
          variant={variant}
          icon={icon}
          onClose={closeModal}
        >
          <div className="space-y-3">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-[#111827]">
                Localização atual{needsLocation ? " *" : " (opcional)"}
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6B7280]" />
                <input
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Ex: Centro de Distribuição São Paulo"
                  className="w-full rounded-xl border border-[#E5E7EB] py-2.5 pl-10 pr-3 text-sm outline-none transition focus:border-[#16A34A] focus:ring-1 focus:ring-[#DCFCE7]"
                  autoFocus
                />
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-[#111827]">
                Observação{needsDescription ? " *" : " (opcional)"}
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={
                  isProblemStatus
                    ? "Descreva o ocorrido com detalhes..."
                    : "Ex: Saiu do galpão às 08h"
                }
                rows={3}
                className="w-full resize-none rounded-xl border border-[#E5E7EB] px-3 py-2.5 text-sm outline-none transition focus:border-[#16A34A] focus:ring-1 focus:ring-[#DCFCE7]"
              />
            </div>
            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={() => submitStatus(status)}
                disabled={!canSubmit || submitting}
                className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-2.5 font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-50 ${
                  isProblemStatus
                    ? "bg-amber-600 hover:bg-amber-700"
                    : "bg-[#16A34A] hover:bg-[#15803D]"
                }`}
              >
                {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : icon}
                {submitting
                  ? "Salvando..."
                  : isRepeat
                    ? "Registrar"
                    : "Confirmar"}
              </button>
              <button
                type="button"
                onClick={closeModal}
                className="rounded-xl border border-[#E5E7EB] px-4 py-2.5 font-semibold text-[#6B7280] transition hover:bg-[#F8FAFC]"
              >
                Cancelar
              </button>
            </div>
          </div>
        </Dialog>
      );
    }

    if (modal.type === "cancel") {
      return (
        <Dialog
          title="Cancelar entrega"
          subtitle="Esta ação não pode ser desfeita."
          variant="danger"
          icon={<XCircle className="h-5 w-5" />}
          onClose={closeModal}
        >
          <div className="space-y-3">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-[#111827]">
                Motivo do cancelamento (opcional)
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Ex: Cliente solicitou cancelamento"
                rows={3}
                className="w-full resize-none rounded-xl border border-[#E5E7EB] px-3 py-2.5 text-sm outline-none transition focus:border-red-400 focus:ring-1 focus:ring-red-100"
                autoFocus
              />
            </div>
            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={submitCancel}
                disabled={submitting}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-red-600 py-2.5 font-semibold text-white transition hover:bg-red-700 disabled:opacity-50"
              >
                {submitting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <XCircle className="h-4 w-4" />
                )}
                {submitting ? "Cancelando..." : "Confirmar cancelamento"}
              </button>
              <button
                type="button"
                onClick={closeModal}
                className="rounded-xl border border-[#E5E7EB] px-4 py-2.5 font-semibold text-[#6B7280] transition hover:bg-[#F8FAFC]"
              >
                Voltar
              </button>
            </div>
          </div>
        </Dialog>
      );
    }

    if (modal.type === "finish") {
      const finishMissing =
        !finishForm.signedName.trim() || !finishForm.deliveryCep.trim();
      return (
        <Dialog
          title="Confirmar entrega"
          subtitle={`CEP de destino registrado: ${formatCep(shipment.destinationCep)}`}
          variant="success"
          icon={<CheckCircle2 className="h-5 w-5" />}
          onClose={closeModal}
        >
          <div className="space-y-3">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-[#111827]">
                Nome de quem assinou *
              </label>
              <input
                value={finishForm.signedName}
                onChange={(e) =>
                  setFinishForm({ ...finishForm, signedName: e.target.value })
                }
                placeholder="Nome completo do receptor"
                className="w-full rounded-xl border border-[#E5E7EB] px-3 py-2.5 text-sm outline-none transition focus:border-[#16A34A] focus:ring-1 focus:ring-[#DCFCE7]"
                autoFocus
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-[#111827]">
                CEP da entrega *
              </label>
              <input
                value={finishForm.deliveryCep}
                onChange={(e) =>
                  setFinishForm({ ...finishForm, deliveryCep: e.target.value })
                }
                placeholder="00000-000"
                className="w-full rounded-xl border border-[#E5E7EB] px-3 py-2.5 text-sm font-mono outline-none transition focus:border-[#16A34A] focus:ring-1 focus:ring-[#DCFCE7]"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-[#111827]">
                  Telefone (opcional)
                </label>
                <input
                  value={finishForm.phone}
                  onChange={(e) =>
                    setFinishForm({ ...finishForm, phone: e.target.value })
                  }
                  placeholder="(00) 00000-0000"
                  className="w-full rounded-xl border border-[#E5E7EB] px-3 py-2.5 text-sm outline-none transition focus:border-[#16A34A] focus:ring-1 focus:ring-[#DCFCE7]"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-[#111827]">
                  Local (opcional)
                </label>
                <input
                  value={finishForm.location}
                  onChange={(e) =>
                    setFinishForm({ ...finishForm, location: e.target.value })
                  }
                  placeholder="Ex: Portaria"
                  className="w-full rounded-xl border border-[#E5E7EB] px-3 py-2.5 text-sm outline-none transition focus:border-[#16A34A] focus:ring-1 focus:ring-[#DCFCE7]"
                />
              </div>
            </div>
            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={submitFinish}
                disabled={finishMissing || submitting}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#16A34A] py-2.5 font-semibold text-white transition hover:bg-[#15803D] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {submitting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <CheckCircle2 className="h-4 w-4" />
                )}
                {submitting ? "Confirmando..." : "Confirmar entrega"}
              </button>
              <button
                type="button"
                onClick={closeModal}
                className="rounded-xl border border-[#E5E7EB] px-4 py-2.5 font-semibold text-[#6B7280] transition hover:bg-[#F8FAFC]"
              >
                Cancelar
              </button>
            </div>
          </div>
        </Dialog>
      );
    }
  }

  return (
    <>
      {renderModal()}
      <div className="flex flex-wrap gap-2">
        {showRepeatTransit && (
          <button
            type="button"
            onClick={() =>
              openModal({ type: "status", status: ShipmentStatus.IN_TRANSIT })
            }
            className="flex items-center gap-1.5 rounded-lg border border-blue-200 bg-blue-50 px-3 py-1.5 text-sm font-medium text-blue-700 transition hover:bg-blue-100"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Registrar movimentação
          </button>
        )}
        {forward.map((status) => (
          <button
            type="button"
            key={status}
            onClick={() => openModal({ type: "status", status })}
            className="flex items-center gap-1.5 rounded-lg border border-[#16A34A] bg-[#F0FDF4] px-3 py-1.5 text-sm font-medium text-[#15803D] transition hover:bg-[#DCFCE7]"
          >
            <ArrowRight className="h-3.5 w-3.5" />
            {getStatusLabel(status)}
          </button>
        ))}
        {problems.map((status) => (
          <button
            type="button"
            key={status}
            onClick={() => openModal({ type: "status", status })}
            className="flex items-center gap-1.5 rounded-lg border border-amber-300 bg-amber-50 px-3 py-1.5 text-sm font-medium text-amber-800 transition hover:bg-amber-100"
          >
            <AlertTriangle className="h-3.5 w-3.5" />
            {getStatusLabel(status)}
          </button>
        ))}
        {showFinish && (
          <button
            type="button"
            onClick={() => openModal({ type: "finish" })}
            className="flex items-center gap-1.5 rounded-lg border border-green-300 bg-green-50 px-3 py-1.5 text-sm font-medium text-[#15803D] transition hover:bg-[#DCFCE7]"
          >
            <Navigation className="h-3.5 w-3.5" />
            Confirmar entrega
          </button>
        )}
        {showCancel && (
          <button
            type="button"
            onClick={() => openModal({ type: "cancel" })}
            className="flex items-center gap-1.5 rounded-lg border border-red-200 px-3 py-1.5 text-sm font-medium text-red-600 transition hover:bg-red-50"
          >
            <XCircle className="h-3.5 w-3.5" />
            Cancelar entrega
          </button>
        )}
      </div>
    </>
  );
}
