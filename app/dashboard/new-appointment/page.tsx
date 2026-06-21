"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Appointment } from "../../../data/appointments";

import {
  createAppointmentInSupabase,
  getAppointments,
  getServicesFromSupabase,
  getStaffFromSupabase,
  saveAppointments,
} from "../../../lib/storage";

import { business } from "../../../data/business";

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

function getSavedAppointments(): Appointment[] {
  return getAppointments();
}

export default function NewAppointment() {
  const router = useRouter();

  const [clientName, setClientName] = useState("");
  const [services, setServices] =
  useState<typeof business.services>(business.services);
  const [staff, setStaff] =
  useState<typeof business.staff>(business.staff);
  const [selectedServiceId, setSelectedServiceId] = useState<number | null>(
    null
  );
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<number | null>(
    null
  );
 useEffect(() => {
  getServicesFromSupabase().then((servicesFromSupabase) => {
    setServices(servicesFromSupabase);
  });

  getStaffFromSupabase().then((staffFromSupabase) => {
    setStaff(staffFromSupabase);
  });
}, []);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState("2026-06-09");
  const [error, setError] = useState("");
  const [showSummary, setShowSummary] = useState(false);
  const [savedMessage, setSavedMessage] = useState("");

  const currentAppointments = getSavedAppointments();

  const availableEmployees = selectedServiceId
    ? staff.filter((employee) =>
        employee.services.includes(selectedServiceId)
      )
    : staff;

  const selectedService = services.find(
    (service) => service.id === selectedServiceId
  );

  const selectedEmployee = staff.find(
    (employee) => employee.id === selectedEmployeeId
  );

  const employeeAppointments = selectedEmployeeId
  ? currentAppointments.filter(
      (appointment) =>
        appointment.staffId === selectedEmployeeId &&
        appointment.date === selectedDate &&
        appointment.status !== "cancelled"
    )
  : [];

  const occupiedBlocks = employeeAppointments.map((appointment) => {
    const service = services.find(
      (service) => service.id === appointment.serviceId
    );

    const start = timeToMinutes(appointment.time);
    const end = start + (service?.duration ?? 0);

    return {
      start,
      end,
      label: `${appointment.time} - ${minutesToTime(end)}`,
    };
  });

  const availableTimes =
    selectedEmployee && selectedService
      ? (() => {
          const workStart = timeToMinutes(selectedEmployee.workingHours.start);
          const workEnd = timeToMinutes(selectedEmployee.workingHours.end);
          const duration = selectedService.duration;

          const result: string[] = [];
          let current = workStart;

          while (current + duration <= workEnd) {
            const candidateStart = current;
            const candidateEnd = current + duration;

            const hasConflict = occupiedBlocks.some((block) => {
              return candidateStart < block.end && candidateEnd > block.start;
            });

            if (!hasConflict) {
              result.push(minutesToTime(candidateStart));
              current = candidateEnd;
            } else {
              const conflictingBlock = occupiedBlocks.find((block) => {
                return candidateStart < block.end && candidateEnd > block.start;
              });

              current = conflictingBlock ? conflictingBlock.end : current + 30;
            }
          }

          return result;
        })()
      : [];

  async function handleCreateAppointment() {
    setError("");
    setShowSummary(false);
    setSavedMessage("");

    if (!clientName.trim()) {
      setError("Ingresá el nombre del cliente.");
      return;
    }

    if (!selectedService) {
      setError("Seleccioná un servicio.");
      return;
    }

    if (!selectedEmployee) {
      setError("Seleccioná una persona del equipo.");
      return;
    }

    if (!selectedTime) {
      setError("Seleccioná un horario disponible.");
      return;
    }

    const newAppointmentId = crypto.randomUUID();

    const newAppointment: Appointment = {
      id: Number(newAppointmentId.replace(/\D/g, "").slice(0, 10)),
      customer: clientName,
      serviceId: selectedService.id,
      staffId: selectedEmployee.id,
      date: selectedDate,
      time: selectedTime,
      status: "confirmed",
    };

    const updatedAppointments = [...currentAppointments, newAppointment];

    saveAppointments(updatedAppointments);

    await createAppointmentInSupabase(newAppointment);

    router.push("/dashboard");
  }

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-8 text-white">
      <section className="mx-auto max-w-3xl">
        <a href="/dashboard" className="text-sm text-emerald-300">
          ← Volver al dashboard
        </a>

        <div className="mt-6 rounded-2xl bg-slate-900 p-6">
          <p className="text-sm text-emerald-300">{business.name}</p>

          <h1 className="mt-2 text-3xl font-bold">Nuevo turno</h1>

          <p className="mt-2 text-slate-400">
            Cargá los datos básicos del cliente, servicio, personal y horario.
          </p>

          <form className="mt-8 space-y-6">
            <div>
              <label className="text-sm font-medium text-slate-300">
                Nombre del cliente
              </label>

              <input
                type="text"
                value={clientName}
                onChange={(event) => {
                  setClientName(event.target.value);
                  setShowSummary(false);
                  setSavedMessage("");
                }}
                placeholder="Ej: María López"
                className="mt-2 w-full rounded-xl border border-white/10 bg-slate-800 px-4 py-3 text-white outline-none placeholder:text-slate-500"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-slate-300">
                Servicio
              </label>

              <select
                className="mt-2 w-full rounded-xl border border-white/10 bg-slate-800 px-4 py-3 text-white outline-none"
                onChange={(event) => {
                  const value = event.target.value;

                  setSelectedServiceId(value ? Number(value) : null);
                  setSelectedEmployeeId(null);
                  setSelectedTime(null);
                  setShowSummary(false);
                  setSavedMessage("");
                }}
              >
                <option value="">Seleccionar servicio</option>

                {services.map((service) => (
                  <option key={service.id} value={service.id}>
                    {service.name} - ${service.price} - {service.duration} min
                  </option>
                ))}
              </select>

              {selectedService && (
                <div className="mt-3 rounded-xl bg-slate-800 p-4">
                  <p className="text-sm text-slate-400">
                    Duración del servicio
                  </p>

                  <p className="mt-1 font-semibold text-emerald-300">
                    {selectedService.duration} minutos
                  </p>
                </div>
              )}
            </div>

            <div>
              <label className="text-sm font-medium text-slate-300">
                Personal
              </label>

              <select
                className="mt-2 w-full rounded-xl border border-white/10 bg-slate-800 px-4 py-3 text-white outline-none"
                value={selectedEmployeeId ?? ""}
                onChange={(event) => {
                  const value = event.target.value;

                  setSelectedEmployeeId(value ? Number(value) : null);
                  setSelectedTime(null);
                  setShowSummary(false);
                  setSavedMessage("");
                }}
              >
                <option value="">Seleccionar personal</option>

                {availableEmployees.map((employee) => (
                  <option key={employee.id} value={employee.id}>
                    {employee.name} ({employee.workingHours.start} -{" "}
                    {employee.workingHours.end})
                  </option>
                ))}
              </select>

              {occupiedBlocks.length > 0 && (
                <div className="mt-4 rounded-xl bg-slate-800 p-4">
                  <p className="font-medium text-amber-300">
                    Horarios ocupados
                  </p>

                  <div className="mt-3 flex flex-wrap gap-2">
                    {occupiedBlocks.map((block) => (
                      <span
                        key={block.label}
                        className="rounded-full bg-red-400/10 px-3 py-1 text-sm text-red-300"
                      >
                        {block.label}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {availableTimes.length > 0 && (
                <div className="mt-4 rounded-xl bg-slate-800 p-4">
                  <p className="font-medium text-emerald-300">
                    Horarios disponibles
                  </p>

                  <div className="mt-3 flex flex-wrap gap-2">
                    {availableTimes.map((time) => {
                      const isSelected = selectedTime === time;

                      return (
                        <button
                          key={time}
                          type="button"
                          onClick={() => {
                            setSelectedTime(time);
                            setShowSummary(false);
                            setSavedMessage("");
                          }}
                          className={`rounded-full px-3 py-1 text-sm ${
                            isSelected
                              ? "bg-emerald-400 text-slate-950"
                              : "bg-emerald-400/10 text-emerald-300"
                          }`}
                        >
                          {time}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            <div>
              <label className="text-sm font-medium text-slate-300">
                Fecha
              </label>

              <input
                type="date"
                value={selectedDate}
                onChange={(event) => {
                  setSelectedDate(event.target.value);
                  setSelectedTime(null);
                  setShowSummary(false);
                  setSavedMessage("");
                }}
                className="mt-2 w-full rounded-xl border border-white/10 bg-slate-800 px-4 py-3 text-white outline-none"
              />
            </div>

            {selectedTime && (
              <div className="rounded-xl bg-emerald-400/10 p-4">
                <p className="text-sm text-slate-400">
                  Horario seleccionado
                </p>

                <p className="mt-1 font-semibold text-emerald-300">
                  {selectedTime}
                </p>
              </div>
            )}

            {error && (
              <div className="rounded-xl bg-red-400/10 p-4 text-red-300">
                {error}
              </div>
            )}

            {savedMessage && (
              <div className="rounded-xl bg-emerald-400/10 p-4 text-emerald-300">
                {savedMessage}
              </div>
            )}

            {showSummary &&
              selectedService &&
              selectedEmployee &&
              selectedTime && (
                <div className="rounded-xl bg-slate-800 p-4">
                  <p className="font-semibold text-emerald-300">
                    Turno listo para crear
                  </p>

                  <div className="mt-3 space-y-1 text-sm text-slate-300">
                    <p>Cliente: {clientName}</p>
                    <p>Servicio: {selectedService.name}</p>
                    <p>Personal: {selectedEmployee.name}</p>
                    <p>Fecha: {selectedDate}</p>
                    <p>Horario: {selectedTime}</p>
                    <p>Precio: ${selectedService.price}</p>
                  </div>
                </div>
              )}

            <button
              type="button"
              onClick={handleCreateAppointment}
              className="w-full rounded-xl bg-emerald-400 px-5 py-3 font-semibold text-slate-950"
            >
              Crear turno
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}