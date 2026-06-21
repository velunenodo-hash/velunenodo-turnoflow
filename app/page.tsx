export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="mx-auto flex min-h-[75vh] max-w-6xl flex-col items-center justify-center px-6 text-center">
        <p className="mb-4 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-2 text-sm text-emerald-300">
          Para salones, barberías y estéticas
        </p>

        <h1 className="max-w-4xl text-4xl font-bold tracking-tight sm:text-6xl">
          Organizá los turnos que ya te llegan por WhatsApp
        </h1>

        <p className="mt-6 max-w-2xl text-lg text-slate-300">
          Menos tiempo respondiendo mensajes. Más tiempo atendiendo clientes.
          TurnoFlow te ayuda a ordenar reservas, horarios y confirmaciones desde
          un sistema simple pensado para negocios chicos.
        </p>

        <div className="mt-10 flex flex-col gap-4 sm:flex-row">
          <a
            href="https://wa.me/5491112345678?text=Hola%2C%20quiero%20probar%20TurnoFlow"
            className="rounded-xl bg-emerald-400 px-6 py-3 font-semibold text-slate-950 transition hover:bg-emerald-300"
          >
            Solicitar acceso beta
          </a>

          <a
            href="#como-funciona"
            className="rounded-xl border border-white/20 px-6 py-3 font-semibold text-white transition hover:bg-white/10"
          >
            Ver cómo funciona
          </a>
        </div>
      </section>

      <section id="como-funciona" className="mx-auto max-w-6xl px-6 py-24">
        <h2 className="text-center text-3xl font-bold">Cómo funciona</h2>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-white/10 p-6">
            <h3 className="text-xl font-semibold">1. El cliente escribe</h3>
            <p className="mt-3 text-slate-300">
              El cliente solicita un turno desde WhatsApp.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 p-6">
            <h3 className="text-xl font-semibold">2. TurnoFlow organiza</h3>
            <p className="mt-3 text-slate-300">
              El sistema consulta horarios disponibles y propone opciones.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 p-6">
            <h3 className="text-xl font-semibold">3. El negocio confirma</h3>
            <p className="mt-3 text-slate-300">
              El dueño recibe la solicitud y confirma el turno rápidamente.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-24">
        <h2 className="text-center text-3xl font-bold">
          ¿Por qué usar TurnoFlow?
        </h2>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-white/10 p-6">
            <h3 className="text-xl font-semibold">Menos mensajes repetidos</h3>
            <p className="mt-3 text-slate-300">
              Evitá responder las mismas preguntas todos los días.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 p-6">
            <h3 className="text-xl font-semibold">Menos errores</h3>
            <p className="mt-3 text-slate-300">
              Organizá horarios y disponibilidad desde un único lugar.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 p-6">
            <h3 className="text-xl font-semibold">Más tiempo para atender</h3>
            <p className="mt-3 text-slate-300">
              Concentrate en tus clientes y no en la administración.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-24">
        <h2 className="text-center text-3xl font-bold">
          Así se ve TurnoFlow
        </h2>

        <div className="mt-12 rounded-3xl border border-white/10 bg-slate-900 p-8">
          <div className="grid gap-6 md:grid-cols-3">
            <div className="rounded-2xl bg-slate-800 p-6">
              <p className="text-sm text-slate-400">Facturación hoy</p>
              <h3 className="mt-2 text-3xl font-bold text-emerald-400">
                $45.000
              </h3>
            </div>

            <div className="rounded-2xl bg-slate-800 p-6">
              <p className="text-sm text-slate-400">Turnos de hoy</p>
              <h3 className="mt-2 text-3xl font-bold">8</h3>
            </div>

            <div className="rounded-2xl bg-slate-800 p-6">
              <p className="text-sm text-slate-400">Clientes</p>
              <h3 className="mt-2 text-3xl font-bold">5</h3>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}