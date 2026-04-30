import Link from "next/link";
import StoryboardBoard from "../../components/works/StoryboardBoard";
import { sanityFetch } from "../../sanity/lib/client";
import { PROJECTS_QUERY } from "../../sanity/lib/queries";

function pad(value: number) {
  return String(value).padStart(2, "0");
}

export const revalidate = 0;

export default async function WorksPage() {
  const projects =
    (await sanityFetch({
      query: PROJECTS_QUERY,
      revalidate: 0,
    })) || [];

  const boardPages = Array.from(
    new Set((projects || []).map((project: any) => project.boardPage || 1))
  ).sort((a: number, b: number) => a - b);

  const totalProjects = projects.length;

  function getProjectsForBoard(boardPage: number) {
    return projects
      .filter((project: any) => (project.boardPage || 1) === boardPage)
      .sort((a: any, b: any) => (a.boardOrder || 9999) - (b.boardOrder || 9999));
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

            <span>Works Archive / Story Sheets</span>
          </div>
        </div>
      </section>

      <section className="px-5 py-12 sm:px-8">
        <div className="mx-auto max-w-[1500px] space-y-14">
          <div className="grid gap-8 xl:grid-cols-[0.5fr_1.5fr] xl:items-end">
            <div className="space-y-4">
              <p className="text-[11px] uppercase tracking-[0.32em] text-zinc-500">
                Works Archive
              </p>
              <div className="h-px w-20 bg-white/15" />
              <p className="max-w-sm text-sm leading-7 text-zinc-500">
                A storyboard-style archive where finished chapters occupy frames
                and the remaining slots stay open for future work.
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
                A cinematic wall of frames instead of a grid of cards.
              </h1>

              <p className="max-w-3xl text-sm leading-8 text-zinc-300 sm:text-base">
                This page is designed as a production-board archive. Each published
                project fills a frame in sequence. As the body of work grows, new
                story sheets appear and empty frames gradually become chapters.
              </p>

              <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                  <p className="text-[11px] uppercase tracking-[0.28em] text-zinc-500">
                    Boards
                  </p>
                  <p className="mt-3 text-base text-zinc-200">
                    {pad(boardPages.length)}
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                  <p className="text-[11px] uppercase tracking-[0.28em] text-zinc-500">
                    Published Chapters
                  </p>
                  <p className="mt-3 text-base text-zinc-200">
                    {pad(totalProjects)}
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                  <p className="text-[11px] uppercase tracking-[0.28em] text-zinc-500">
                    Navigation
                  </p>
                  <p className="mt-3 text-base text-zinc-200">
                    Frame → Case Study
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
              />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}