export type ProjectFrame = {
  label: string;
  caption: string;
  image: string;
  alt: string;
};

export type ProjectNote = {
  title: string;
  body: string;
};

export type ProjectCredit = {
  label: string;
  value: string;
};

export type ProjectBoardSize = "frame" | "wide";

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
  quote: string;
  frameStudy: ProjectFrame[];
  processNotes: ProjectNote[];
  credits: ProjectCredit[];
  boardPage: number;
  boardOrder: number;
  boardLabel: string;
  boardCaption: string;
  boardSize: ProjectBoardSize;
};

export const BOARD_SLOTS_PER_PAGE = 12;

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
    quote:
      "The goal was not simply to prove that the workflow functioned, but that the image could still feel authored, restrained, and cinematic inside a technical test.",
    frameStudy: [
      {
        label: "Frame Study 01",
        caption: "Initial image language and subject separation.",
        image: "/images/projects/jesus-is-christ-cover.jpg",
        alt: "Frame study 01 for Jesus is Christ",
      },
      {
        label: "Frame Study 02",
        caption: "Lighting control and foreground-background balance.",
        image: "/images/projects/jesus-is-christ-cover.jpg",
        alt: "Frame study 02 for Jesus is Christ",
      },
      {
        label: "Frame Study 03",
        caption: "A wider frame intended to suggest the final cinematic direction.",
        image: "/images/projects/jesus-is-christ-cover.jpg",
        alt: "Frame study 03 for Jesus is Christ",
      },
    ],
    processNotes: [
      {
        title: "Visual Goal",
        body: "Create a frame language that still feels deliberate and cinematic inside a constrained technical test environment.",
      },
      {
        title: "Workflow Focus",
        body: "Reduce variables, preserve image clarity, and test how camera movement and separation survive the VP pipeline.",
      },
      {
        title: "Image Priority",
        body: "Favor control, restraint, and believable contrast over purely demonstrative technical spectacle.",
      },
    ],
    credits: [
      { label: "Role", value: "DP / VP Visual Direction" },
      { label: "Format", value: "Test Film" },
      { label: "Pipeline", value: "Greenscreen · In-Camera VFX" },
      { label: "Year", value: "2026" },
    ],
    boardPage: 1,
    boardOrder: 1,
    boardLabel: "A01",
    boardCaption: "Greenscreen VP Test",
    boardSize: "frame",
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
    quote:
      "The real challenge was not making previs look impressive, but making the finished frame carry the same intent without losing emotional clarity.",
    frameStudy: [
      {
        label: "Frame Study 01",
        caption: "Previs-to-frame continuity and visual rhythm.",
        image: "/images/projects/the-king-of-kings-cover.jpg",
        alt: "Frame study 01 for the King of kings",
      },
      {
        label: "Frame Study 02",
        caption: "Testing lens behavior and subject emphasis.",
        image: "/images/projects/the-king-of-kings-cover.jpg",
        alt: "Frame study 02 for the King of kings",
      },
      {
        label: "Frame Study 03",
        caption: "A broader composition used to test final image readability.",
        image: "/images/projects/the-king-of-kings-cover.jpg",
        alt: "Frame study 03 for the King of kings",
      },
    ],
    processNotes: [
      {
        title: "Visual Goal",
        body: "Preserve intention from previs through final frame without letting the pipeline flatten the image language.",
      },
      {
        title: "Workflow Focus",
        body: "Use Unreal and shot-planning as tools for consistency, not as a substitute for authored cinematography.",
      },
      {
        title: "Image Priority",
        body: "Maintain emotional readability and lens discipline while scaling the technical system underneath it.",
      },
    ],
    credits: [
      { label: "Role", value: "DP / VP Build" },
      { label: "Format", value: "VP Build" },
      { label: "Pipeline", value: "Previs · Unreal Engine" },
      { label: "Year", value: "2027" },
    ],
    boardPage: 1,
    boardOrder: 2,
    boardLabel: "A02",
    boardCaption: "Previs Translation",
    boardSize: "frame",
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
    quote:
      "The strength of the project comes from restraint: the image feels considered not because it is overloaded, but because every decision stays legible.",
    frameStudy: [
      {
        label: "Frame Study 01",
        caption: "Subject clarity and measured documentary framing.",
        image: "/images/projects/trinity-cover.jpg",
        alt: "Frame study 01 for Trinity",
      },
      {
        label: "Frame Study 02",
        caption: "Editorial stillness used as visual structure.",
        image: "/images/projects/trinity-cover.jpg",
        alt: "Frame study 02 for Trinity",
      },
      {
        label: "Frame Study 03",
        caption: "A wider composition preserving restraint and readability.",
        image: "/images/projects/trinity-cover.jpg",
        alt: "Frame study 03 for Trinity",
      },
    ],
    processNotes: [
      {
        title: "Visual Goal",
        body: "Keep the image emotionally grounded while preserving a polished editorial rhythm.",
      },
      {
        title: "Workflow Focus",
        body: "Use structure and hierarchy to elevate documentary material without forcing spectacle onto it.",
      },
      {
        title: "Image Priority",
        body: "Favor clarity, restraint, and compositional confidence over heavier interface-driven effects.",
      },
    ],
    credits: [
      { label: "Role", value: "DP" },
      { label: "Format", value: "Documentary" },
      { label: "Pipeline", value: "Visual Development · Case Study" },
      { label: "Year", value: "2027" },
    ],
    boardPage: 1,
    boardOrder: 3,
    boardLabel: "A03",
    boardCaption: "Documentary Chapter",
    boardSize: "frame",
  },
];

export function getProjectBySlug(slug: string) {
  return projects.find((project) => project.slug === slug);
}

export function getBoardPages() {
  const maxBoardPage = Math.max(1, ...projects.map((project) => project.boardPage));

  return Array.from({ length: maxBoardPage }, (_, index) => index + 1);
}

export function getProjectsForBoard(boardPage: number) {
  return projects
    .filter((project) => project.boardPage === boardPage)
    .sort((a, b) => a.boardOrder - b.boardOrder);
}