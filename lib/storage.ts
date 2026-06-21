import { Appointment, appointments } from "../data/appointments";
import { business } from "../data/business";
import { supabase } from "./supabase";

const APPOINTMENTS_KEY = "turnoflow-appointments";
const SERVICES_KEY = "turnoflow-services";
const STAFF_KEY = "turnoflow-staff";

export function getAppointments(): Appointment[] {
  if (typeof window === "undefined") {
    return appointments;
  }

  const savedAppointments = localStorage.getItem(APPOINTMENTS_KEY);

  return savedAppointments ? JSON.parse(savedAppointments) : appointments;
}

export function saveAppointments(updatedAppointments: Appointment[]) {
  localStorage.setItem(
    APPOINTMENTS_KEY,
    JSON.stringify(updatedAppointments)
  );
}

export function getServices() {
  if (typeof window === "undefined") {
    return business.services;
  }

  const savedServices = localStorage.getItem(SERVICES_KEY);

  return savedServices ? JSON.parse(savedServices) : business.services;
}

export function saveServices(updatedServices: typeof business.services) {
  localStorage.setItem(SERVICES_KEY, JSON.stringify(updatedServices));
}

export function getStaff() {
  if (typeof window === "undefined") {
    return business.staff;
  }

  const savedStaff = localStorage.getItem(STAFF_KEY);

  return savedStaff ? JSON.parse(savedStaff) : business.staff;
}

export function saveStaff(updatedStaff: typeof business.staff) {
  localStorage.setItem(STAFF_KEY, JSON.stringify(updatedStaff));
}

export async function testSupabaseConnection() {
  const { data, error } = await supabase.from("appointments").select("*");

  console.log("DATA:", data);
  console.log("ERROR:", error);
}

export async function createAppointmentInSupabase(appointment: Appointment) {
  const { data, error } = await supabase.from("appointments").insert({
    id: appointment.id,
    customer: appointment.customer,
    date: appointment.date,
    time: appointment.time,
    status: appointment.status,
    service_id: appointment.serviceId,
    staff_id: appointment.staffId,
  });

  console.log("SUPABASE INSERT DATA:", data);
  console.log("SUPABASE INSERT ERROR:", error);

  return { data, error };
}

export async function updateAppointmentInSupabase(appointment: Appointment) {
  const { data, error } = await supabase
    .from("appointments")
    .update({
      customer: appointment.customer,
      date: appointment.date,
      time: appointment.time,
      status: appointment.status,
      service_id: appointment.serviceId,
      staff_id: appointment.staffId,
    })
    .eq("id", appointment.id);

  console.log("SUPABASE APPOINTMENT UPDATE:", data);
  console.log("SUPABASE APPOINTMENT UPDATE ERROR:", error);

  return { data, error };
}

export async function getAppointmentsFromSupabase(): Promise<Appointment[]> {
  const { data, error } = await supabase
    .from("appointments")
    .select("*");

  if (error) {
    console.log("SUPABASE SELECT ERROR:", error);
    return getAppointments();
  }

  return data.map((appointment) => ({
    id: appointment.id,
    customer: appointment.customer,
    date: appointment.date,
    time: appointment.time,
    status: appointment.status,
    serviceId: appointment.service_id,
    staffId: appointment.staff_id,
  }));
}

export async function getServicesFromSupabase() {
  const { data, error } = await supabase
    .from("services")
    .select("*");

  if (error) {
    console.log("SUPABASE SERVICES SELECT ERROR:", error);
    return getServices();
  }

  return data.map((service) => ({
    id: service.id,
    name: service.name,
    duration: service.duration,
    price: service.price,
  }));
}

export async function updateServiceInSupabase(
  id: number,
  duration: number,
  price: number
) {
  const { data, error } = await supabase
    .from("services")
    .update({
      duration,
      price,
    })
    .eq("id", id);

  console.log("SUPABASE SERVICE UPDATE:", data);
  console.log("SUPABASE SERVICE ERROR:", error);

  return { data, error };
}

export async function getStaffFromSupabase() {
  const { data, error } = await supabase
    .from("staff")
    .select("*");

  if (error) {
    console.log("SUPABASE STAFF SELECT ERROR:", error);
    return getStaff();
  }

  return data.map((employee) => ({
    id: employee.id,
    name: employee.name,
    workingHours: {
      start: employee.start_hour,
      end: employee.end_hour,
    },
    services: [1, 2, 3],
  }));
}

export async function updateStaffInSupabase(
  id: number,
  name: string,
  startHour: string,
  endHour: string
) {
  const { data, error } = await supabase
    .from("staff")
    .update({
      name,
      start_hour: startHour,
      end_hour: endHour,
    })
    .eq("id", id);

  console.log("SUPABASE STAFF UPDATE:", data);
  console.log("SUPABASE STAFF ERROR:", error);

  return { data, error };
}

export async function deleteAppointmentInSupabase(appointmentId: number) {
  const { data, error } = await supabase
    .from("appointments")
    .delete()
    .eq("id", appointmentId);

  console.log("SUPABASE APPOINTMENT DELETE:", data);
  console.log("SUPABASE APPOINTMENT DELETE ERROR:", error);

  return { data, error };
}