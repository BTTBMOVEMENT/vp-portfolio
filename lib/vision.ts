export type VisionEntry = {
  id: string;
  title: string;
  image: string;
  alt: string;
  year: string;
  tags: string[];
  note?: string;
};

export const visionEntries: VisionEntry[] = [
  {
    id: "vision-001",
    title: "Threshold Light",
    image: "/images/projects/jesus-is-christ-cover.jpg",
    alt: "My Vision image 001",
    year: "2026",
    tags: ["Night", "Contrast", "Threshold"],
    note:
      "A frame about distance and restraint. The image works because it does not explain itself too quickly.",
  },
  {
    id: "vision-002",
    title: "Parallax Memory",
    image: "/images/projects/the-king-of-kings-cover.jpg",
    alt: "My Vision image 002",
    year: "2026",
    tags: ["Parallax", "Depth", "Stillness"],
    note:
      "The eye lands on the image because the background remains disciplined. Space is felt before it is described.",
  },
  {
    id: "vision-003",
    title: "Quiet Witness",
    image: "/images/projects/trinity-cover.jpg",
    alt: "My Vision image 003",
    year: "2026",
    tags: ["Documentary", "Calm", "Portrait"],
  },
  {
    id: "vision-004",
    title: "Afterimage",
    image: "/images/projects/jesus-is-christ-cover.jpg",
    alt: "My Vision image 004",
    year: "2026",
    tags: ["Shadow", "Afterglow", "Shape"],
    note:
      "I am interested in the moment when the image feels remembered rather than merely seen.",
  },
  {
    id: "vision-005",
    title: "Surface Tension",
    image: "/images/projects/the-king-of-kings-cover.jpg",
    alt: "My Vision image 005",
    year: "2027",
    tags: ["Texture", "Surface", "Atmosphere"],
  },
  {
    id: "vision-006",
    title: "Held Frame",
    image: "/images/projects/trinity-cover.jpg",
    alt: "My Vision image 006",
    year: "2027",
    tags: ["Frame", "Balance", "Stillness"],
    note:
      "The image does not need spectacle if the frame knows exactly where its weight belongs.",
  },
  {
    id: "vision-007",
    title: "Edge of the Set",
    image: "/images/projects/jesus-is-christ-cover.jpg",
    alt: "My Vision image 007",
    year: "2027",
    tags: ["Set", "Edge", "Control"],
  },
  {
    id: "vision-008",
    title: "Signal and Fog",
    image: "/images/projects/the-king-of-kings-cover.jpg",
    alt: "My Vision image 008",
    year: "2027",
    tags: ["Signal", "Fog", "Transition"],
    note:
      "When contrast is low, hierarchy matters even more. Without hierarchy, atmosphere becomes noise.",
  },
  {
    id: "vision-009",
    title: "Document of Light",
    image: "/images/projects/trinity-cover.jpg",
    alt: "My Vision image 009",
    year: "2027",
    tags: ["Observation", "Light", "Document"],
  },
  {
    id: "vision-010",
    title: "Drift Line",
    image: "/images/projects/jesus-is-christ-cover.jpg",
    alt: "My Vision image 010",
    year: "2027",
    tags: ["Drift", "Line", "Motion"],
    note:
      "A useful image is often one that keeps moving after the screen itself has stopped.",
  },
  {
    id: "vision-011",
    title: "Invisible Axis",
    image: "/images/projects/the-king-of-kings-cover.jpg",
    alt: "My Vision image 011",
    year: "2027",
    tags: ["Axis", "Composition", "Control"],
  },
  {
    id: "vision-012",
    title: "Last Reflection",
    image: "/images/projects/trinity-cover.jpg",
    alt: "My Vision image 012",
    year: "2027",
    tags: ["Reflection", "Ending", "Memory"],
    note:
      "The frame should feel like it belongs to a longer sequence, even when it stands alone.",
  },
];