"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Package,
  Search,
  Truck,
  Shield,
  Clock,
  MapPin,
  ChevronRight,
  ArrowRight,
} from "lucide-react";

export default function HomePage() {
  const router = useRouter();
  const [code, setCode] = useState("");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const trimmed = code.trim().toUpperCase();
    if (trimmed) router.push(`/track/${trimmed}`);
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* ── Navbar ─────────────────────────────────────────────── */}
      <header className="border-b border-[#E5E7EB] bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#16A34A]">
              <Package className="h-4 w-4 text-white" />
            </div>
            <span className="text-lg font-bold text-[#111827]">TrackLog</span>
          </div>
          <Link
            href="/login"
            className="flex items-center gap-1.5 rounded-xl bg-[#16A34A] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#15803D]"
          >
            Área da empresa
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      </header>

      {/* ── Hero ───────────────────────────────────────────────── */}
      <main>
        <section className="relative overflow-hidden bg-white pb-20 pt-16">
          {/* Decorative blur blob */}
          <div
            aria-hidden
            className="pointer-events-none absolute -top-24 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-[#DCFCE7] opacity-60 blur-3xl"
          />

          <div className="relative mx-auto max-w-3xl px-4 text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#DCFCE7] bg-[#F0FDF4] px-4 py-1.5 text-sm font-medium text-[#15803D]">
              <span className="h-2 w-2 rounded-full bg-[#16A34A]" />
              Rastreamento em tempo real
            </div>

            <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-[#111827] sm:text-5xl lg:text-6xl">
              Acompanhe sua
              <span className="text-[#16A34A]"> entrega</span>
              <br />
              de qualquer lugar
            </h1>

            <p className="mx-auto mt-5 max-w-xl text-lg text-[#6B7280]">
              Digite o código de rastreio e veja em tempo real onde está a sua
              encomenda, desde o despacho até a entrega.
            </p>

            {/* Search form */}
            <form
              onSubmit={handleSubmit}
              className="mx-auto mt-10 flex max-w-xl flex-col gap-3 sm:flex-row"
            >
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#6B7280]" />
                <input
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="Ex: BRXYZ1234AB"
                  className="w-full rounded-2xl border border-[#E5E7EB] bg-white py-4 pl-12 pr-4 font-mono text-lg text-[#111827] uppercase shadow-sm outline-none transition focus:border-[#16A34A] focus:ring-2 focus:ring-[#DCFCE7]"
                />
              </div>
              <button
                type="submit"
                className="flex items-center justify-center gap-2 rounded-2xl bg-[#16A34A] px-7 py-4 font-bold text-white shadow-md transition hover:bg-[#15803D] active:scale-95"
              >
                Rastrear
                <ArrowRight className="h-5 w-5" />
              </button>
            </form>

            <p className="mt-4 text-sm text-[#6B7280]">
              O código foi enviado por e-mail no momento da criação da encomenda.
            </p>
          </div>
        </section>

        {/* ── Features ───────────────────────────────────────────── */}
        <section className="bg-[#F8FAFC] py-20">
          <div className="mx-auto max-w-6xl px-4">
            <h2 className="mb-12 text-center text-2xl font-bold text-[#111827]">
              Por que usar o TrackLog?
            </h2>
            <div className="grid gap-6 sm:grid-cols-3">
              {[
                {
                  icon: <Truck className="h-6 w-6 text-[#16A34A]" />,
                  title: "Rastreamento preciso",
                  desc: "Atualizações em cada etapa da entrega, com localização e horário exatos.",
                },
                {
                  icon: <Clock className="h-6 w-6 text-[#16A34A]" />,
                  title: "Prazo estimado",
                  desc: "Saiba com antecedência quando sua encomenda vai chegar.",
                },
                {
                  icon: <Shield className="h-6 w-6 text-[#16A34A]" />,
                  title: "Segurança total",
                  desc: "Confirmação de entrega com assinatura e validação de CEP.",
                },
              ].map((f) => (
                <div
                  key={f.title}
                  className="rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-sm transition hover:shadow-md"
                >
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#F0FDF4]">
                    {f.icon}
                  </div>
                  <h3 className="mb-2 font-semibold text-[#111827]">{f.title}</h3>
                  <p className="text-sm text-[#6B7280]">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── How it works ───────────────────────────────────────── */}
        <section className="bg-white py-20">
          <div className="mx-auto max-w-4xl px-4 text-center">
            <h2 className="mb-12 text-2xl font-bold text-[#111827]">
              Como rastrear em 3 passos
            </h2>
            <div className="grid gap-8 sm:grid-cols-3">
              {[
                { n: "01", icon: <Package className="h-6 w-6" />, label: "Receba o código", desc: "O código é enviado por e-mail ao criar a encomenda." },
                { n: "02", icon: <Search className="h-6 w-6" />, label: "Pesquise", desc: "Cole o código no campo de busca acima." },
                { n: "03", icon: <MapPin className="h-6 w-6" />, label: "Acompanhe", desc: "Veja o histórico completo de movimentações." },
              ].map((s) => (
                <div key={s.n} className="flex flex-col items-center">
                  <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#DCFCE7] text-[#16A34A]">
                    {s.icon}
                  </div>
                  <span className="mb-1 text-xs font-bold tracking-widest text-[#16A34A]">
                    {s.n}
                  </span>
                  <h3 className="mb-1 font-semibold text-[#111827]">{s.label}</h3>
                  <p className="text-sm text-[#6B7280]">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* ── Footer ─────────────────────────────────────────────── */}
      <footer className="border-t border-[#E5E7EB] bg-white py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 sm:flex-row">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-[#16A34A]">
              <Package className="h-3 w-3 text-white" />
            </div>
            <span className="text-sm font-semibold text-[#111827]">TrackLog</span>
          </div>
          <p className="text-sm text-[#6B7280]">
            © {new Date().getFullYear()} TrackLog. Sistema de rastreamento de entregas.
          </p>
        </div>
      </footer>
    </div>
  );
}
