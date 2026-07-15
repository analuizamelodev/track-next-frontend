"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import * as shipmentsService from "@/src/services/shipments-service";
import { PublicTracking } from "@/src/types/shipments-types";
import { TrackingResult } from "@/src/components/tracking-result";
import { Package, Search, Loader2 } from "lucide-react";

export default function TrackByCodePage() {
  const params = useParams<{ code: string }>();
  const code = decodeURIComponent(params.code ?? "").toUpperCase();
  const [result, setResult] = useState<PublicTracking | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!code) return;
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError("");
      try {
        const data = await shipmentsService.findByTrackingCode(code);
        if (!cancelled) setResult(data);
      } catch {
        if (!cancelled) setError("Código de rastreio não encontrado.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, [code]);

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
            href="/track"
            className="flex items-center gap-1.5 text-sm font-medium text-[#16A34A] hover:text-[#15803D]"
          >
            <Search className="h-4 w-4" />
            Nova busca
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-10">
        <div className="mb-6">
          <p className="text-xs font-medium uppercase tracking-wide text-[#6B7280]">
            Rastreamento
          </p>
          <h1 className="font-mono text-2xl font-bold text-[#111827]">{code}</h1>
        </div>

        {loading && (
          <div className="flex items-center gap-3 rounded-2xl border border-[#E5E7EB] bg-white p-10 text-[#6B7280]">
            <Loader2 className="h-5 w-5 animate-spin text-[#16A34A]" />
            Buscando informações da encomenda...
          </div>
        )}

        {error && !loading && (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-6 py-8 text-center">
            <p className="text-lg font-semibold text-red-700">{error}</p>
            <p className="mt-2 text-sm text-red-500">
              Verifique o código e{" "}
              <Link href="/track" className="font-medium underline">
                tente novamente
              </Link>
              .
            </p>
          </div>
        )}

        {result && <TrackingResult data={result} />}
      </main>
    </div>
  );
}
