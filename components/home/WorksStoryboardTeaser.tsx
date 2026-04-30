"use client";

import Link from "next/link";
import { motion } from "motion/react";

const TEASER_BOARD_PAGE = 1;
const TEASER_SLOTS = 6;

function pad(value: number) {
  return String(value).padStart(2, "0");
}

type ProjectTeaser = {
  _id: string;
  title: string;
  slug: string;
  year?: string;
  role?: string;
  description?: string;
  imageUrl?: string;
  boardPage?: number;
  boardOrder?: number;
  boardLabel?: string;
  boardCaption?: string;
};

type WorksStoryboardTeaserProps = {
  projects: ProjectTeaser[];
  sectionLabel?: string;
  title?: string;
  description?: string;
  metaLabel?: string;
  metaBody?: string;
  archiveButtonLabel?: string;
};

export default function WorksStoryboardTeaser({
  projects,
  sectionLabel = "Works",
  title = "A storyboard archive where finished chapters occupy frames.",
  description = "The home page only shows the opening sheet.",
  metaLabel = "Preview Logic",
  metaBody = "Home only shows the opening sheet.",
  archiveButtonLabel = "Open Works Archive",
}: WorksStoryboardTeaserProps) {
  const boardEntries = projects
    .filter((entry) => (entry.boardPage || 1) === TEASER_BOARD_PAGE)
    .sort((a, b) => (a.boardOrder || 9999) - (b.boardOrder || 9999));

  const teaserEntries = boardEntries.filter(
    (entry) => (entry.boardOrder || 9999) <= TEASER_SLOTS
  );

  const slotMap = new Map(teaserEntries.map((entry) => [entry.boardOrder || 0, entry]));
  const slots = Array.from({ length: TEASER_SLOTS }, (_, index) => index + 1);

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

          <Link
            href="/works"
            className="inline-flex rounded-full border border-white/10 px-4 py-3 text-sm text-zinc-200 transition hover:border-white/30 hover:text-white"
          >
            {archiveButtonLabel}
          </Link>
        </motion.div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {slots.map((slot) => {
            const project = slotMap.get(slot);

            if (!project) {
              return (
                <article
                  key={slot}
                  className="overflow-hidden rounded-[1.65rem] border border-dashed border-white/10 bg-white/[0.02]"
                >
                  <div className="relative aspect-[4/3]">
                    <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.02),rgba(255,255,255,0.01))]" />
                    <div className="absolute bottom-5 left-5 right-5 space-y-2">
                      <p className="text-[11px] uppercase tracking-[0.22em] text-zinc-500">
                        Empty Frame
                      </p>
                      <div className="h-px w-full bg-white/10" />
                    </div>
                  </div>
                </article>
              );
            }

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

                  <div className="absolute bottom-5 left-5 right-5 space-y-3">
                    <h3 className="max-w-[12ch] text-2xl font-semibold leading-tight text-zinc-100">
                      {project.title}
                    </h3>

                    <p className="text-sm leading-6 text-zinc-300">
                      {project.boardCaption || project.description}
                    </p>

                    <div className="h-px w-full bg-white/15" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="mt-6 space-y-4">
          <p className="text-[11px] uppercase tracking-[0.32em] text-zinc-500">
            {metaLabel}
          </p>

          <p className="max-w-2xl text-sm leading-8 text-zinc-300 sm:text-base">
            {metaBody}
          </p>
        </div>
      </div>
    </section>
  );
}