import Link from "next/link";
import StoryboardBoard from "../../components/works/StoryboardBoard";
import { sanityFetch } from "../../sanity/lib/client";
import { PROJECTS_QUERY, SITE_SETTINGS_QUERY } from "../../sanity/lib/queries";
import type { ProjectListItem, SiteSettings } from "../../sanity/lib/types";

function pad(value: number) {
  return String(value).padStart(2, "0");
}

type NormalizedProject = ProjectListItem & {
  boardPage: number;
  boardOrder: number;
};

function normalizeArchiveProjects(projects: ProjectListItem[]): NormalizedProject[] {
  const pages = new Map<number, ProjectListItem[]>();

  for (const project of projects) {
    const page = project.boardPage ?? 1;

    if (!pages.has(page)) {
      pages.set(page, []);
    }

    pages.get(page)!.push(project);
  }

  const normalized: NormalizedProject[] = [];

  for (const [page, items] of [...pages.entries()].sort((a, b) => a[0] - b[0])) {
    const used = new Set<number>();

    const sortedItems = [...items].sort((a, b) => {
      const aOrder = a.boardOrder ?? Number.MAX_SAFE_INTEGER;
      const bOrder = b.boardOrder ?? Number.MAX_SAFE_INTEGER;
      return aOrder - bOrder;
    });

    for (const item of sortedItems) {
      let slot = item.boardOrder ?? 0;

      if (!slot || slot < 1 || used.has(slot)) {
        slot = 1;
        while (used.has(slot)) {
          slot += 1;
        }
      }

      used.add(slot);

      normalized.push({
        ...item,
        boardPage: page,
        boardOrder: slot,
      });
    }
  }

  return normalized.sort(
    (a, b) =>
      a.boardPage - b.boardPage ||
      a.boardOrder - b.boardOrder
  );
}

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function WorksPage() {
  const [rawProjects, siteSettings] = await Promise.all([
    sanityFetch<ProjectListItem[]>({
      query: PROJECTS_QUERY,
      revalidate: 0,
    }),
    sanityFetch<SiteSettings>({
      query: SITE_SETTINGS_QUERY,
      revalidate: 0,
    }),
  ]);

  const projects = normalizeArchiveProjects(rawProjects || []);
  const boardPages = Array.from(
    new Set<number>(projects.map((project) => project.boardPage))
  ).sort((a, b) => a - b);

  const totalProjects = projects.length;

  const copy = {
    pageLabel: siteSettings?.worksPage?.pageLabel || "Works Archive",
    pageIntro:
      siteSettings?.worksPage?.pageIntro ||
      "A storyboard-style archive where finished chapters occupy frames and the remaining slots stay open for future work.",
    title:
      siteSettings?.worksPage?.title ||
      "A cinematic wall of frames instead of a grid of cards.",
    description:
      siteSettings?.worksPage?.description ||
      "This page is designed as a production-board archive. Each published project fills a frame in sequence.",
    statsBoardsLabel: siteSettings?.worksPage?.statsBoardsLabel || "Boards",
    statsPublishedLabel:
      siteSettings?.worksPage?.statsPublishedLabel || "Published Chapters",
    statsNavigationLabel:
      siteSettings?.worksPage?.statsNavigationLabel || "Navigation",
    statsNavigationValue:
      siteSettings?.worksPage?.statsNavigationValue || "Frame → Case Study",
    boardEyebrow: siteSettings?.worksPage?.boardEyebrow || "Board",
    boardDescription:
      siteSettings?.worksPage?.boardDescription ||
      "A storyboard sheet that fills as more projects are published.",
    boardSheetTypeLabel:
      siteSettings?.worksPage?.boardSheetTypeLabel || "Sheet Type",
    boardSheetTypeValue:
      siteSettings?.worksPage?.boardSheetTypeValue || "Storyboard Archive",
    boardLoadedFramesLabel:
      siteSettings?.worksPage?.boardLoadedFramesLabel || "Loaded Frames",
    boardStatusLabel:
      siteSettings?.worksPage?.boardStatusLabel || "Status",
    boardStatusValue:
      siteSettings?.worksPage?.boardStatusValue || "Active Sheet",
    boardNextFillLabel:
      siteSettings?.worksPage?.boardNextFillLabel || "Next Fill",
    boardStorySheetLabel:
      siteSettings?.worksPage?.boardStorySheetLabel || "Story Sheet",
    boardClickHint:
      siteSettings?.worksPage?.boardClickHint ||
      "Click a filled frame to open its case study",
    boardEmptyFrameLabel:
      siteSettings?.worksPage?.boardEmptyFrameLabel || "Empty Frame",
    boardEmptyFrameDescription:
      siteSettings?.worksPage?.boardEmptyFrameDescription ||
      "Awaiting the next published chapter.",
    boardStoryFrameLabel:
      siteSettings?.worksPage?.boardStoryFrameLabel || "Story Frame",
    boardOpenCaseStudyLabel:
      siteSettings?.worksPage?.boardOpenCaseStudyLabel || "Open Case Study",
  };

  function getProjectsForBoard(boardPage: number): NormalizedProject[] {
    return projects.filter((project) => project.boardPage === boardPage);
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <section className="border-b border-white/10 px-5 pb-8 pt-6 sm:px-8">
        <div className="mx-auto max-w-[1500px]">
          <div className="flex items-center justify-between gap-4 text-[11px] uppercase tracking-[0.28em] text-zinc-400">
            <Link
              href="/"
              className="rounded-full border border-white/10 px-3 py-2 transition hover:border-white/30 hover:text-white"
            >
              Back to Home
            </Link>

            <span>{copy.pageLabel} / Story Sheets</span>
          </div>
        </div>
      </section>

      <section className="px-5 py-12 sm:px-8">
        <div className="mx-auto max-w-[1500px] space-y-14">
          <div className="grid gap-8 xl:grid-cols-[0.5fr_1.5fr] xl:items-end">
            <div className="space-y-4">
              <p className="text-[11px] uppercase tracking-[0.32em] text-zinc-500">
                {copy.pageLabel}
              </p>
              <div className="h-px w-20 bg-white/15" />
              <p className="max-w-sm text-sm leading-7 text-zinc-500">
                {copy.pageIntro}
              </p>

              <div className="flex flex-wrap gap-3 pt-3">
                {boardPages.map((boardPage) => (
                  <a
                    key={boardPage}
                    href={`#board-${pad(boardPage)}`}
                    className="rounded-full border border-white/10 px-4 py-2 text-[11px] uppercase tracking-[0.24em] text-zinc-300 transition hover:border-white/30 hover:text-white"
                  >
                    Board {pad(boardPage)}
                  </a>
                ))}
              </div>
            </div>

            <div className="space-y-5">
              <h1 className="max-w-[13ch] text-5xl font-semibold leading-[0.92] sm:text-6xl">
                {copy.title}
              </h1>

              <p className="max-w-3xl text-sm leading-8 text-zinc-300 sm:text-base">
                {copy.description}
              </p>

              <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                  <p className="text-[11px] uppercase tracking-[0.28em] text-zinc-500">
                    {copy.statsBoardsLabel}
                  </p>
                  <p className="mt-3 text-base text-zinc-200">
                    {pad(boardPages.length)}
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                  <p className="text-[11px] uppercase tracking-[0.28em] text-zinc-500">
                    {copy.statsPublishedLabel}
                  </p>
                  <p className="mt-3 text-base text-zinc-200">
                    {pad(totalProjects)}
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                  <p className="text-[11px] uppercase tracking-[0.28em] text-zinc-500">
                    {copy.statsNavigationLabel}
                  </p>
                  <p className="mt-3 text-base text-zinc-200">
                    {copy.statsNavigationValue}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-12">
            {boardPages.map((boardPage) => (
              <StoryboardBoard
                key={boardPage}
                boardPage={boardPage}
                entries={getProjectsForBoard(boardPage)}
                copy={{
                  eyebrow: `${copy.boardEyebrow} ${pad(boardPage)}`,
                  description: copy.boardDescription,
                  sheetTypeLabel: copy.boardSheetTypeLabel,
                  sheetTypeValue: copy.boardSheetTypeValue,
                  loadedFramesLabel: copy.boardLoadedFramesLabel,
                  statusLabel: copy.boardStatusLabel,
                  statusValue: copy.boardStatusValue,
                  nextFillLabel: copy.boardNextFillLabel,
                  storySheetLabel: copy.boardStorySheetLabel,
                  clickHint: copy.boardClickHint,
                  emptyFrameLabel: copy.boardEmptyFrameLabel,
                  emptyFrameDescription: copy.boardEmptyFrameDescription,
                  storyFrameLabel: copy.boardStoryFrameLabel,
                  openCaseStudyLabel: copy.boardOpenCaseStudyLabel,
                }}
              />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}