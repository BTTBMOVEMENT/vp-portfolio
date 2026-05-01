import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { sanityFetch } from "../../../sanity/lib/client";
import {
  PROJECT_BY_SLUG_QUERY,
  PROJECTS_QUERY,
} from "../../../sanity/lib/queries";
import type { ProjectDetail, ProjectListItem } from "../../../sanity/lib/types";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

function hasText(value?: string | null) {
  return typeof value === "string" && value.trim().length > 0;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;

  const project =
    (await sanityFetch<ProjectDetail | null>({
      query: PROJECT_BY_SLUG_QUERY,
      params: { slug },
      revalidate: 0,
    })) ?? null;

  if (!project) {
    return {
      title: "Project not found",
    };
  }

  return {
    title: project.title,
    description: project.description,
  };
}

export default async function ProjectPage({ params }: PageProps) {
  const { slug } = await params;

  const [project, allProjects] = await Promise.all([
    sanityFetch<ProjectDetail | null>({
      query: PROJECT_BY_SLUG_QUERY,
      params: { slug },
      revalidate: 0,
    }),
    sanityFetch<ProjectListItem[]>({
      query: PROJECTS_QUERY,
      revalidate: 0,
    }),
  ]);

  if (!project) {
    notFound();
  }

  const sortedProjects = [...allProjects].sort(
    (a, b) =>
      (a.boardPage ?? 1) - (b.boardPage ?? 1) ||
      (a.boardOrder ?? 9999) - (b.boardOrder ?? 9999)
  );

  const currentIndex = sortedProjects.findIndex((item) => item.slug === project.slug);
  const previousProject = currentIndex > 0 ? sortedProjects[currentIndex - 1] : null;
  const nextProject =
    currentIndex < sortedProjects.length - 1
      ? sortedProjects[currentIndex + 1]
      : null;

  const overview = hasText(project.overview) ? project.overview!.trim() : "";
  const contribution = hasText(project.contribution)
    ? project.contribution!.trim()
    : "";
  const approach = hasText(project.approach) ? project.approach!.trim() : "";

  return (
    <main className="min-h-screen bg-black text-white">
      <section className="border-b border-white/10 px-5 pb-8 pt-6 sm:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="flex items-center justify-between gap-4 text-[11px] uppercase tracking-[0.28em] text-zinc-400">
            <Link
              href="/works"
              className="rounded-full border border-white/10 px-3 py-2 transition hover:border-white/30 hover:text-white"
            >
              Back to Works
            </Link>

            <span>
              Chapter {project.boardLabel || project.boardOrder} / {project.year}
            </span>
          </div>
        </div>
      </section>

      <section className="px-5 py-12 sm:px-8">
        <div className="mx-auto max-w-6xl space-y-12">
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
            <div className="relative space-y-6">
              <div className="pointer-events-none absolute -top-8 left-0 select-none text-[6rem] font-semibold leading-none tracking-[-0.08em] text-white/[0.04] sm:text-[8rem]">
                {project.boardLabel || project.boardOrder}
              </div>

              <div className="relative z-10 space-y-4">
                <p className="text-[11px] uppercase tracking-[0.32em] text-zinc-500">
                  Project / {project.boardLabel || project.boardOrder}
                </p>

                <h1 className="max-w-[12ch] text-5xl font-semibold leading-[0.92] sm:text-6xl">
                  {project.title}
                </h1>

                <p className="max-w-xl text-sm leading-7 text-zinc-400 sm:text-base">
                  {project.role}
                </p>
              </div>

              <p className="max-w-xl text-sm leading-8 text-zinc-300 sm:text-base">
                {project.description}
              </p>

              <div className="flex flex-wrap gap-3">
                {(project.tools || []).map((tool) => (
                  <span
                    key={tool}
                    className="rounded-full border border-white/10 px-4 py-2 text-sm text-zinc-200"
                  >
                    {tool}
                  </span>
                ))}
              </div>
            </div>

            <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-zinc-900">
              <div className="relative aspect-[4/5] sm:aspect-[16/10]">
                {project.imageUrl ? (
                  <img
                    src={project.imageUrl}
                    alt={project.title}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 bg-zinc-900" />
                )}

                <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/25 to-black/80" />
              </div>
            </div>
          </div>

          {project.quote && (
            <section className="rounded-[2rem] border border-white/10 bg-white/[0.03] px-6 py-8 sm:px-8">
              <div className="grid gap-6 lg:grid-cols-[0.45fr_1.55fr] lg:items-start">
                <p className="text-[11px] uppercase tracking-[0.32em] text-zinc-500">
                  Pull Quote
                </p>

                <blockquote className="max-w-4xl text-2xl font-medium leading-relaxed text-zinc-100 sm:text-3xl">
                  “{project.quote}”
                </blockquote>
              </div>
            </section>
          )}

          <div className="grid gap-10 lg:grid-cols-[1fr_0.42fr]">
            <div className="space-y-12">
              {overview && (
                <section className="space-y-4">
                  <p className="text-[11px] uppercase tracking-[0.32em] text-zinc-500">
                    Overview
                  </p>
                  <h2 className="text-3xl font-semibold leading-tight sm:text-4xl">
                    What this project is trying to prove.
                  </h2>
                  <p className="whitespace-pre-line max-w-2xl text-sm leading-8 text-zinc-300 sm:text-base">
                    {overview}
                  </p>
                </section>
              )}

              {contribution && (
                <section className="space-y-4">
                  <p className="text-[11px] uppercase tracking-[0.32em] text-zinc-500">
                    Contribution
                  </p>
                  <h2 className="text-3xl font-semibold leading-tight sm:text-4xl">
                    Cinematography and workflow role.
                  </h2>
                  <p className="whitespace-pre-line max-w-2xl text-sm leading-8 text-zinc-300 sm:text-base">
                    {contribution}
                  </p>
                </section>
              )}

              {approach && (
                <section className="space-y-4">
                  <p className="text-[11px] uppercase tracking-[0.32em] text-zinc-500">
                    Approach
                  </p>
                  <h2 className="text-3xl font-semibold leading-tight sm:text-4xl">
                    How the visual system was framed.
                  </h2>
                  <p className="whitespace-pre-line max-w-2xl text-sm leading-8 text-zinc-300 sm:text-base">
                    {approach}
                  </p>
                </section>
              )}
            </div>

            <aside className="space-y-6 lg:sticky lg:top-6 lg:self-start">
              {(project.highlights || []).length > 0 && (
                <div className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-6">
                  <p className="text-[11px] uppercase tracking-[0.32em] text-zinc-500">
                    Highlights
                  </p>

                  <ul className="mt-5 space-y-4">
                    {project.highlights!.map((item) => (
                      <li
                        key={item}
                        className="border-b border-white/10 pb-4 text-sm leading-7 text-zinc-200 last:border-b-0 last:pb-0"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {(project.credits || []).length > 0 && (
                <div className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-6">
                  <p className="text-[11px] uppercase tracking-[0.32em] text-zinc-500">
                    Credits
                  </p>

                  <div className="mt-5 space-y-4">
                    {project.credits!.map((credit, index) => (
                      <div
                        key={`${credit.label}-${index}`}
                        className="flex items-start justify-between gap-4 border-b border-white/10 pb-4 last:border-b-0 last:pb-0"
                      >
                        <span className="text-[11px] uppercase tracking-[0.24em] text-zinc-500">
                          {credit.label}
                        </span>
                        <span className="text-right text-sm text-zinc-200">
                          {credit.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </aside>
          </div>

          {(project.frameStudy || []).length > 0 && (
            <section className="space-y-6">
              <div className="space-y-3">
                <p className="text-[11px] uppercase tracking-[0.32em] text-zinc-500">
                  Frame Study
                </p>
                <h2 className="text-3xl font-semibold leading-tight sm:text-4xl">
                  Three frames that define the chapter.
                </h2>
              </div>

              <div className="grid gap-6 lg:grid-cols-12">
                {(project.frameStudy || []).map((frame, index) => {
                  const colClass =
                    index === 0
                      ? "lg:col-span-7"
                      : index === 1
                      ? "lg:col-span-5"
                      : "lg:col-span-12";

                  const aspectClass =
                    index === 2
                      ? "aspect-[16/10]"
                      : "aspect-[4/5] sm:aspect-[16/10]";

                  return (
                    <article
                      key={`${frame.label}-${index}`}
                      className={`${colClass} overflow-hidden rounded-[2rem] border border-white/10 bg-zinc-900`}
                    >
                      <div className={`relative ${aspectClass}`}>
                        {frame.imageUrl ? (
                          <img
                            src={frame.imageUrl}
                            alt={frame.label || project.title}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="absolute inset-0 bg-zinc-900" />
                        )}

                        <div className="absolute inset-0 bg-gradient-to-b from-black/5 via-black/20 to-black/75" />

                        <div className="absolute bottom-0 left-0 right-0 p-6">
                          <div className="space-y-3">
                            <p className="text-[11px] uppercase tracking-[0.28em] text-zinc-200">
                              {frame.label}
                            </p>
                            <p className="max-w-xl text-sm leading-7 text-zinc-300">
                              {frame.caption}
                            </p>
                            <div className="h-px w-full bg-white/20" />
                          </div>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>
          )}

          {(project.processNotes || []).length > 0 && (
            <section className="space-y-6">
              <div className="space-y-3">
                <p className="text-[11px] uppercase tracking-[0.32em] text-zinc-500">
                  Process Notes
                </p>
                <h2 className="text-3xl font-semibold leading-tight sm:text-4xl">
                  The chapter beneath the images.
                </h2>
              </div>

              <div className="grid gap-6 lg:grid-cols-3">
                {(project.processNotes || []).map((note, index) => (
                  <article
                    key={`${note.title}-${index}`}
                    className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-6"
                  >
                    <div className="space-y-4">
                      <p className="text-[11px] uppercase tracking-[0.28em] text-zinc-500">
                        {note.title}
                      </p>

                      <p className="text-sm leading-8 text-zinc-300">
                        {note.body}
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          )}

          <section className="space-y-6 border-t border-white/10 pt-12">
            <p className="text-[11px] uppercase tracking-[0.32em] text-zinc-500">
              Continue Reading
            </p>

            <div className="grid gap-6 md:grid-cols-2">
              {previousProject ? (
                <Link
                  href={`/projects/${previousProject.slug}`}
                  className="group rounded-[2rem] border border-white/10 bg-white/[0.03] p-6 transition hover:border-white/20"
                >
                  <div className="space-y-3">
                    <p className="text-[11px] uppercase tracking-[0.28em] text-zinc-500">
                      Previous Chapter
                    </p>
                    <h3 className="text-3xl font-semibold leading-tight text-zinc-100 transition group-hover:text-white">
                      {previousProject.title}
                    </h3>
                  </div>
                </Link>
              ) : (
                <div className="rounded-[2rem] border border-white/10 bg-white/[0.02] p-6 opacity-50">
                  <div className="space-y-3">
                    <p className="text-[11px] uppercase tracking-[0.28em] text-zinc-500">
                      Previous Chapter
                    </p>
                    <h3 className="text-3xl font-semibold leading-tight text-zinc-500">
                      Start of sequence
                    </h3>
                  </div>
                </div>
              )}

              {nextProject ? (
                <Link
                  href={`/projects/${nextProject.slug}`}
                  className="group rounded-[2rem] border border-white/10 bg-white/[0.03] p-6 transition hover:border-white/20"
                >
                  <div className="space-y-3">
                    <p className="text-[11px] uppercase tracking-[0.28em] text-zinc-500">
                      Next Chapter
                    </p>
                    <h3 className="text-3xl font-semibold leading-tight text-zinc-100 transition group-hover:text-white">
                      {nextProject.title}
                    </h3>
                  </div>
                </Link>
              ) : (
                <div className="rounded-[2rem] border border-white/10 bg-white/[0.02] p-6 opacity-50">
                  <div className="space-y-3">
                    <p className="text-[11px] uppercase tracking-[0.28em] text-zinc-500">
                      Next Chapter
                    </p>
                    <h3 className="text-3xl font-semibold leading-tight text-zinc-500">
                      End of sequence
                    </h3>
                  </div>
                </div>
              )}
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}