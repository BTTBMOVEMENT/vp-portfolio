import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  formatJournalDate,
  getJournalEntryBySlug,
  journalEntries,
} from "../../../lib/journal";

type PageProps = {
  params: Promise<{ slug: string }>;
};

const kindLabelMap = {
  essay: "Essay",
  note: "Note",
  photo: "Photo",
  video: "Video",
} as const;

export async function generateStaticParams() {
  return journalEntries.map((entry) => ({
    slug: entry.slug,
  }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const entry = getJournalEntryBySlug(slug);

  if (!entry) {
    return {
      title: "Journal entry not found | BTTB Movement",
      description: "The requested journal entry could not be found.",
    };
  }

  return {
    title: `${entry.title} | Journal | BTTB Movement`,
    description: entry.excerpt,
  };
}

export default async function JournalEntryPage({ params }: PageProps) {
  const { slug } = await params;
  const entry = getJournalEntryBySlug(slug);

  if (!entry) {
    notFound();
  }

  const entryIndex = journalEntries.findIndex((item) => item.slug === entry.slug);
  const previousEntry = entryIndex > 0 ? journalEntries[entryIndex - 1] : null;
  const nextEntry =
    entryIndex < journalEntries.length - 1 ? journalEntries[entryIndex + 1] : null;

  return (
    <main className="min-h-screen bg-black text-white">
      <section className="border-b border-white/10 px-5 pb-8 pt-6 sm:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="flex items-center justify-between gap-4 text-[11px] uppercase tracking-[0.28em] text-zinc-400">
            <Link
              href="/journal"
              className="rounded-full border border-white/10 px-3 py-2 transition hover:border-white/30 hover:text-white"
            >
              Back to Journal
            </Link>

            <span>{kindLabelMap[entry.kind]} / {entry.readTime}</span>
          </div>
        </div>
      </section>

      <section className="px-5 py-12 sm:px-8">
        <div className="mx-auto max-w-6xl space-y-12">
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
            <div className="space-y-6">
              <div className="space-y-4">
                <p className="text-[11px] uppercase tracking-[0.32em] text-zinc-500">
                  {kindLabelMap[entry.kind]}
                </p>

                <h1 className="max-w-[12ch] text-5xl font-semibold leading-[0.92] sm:text-6xl">
                  {entry.title}
                </h1>

                <div className="flex flex-wrap items-center gap-3 text-[11px] uppercase tracking-[0.24em] text-zinc-500">
                  <span>{formatJournalDate(entry.publishedAt)}</span>
                  <span>{entry.readTime}</span>
                </div>
              </div>

              <p className="max-w-xl text-sm leading-8 text-zinc-300 sm:text-base">
                {entry.excerpt}
              </p>

              <div className="flex flex-wrap gap-3">
                {entry.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-white/10 px-4 py-2 text-sm text-zinc-200"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-zinc-900">
              <div className="relative aspect-[4/5] sm:aspect-[16/10]">
                <Image
                  src={entry.coverImage}
                  alt={entry.coverAlt}
                  fill
                  sizes="(max-width: 1024px) 100vw, 55vw"
                  className="object-cover"
                />

                <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/25 to-black/80" />

                <div className="absolute bottom-6 left-6 right-6">
                  <div className="space-y-3">
                    <p className="text-[11px] uppercase tracking-[0.24em] text-zinc-200">
                      {kindLabelMap[entry.kind]} Entry
                    </p>
                    <div className="h-px w-full bg-white/20" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <section className="rounded-[2rem] border border-white/10 bg-white/[0.03] px-6 py-8 sm:px-8">
            <div className="grid gap-6 lg:grid-cols-[0.45fr_1.55fr] lg:items-start">
              <p className="text-[11px] uppercase tracking-[0.32em] text-zinc-500">
                Intro
              </p>

              <p className="max-w-4xl text-xl leading-relaxed text-zinc-100 sm:text-2xl">
                {entry.intro}
              </p>
            </div>
          </section>

          <div className="grid gap-10 lg:grid-cols-[1fr_0.42fr]">
            <div className="space-y-8">
              {entry.body.map((paragraph, index) => (
                <section key={index} className="space-y-4">
                  <p className="text-[11px] uppercase tracking-[0.32em] text-zinc-500">
                    Section {String(index + 1).padStart(2, "0")}
                  </p>
                  <p className="max-w-2xl text-sm leading-8 text-zinc-300 sm:text-base">
                    {paragraph}
                  </p>
                </section>
              ))}
            </div>

            <aside className="space-y-6 lg:sticky lg:top-6 lg:self-start">
              <div className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-6">
                <p className="text-[11px] uppercase tracking-[0.32em] text-zinc-500">
                  Side Notes
                </p>

                <ul className="mt-5 space-y-4">
                  {entry.sideNotes.map((note) => (
                    <li
                      key={note}
                      className="border-b border-white/10 pb-4 text-sm leading-7 text-zinc-200 last:border-b-0 last:pb-0"
                    >
                      {note}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-6">
                <p className="text-[11px] uppercase tracking-[0.32em] text-zinc-500">
                  Actions
                </p>

                <div className="mt-5 space-y-3">
                  <Link
                    href="/journal"
                    className="block rounded-full border border-white/10 px-4 py-3 text-sm text-zinc-200 transition hover:border-white/30 hover:text-white"
                  >
                    Return to journal list
                  </Link>

                  <Link
                    href="/#works"
                    className="block rounded-full border border-white/10 px-4 py-3 text-sm text-zinc-200 transition hover:border-white/30 hover:text-white"
                  >
                    Return to works
                  </Link>
                </div>
              </div>
            </aside>
          </div>

          <section className="space-y-6 border-t border-white/10 pt-12">
            <p className="text-[11px] uppercase tracking-[0.32em] text-zinc-500">
              Continue Reading
            </p>

            <div className="grid gap-6 md:grid-cols-2">
              {previousEntry ? (
                <Link
                  href={`/journal/${previousEntry.slug}`}
                  className="group rounded-[2rem] border border-white/10 bg-white/[0.03] p-6 transition hover:border-white/20"
                >
                  <div className="space-y-3">
                    <p className="text-[11px] uppercase tracking-[0.28em] text-zinc-500">
                      Previous Entry
                    </p>
                    <h3 className="text-3xl font-semibold leading-tight text-zinc-100 transition group-hover:text-white">
                      {previousEntry.title}
                    </h3>
                    <p className="text-sm leading-7 text-zinc-400">
                      {previousEntry.excerpt}
                    </p>
                  </div>
                </Link>
              ) : (
                <div className="rounded-[2rem] border border-white/10 bg-white/[0.02] p-6 opacity-50">
                  <div className="space-y-3">
                    <p className="text-[11px] uppercase tracking-[0.28em] text-zinc-500">
                      Previous Entry
                    </p>
                    <h3 className="text-3xl font-semibold leading-tight text-zinc-500">
                      Start of journal
                    </h3>
                  </div>
                </div>
              )}

              {nextEntry ? (
                <Link
                  href={`/journal/${nextEntry.slug}`}
                  className="group rounded-[2rem] border border-white/10 bg-white/[0.03] p-6 transition hover:border-white/20"
                >
                  <div className="space-y-3">
                    <p className="text-[11px] uppercase tracking-[0.28em] text-zinc-500">
                      Next Entry
                    </p>
                    <h3 className="text-3xl font-semibold leading-tight text-zinc-100 transition group-hover:text-white">
                      {nextEntry.title}
                    </h3>
                    <p className="text-sm leading-7 text-zinc-400">
                      {nextEntry.excerpt}
                    </p>
                  </div>
                </Link>
              ) : (
                <div className="rounded-[2rem] border border-white/10 bg-white/[0.02] p-6 opacity-50">
                  <div className="space-y-3">
                    <p className="text-[11px] uppercase tracking-[0.28em] text-zinc-500">
                      Next Entry
                    </p>
                    <h3 className="text-3xl font-semibold leading-tight text-zinc-500">
                      End of journal
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