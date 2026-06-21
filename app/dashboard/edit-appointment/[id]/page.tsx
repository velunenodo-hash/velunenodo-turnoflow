"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Appointment,
  appointments as initialAppointments,
} from "../../../../data/appointments";
import { business } from "../../../../data/business";

import {
  getAppointmentsFromSupabase,
  getServicesFromSupabase,
  getStaffFromSupabase,
  updateAppointmentInSupabase,
} from "../../../../lib/storage";

function timeToMinutes(time: string) {
  const [hours, minutes] = time.split(":").map(Number);

  return hours * 60 + minutes;
}

function minutesToTime(totalMinutes: number) {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
    2,
    "0"
  )}`;
}

export default function EditAppointment() {
  const params = useParams();
  const router = useRouter();

  const appointmentId = Number(params.id);

  const [appointments, setAppointments] =
    useState<Appointment[]>(initialAppointments);

  const [services, setServices] =
  useState<typeof business.services>(business.services);

  const [staff, setStaff] =
  useState<typeof business.staff>(business.staff);
  const [isLoaded, setIsLoaded] = useState(false);

  const [customer, setCustomer] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [status, setStatus] = useState<
    "confirmed" | "pending" | "cancelled"
  >("confirmed");

  const [serviceId, setServiceId] = useState<number | null>(null);
  const [staffId, setStaffId] = useState<number | null>(null);

  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
  queueMicrotask(async () => {
    setAppointments(await getAppointmentsFromSupabase());
    setServices(await getServicesFromSupabase());
    setStaff(await getStaffFromSupabase());

    setIsLoaded(true);
  });
}, []);

  const appointment = appointments.find(
    (appointment) => appointment.id === appointmentId
  );

  useEffect(() => {
    queueMicrotask(() => {
      if (!appointment) {
        return;
      }

      setCustomer(appointment.customer);
      setDate(appointment.date);
      setTime(appointment.time);
      setStatus(appointment.status);
      setServiceId(appointment.serviceId);
      setStaffId(appointment.staffId);
    });
  }, [appointment]);

  async function handleSave() {
    setIsSaving(true);

    const selectedService = services.find(
      (service) => service.id === serviceId
    );

    if (!selectedService) {
      setError("Seleccioná un servicio válido");
      setIsSaving(false);
      return;      
    }

    const newStart = timeToMinutes(time);
    const newEnd = newStart + selectedService.duration;

    const conflictingAppointment = appointments.find((appointment) => {
      if (
        appointment.id === appointmentId ||
        appointment.staffId !== staffId ||
        appointment.date !== date ||
        appointment.status === "cancelled"
      ) {
        return false;
      }

      const appointmentService = services.find(
        (service) => service.id === appointment.serviceId
      );

      const existingStart = timeToMinutes(appointment.time);
      const existingEnd = existingStart + (appointmentService?.duration ?? 0);

      return newStart < existingEnd && newEnd > existingStart;
    });

    if (conflictingAppointment) {
      setError("Ese horario se superpone con otro turno de este empleado");
      setIsSaving(false);
      return;
    }

    const updatedAppointments = appointments.map((appointment) => {
      if (appointment.id !== appointmentId) {
        return appointment;
      }

      return {
        ...appointment,
        customer,
        date,
        time,
        status,
        serviceId: serviceId ?? appointment.serviceId,
        staffId: staffId ?? appointment.staffId,
      };
    });

    setError("");

    const updatedAppointment = updatedAppointments.find(
  (appointment) => appointment.id === appointmentId
);

if (updatedAppointment) {
  await updateAppointmentInSupabase(updatedAppointment);
}

setIsSaving(false);
router.push("/dashboard");
  }

  const selectedService = services.find(
    (service) => service.id === serviceId
  );

  const endTime =
    selectedService && time
      ? minutesToTime(timeToMinutes(time) + selectedService.duration)
      : "";

  const availableEmployees = serviceId
    ? staff.filter((employee) =>
        employee.services.includes(serviceId)
      )
    : staff;

  if (!isLoaded) {
    return null;
  }

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-8 text-white">
      <section className="mx-auto max-w-3xl">
        <a href="/dashboard" className="text-sm text-emerald-300">
          ← Volver al dashboard
        </a>

        <div className="mt-6 rounded-2xl bg-slate-900 p-6">
          <h1 className="text-3xl font-bold">Editar turno</h1>

          {!appointment ? (
            <p className="mt-6 text-red-300">Turno no encontrado.</p>
          ) : (
            <form className="mt-6 space-y-6">
              <div>
                <label className="text-sm text-slate-300">Cliente</label>

                <input
                  type="text"
                  value={customer}
                  onChange={(event) => setCustomer(event.target.value)}
                  className="mt-2 w-full rounded-xl border border-white/10 bg-slate-800 px-4 py-3 text-white"
                />
              </div>

              <div>
                <label className="text-sm text-slate-300">Servicio</label>

                <select
                  value={serviceId ?? ""}
                  onChange={(event) => setServiceId(Number(event.target.value))}
                  className="mt-2 w-full rounded-xl border border-white/10 bg-slate-800 px-4 py-3 text-white"
                >
                  {services.map((service) => (
                    <option key={service.id} value={service.id}>
                      {service.name} - ${service.price} - {service.duration} min
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm text-slate-300">Empleado</label>

                <select
                  value={staffId ?? ""}
                  onChange={(event) => setStaffId(Number(event.target.value))}
                  className="mt-2 w-full rounded-xl border border-white/10 bg-slate-800 px-4 py-3 text-white"
                >
                  {availableEmployees.map((employee) => (
                    <option key={employee.id} value={employee.id}>
                      {employee.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm text-slate-300">Fecha</label>

                <input
                  type="date"
                  value={date}
                  onChange={(event) => setDate(event.target.value)}
                  className="mt-2 w-full rounded-xl border border-white/10 bg-slate-800 px-4 py-3 text-white"
                />
              </div>

              <div>
                <label className="text-sm text-slate-300">Hora</label>

                {endTime && (
                  <div className="rounded-xl bg-emerald-400/10 p-4">
                    <p className="text-sm text-slate-400">
                      Este turno termina a
                    </p>

                    <p className="mt-1 font-semibold text-emerald-300">
                      {endTime}
                    </p>
                  </div>
                )}

                <input
                  type="time"
                  value={time}
                  onChange={(event) => setTime(event.target.value)}
                  className="mt-2 w-full rounded-xl border border-white/10 bg-slate-800 px-4 py-3 text-white"
                />
              </div>

              <div>
                <label className="text-sm text-slate-300">Estado</label>

                <select
                  value={status}
                  onChange={(event) =>
                    setStatus(
                      event.target.value as
                        | "confirmed"
                        | "pending"
                        | "cancelled"
                    )
                  }
                  className="mt-2 w-full rounded-xl border border-white/10 bg-slate-800 px-4 py-3 text-white"
                >
                  <option value="confirmed">Confirmado</option>
                  <option value="pending">Pendiente</option>
                  <option value="cancelled">Cancelado</option>
                </select>
              </div>

              {error && (
                <div className="rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-300">
                  ❌ {error}
                </div>
              )}

              <button
                type="button"
                onClick={handleSave}
                disabled={isSaving}
                className="w-full rounded-xl bg-emerald-400 px-5 py-3 font-semibold text-slate-950 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSaving ? "Guardando..." : "Guardar cambios"}
              </button>
            </form>
          )}
        </div>
      </section>
    </main>
  );
}