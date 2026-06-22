const business = {
  name: "Glow Esthetic",
  city: "Villa Lugano",
  category: "Belleza • Uñas • Pestañas • Facial",
  description:
    "Un espacio pensado para verte y sentirte mejor. Tratamientos de belleza, estética y bienestar en un ambiente cómodo y profesional.",
  services: [
    { id: 1, name: "Kapping Gel", duration: 90, price: 18000 },
    { id: 2, name: "Semipermanente", duration: 60, price: 14000 },
    { id: 3, name: "Lifting de pestañas", duration: 75, price: 22000 },
  ],
};

const galleryItems = [
  "Uñas",
  "Pestañas",
  "Cejas",
  "Facial",
  "Nail art",
  "Belleza",
];

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

        <section className="grid min-h-[85vh] items-center gap-10 py-12 md:grid-cols-2">
          <div>
            <div className="relative w-full h-[320px] md:h-[500px] rounded-3xl overflow-hidden">
              <img
                src="/demo/hero.jpg"
                alt="Glow Esthetic"
                className="w-full h-full object-cover"
              />

              <div className="absolute inset-0 bg-black/30" />
            </div>

            <p className="mt-8 text-sm uppercase tracking-[0.25em] text-[#867b6d]">
              {business.city}
            </p>

            <h1 className="mt-3 max-w-xl text-5xl font-bold tracking-tight md:text-7xl">
              {business.name}
            </h1>

            <p className="mt-5 text-lg text-[#6d6d6d]">
              {business.category}
            </p>

            <p className="mt-5 max-w-xl text-base leading-8 text-[#6d6d6d]">
              {business.description}
            </p>

            <div className="mt-8 grid gap-3 sm:max-w-md">
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

          <div className="rounded-[2rem] bg-[#e9dfd0] p-4">
            <div className="flex aspect-[4/5] items-end rounded-[1.5rem] bg-gradient-to-br from-[#d9cfc1] to-[#f7f1e8] p-6">
              <div>
                <p className="text-sm uppercase tracking-[0.25em] text-[#867b6d]">
                  Estética
                </p>
                <h2 className="mt-2 text-3xl font-bold">
                  Tu momento de cuidado
                </h2>
              </div>
            </div>
          </div>
        </section>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-12 md:px-10">
        <div className="mb-6">
          <p className="text-sm uppercase tracking-[0.25em] text-[#867b6d]">
            Galería
          </p>
          <h2 className="mt-2 text-3xl font-bold md:text-4xl">
            Trabajos recientes
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
          {galleryItems.map((item) => (
            <div
              key={item}
              className="flex aspect-square items-end rounded-[2rem] bg-[#e9dfd0] p-4"
            >
              <span className="rounded-full bg-white/80 px-4 py-2 text-sm font-semibold">
                {item}
              </span>
            </div>
          ))}
        </div>
      </section>

      <section id="services" className="mx-auto max-w-6xl px-5 py-12 md:px-10">
        <div className="mb-6">
          <p className="text-sm uppercase tracking-[0.25em] text-[#867b6d]">
            Servicios
          </p>
          <h2 className="mt-2 text-3xl font-bold md:text-4xl">
            Elegí tu próximo turno
          </h2>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {business.services.map((service) => (
            <article
              key={service.id}
              className="rounded-[2rem] bg-white p-6 shadow-sm"
            >
              <h3 className="text-2xl font-bold">{service.name}</h3>

              <p className="mt-3 text-[#6d6d6d]">
                Duración: {service.duration} minutos
              </p>

              <p className="mt-5 text-3xl font-bold">
                ${service.price.toLocaleString("es-AR")}
              </p>

              <a
                href="#"
                className="mt-6 block rounded-2xl bg-[#1f1f1f] px-5 py-4 text-center font-semibold text-white"
              >
                Reservar
              </a>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}