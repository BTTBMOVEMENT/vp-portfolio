"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { BOARD_SLOTS_PER_PAGE, getProjectsForBoard } from "../../lib/projects";

const TEASER_BOARD_PAGE = 1;
const TEASER_SLOTS = 6;

function pad(value: number) {
  return String(value).padStart(2, "0");
}

type WorksStoryboardTeaserProps = {
  sectionLabel?: string;
  title?: string;
  description?: string;
  metaLabel?: string;
  metaBody?: string;
  archiveButtonLabel?: string;
};

export default function WorksStoryboardTeaser({
  sectionLabel = "Works",
  title = "A storyboard archive where finished chapters occupy frames.",
  description = "The home page only shows the opening sheet. Each filled frame leads into a case study. Empty frames stay visible so the archive feels like an active wall rather than a closed list.",
  metaLabel = "Preview Logic",
  metaBody = "Home only shows the opening sheet. The full archive continues inside the dedicated Works page, where each board grows over time as new projects are published.",
  archiveButtonLabel = "Open Works Archive",
}: WorksStoryboardTeaserProps) {
  const boardEntries = getProjectsForBoard(TEASER_BOARD_PAGE);
  const teaserEntries = boardEntries.filter(
    (entry) => entry.boardOrder <= TEASER_SLOTS
  );

  const slotMap = new Map(teaserEntries.map((entry) => [entry.boardOrder, entry]));
  const slots = Array.from({ length: TEASER_SLOTS }, (_, index) => index + 1);
  const filledTeaserSlots = teaserEntries.length;

  return (
    <section id="works" className="border-t border-white/10 px-5 py-20 sm:px-8">
      <div className="mx-auto max-w-[1500px]">
        <motion.div
          className="mb-14 flex flex-col gap-8 xl:flex-row xl:items-end xl:justify-between"
          initial={{ opacity: 0, y: 70 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ amount: 0.2 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
        >
          <div className="max-w-3xl space-y-4">
            <p className="text-[11px] uppercase tracking-[0.32em] text-zinc-400">
              {sectionLabel}
            </p>

            <h2 className="max-w-[13ch] text-3xl font-semibold leading-tight sm:text-4xl md:text-5xl">
              {title}
            </h2>

            <p className="max-w-2xl text-sm leading-8 text-zinc-300 sm:text-base">
              {description}
            </p>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="text-[11px] uppercase tracking-[0.24em] text-zinc-500">
              Board {pad(TEASER_BOARD_PAGE)} / teaser view
            </div>

            <Link
              href="/works"
              className="inline-flex rounded-full border border-white/10 px-4 py-3 text-sm text-zinc-200 transition hover:border-white/30 hover:text-white"
            >
              {archiveButtonLabel}
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 80 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ amount: 0.15 }}
          transition={{ duration: 0.95, ease: "easeOut" }}
          className="relative overflow-hidden rounded-[2.75rem] border border-white/10 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.06),transparent_28%),linear-gradient(180deg,rgba(255,255,255,0.03),rgba(255,255,255,0.01))] px-4 py-5 sm:px-6 sm:py-6 lg:px-10 lg:py-8"
        >
          <div className="pointer-events-none absolute right-4 top-0 select-none text-[7rem] font-semibold leading-none tracking-[-0.08em] text-white/[0.04] sm:text-[9rem] lg:text-[11rem]">
            {pad(TEASER_BOARD_PAGE)}
          </div>

          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-2">
              <p className="text-[11px] uppercase tracking-[0.32em] text-zinc-500">
                Story Sheet
              </p>
              <p className="text-sm leading-7 text-zinc-300">
                Home teaser for the storyboard archive.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 text-[11px] uppercase tracking-[0.24em] text-zinc-500">
              <span>Board {pad(TEASER_BOARD_PAGE)}</span>
              <span>{pad(filledTeaserSlots)} / {pad(TEASER_SLOTS)} visible</span>
              <span>{pad(boardEntries.length)} / {pad(BOARD_SLOTS_PER_PAGE)} loaded on sheet</span>
            </div>
          </div>

          <div className="overflow-hidden rounded-[2.15rem] border border-white/10 bg-black/40 p-4 sm:p-5 lg:p-6">
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {slots.map((slot) => {
                const project = slotMap.get(slot);

                if (project) {
                  return (
                    <Link
                      key={slot}
                      href={`/projects/${project.slug}`}
                      className="group block overflow-hidden rounded-[1.65rem] border border-white/10 bg-zinc-950 transition hover:border-white/20"
                    >
                      <div className="relative aspect-[4/3]">
                        <Image
                          src={project.image}
                          alt={project.alt}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
                          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                        />

                        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/30 to-black/85" />

                        <div className="absolute left-5 top-5 right-5 flex items-start justify-between gap-4">
                          <div className="space-y-1">
                            <p className="text-[11px] uppercase tracking-[0.28em] text-zinc-200">
                              {project.boardLabel}
                            </p>
                            <p className="text-[11px] uppercase tracking-[0.22em] text-zinc-500">
                              Story Frame
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
                            <span>Open Case Study</span>
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
                          Empty Frame
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
                          Reserved for a future chapter.
                        </p>
                        <div className="h-px w-full bg-white/10" />
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>

          <div className="mt-6 grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
            <div className="space-y-4">
              <p className="text-[11px] uppercase tracking-[0.32em] text-zinc-500">
                {metaLabel}
              </p>

              <p className="max-w-2xl text-sm leading-8 text-zinc-300 sm:text-base">
                {metaBody}
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-3 xl:grid-cols-1">
              <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
                <p className="text-[11px] uppercase tracking-[0.28em] text-zinc-500">
                  Live Frames
                </p>
                <p className="mt-3 text-base text-zinc-200">
                  {pad(boardEntries.length)}
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
                <p className="text-[11px] uppercase tracking-[0.28em] text-zinc-500">
                  Archive Route
                </p>
                <p className="mt-3 text-base text-zinc-200">/works</p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
                <p className="text-[11px] uppercase tracking-[0.28em] text-zinc-500">
                  Navigation
                </p>
                <p className="mt-3 text-base text-zinc-200">
                  Frame → Case Study
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}