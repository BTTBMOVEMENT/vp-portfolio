export type JournalKind = "essay" | "note" | "photo" | "video";

export type JournalEntry = {
  slug: string;
  kind: JournalKind;
  title: string;
  excerpt: string;
  publishedAt: string;
  readTime: string;
  coverImage: string;
  coverAlt: string;
  tags: string[];
  intro: string;
  body: string[];
  sideNotes: string[];
};

export const journalEntries: JournalEntry[] = [
  {
    slug: "vp-test-log-001",
    kind: "note",
    title: "VP Test Log 001",
    excerpt:
      "A first field note on how small visual decisions affect perceived scale inside a virtual production test.",
    publishedAt: "2026-04-28",
    readTime: "4 min",
    coverImage: "/images/projects/jesus-is-christ-cover.jpg",
    coverAlt: "Journal cover for VP Test Log 001",
    tags: ["Virtual Production", "Testing", "Workflow"],
    intro:
      "This note documents an early round of visual tests where the priority was not spectacle, but control. The question was how much of the final cinematic feeling could survive once the setup moved into a more technical VP environment.",
    body: [
      "The first lesson was that scale breaks quickly when too many variables are introduced at once. The most effective images came from reducing the number of competing ideas inside the frame and instead choosing one clear relationship between subject, light, and virtual space.",
      "A second lesson was that camera intention has to be protected much earlier than expected. If the camera logic is vague during testing, the technical side becomes louder than the image itself. That creates a result that may be functional, but does not feel authored.",
      "For future tests, the working principle will stay simple: reduce noise, strengthen contrast, and always judge the setup by what the final frame feels like rather than by how impressive the setup sounds on paper.",
    ],
    sideNotes: [
      "Keep test variables narrow.",
      "Evaluate image language before expanding complexity.",
      "Favor authored framing over technical novelty.",
    ],
  },
  {
    slug: "image-language-and-separation",
    kind: "essay",
    title: "Image Language and Separation",
    excerpt:
      "A short essay on how contrast, distance, and subject hierarchy shape whether a frame feels cinematic or merely descriptive.",
    publishedAt: "2026-04-22",
    readTime: "6 min",
    coverImage: "/images/projects/the-king-of-kings-cover.jpg",
    coverAlt: "Journal cover for Image Language and Separation",
    tags: ["Cinematography", "Lighting", "Composition"],
    intro:
      "When a frame does not feel cinematic, the problem is often not a lack of equipment or production value. More often, it is a lack of separation: visual, tonal, emotional, or spatial.",
    body: [
      "Separation is one of the quickest ways to turn a flat image into one with intention. It does not only mean making the subject brighter. It can also mean reducing competition, simplifying the background, or deciding that one element deserves to dominate the frame.",
      "In practice, good separation is often the result of restraint. Instead of adding more atmosphere, more motion, or more visual layers, the stronger choice may be to remove distractions until the frame has a single readable purpose.",
      "This is one reason virtual production and cinematography must be discussed together. The environment may be digital, but the frame still needs to obey the same discipline of visual hierarchy. If the eye does not know where to land, the technology will not save the image.",
    ],
    sideNotes: [
      "Separation is not only about brightness.",
      "Simplification is often more cinematic than addition.",
      "Hierarchy matters more than complexity.",
    ],
  },
  {
    slug: "building-a-mobile-first-showcase",
    kind: "photo",
    title: "Building a Mobile-First Showcase",
    excerpt:
      "Notes on why a portfolio should be designed for vertical viewing first, especially when the first audience contact happens on a phone.",
    publishedAt: "2026-04-18",
    readTime: "5 min",
    coverImage: "/images/projects/trinity-cover.jpg",
    coverAlt: "Journal cover for Building a Mobile-First Showcase",
    tags: ["Web", "Portfolio", "Mobile First"],
    intro:
      "A portfolio link is often opened on a phone before it is ever seen on a desktop. That changes what should be considered the primary stage for first impression.",
    body: [
      "Designing for mobile first does not mean shrinking a desktop layout. It means deciding that vertical rhythm, thumb-driven scrolling, and quick visual impact are the real front door of the experience.",
      "For image-based creative work, this is especially important. A mobile-first portfolio can feel more cinematic when the transitions are controlled, the text is sparse, and the visual rhythm is designed like a sequence rather than a document.",
      "The challenge is to make the site feel intentional rather than merely responsive. That means large type, disciplined spacing, and visual sections that read as chapters instead of content blocks.",
    ],
    sideNotes: [
      "Vertical rhythm matters more than dense information.",
      "Mobile should feel authored, not compressed.",
      "Sequence beats clutter.",
    ],
  },
];

export function getJournalEntryBySlug(slug: string) {
  return journalEntries.find((entry) => entry.slug === slug);
}

export function formatJournalDate(date: string) {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeZone: "UTC",
  }).format(new Date(date));
}