export type Project = {
  slug: string;
  number: string;
  title: string;
  year: string;
  role: string;
  description: string;
  image: string;
  alt: string;
  format: string;
  pipeline: string;
  tools: string[];
  overview: string;
  contribution: string;
  approach: string;
  highlights: string[];
};

export const projects: Project[] = [
  {
    slug: "jesus-is-christ",
    number: "01",
    title: "Jesus is Christ",
    year: "2026",
    role: "Virtual Production, Fake Documentary / DP",
    description:
      "Greenscreen Virtual Production with In-Camera VFX test project.",
    image: "/images/projects/jesus-is-christ-cover.jpg",
    alt: "Cover still for Jesus is Christ",
    format: "Test Film",
    pipeline: "Greenscreen · In-Camera VFX",
    tools: ["Unreal Engine", "Virtual Camera", "Lighting Test"],
    overview:
      "A test-driven project built to examine how a greenscreen workflow could transition into a stronger in-camera illusion. The focus was on building a believable frame language rather than only validating the technical setup.",
    contribution:
      "Led the cinematography direction while shaping how the virtual production workflow should support the visual goal. The emphasis was on frame composition, controlled light, and how camera choices would translate once the virtual background was introduced.",
    approach:
      "The project was treated as a proof-of-language exercise. Instead of overloading the test with too many variables, the frame design was narrowed to a small number of controlled decisions: separation, practical contrast, and camera movement that could still feel cinematic in a constrained setup.",
    highlights: [
      "Greenscreen-based virtual production test",
      "Built around in-camera VFX validation",
      "Focused on believable cinematic framing",
      "Explored light separation and camera control",
    ],
  },
  {
    slug: "the-king-of-kings",
    number: "02",
    title: "the King of kings",
    year: "2027",
    role: "Virtual Production, Cinematography / DP",
    description:
      "The first Virtual Production build with Unreal Engine, focused on translating previs into finished cinematic frames.",
    image: "/images/projects/the-king-of-kings-cover.jpg",
    alt: "Cover still for the King of kings",
    format: "VP Build",
    pipeline: "Previs · Unreal Engine",
    tools: ["Unreal Engine", "Lens Language", "Shot Planning"],
    overview:
      "This project centered on turning previs ideas into a visual pipeline that could hold up as a finished cinematic presentation. It was less about a single shot and more about proving that the visual language could survive the full VP workflow.",
    contribution:
      "Defined the cinematography approach and helped frame how Unreal-based previs should inform the final image. The project required balancing technical constraints with image clarity so the work would still feel authored instead of purely demonstrative.",
    approach:
      "The direction was to preserve intentionality from early previs through final composition. That meant choosing a limited visual vocabulary, testing how camera decisions translated across stages, and protecting the emotional tone of the frame while building the technical system underneath it.",
    highlights: [
      "First Unreal Engine-based VP build",
      "Previs-to-frame continuity",
      "Lens and shot-language testing",
      "Focused on cinematic readability",
    ],
  },
  {
    slug: "trinity",
    number: "03",
    title: "Trinity",
    year: "2027",
    role: "Documentary / DP",
    description:
      "A documentary-driven project framed as a clean case-study preview with stronger editorial presentation.",
    image: "/images/projects/trinity-cover.jpg",
    alt: "Cover still for Trinity",
    format: "Documentary",
    pipeline: "Visual Development · Case Study",
    tools: ["Documentary", "Camera Blocking", "Visual Storytelling"],
    overview:
      "Trinity is positioned differently from the VP-heavy work. Its strength is not technical spectacle, but clarity of subject, image discipline, and documentary framing that can still sit inside a highly designed portfolio system.",
    contribution:
      "Shaped the documentary image approach as director of photography, with particular attention to restraint, visual rhythm, and how the frame could remain emotionally grounded while still feeling deliberate and polished.",
    approach:
      "The page should present the project as a calm but authoritative chapter. Instead of leaning on heavy interface effects, the structure highlights stillness, hierarchy, and the discipline of making a documentary image feel intentional without over-designing it.",
    highlights: [
      "Documentary-led cinematography",
      "Editorial case-study framing",
      "Focused on clarity and restraint",
      "Built for strong still-image presentation",
    ],
  },
];

export function getProjectBySlug(slug: string) {
  return projects.find((project) => project.slug === slug);
}