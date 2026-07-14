"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import * as shipmentsService from "@/src/services/shipments-service";
import { PublicTracking } from "@/src/types/shipments-types";
import { TrackingResult } from "@/src/components/tracking-result";

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
    return () => {
      cancelled = true;
    };
  }, [code]);

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-4">
          <Link href="/" className="font-semibold text-slate-900">
            Track System
          </Link>
          <Link href="/track" className="text-sm text-teal-700 hover:underline">
            Nova busca
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-3xl space-y-6 px-4 py-10">
        <h1 className="text-3xl font-semibold text-slate-900">
          Rastreamento {code}
        </h1>

        {loading && <p className="text-slate-500">Carregando...</p>}
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
