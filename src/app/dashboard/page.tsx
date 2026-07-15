"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/src/context/auth-context";
import * as shipmentsService from "@/src/services/shipments-service";
import * as customersService from "@/src/services/customers-service";
import { Shipment } from "@/src/types/shipments-types";
import { Customer } from "@/src/types/customers-types";
import { ShipmentStatus, getStatusLabel } from "@/src/libs/status";
import {
  Truck,
  Users,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Package,
  Clock,
  TrendingUp,
} from "lucide-react";

interface MetricCard {
  label: string;
  value: number | string;
  icon: React.ReactNode;
  color: string;
  bg: string;
  href: string;
}

function computeMetrics(shipments: Shipment[], customers: Customer[]) {
  const total = shipments.length;
  const delivered = shipments.filter((s) => s.status === ShipmentStatus.DELIVERED).length;
  const inTransit = shipments.filter(
    (s) =>
      s.status === ShipmentStatus.IN_TRANSIT ||
      s.status === ShipmentStatus.OUT_FOR_DELIVERY ||
      s.status === ShipmentStatus.IN_PREPARATION,
  ).length;
  const problems = shipments.filter(
    (s) =>
      s.status === ShipmentStatus.EXTRAVIADO ||
      s.status === ShipmentStatus.DANIFICADO ||
      s.status === ShipmentStatus.ENDERECO_INVALIDO ||
      s.status === ShipmentStatus.DESTINATARIO_AUSENTE,
  ).length;

  return { total, delivered, inTransit, problems, customers: customers.length };
}

function RecentShipments({ shipments }: { shipments: Shipment[] }) {
  const recent = [...shipments]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  const STATUS_BADGE: Record<number, string> = {
    [ShipmentStatus.ORDER_CREATED]: "bg-slate-100 text-slate-600",
    [ShipmentStatus.IN_PREPARATION]: "bg-blue-50 text-blue-700",
    [ShipmentStatus.IN_TRANSIT]: "bg-orange-50 text-orange-700",
    [ShipmentStatus.OUT_FOR_DELIVERY]: "bg-purple-50 text-purple-700",
    [ShipmentStatus.DELIVERED]: "bg-green-50 text-[#15803D]",
    [ShipmentStatus.CANCELLED]: "bg-red-50 text-red-700",
    [ShipmentStatus.EXTRAVIADO]: "bg-red-100 text-red-800",
    [ShipmentStatus.DANIFICADO]: "bg-yellow-50 text-yellow-700",
    [ShipmentStatus.ENDERECO_INVALIDO]: "bg-gray-100 text-gray-700",
    [ShipmentStatus.DESTINATARIO_AUSENTE]: "bg-amber-50 text-amber-700",
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-[#E5E7EB] px-6 py-4">
        <h2 className="font-semibold text-[#111827]">Entregas recentes</h2>
        <Link
          href="/dashboard/shipments"
          className="flex items-center gap-1 text-sm font-medium text-[#16A34A] hover:text-[#15803D]"
        >
          Ver todas <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
      <div className="divide-y divide-[#E5E7EB]">
        {recent.length === 0 ? (
          <p className="px-6 py-8 text-center text-sm text-[#6B7280]">
            Nenhuma entrega ainda.
          </p>
        ) : (
          recent.map((s) => (
            <div
              key={s.id}
              className="flex items-center justify-between px-6 py-3.5 transition hover:bg-[#F8FAFC]"
            >
              <div className="min-w-0">
                <p className="font-mono text-sm font-semibold text-[#111827]">
                  {s.trackingCode}
                </p>
                <p className="truncate text-xs text-[#6B7280]">
                  {s.senderName} → {s.recipientName}
                </p>
              </div>
              <span
                className={`ml-4 shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${
                  STATUS_BADGE[s.status] ?? "bg-slate-100 text-slate-600"
                }`}
              >
                {getStatusLabel(s.status)}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { user, isAdmin } = useAuth();
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([shipmentsService.findAll(), customersService.findAll()])
      .then(([s, c]) => {
        setShipments(s);
        setCustomers(c);
      })
      .finally(() => setLoading(false));
  }, []);

  const metrics = computeMetrics(shipments, customers);

  const cards: MetricCard[] = [
    {
      label: "Total de entregas",
      value: loading ? "—" : metrics.total,
      icon: <Package className="h-5 w-5" />,
      color: "text-blue-700",
      bg: "bg-blue-50",
      href: "/dashboard/shipments",
    },
    {
      label: "Em andamento",
      value: loading ? "—" : metrics.inTransit,
      icon: <Truck className="h-5 w-5" />,
      color: "text-orange-700",
      bg: "bg-orange-50",
      href: "/dashboard/shipments",
    },
    {
      label: "Entregas concluídas",
      value: loading ? "—" : metrics.delivered,
      icon: <CheckCircle2 className="h-5 w-5" />,
      color: "text-[#15803D]",
      bg: "bg-[#DCFCE7]",
      href: "/dashboard/shipments",
    },
    {
      label: "Ocorrências",
      value: loading ? "—" : metrics.problems,
      icon: <AlertTriangle className="h-5 w-5" />,
      color: "text-amber-700",
      bg: "bg-amber-50",
      href: "/dashboard/shipments",
    },
    {
      label: "Clientes",
      value: loading ? "—" : metrics.customers,
      icon: <Users className="h-5 w-5" />,
      color: "text-purple-700",
      bg: "bg-purple-50",
      href: "/dashboard/customers",
    },
  ];

  return (
    <div className="space-y-8">
      {/* ── Header ─ */}
      <div>
        <p className="text-sm text-[#6B7280]">
          {new Date().toLocaleDateString("pt-BR", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
        <h1 className="mt-1 text-2xl font-bold text-[#111827]">
          Olá, {user?.name?.split(" ")[0]} 👋
        </h1>
        <p className="mt-1 text-[#6B7280]">
          Bem-vindo ao painel de controle do TrackLog.
        </p>
      </div>

      {/* ── Metric cards ─ */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {cards
          .filter((c) => c.label !== "Clientes" || isAdmin || true)
          .map((card) => (
            <Link
              key={card.label}
              href={card.href}
              className="group rounded-2xl border border-[#E5E7EB] bg-white p-5 shadow-sm transition hover:shadow-md"
            >
              <div className={`mb-3 flex h-10 w-10 items-center justify-center rounded-xl ${card.bg} ${card.color}`}>
                {card.icon}
              </div>
              <p className="text-2xl font-bold text-[#111827]">{card.value}</p>
              <p className="mt-1 text-sm text-[#6B7280]">{card.label}</p>
            </Link>
          ))}
      </div>

      {/* ── Quick links ─ */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Link
          href="/dashboard/shipments"
          className="flex items-center gap-4 rounded-2xl border border-[#E5E7EB] bg-white p-5 shadow-sm transition hover:border-[#16A34A] hover:shadow-md"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
            <Truck className="h-6 w-6" />
          </div>
          <div>
            <p className="font-semibold text-[#111827]">Gerenciar entregas</p>
            <p className="mt-0.5 text-sm text-[#6B7280]">Criar e atualizar status</p>
          </div>
          <ArrowRight className="ml-auto h-5 w-5 text-[#6B7280]" />
        </Link>

        <Link
          href="/dashboard/customers"
          className="flex items-center gap-4 rounded-2xl border border-[#E5E7EB] bg-white p-5 shadow-sm transition hover:border-[#16A34A] hover:shadow-md"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
            <Users className="h-6 w-6" />
          </div>
          <div>
            <p className="font-semibold text-[#111827]">Clientes</p>
            <p className="mt-0.5 text-sm text-[#6B7280]">Cadastrar e consultar</p>
          </div>
          <ArrowRight className="ml-auto h-5 w-5 text-[#6B7280]" />
        </Link>

        {isAdmin && (
          <Link
            href="/dashboard/users"
            className="flex items-center gap-4 rounded-2xl border border-[#E5E7EB] bg-white p-5 shadow-sm transition hover:border-[#16A34A] hover:shadow-md"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <TrendingUp className="h-6 w-6" />
            </div>
            <div>
              <p className="font-semibold text-[#111827]">Usuários</p>
              <p className="mt-0.5 text-sm text-[#6B7280]">Criar operadores</p>
            </div>
            <ArrowRight className="ml-auto h-5 w-5 text-[#6B7280]" />
          </Link>
        )}
      </div>

      {/* ── Recent shipments ─ */}
      {!loading && <RecentShipments shipments={shipments} />}

      {loading && (
        <div className="flex items-center gap-3 rounded-2xl border border-[#E5E7EB] bg-white p-8 text-[#6B7280]">
          <Clock className="h-5 w-5 animate-pulse text-[#16A34A]" />
          Carregando dados...
        </div>
      )}
    </div>
  );
}
