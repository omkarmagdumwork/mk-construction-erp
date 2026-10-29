// Edit this file to change the website content.
export const company = {
  name: "MK Construction & Builders",
  phone: "[Phone number]",
  email: "[Email address]",
  address: "[Company address]",
};

// REPLACE with your real numbers
export const stats = [
  { label: "Projects Completed", value: 100 },
  { label: "Years of Experience", value: 10 },
  { label: "Happy Clients", value: 80 },
];

export const services = [
  {
    title: "Residential",
    text: "Homes, bungalows and apartments built to last.",
  },
  {
    title: "Commercial",
    text: "Offices, shops and complexes for your business.",
  },
  {
    title: "Renovation",
    text: "Give your existing building a fresh new life.",
  },
  { title: "Interior", text: "Smart, modern interiors designed around you." },
];

// image = file name inside public/images (a .jpg is used first, .svg is the fallback)
// export const projects = [
//   { title: "Residential Project", meta: "[PUNE] · [00] sq ft", image: "p" },
//   { title: "Commercial Complex", meta: "[City] · [00] floors", image: "project-2" },
//   { title: "Renovation Work", meta: "[City] · [00] sq ft", image: "project-3" },
// ];
export const projects = [
  {
    title: "Residential Project",
    meta: "[PUNE] · [5000] sq ft",
    image: "p",
    video: "p",
  },
  {
    title: "Commercial Complex",
    meta: "[PUNE] · [00] floors",
    image: "p1",
    video: "p1",
  },
  {
    title: "Renovation Work",
    meta: "[PUNE] · [00] sq ft",
    image: "p3",
    video: "p3",
  },
  {
    title: "Renovation Work",
    meta: "[PUNE] · [00] sq ft",
    image: "p4",
    video: "p4",
  },
  {
    title: "Renovation Work",
    meta: "[PUNE] · [00] sq ft",
    image: "p5",
    video: "p5",
  },
];

// Team section content. Put your group photo at public/images/team.png (or team.jpg)
export const team = {
  title: "Meet Our Team",
  intro: "The people behind every MK Construction project.",
  heading: "The Team Behind Your Project",
  paragraphs: [
    "Every building we deliver is the result of a team that works together on site, every single day. Our engineers, supervisors and skilled workers share one goal: quality construction delivered on time.",
    "From the first site visit to the final handover, you deal with people who know your project and care about the result.",
  ],
  highlights: [
    {
      title: "Engineers",
      text: "Planning, design checks and quality control.",
    },
    {
      title: "Site Supervisors",
      text: "Daily supervision and on-time progress.",
    },
    {
      title: "Skilled Workers",
      text: "Experienced masons, electricians and plumbers.",
    },
  ],
};

// image = path inside public/images, without ".png"  ->  public/images/r/r(1).png
export const reviews = Array.from({ length: 30 }, (_, i) => ({
  name: "[Customer Name]",
  location: "[City]",
  text: "[Write the real customer review here]",
  image: `r/r (${i + 1})`,
}));