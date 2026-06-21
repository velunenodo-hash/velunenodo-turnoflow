"use client";

import { useEffect, useState } from "react";
import { business } from "../../../../data/business";

import {
  getStaffFromSupabase,
  updateStaffInSupabase,
} from "../../../../lib/storage";

export default function StaffPage() {
  const [staff, setStaff] = useState(business.staff);
  const [editingStaffId, setEditingStaffId] = useState<number | null>(null);

  useEffect(() => {
    queueMicrotask(async () => {
      const staffFromSupabase = await getStaffFromSupabase();

      setStaff(staffFromSupabase);
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
            Personal
          </h1>

          <p className="mt-2 text-slate-400">
            Administrá empleados y horarios.
          </p>
        </div>

        <div className="mt-8 grid gap-4">
          {staff.map((employee) => (
            <div
              key={employee.id}
              className="rounded-2xl bg-slate-900 p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold">
                    {employee.name}
                  </h2>

                  <p className="mt-2 text-slate-400">
                    Horario: {employee.workingHours.start} - {employee.workingHours.end}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setEditingStaffId(employee.id)}
                  className="rounded-xl bg-sky-400/10 px-4 py-2 text-sm text-sky-300"
                >
                  Editar
                </button>
              </div>

              {editingStaffId === employee.id && (
                <div className="mt-6 grid gap-4 md:grid-cols-3">
                  <div>
                    <label className="text-sm text-slate-300">
                      Nombre
                    </label>

                    <input
                      type="text"
                      value={employee.name}
                      onChange={(event) => {
                        const newName = event.target.value;

                        setStaff((currentStaff) =>
                          currentStaff.map((currentEmployee) =>
                            currentEmployee.id === employee.id
                              ? { ...currentEmployee, name: newName }
                              : currentEmployee
                          )
                        );
                      }}
                      className="mt-2 w-full rounded-xl border border-white/10 bg-slate-800 px-4 py-3 text-white"
                    />
                  </div>

                  <div>
                    <label className="text-sm text-slate-300">
                      Inicio
                    </label>

                    <input
                      type="time"
                      value={employee.workingHours.start}
                      onChange={(event) => {
                        const newStart = event.target.value;

                        setStaff((currentStaff) =>
                          currentStaff.map((currentEmployee) =>
                            currentEmployee.id === employee.id
                              ? {
                                  ...currentEmployee,
                                  workingHours: {
                                    ...currentEmployee.workingHours,
                                    start: newStart,
                                  },
                                }
                              : currentEmployee
                          )
                        );
                      }}
                      className="mt-2 w-full rounded-xl border border-white/10 bg-slate-800 px-4 py-3 text-white"
                    />
                  </div>

                  <div>
                    <label className="text-sm text-slate-300">
                      Fin
                    </label>

                    <input
                      type="time"
                      value={employee.workingHours.end}
                      onChange={(event) => {
                        const newEnd = event.target.value;

                        setStaff((currentStaff) =>
                          currentStaff.map((currentEmployee) =>
                            currentEmployee.id === employee.id
                              ? {
                                  ...currentEmployee,
                                  workingHours: {
                                    ...currentEmployee.workingHours,
                                    end: newEnd,
                                  },
                                }
                              : currentEmployee
                          )
                        );
                      }}
                      className="mt-2 w-full rounded-xl border border-white/10 bg-slate-800 px-4 py-3 text-white"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={async () => {
                      await updateStaffInSupabase(
                        employee.id,
                        employee.name,
                        employee.workingHours.start,
                        employee.workingHours.end
                      );

                      setEditingStaffId(null);
                    }}
                    className="rounded-xl bg-emerald-400 px-4 py-3 font-semibold text-slate-950 md:col-span-3"
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