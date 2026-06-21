"use client";

import { useEffect, useState } from "react";
import { business } from "../../../../data/business";

import {
  getServicesFromSupabase,
  updateServiceInSupabase,
} from "../../../../lib/storage";

export default function ServicesPage() {
  const [services, setServices] = useState(business.services);
  const [editingServiceId, setEditingServiceId] = useState<number | null>(null);
  useEffect(() => {
  queueMicrotask(async () => {
    const servicesFromSupabase = await getServicesFromSupabase();

    setServices(servicesFromSupabase);
  });
}, []);
  return (
    <main className="min-h-screen bg-slate-950 px-6 py-8 text-white">
      <section className="mx-auto max-w-5xl">
        <a
          href="/dashboard/settings"
          className="text-sm text-emerald-300"
        >
          ← Volver a configuración
        </a>

        <div className="mt-6">
          <h1 className="text-3xl font-bold">
            Servicios
          </h1>

          <p className="mt-2 text-slate-400">
            Administrá precios y duración de servicios.
          </p>
        </div>

        <div className="mt-8 grid gap-4">
          {services.map((service) => (
            <div
              key={service.id}
              className="rounded-2xl bg-slate-900 p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold">
                    {service.name}
                  </h2>

                  <p className="mt-2 text-slate-400">
                    Duración: {service.duration} minutos
                  </p>

                  <p className="text-emerald-300">
                    Precio: ${service.price}
                  </p>
                </div>

                <button
                    type="button"
                    onClick={() => setEditingServiceId(service.id)}
                    className="rounded-xl bg-sky-400/10 px-4 py-2 text-sm text-sky-300"
                    >
                    Editar
                    </button>
              </div>
              {editingServiceId === service.id && (
  <div className="mt-6 grid gap-4 md:grid-cols-2">
    <div>
      <label className="text-sm text-slate-300">
        Duración
      </label>

      <input
        type="number"
        value={service.duration}
        onChange={(event) => {
          const newDuration = Number(event.target.value);

          setServices((currentServices) =>
            currentServices.map((currentService) =>
              currentService.id === service.id
                ? { ...currentService, duration: newDuration }
                : currentService
            )
          );
        }}
        className="mt-2 w-full rounded-xl border border-white/10 bg-slate-800 px-4 py-3 text-white"
      />
    </div>

    <div>
      <label className="text-sm text-slate-300">
        Precio
      </label>

      <input
        type="number"
        value={service.price}
        onChange={(event) => {
          const newPrice = Number(event.target.value);

          setServices((currentServices) =>
            currentServices.map((currentService) =>
              currentService.id === service.id
                ? { ...currentService, price: newPrice }
                : currentService
            )
          );
        }}
        className="mt-2 w-full rounded-xl border border-white/10 bg-slate-800 px-4 py-3 text-white"
      />
    </div>

    <button
  type="button"
  onClick={async () => {
    await updateServiceInSupabase(
      service.id,
      service.duration,
      service.price
    );

    setEditingServiceId(null);
  }}
  className="rounded-xl bg-emerald-400 px-4 py-3 font-semibold text-slate-950 md:col-span-2"
>
  Guardar cambios
</button>
  </div>
)}
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}