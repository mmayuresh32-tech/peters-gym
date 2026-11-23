/**
 * ============================================================
 *  PETER'S GYM — EDITABLE SITE CONFIG
 *  Replace every placeholder below with real details.
 * ============================================================
 */
export const CONFIG = {
  brand: "Peter's Gym",
  // Digits only, international format, no "+" (used for wa.me link)
  whatsappNumber: "0000000000",
  // Displayed phone + tel: value
  phoneDisplay: "+00 00000 00000",
  phoneTel: "+0000000000",
  instagramHandle: "@petersgym",
  instagramUrl: "https://www.instagram.com/petersgym",
  email: "hello@petersgym.com",
  addressLines: ["Street address placeholder", "City, State — PIN / ZIP"],
  // Used for the embedded map + directions button
  mapQuery: "Peter's Gym",
  hours: [
    { day: "Monday — Friday", time: "00:00 — 00:00" },
    { day: "Saturday", time: "00:00 — 00:00" },
    { day: "Sunday", time: "00:00 — 00:00" },
  ],
};

export const whatsappLink = (message = "Hi Peter's Gym! I'd like to know more about joining.") =>
  `https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(message)}`;

export const telLink = `tel:${CONFIG.phoneTel}`;

// Exact Google Maps location shared by the gym owner.
export const directionsLink = "https://maps.app.goo.gl/3i7muYFV81WsGoCU7";

// Use the same location link in the embedded map panel.
export const mapEmbedSrc = directionsLink;

/** Stock photography (Pexels) — sized on demand. */
export const px = (id: number, w = 1400, h?: number) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=${w}${
    h ? `&h=${h}` : ""
  }`;

export const IMG = {
  heroBg: 19132573,
  aboutMain: 40371848,
  aboutSecond: 3888405,
  aboutThird: 4464780,
  motivation: 29825227,
  contactBg: 4162478,
};

export const NAV = [
  { label: "About", id: "about" },
  { label: "Equipment", id: "equipment" },
  { label: "Zones", id: "zones" },
  { label: "Why Us", id: "why" },
  { label: "Membership", id: "membership" },
  { label: "Contact", id: "contact" },
];

export const EQUIPMENT = [
  {
    no: "01",
    name: "Strength Training Machines",
    short: "Selectorized & plate-loaded power.",
    desc: "Smooth, guided resistance machines engineered for controlled, progressive overload — ideal for building a base or pushing past a plateau.",
    tags: ["Back", "Arms", "Full body"],
    img: 4464780,
  },
  {
    no: "02",
    name: "Chest & Shoulder Machines",
    short: "Press, fly and sculpt the upper body.",
    desc: "Chest presses, pec decks and shoulder presses with ergonomic seats and adjustable ranges, so every rep tracks the way your body moves.",
    tags: ["Chest", "Shoulders", "Triceps"],
    img: 3838937,
  },
  {
    no: "03",
    name: "Leg Press & Lower Body",
    short: "Heavy foundations, built from the ground up.",
    desc: "Leg press, extension and curl stations plus lower-body specialty gear to build serious drive, stability and raw leg strength.",
    tags: ["Quads", "Hamstrings", "Glutes"],
    img: 19254709,
  },
  {
    no: "04",
    name: "Cable Machines",
    short: "Limitless angles. Constant tension.",
    desc: "Dual-stack crossovers and pulldown stations offering fully adjustable pulleys for isolation work, mobility and finishing sets.",
    tags: ["Lats", "Chest", "Core"],
    img: 5327505,
  },
  {
    no: "05",
    name: "Free Weights",
    short: "Barbells, dumbbells and honest iron.",
    desc: "Racks of dumbbells, barbells, benches and plates on a spacious floor — the classic tools for raw strength and athletic power.",
    tags: ["Compound", "Power", "Hypertrophy"],
    img: 19025674,
  },
  {
    no: "06",
    name: "Cardio Equipment",
    short: "Engine work for every fitness level.",
    desc: "A full line of treadmills, bikes and cross-trainers to warm up, burn through conditioning and build lasting endurance.",
    tags: ["Endurance", "Fat loss", "Heart"],
    img: 12250460,
  },
];

export const ZONES = [
  {
    no: "01",
    name: "Strength Zone",
    line: "Where the heavy work happens.",
    desc: "Rows of precision-engineered machines for every muscle group, laid out so you can move through your session without waiting or wandering.",
    tags: ["Machines", "Progressive overload", "Guided movement"],
    img: 40371838,
  },
  {
    no: "02",
    name: "Free Weights Area",
    line: "Raw iron. Pure intent.",
    desc: "Dumbbells, barbells, racks and benches with room to breathe. This is the heart of the floor for lifters who like it honest.",
    tags: ["Dumbbells", "Barbells", "Racks"],
    img: 4164763,
  },
  {
    no: "03",
    name: "Cardio Zone",
    line: "Build the engine.",
    desc: "A dedicated cardio floor with modern treadmills and conditioning machines — light, energetic and made for long, strong efforts.",
    tags: ["Treadmills", "Conditioning", "Endurance"],
    img: 20418606,
  },
  {
    no: "04",
    name: "Functional Training",
    line: "Move better. Move harder.",
    desc: "Open space for ropes, kettlebells and bodyweight circuits. Train athletic movement patterns, mobility and total-body conditioning.",
    tags: ["Battle ropes", "Kettlebells", "Circuits"],
    img: 7187951,
  },
  {
    no: "05",
    name: "Personal Training",
    line: "Your goals. Guided.",
    desc: "One-to-one attention to perfect your form, structure your plan and keep you accountable — whether it's your first week or your fiftieth.",
    tags: ["1-on-1", "Form coaching", "Programming"],
    img: 30428668,
  },
];

export const WHY = [
  {
    title: "Advanced fitness machines",
    desc: "Modern, well-maintained equipment that moves the way your body does.",
  },
  {
    title: "Well-developed workout facility",
    desc: "A complete, thoughtfully built training space — nothing missing, nothing wasted.",
  },
  {
    title: "Spacious training environment",
    desc: "Room to move, lift and breathe. Zones that never feel crowded or cramped.",
  },
  {
    title: "Equipment for every muscle group",
    desc: "Chest to calves, upper to lower — complete coverage for balanced progress.",
  },
  {
    title: "Supportive fitness atmosphere",
    desc: "A motivating, respectful community that pushes you without judgement.",
  },
  {
    title: "Beginners to experienced members",
    desc: "Day-one friendly and challenging enough for seasoned athletes.",
  },
];

export const PLANS = [
  { name: "Monthly", term: "1 Month", note: "Try the floor. Feel the difference." },
  { name: "Quarterly", term: "3 Months", note: "Long enough to see real change." },
  { name: "Half-Yearly", term: "6 Months", note: "Commit to a serious transformation." },
  { name: "Annual", term: "12 Months", note: "The full year. The full result.", featured: true },
];

/** Replace with real pricing whenever you're ready. */
export const PLAN_PRICE_PLACEHOLDER = "XXX";
