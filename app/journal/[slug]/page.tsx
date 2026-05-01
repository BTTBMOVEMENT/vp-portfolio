import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import PortableTextContent from "../../../components/cms/PortableTextContent";
import { sanityFetch } from "../../../sanity/lib/client";
import {
  JOURNAL_ENTRIES_QUERY,
  JOURNAL_ENTRY_BY_SLUG_QUERY,
  SITE_SETTINGS_QUERY,
} from "../../../sanity/lib/queries";
import { estimateReadTime } from "../../../sanity/lib/text";
import type { JournalDetail, JournalListItem, SiteSettings } from "../../../sanity/lib/types";

type PageProps = {
  params: Promise<{ slug: string }>;
};

function formatDate(value?: string) {
  if (!value) return "";
  try {
    return new Intl.DateTimeFormat("en-US", {
      dateStyle: "medium",
    }).format(new Date(value));
  } catch {
    return value;
  }
}

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;

  const entry =
    (await sanityFetch<JournalDetail | null>({
      query: JOURNAL_ENTRY_BY_SLUG_QUERY,
      params: { slug },
      revalidate: 0,
    })) ?? null;

  if (!entry) {
    return { title: "Journal entry not found" };
  }

  return {
    title: entry.title,
    description: entry.excerpt,
  };
}

export default async function JournalEntryPage({ params }: PageProps) {
  const { slug } = await params;

  const [entry, rawEntries, siteSettings] = await Promise.all([
    sanityFetch<JournalDetail | null>({
      query: JOURNAL_ENTRY_BY_SLUG_QUERY,
      params: { slug },
      revalidate: 0,
    }),
    sanityFetch<JournalListItem[]>({
      query: JOURNAL_ENTRIES_QUERY,
      revalidate: 0,
    }),
    sanityFetch<SiteSettings>({
      query: SITE_SETTINGS_QUERY,
      revalidate: 0,
    }),
  ]);

  if (!entry) {
    notFound();
  }

  const journalEntries = (rawEntries || []).map((item) => ({
    ...item,
    readTime: estimateReadTime(item.body),
  }));

  const currentIndex = journalEntries.findIndex((item) => item.slug === entry.slug);
  const previousEntry = currentIndex > 0 ? journalEntries[currentIndex - 1] : null;
  const nextEntry =
    currentIndex < journalEntries.length - 1 ? journalEntries[currentIndex + 1] : null;

  const copy = {
    introLabel: siteSettings?.journalPage?.detailIntroLabel || "Intro",
    actionsLabel: siteSettings?.journalPage?.detailActionsLabel || "Actions",
    returnToJournalLabel:
      siteSettings?.journalPage?.detailReturnToJournalLabel || "Return to journal list",
    returnToWorksLabel:
      siteSettings?.journalPage?.detailReturnToWorksLabel || "Return to works",
    galleryLabel: siteSettings?.journalPage?.detailGalleryLabel || "Gallery",
    continueReadingLabel:
      siteSettings?.journalPage?.detailContinueReadingLabel || "Continue Reading",
    previousEntryLabel:
      siteSettings?.journalPage?.detailPreviousEntryLabel || "Previous Entry",
    nextEntryLabel:
      siteSettings?.journalPage?.detailNextEntryLabel || "Next Entry",
    startOfJournalLabel:
      siteSettings?.journalPage?.detailStartOfJournalLabel || "Start of journal",
    endOfJournalLabel:
      siteSettings?.journalPage?.detailEndOfJournalLabel || "End of journal",
  };

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

            <span>{entry.kind} / {estimateReadTime(entry.body)}</span>
          </div>
        </div>
      </section>

      <section className="px-5 py-12 sm:px-8">
        <div className="mx-auto max-w-6xl space-y-12">
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
            <div className="space-y-6">
              <div className="space-y-4">
                <p className="text-[11px] uppercase tracking-[0.32em] text-zinc-500">
                  {entry.kind}
                </p>

                <h1 className="max-w-[12ch] text-5xl font-semibold leading-[0.92] sm:text-6xl">
                  {entry.title}
                </h1>

                <div className="flex flex-wrap items-center gap-3 text-[11px] uppercase tracking-[0.24em] text-zinc-500">
                  <span>{formatDate(entry.publishedAt)}</span>
                  <span>{estimateReadTime(entry.body)}</span>
                </div>
              </div>

              <p className="max-w-xl text-sm leading-8 text-zinc-300 sm:text-base">
                {entry.excerpt}
              </p>
            </div>

            <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-zinc-900">
              <div className="relative aspect-[4/5] sm:aspect-[16/10]">
                {entry.coverImageUrl ? (
                  <img
                    src={entry.coverImageUrl}
                    alt={entry.title}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 bg-zinc-900" />
                )}

                <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/25 to-black/80" />
              </div>
            </div>
          </div>

          {entry.intro && (
            <section className="rounded-[2rem] border border-white/10 bg-white/[0.03] px-6 py-8 sm:px-8">
              <div className="grid gap-6 lg:grid-cols-[0.45fr_1.55fr] lg:items-start">
                <p className="text-[11px] uppercase tracking-[0.32em] text-zinc-500">
                  {copy.introLabel}
                </p>

                <p className="max-w-4xl text-xl leading-relaxed text-zinc-100 sm:text-2xl">
                  {entry.intro}
                </p>
              </div>
            </section>
          )}

          <div className="grid gap-10 lg:grid-cols-[1fr_0.42fr]">
            <div className="space-y-8">
              <PortableTextContent value={entry.body} />
            </div>

            <aside className="space-y-6 lg:sticky lg:top-6 lg:self-start">
              <div className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-6">
                <p className="text-[11px] uppercase tracking-[0.32em] text-zinc-500">
                  {copy.actionsLabel}
                </p>

                <div className="mt-5 space-y-3">
                  <Link
                    href="/journal"
                    className="block rounded-full border border-white/10 px-4 py-3 text-sm text-zinc-200 transition hover:border-white/30 hover:text-white"
                  >
                    {copy.returnToJournalLabel}
                  </Link>

                  <Link
                    href="/works"
                    className="block rounded-full border border-white/10 px-4 py-3 text-sm text-zinc-200 transition hover:border-white/30 hover:text-white"
                  >
                    {copy.returnToWorksLabel}
                  </Link>
                </div>
              </div>
            </aside>
          </div>

          {(entry.gallery || []).length > 0 && (
            <section className="space-y-6">
              <p className="text-[11px] uppercase tracking-[0.32em] text-zinc-500">
                {copy.galleryLabel}
              </p>

              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {(entry.gallery || []).map((image, index) => (
                  <div
                    key={`${image.imageUrl}-${index}`}
                    className="overflow-hidden rounded-[1.75rem] border border-white/10 bg-zinc-900"
                  >
                    {image.imageUrl ? (
                      <img
                        src={image.imageUrl}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="aspect-[4/5] bg-zinc-900" />
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          <section className="space-y-6 border-t border-white/10 pt-12">
            <p className="text-[11px] uppercase tracking-[0.32em] text-zinc-500">
              {copy.continueReadingLabel}
            </p>

            <div className="grid gap-6 md:grid-cols-2">
              {previousEntry ? (
                <Link
                  href={`/journal/${previousEntry.slug}`}
                  className="group rounded-[2rem] border border-white/10 bg-white/[0.03] p-6 transition hover:border-white/20"
                >
                  <div className="space-y-3">
                    <p className="text-[11px] uppercase tracking-[0.28em] text-zinc-500">
                      {copy.previousEntryLabel}
                    </p>
                    <h3 className="text-3xl font-semibold leading-tight text-zinc-100 transition group-hover:text-white">
                      {previousEntry.title}
                    </h3>
                  </div>
                </Link>
              ) : (
                <div className="rounded-[2rem] border border-white/10 bg-white/[0.02] p-6 opacity-50">
                  <div className="space-y-3">
                    <p className="text-[11px] uppercase tracking-[0.28em] text-zinc-500">
                      {copy.previousEntryLabel}
                    </p>
                    <h3 className="text-3xl font-semibold leading-tight text-zinc-500">
                      {copy.startOfJournalLabel}
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
                      {copy.nextEntryLabel}
                    </p>
                    <h3 className="text-3xl font-semibold leading-tight text-zinc-100 transition group-hover:text-white">
                      {nextEntry.title}
                    </h3>
                  </div>
                </Link>
              ) : (
                <div className="rounded-[2rem] border border-white/10 bg-white/[0.02] p-6 opacity-50">
                  <div className="space-y-3">
                    <p className="text-[11px] uppercase tracking-[0.28em] text-zinc-500">
                      {copy.nextEntryLabel}
                    </p>
                    <h3 className="text-3xl font-semibold leading-tight text-zinc-500">
                      {copy.endOfJournalLabel}
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