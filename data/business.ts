export const business = {
  name: "GlowStetic",

  whatsapp: "+5491112345678",

  services: [
    {
      id: 1,
      name: "Uñas semipermanentes",
      duration: 90,
      price: 12000,
    },

    {
      id: 2,
      name: "Kapping gel",
      duration: 120,
      price: 18000,
    },

    {
      id: 3,
      name: "Nail Art",
      duration: 60,
      price: 10000,
    },
  ],

  staff: [
  {
  id: 1,
  name: "Sofía",

  services: [1, 2],

  workingHours: {
    start: "09:00",
    end: "18:00",
  },
},

  {
  id: 2,
  name: "Camila",

  services: [2, 3],

  workingHours: {
    start: "10:00",
    end: "19:00",
  },
},
],
};