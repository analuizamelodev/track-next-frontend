"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import * as shipmentsService from "@/src/services/shipments-service";
import { PublicTracking } from "@/src/types/shipments-types";
import { TrackingResult } from "@/src/components/tracking-result";
import { Package, Search, ArrowLeft } from "lucide-react";

export default function TrackPage() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [result, setResult] = useState<PublicTracking | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const trackingCode = code.trim().toUpperCase();
    if (!trackingCode) return;

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const data = await shipmentsService.findByTrackingCode(trackingCode);
      setResult(data);
      router.replace(`/track/${trackingCode}`);
    } catch {
      setError("Código de rastreio não encontrado. Verifique e tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <header className="border-b border-[#E5E7EB] bg-white">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#16A34A]">
              <Package className="h-4 w-4 text-white" />
            </div>
            <span className="font-bold text-[#111827]">TrackLog</span>
          </Link>
          <Link
            href="/login"
            className="text-sm font-medium text-[#6B7280] hover:text-[#111827]"
          >
            Área da empresa
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-10">
        <Link
          href="/"
          className="mb-6 inline-flex items-center gap-1.5 text-sm text-[#6B7280] hover:text-[#111827]"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar ao início
        </Link>

        <h1 className="mb-2 text-3xl font-bold text-[#111827]">
          Rastrear encomenda
        </h1>
        <p className="mb-8 text-[#6B7280]">
          Informe o código recebido por e-mail no momento do envio.
        </p>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-3 rounded-2xl border border-[#E5E7EB] bg-white p-5 shadow-sm sm:flex-row"
        >
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#6B7280]" />
            <input
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Ex: BRXYZ1234AB"
              className="w-full rounded-xl border border-[#E5E7EB] py-3 pl-12 pr-4 font-mono text-lg uppercase text-[#111827] outline-none transition focus:border-[#16A34A] focus:ring-2 focus:ring-[#DCFCE7]"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="flex items-center justify-center gap-2 rounded-xl bg-[#16A34A] px-6 py-3 font-semibold text-white transition hover:bg-[#15803D] disabled:opacity-60"
          >
            {loading ? "Buscando..." : "Buscar"}
          </button>
        </form>

        {error && (
          <div className="mt-4 flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {result && (
          <div className="mt-8">
            <TrackingResult data={result} />
          </div>
        )}
      </main>
    </div>
  );
}
