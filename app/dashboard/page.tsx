"use client";

import { useEffect, useState } from "react";
import {
  Appointment,
  appointments as initialAppointments,
} from "../../data/appointments";
import { business } from "../../data/business";

import {
  deleteAppointmentInSupabase,
  getAppointmentsFromSupabase,
  getServicesFromSupabase,
  getStaffFromSupabase,
  updateAppointmentInSupabase,
} from "../../lib/storage";

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

function getTodayDate() {
  const today = new Date();
  return today.toISOString().split("T")[0];
}

function addDays(date: string, days: number) {
  const currentDate = new Date(`${date}T00:00:00`);
  currentDate.setDate(currentDate.getDate() + days);
  return currentDate.toISOString().split("T")[0];
}

export default function Dashboard() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [appointmentToDelete, setAppointmentToDelete] =
    useState<Appointment | null>(null);
  const [message, setMessage] = useState("");
  const [selectedDate, setSelectedDate] = useState(getTodayDate());

  const [dashboardAppointments, setDashboardAppointments] =
    useState<Appointment[]>(initialAppointments);

  const [dashboardServices, setDashboardServices] =
    useState<typeof business.services>(business.services);

  const [dashboardStaff, setDashboardStaff] =
    useState<typeof business.staff>(business.staff);

  useEffect(() => {
    queueMicrotask(async () => {
      const appointmentsFromSupabase = await getAppointmentsFromSupabase();
      const servicesFromSupabase = await getServicesFromSupabase();
      const staffFromSupabase = await getStaffFromSupabase();

      setDashboardAppointments(appointmentsFromSupabase);
      setDashboardServices(servicesFromSupabase);
      setDashboardStaff(staffFromSupabase);
      setIsLoaded(true);
    });
  }, []);

  useEffect(() => {
    if (!message) {
      return;
    }

    const timer = setTimeout(() => {
      setMessage("");
    }, 3000);

    return () => clearTimeout(timer);
  }, [message]);

  async function handlePendingAppointment(appointmentId: number) {
    const updatedAppointments = dashboardAppointments.map((appointment) =>
      appointment.id !== appointmentId
        ? appointment
        : { ...appointment, status: "pending" as const }
    );

    setDashboardAppointments(updatedAppointments);
    setMessage("Turno marcado como pendiente.");

    const updatedAppointment = updatedAppointments.find(
      (appointment) => appointment.id === appointmentId
    );

    if (updatedAppointment) {
      await updateAppointmentInSupabase(updatedAppointment);
    }
  }

  async function handleConfirmAppointment(appointmentId: number) {
    const updatedAppointments = dashboardAppointments.map((appointment) =>
      appointment.id !== appointmentId
        ? appointment
        : { ...appointment, status: "confirmed" as const }
    );

    setDashboardAppointments(updatedAppointments);
    setMessage("Turno confirmado correctamente.");

    const updatedAppointment = updatedAppointments.find(
      (appointment) => appointment.id === appointmentId
    );

    if (updatedAppointment) {
      await updateAppointmentInSupabase(updatedAppointment);
    }
  }

  async function handleCancelAppointment(appointmentId: number) {
    const updatedAppointments = dashboardAppointments.map((appointment) =>
      appointment.id !== appointmentId
        ? appointment
        : { ...appointment, status: "cancelled" as const }
    );

    setDashboardAppointments(updatedAppointments);
    setMessage("Turno cancelado correctamente.");

    const updatedAppointment = updatedAppointments.find(
      (appointment) => appointment.id === appointmentId
    );

    if (updatedAppointment) {
      await updateAppointmentInSupabase(updatedAppointment);
    }
  }

  async function handleDeleteAppointment(appointmentId: number) {
    const updatedAppointments = dashboardAppointments.filter(
      (appointment) => appointment.id !== appointmentId
    );

    setDashboardAppointments(updatedAppointments);
    setMessage("Turno eliminado correctamente.");
    setAppointmentToDelete(null);

    await deleteAppointmentInSupabase(appointmentId);
  }

  const activeAppointments = dashboardAppointments.filter(
    (appointment) => appointment.status !== "cancelled"
  );

  const todayAppointments = activeAppointments.filter(
    (appointment) => appointment.date === selectedDate
  );

  const todayRevenue = todayAppointments.reduce((total, appointment) => {
    const service = dashboardServices.find(
      (service) => service.id === appointment.serviceId
    );

    return total + (service?.price ?? 0);
  }, 0);

  const uniqueTodayCustomers = new Set(
    todayAppointments.map((appointment) => appointment.customer)
  ).size;

  const cancelledTodayAppointments = dashboardAppointments.filter(
    (appointment) =>
      appointment.date === selectedDate &&
      appointment.status === "cancelled"
  );

  const filteredAppointments = dashboardAppointments.filter(
    (appointment) =>
      appointment.date === selectedDate &&
      appointment.customer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedAppointments = [...filteredAppointments].sort((a, b) => {
    const dateA = new Date(`${a.date}T${a.time}`);
    const dateB = new Date(`${b.date}T${b.time}`);

    return dateA.getTime() - dateB.getTime();
  });

  const scheduleConflicts = dashboardAppointments.filter(
    (appointment, index) => {
      return dashboardAppointments.some((otherAppointment, otherIndex) => {
        const isSameAppointment = index === otherIndex;
        const isSameStaff = appointment.staffId === otherAppointment.staffId;
        const isSameTime = appointment.time === otherAppointment.time;
        const isSameDate = appointment.date === otherAppointment.date;

        return !isSameAppointment && isSameStaff && isSameTime && isSameDate;
      });
    }
  );

  if (!isLoaded) {
    return null;
  }

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-8 text-white">
      {appointmentToDelete && (
        <div className="fixed left-0 top-0 z-50 flex h-screen w-screen items-center justify-center bg-black/60 px-6">
          <div className="w-full max-w-md rounded-2xl bg-slate-900 p-6 shadow-xl">
            <h2 className="text-xl font-bold text-white">
              ¿Eliminar este turno?
            </h2>

            <p className="mt-3 text-slate-300">
              Vas a eliminar el turno de{" "}
              <span className="font-semibold text-white">
                {appointmentToDelete.customer}
              </span>
              . Esta acción no se puede deshacer.
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setAppointmentToDelete(null)}
                className="rounded-xl border border-white/10 px-4 py-2 text-sm text-slate-300 transition hover:bg-white/10"
              >
                Cancelar
              </button>

              <button
                type="button"
                onClick={() => handleDeleteAppointment(appointmentToDelete.id)}
                className="rounded-xl bg-red-400 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-red-300"
              >
                Sí, eliminar
              </button>
            </div>
          </div>
        </div>
      )}
      <section className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm text-emerald-300">{business.name}</p>

            <h1 className="text-3xl font-bold">Panel del negocio</h1>

            <p className="mt-2 text-slate-400">
              Resumen de turnos, clientes y facturación del día {selectedDate}.
            </p>
            
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => setSelectedDate(addDays(selectedDate, -1))}
                className="rounded-xl border border-white/10 px-4 py-2 text-sm text-slate-300 transition hover:bg-white/10"
              >
                ← Día anterior
              </button>

              <span className="rounded-xl bg-slate-900 px-4 py-2 text-sm text-emerald-300">
                {selectedDate}
              </span>

              <button
                type="button"
                onClick={() => setSelectedDate(addDays(selectedDate, 1))}
                className="rounded-xl border border-white/10 px-4 py-2 text-sm text-slate-300 transition hover:bg-white/10"
              >
                Día siguiente →
              </button>

              <button
                type="button"
                onClick={() => setSelectedDate(getTodayDate())}
                className="rounded-xl bg-emerald-400 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:opacity-90"
              >
                Hoy
              </button>
            </div>
          </div>

          <a
            href="/dashboard/settings"
            className="rounded-xl border border-white/10 px-5 py-3 text-center font-semibold text-white transition hover:bg-white/10"
          >
            Configuración
          </a>

          <a
            href="/dashboard/new-appointment"
            className="rounded-xl bg-emerald-400 px-5 py-3 text-center font-semibold text-slate-950"
          >
            + Nuevo turno
          </a>
        </div>

        {message && (
          <div className="mb-6 rounded-2xl bg-emerald-400/10 p-4 text-emerald-300">
            {message}
          </div>
        )}

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-2xl bg-slate-900 p-6">
            <p className="text-sm text-slate-400">Facturación hoy</p>

            <h2 className="mt-2 text-3xl font-bold text-emerald-400">
              ${todayRevenue.toLocaleString("es-AR")}
            </h2>

            <p className="mt-2 text-sm text-emerald-300">+15% que ayer</p>
          </div>

          <div className="rounded-2xl bg-slate-900 p-6">
            <p className="text-sm text-slate-400">Turnos de hoy</p>

            <h2 className="mt-2 text-3xl font-bold">
              {todayAppointments.length}
            </h2>

            <p className="mt-2 text-sm text-slate-400">
              Turnos registrados
            </p>
          </div>

          <div className="rounded-2xl bg-slate-900 p-6">
            <p className="text-sm text-slate-400">Clientes atendidos</p>

            <h2 className="mt-2 text-3xl font-bold">
              {uniqueTodayCustomers}
            </h2>

            <p className="mt-2 text-sm text-slate-400">
              Clientes únicos
            </p>
          </div>

          <div className="rounded-2xl bg-slate-900 p-6">
            <p className="text-sm text-slate-400">
              Cancelados hoy
            </p>

            <h2 className="mt-2 text-3xl font-bold text-yellow-300">
              {cancelledTodayAppointments.length}
            </h2>

            <p className="mt-2 text-sm text-slate-400">
              Turnos cancelados
            </p>
         </div>

        </div>
         
        {scheduleConflicts.length > 0 && (
          <section className="mt-8 rounded-2xl border border-red-400/20 bg-red-400/10 p-6">
            <h2 className="text-xl font-semibold text-red-300">
              Alertas de agenda
            </h2>

            <div className="mt-4 space-y-3">
              {scheduleConflicts.map((conflict) => {
                const employee = dashboardStaff.find(
                  (staff) => staff.id === conflict.staffId
                );

                return (
                  <div
                    key={conflict.id}
                    className="rounded-xl bg-slate-950/60 p-4"
                  >
                    <p className="font-semibold text-red-200">
                      Conflicto de horario
                    </p>

                    <p className="mt-1 text-sm text-slate-300">
                      {employee?.name} tiene más de un turno el día{" "}
                      {conflict.date} a las {conflict.time}.
                    </p>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          <div className="rounded-2xl bg-slate-900 p-6 lg:col-span-2">
            <h2 className="text-xl font-semibold">
              Turnos registrados
            </h2>

            <input
              type="text"
              placeholder="Buscar cliente..."
              value={searchTerm}
              onChange={(event) =>
                setSearchTerm(event.target.value)
              }
              className="mt-4 w-full rounded-xl border border-white/10 bg-slate-800 px-4 py-3 text-white outline-none placeholder:text-slate-500"
            />

            <div className="mt-6 space-y-4">
              {sortedAppointments.length === 0 ? (
                <div className="rounded-2xl bg-slate-800 p-6 text-center">
                  <p className="text-slate-400">
                    No hay turnos para esta fecha
                  </p>
                </div>
              ) : (
                sortedAppointments.map((appointment) => {

                
                const service = dashboardServices.find(
                  (service) => service.id === appointment.serviceId
                );

                const employee = dashboardStaff.find(
                  (staff) => staff.id === appointment.staffId
                );

                const start = timeToMinutes(appointment.time);
                const end = start + (service?.duration ?? 0);
                const endTime = minutesToTime(end);

                const statusText =
                  appointment.status === "confirmed"
                    ? "Confirmado"
                    : appointment.status === "cancelled"
                    ? "Cancelado"
                    : "Pendiente";

                    const statusClass =
                      appointment.status === "confirmed"
                        ? "bg-emerald-400/10 text-emerald-300"
                        : appointment.status === "cancelled"
                        ? "bg-red-400/10 text-red-300"
                        : "bg-yellow-400/10 text-yellow-300";

                    const cardClass =
                      appointment.status === "cancelled"
                        ? "bg-slate-800/50 opacity-70"
                        : "bg-slate-800";

                return (
                  <div
                    key={appointment.id}
                    className={`flex flex-col gap-3 rounded-xl p-4 md:flex-row md:items-center md:justify-between ${cardClass}`}
                  >
                    <div>
                      <p className="font-semibold">
                        {appointment.date} - {appointment.time} -{" "}
                        {appointment.customer}
                      </p>

                      <div className="mt-1">
                        <p className="text-sm text-slate-400">
                          {service?.name}
                        </p>

                        <p className="text-xs text-emerald-300">
                          Termina: {endTime}
                        </p>

                        <p className="text-xs text-slate-500">
                          Atiende: {employee?.name}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className={`rounded-full px-3 py-1 text-sm ${statusClass}`}>
                        {statusText}
                      </span>

                      <a
                        href={`/dashboard/edit-appointment/${appointment.id}`}
                        className="rounded-full bg-sky-400/10 px-3 py-1 text-sm text-sky-300 transition hover:bg-sky-400/20"
                      >
                        Editar
                      </a>

                      {appointment.status === "confirmed" && (
                        <button
                          type="button"
                          onClick={() => handlePendingAppointment(appointment.id)}
                          className="rounded-full bg-yellow-400/10 px-3 py-1 text-sm text-yellow-300 transition hover:bg-yellow-400/20"
                        >
                          Pendiente
                        </button>
                      )}

                      {appointment.status === "pending" && (
                        <button
                          type="button"
                          onClick={() => handleConfirmAppointment(appointment.id)}
                          className="rounded-full bg-emerald-400/10 px-3 py-1 text-sm text-emerald-300 transition hover:bg-emerald-400/20"
                        >
                          Confirmar
                        </button>
                      )}

                      {appointment.status !== "cancelled" && (
                      <button
                        type="button"
                        onClick={() => handleCancelAppointment(appointment.id)}
                        className="rounded-full bg-yellow-400/10 px-3 py-1 text-sm text-yellow-300 transition hover:bg-yellow-400/20"
                      >
                        Cancelar
                      </button>
                    )}

                      <button
                        type="button"
                        onClick={() => setAppointmentToDelete(appointment)}
                        className="rounded-full bg-red-400/10 px-3 py-1 text-sm text-red-300 transition hover:bg-red-400/20"
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                );
              })
            )}
            </div>
          </div>

          <div className="rounded-2xl bg-slate-900 p-6">
            <h2 className="text-xl font-semibold">Servicios más pedidos</h2>

            <div className="mt-6 space-y-4">
              {dashboardServices.map((service) => {
                const count = dashboardAppointments.filter(
                  (appointment) =>
                    appointment.serviceId === service.id &&
                    appointment.date === selectedDate &&
                    appointment.status !== "cancelled"
                ).length;

                return (
                  <div key={service.id}>
                    <div className="mb-2 flex justify-between text-sm">
                      <span>{service.name}</span>
                      <span>{count}</span>
                    </div>

                    <div className="h-2 rounded-full bg-slate-800">
                      <div
                        className="h-2 rounded-full bg-emerald-400"
                        style={{
                          width: `${Math.min(count * 20, 100)}%`,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <section className="mt-8 rounded-2xl bg-slate-900 p-6">
          <h2 className="text-xl font-semibold">Servicios configurados</h2>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {dashboardServices.map((service) => (
              <div key={service.id} className="rounded-xl bg-slate-800 p-4">
                <h3 className="font-semibold">{service.name}</h3>

                <p className="mt-2 text-sm text-slate-400">
                  Duración: {service.duration} min
                </p>

                <p className="text-sm text-emerald-300">${service.price}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-8 rounded-2xl bg-slate-900 p-6">
          <h2 className="text-xl font-semibold">Personal</h2>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {dashboardStaff.map((employee) => (
              <div key={employee.id} className="rounded-xl bg-slate-800 p-4">
                <h3 className="font-semibold">{employee.name}</h3>

                <p className="mt-2 text-sm text-slate-400">
                  Horario: {employee.workingHours.start} -{" "}
                  {employee.workingHours.end}
                </p>

                <div className="mt-3">
                  <p className="mb-2 text-xs uppercase text-slate-500">
                    Servicios
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {employee.services.map((serviceId) => {
                      const service = dashboardServices.find(
                        (service) => service.id === serviceId
                      );

                      return (
                        <span
                          key={serviceId}
                          className="rounded-full bg-emerald-400/10 px-2 py-1 text-xs text-emerald-300"
                        >
                          {service?.name}
                        </span>
                      );
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-8 rounded-2xl bg-slate-900 p-6">
          <h2 className="text-xl font-semibold">Agenda por personal</h2>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {dashboardStaff.map((employee) => {
              const employeeAppointments = dashboardAppointments
                .filter(
                  (appointment) =>
                    appointment.staffId === employee.id &&
                    appointment.date === selectedDate
                );

              return (
                <div key={employee.id} className="rounded-xl bg-slate-800 p-4">
                  <h3 className="font-semibold">{employee.name}</h3>

                  <p className="mt-1 text-sm text-slate-400">
                    Horario: {employee.workingHours.start} -{" "}
                    {employee.workingHours.end}
                  </p>

                  <div className="mt-4 space-y-3">
                    {employeeAppointments.map((appointment) => {
                      const service = dashboardServices.find(
                        (service) => service.id === appointment.serviceId
                      );

                      return (
                        <div
                          key={appointment.id}
                          className="rounded-lg bg-slate-900 p-3"
                        >
                          <p className="font-medium">
                            {appointment.date} - {appointment.time} -{" "}
                            {appointment.customer}
                          </p>

                          <p className="text-sm text-slate-400">
                            {service?.name}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
            
           </section>      
    </main>
  );
}