import { business } from "../../../data/business";

export default function SettingsPage() {
  return (
    <main className="min-h-screen bg-slate-950 px-6 py-8 text-white">
      <section className="mx-auto max-w-5xl">
        <a href="/dashboard" className="text-sm text-emerald-300">
          ← Volver al dashboard
        </a>

        <div className="mt-6">
          <p className="text-sm text-emerald-300">{business.name}</p>

          <h1 className="mt-2 text-3xl font-bold">
            Configuración del negocio
          </h1>

          <p className="mt-2 text-slate-400">
            Administrá servicios, personal, horarios y datos generales.
          </p>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <a
            href="/dashboard/settings/services"
            className="rounded-2xl bg-slate-900 p-6 transition hover:bg-slate-800"
          >
            <h2 className="text-xl font-semibold">Servicios</h2>

            <p className="mt-2 text-slate-400">
              Editar precios, duración y servicios disponibles.
            </p>
          </a>

          <a
            href="/dashboard/settings/staff"
            className="rounded-2xl bg-slate-900 p-6 transition hover:bg-slate-800"
          >
            <h2 className="text-xl font-semibold">Personal</h2>

            <p className="mt-2 text-slate-400">
              Administrar empleados, horarios y servicios que realizan.
            </p>
          </a>

          <div className="rounded-2xl bg-slate-900 p-6 opacity-60">
            <h2 className="text-xl font-semibold">WhatsApp</h2>

            <p className="mt-2 text-slate-400">
              Configuración futura para mensajes y confirmaciones.
            </p>
          </div>

          <div className="rounded-2xl bg-slate-900 p-6 opacity-60">
            <h2 className="text-xl font-semibold">Datos del negocio</h2>

            <p className="mt-2 text-slate-400">
              Nombre, teléfono, dirección y datos visibles para clientes.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}