import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-100">
      <div className="mx-auto flex min-h-screen max-w-3xl flex-col justify-center px-4 py-16">
        <p className="text-sm font-medium uppercase tracking-wide text-teal-700">
          Track System
        </p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-slate-900">
          Acompanhe entregas com simplicidade
        </h1>
        <p className="mt-4 max-w-xl text-lg text-slate-600">
          Clientes rastreiam pelo código. A equipe da empresa gerencia clientes,
          status e usuários na área interna.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/track"
            className="rounded-xl bg-teal-700 px-5 py-3 font-semibold text-white hover:bg-teal-800"
          >
            Rastrear entrega
          </Link>
          <Link
            href="/login"
            className="rounded-xl border border-slate-300 bg-white px-5 py-3 font-semibold text-slate-800 hover:bg-slate-50"
          >
            Área da empresa
          </Link>
        </div>
      </div>
    </main>
  );
}
