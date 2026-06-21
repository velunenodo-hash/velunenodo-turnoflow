export type Appointment = {
  id: number;
  customer: string;
  serviceId: number;
  staffId: number;
  date: string;
  time: string;
  status: "confirmed" | "pending" | "cancelled";
};

export const appointments: Appointment[] = [
  {
    id: 1,
    customer: "María López",
    serviceId: 1,
    staffId: 1,
    date: "2026-06-09",
    time: "10:00",
    status: "confirmed",
  },

  {
    id: 2,
    customer: "Camila Pérez",
    serviceId: 2,
    staffId: 2,
    date: "2026-06-09",
    time: "12:30",
    status: "pending",
  },

  {
    id: 3,
    customer: "Sofía Díaz",
    serviceId: 1,
    staffId: 1,
    date: "2026-06-09",
    time: "15:00",
    status: "confirmed",
  },

  {
    id: 4,
    customer: "Laura Gómez",
    serviceId: 2,
    staffId: 1,
    date: "2026-06-09",
    time: "10:00",
    status: "confirmed",
  },
];