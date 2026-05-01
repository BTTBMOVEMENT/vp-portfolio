import Link from "next/link";
import type { ProjectListItem } from "../../sanity/lib/types";

const BOARD_SLOTS_PER_PAGE = 12;

function pad(value: number) {
  return String(value).padStart(2, "0");
}

type StoryboardBoardCopy = {
  eyebrow?: string;
  description?: string;
  sheetTypeLabel?: string;
  sheetTypeValue?: string;
  loadedFramesLabel?: string;
  statusLabel?: string;
  statusValue?: string;
  nextFillLabel?: string;
  storySheetLabel?: string;
  clickHint?: string;
  emptyFrameLabel?: string;
  emptyFrameDescription?: string;
  storyFrameLabel?: string;
  openCaseStudyLabel?: string;
};

type StoryboardBoardProps = {
  boardPage: number;
  entries: ProjectListItem[];
  copy?: StoryboardBoardCopy;
};

export default function StoryboardBoard({
  boardPage,
  entries,
  copy,
}: StoryboardBoardProps) {
  const slotMap = new Map(entries.map((entry) => [entry.boardOrder || 0, entry]));
  const slots = Array.from({ length: BOARD_SLOTS_PER_PAGE }, (_, index) => index + 1);
  const filledCount = entries.length;

  return (
    <section id={`board-${pad(boardPage)}`} className="scroll-mt-24">
      <div className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.015))] p-4 sm:p-6 lg:p-8">
        <div className="pointer-events-none absolute right-4 top-0 select-none text-[7rem] font-semibold leading-none tracking-[-0.08em] text-white/[0.04] sm:text-[9rem] lg:text-[11rem]">
          {pad(boardPage)}
        </div>

        <div className="mb-8 grid gap-6 lg:grid-cols-[0.42fr_1.58fr] lg:items-end">
          <div className="space-y-3">
            <p className="text-[11px] uppercase tracking-[0.32em] text-zinc-500">
              {copy?.eyebrow || `Board ${pad(boardPage)}`}
            </p>
            <div className="h-px w-20 bg-white/15" />
            <p className="max-w-sm text-sm leading-7 text-zinc-400">
              {copy?.description || "A storyboard sheet that fills as more projects are published."}
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
              <p className="text-[11px] uppercase tracking-[0.28em] text-zinc-500">
                {copy?.sheetTypeLabel || "Sheet Type"}
              </p>
              <p className="mt-3 text-base text-zinc-200">
                {copy?.sheetTypeValue || "Storyboard Archive"}
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
              <p className="text-[11px] uppercase tracking-[0.28em] text-zinc-500">
                {copy?.loadedFramesLabel || "Loaded Frames"}
              </p>
              <p className="mt-3 text-base text-zinc-200">
                {pad(filledCount)} / {pad(BOARD_SLOTS_PER_PAGE)}
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
              <p className="text-[11px] uppercase tracking-[0.28em] text-zinc-500">
                {copy?.statusLabel || "Status"}
              </p>
              <p className="mt-3 text-base text-zinc-200">
                {copy?.statusValue || "Active Sheet"}
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
              <p className="text-[11px] uppercase tracking-[0.28em] text-zinc-500">
                {copy?.nextFillLabel || "Next Fill"}
              </p>
              <p className="mt-3 text-base text-zinc-200">
                Slot {pad(filledCount + 1 <= BOARD_SLOTS_PER_PAGE ? filledCount + 1 : BOARD_SLOTS_PER_PAGE)}
              </p>
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-black/40 p-4 sm:p-5 lg:p-6">
          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap items-center gap-3 text-[11px] uppercase tracking-[0.24em] text-zinc-500">
              <span>{copy?.storySheetLabel || "Story Sheet"}</span>
              <span>Board {pad(boardPage)}</span>
              <span>{pad(filledCount)} Frames Loaded</span>
            </div>

            <div className="text-[11px] uppercase tracking-[0.24em] text-zinc-500">
              {copy?.clickHint || "Click a filled frame to open its case study"}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {slots.map((slot) => {
              const project = slotMap.get(slot);

              if (project) {
                return (
                  <Link
                    key={project._id}
                    href={`/projects/${project.slug}`}
                    className="group block overflow-hidden rounded-[1.65rem] border border-white/10 bg-zinc-950 transition hover:border-white/20"
                  >
                    <div className="relative aspect-[4/3]">
                      {project.imageUrl ? (
                        <img
                          src={project.imageUrl}
                          alt={project.title}
                          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                        />
                      ) : (
                        <div className="absolute inset-0 bg-zinc-900" />
                      )}

                      <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/30 to-black/85" />

                      <div className="absolute left-5 top-5 right-5 flex items-start justify-between gap-4">
                        <div className="space-y-1">
                          <p className="text-[11px] uppercase tracking-[0.28em] text-zinc-200">
                            {project.boardLabel || `A${String(slot).padStart(2, "0")}`}
                          </p>
                          <p className="text-[11px] uppercase tracking-[0.22em] text-zinc-500">
                            {copy?.storyFrameLabel || "Story Frame"}
                          </p>
                        </div>

                        <p className="text-[11px] uppercase tracking-[0.22em] text-zinc-400">
                          Slot {pad(slot)}
                        </p>
                      </div>

                      <div className="absolute bottom-5 left-5 right-5 space-y-3">
                        <div className="space-y-1">
                          <h3 className="max-w-[12ch] text-2xl font-semibold leading-tight text-zinc-100">
                            {project.title}
                          </h3>
                          <p className="text-sm leading-6 text-zinc-300">
                            {project.boardCaption}
                          </p>
                        </div>

                        <div className="flex items-center justify-between gap-4 text-[11px] uppercase tracking-[0.22em] text-zinc-400">
                          <span>{project.year}</span>
                          <span>{copy?.openCaseStudyLabel || "Open Case Study"}</span>
                        </div>

                        <div className="h-px w-full bg-white/15" />
                      </div>
                    </div>
                  </Link>
                );
              }

              return (
                <article
                  key={slot}
                  className="overflow-hidden rounded-[1.65rem] border border-dashed border-white/10 bg-white/[0.02]"
                >
                  <div className="relative aspect-[4/3]">
                    <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.02),rgba(255,255,255,0.01))]" />
                    <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_49.6%,rgba(255,255,255,0.04)_50%,transparent_50.4%),linear-gradient(transparent_49.6%,rgba(255,255,255,0.04)_50%,transparent_50.4%)]" />

                    <div className="absolute left-5 top-5 space-y-1">
                      <p className="text-[11px] uppercase tracking-[0.28em] text-zinc-500">
                        {copy?.emptyFrameLabel || "Empty Frame"}
                      </p>
                      <p className="text-[11px] uppercase tracking-[0.22em] text-zinc-600">
                        Slot {pad(slot)}
                      </p>
                    </div>

                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="relative h-14 w-14">
                        <div className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-white/10" />
                        <div className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-white/10" />
                      </div>
                    </div>

                    <div className="absolute bottom-5 left-5 right-5 space-y-3">
                      <p className="max-w-[14ch] text-sm leading-6 text-zinc-500">
                        {copy?.emptyFrameDescription || "Awaiting the next published chapter."}
                      </p>
                      <div className="h-px w-full bg-white/10" />
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}