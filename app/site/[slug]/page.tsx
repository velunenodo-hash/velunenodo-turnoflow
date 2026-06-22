const business = {
  name: "Glow Esthetic",
  city: "Villa Lugano",
  category: "Uñas • Pestañas • Cejas • Facial",
  description:
    "Reservá tratamientos de belleza y bienestar de forma simple, sin esperar respuesta por WhatsApp.",
  services: [
    {
      id: 1,
      name: "Kapping Gel",
      duration: 90,
      price: 18000,
      detail: "Incluye esmaltado semipermanente",
    },
    {
      id: 2,
      name: "Semipermanente",
      duration: 60,
      price: 14000,
      detail: "Color liso o diseño simple",
    },
    {
      id: 3,
      name: "Lifting de pestañas",
      duration: 75,
      price: 22000,
      detail: "Incluye nutrición y perfilado",
    },
  ],
};

const galleryImages = [
  { title: "Uñas Soft Gel", image: "/demo/nails1.jpg" },
  { title: "Lifting Pestañas", image: "/demo/lashes1.jpg" },
  { title: "Facial Premium", image: "/demo/facial1.jpg" },
  { title: "Nail Art", image: "/demo/nails1.jpg" },
];

const team = [
  {
    name: "Belén",
    role: "Uñas y Nail Art",
    image: "/demo/team1.jpg",
  },
  {
    name: "Camila",
    role: "Pestañas y cejas",
    image: "/demo/team2.jpg",
  },
  {
    name: "Julieta",
    role: "Tratamientos faciales",
    image: "/demo/team3.jpg",
  },
];

const availableSlots = ["Hoy 16:30", "Mañana 10:00", "Mañana 14:30"];

export default function PublicBusinessPage() {
  return (
    <main className="min-h-screen bg-[#faf8f4] text-[#1f1f1f]">
      <section className="mx-auto max-w-6xl px-5 py-6 md:px-10">
        <header className="flex items-center justify-between">
          <p className="text-sm font-semibold tracking-tight">Velune Nodo</p>

          <a
            href="#services"
            className="rounded-full bg-[#1f1f1f] px-5 py-3 text-sm font-semibold text-white"
          >
            Reservar
          </a>
        </header>

        <section className="grid gap-6 py-8 md:grid-cols-2 md:items-center md:py-12">
          <div className="order-2 md:order-1">
            <p className="text-sm uppercase tracking-[0.25em] text-[#867b6d]">
              {business.city}
            </p>

            <h1 className="mt-3 text-5xl font-bold tracking-tight md:text-7xl">
              {business.name}
            </h1>

            <p className="mt-4 text-lg text-[#6d6d6d]">
              {business.category}
            </p>

            <p className="mt-5 max-w-xl text-base leading-8 text-[#6d6d6d]">
              {business.description}
            </p>

            <div className="mt-6 rounded-3xl bg-white p-4 shadow-sm">
              <p className="text-sm font-semibold text-[#867b6d]">
                Próximos turnos disponibles
              </p>

              <div className="mt-3 flex flex-wrap gap-2">
                {availableSlots.map((slot) => (
                  <span
                    key={slot}
                    className="rounded-full bg-[#f0e7da] px-4 py-2 text-sm font-semibold"
                  >
                    {slot}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-7 grid gap-3">
              <a
                href="#services"
                className="rounded-2xl bg-[#1f1f1f] px-6 py-4 text-center font-semibold text-white"
              >
                Reservar turno
              </a>

              <div className="grid grid-cols-2 gap-3">
                <a
                  href="#"
                  className="rounded-2xl bg-white px-6 py-4 text-center font-semibold shadow-sm"
                >
                  WhatsApp
                </a>

                <a
                  href="#"
                  className="rounded-2xl bg-white px-6 py-4 text-center font-semibold shadow-sm"
                >
                  Instagram
                </a>
              </div>
            </div>
          </div>

          <div className="order-1 md:order-2">
            <div className="relative aspect-[4/4] overflow-hidden rounded-[2rem] shadow-sm md:aspect-[4/5]">
              <img
                src="/demo/hero.jpg"
                alt="Glow Esthetic"
                className="h-full w-full object-cover"
              />

              <div className="absolute inset-0 bg-black/10" />

              <div className="absolute bottom-4 left-4 rounded-2xl bg-white/90 px-4 py-3 backdrop-blur">
                <p className="text-sm font-semibold">+500 clientas</p>
                <p className="text-xs text-[#6d6d6d]">
                  Belleza y bienestar en Villa Lugano
                </p>
              </div>
            </div>
          </div>
        </section>
      </section>

      <section id="services" className="mx-auto max-w-6xl px-5 py-6 md:px-10">
        <div className="mb-5">
          <p className="text-sm uppercase tracking-[0.25em] text-[#867b6d]">
            Servicios
          </p>

          <h2 className="mt-2 text-4xl font-bold md:text-5xl">
            Elegí tu próximo turno
          </h2>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {business.services.map((service) => (
            <article
              key={service.id}
              className="rounded-[1.5rem] bg-white p-4 shadow-sm"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-2xl font-bold">{service.name}</h3>

                  <p className="mt-2 text-sm text-[#6d6d6d]">
                    {service.detail}
                  </p>
                </div>

                <span className="rounded-full bg-[#f0e7da] px-3 py-2 text-xs font-semibold">
                  {service.duration} min
                </span>
              </div>

              <p className="mt-5 text-3xl font-bold">
                ${service.price.toLocaleString("es-AR")}
              </p>

              <a
                href="#"
                className="mt-5 block rounded-2xl bg-[#1f1f1f] px-5 py-3 text-center font-semibold text-white"
              >
                Reservar
              </a>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-10 md:px-10">
        <div className="mb-5">
          <p className="text-sm uppercase tracking-[0.25em] text-[#867b6d]">
            Galería
          </p>

          <h2 className="mt-2 text-4xl font-bold md:text-5xl">
            Trabajos recientes
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {galleryImages.map((item) => (
            <div
              key={item.title}
              className="relative aspect-square overflow-hidden rounded-3xl"
            >
              <img
                src={item.image}
                alt={item.title}
                className="h-full w-full object-cover"
              />

              <div className="absolute inset-0 bg-black/20" />

              <div className="absolute bottom-3 left-3 rounded-full bg-white px-4 py-2 text-sm font-semibold">
                {item.title}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-10 md:px-10">
        <div className="mb-5">
          <p className="text-sm uppercase tracking-[0.25em] text-[#867b6d]">
            Equipo
          </p>

          <h2 className="mt-2 text-4xl font-bold md:text-5xl">
            Profesionales
          </h2>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {team.map((member) => (
            <article
              key={member.name}
              className="overflow-hidden rounded-[2rem] bg-white shadow-sm"
            >
              <img
                src={member.image}
                alt={member.name}
                className="h-44 w-full object-cover"
              />

              <div className="p-4">
                <h3 className="text-2xl font-bold">{member.name}</h3>

                <p className="mt-1 text-[#6d6d6d]">{member.role}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-10 md:px-10">
        <div className="rounded-[2rem] bg-[#1f1f1f] p-6 text-white md:p-8">
          <p className="text-sm uppercase tracking-[0.25em] text-[#d9cfc1]">
            Reserva online
          </p>

          <h2 className="mt-3 text-4xl font-bold">
            Reservá sin esperar respuesta por WhatsApp
          </h2>

          <p className="mt-4 text-white/70">
            Elegí servicio, profesional y horario disponible desde un solo lugar.
          </p>

          <a
            href="#services"
            className="mt-6 block rounded-2xl bg-white px-6 py-4 text-center font-semibold text-[#1f1f1f]"
          >
            Ver servicios
          </a>
        </div>
      </section>
    </main>
  );
}