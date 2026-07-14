"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import * as shipmentsService from "@/src/services/shipments-service";
import { PublicTracking } from "@/src/types/shipments-types";
import { TrackingResult } from "@/src/components/tracking-result";

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
      setError("Código de rastreio não encontrado.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-4">
          <Link href="/" className="font-semibold text-slate-900">
            Track System
          </Link>
          <Link href="/login" className="text-sm text-teal-700 hover:underline">
            Área da empresa
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-3xl space-y-6 px-4 py-10">
        <div>
          <h1 className="text-3xl font-semibold text-slate-900">
            Rastrear entrega
          </h1>
          <p className="mt-2 text-slate-500">
            Digite o código gerado no momento da criação da encomenda.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row"
        >
          <input
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Ex: BRQ5C2PA1L"
            className="flex-1 rounded-xl border border-slate-300 px-4 py-3 font-mono uppercase outline-none focus:border-teal-600"
          />
          <button
            type="submit"
            disabled={loading}
            className="rounded-xl bg-teal-700 px-5 py-3 font-semibold text-white hover:bg-teal-800 disabled:opacity-60"
          >
            {loading ? "Buscando..." : "Buscar"}
          </button>
        </form>

        {error && (
          <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {error}
          </div>
        )}

        {result && <TrackingResult data={result} />}
      </main>
    </div>
  );
}
