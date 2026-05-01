import Link from "next/link";
import { sanityFetch } from "../../sanity/lib/client";
import { JOURNAL_ENTRIES_QUERY, SITE_SETTINGS_QUERY } from "../../sanity/lib/queries";
import { estimateReadTime } from "../../sanity/lib/text";
import type { JournalListItem, SiteSettings } from "../../sanity/lib/types";

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

export default async function JournalPage() {
  const [rawEntries, siteSettings] = await Promise.all([
    sanityFetch<JournalListItem[]>({
      query: JOURNAL_ENTRIES_QUERY,
      revalidate: 0,
    }),
    sanityFetch<SiteSettings>({
      query: SITE_SETTINGS_QUERY,
      revalidate: 0,
    }),
  ]);

  const journalEntries = (rawEntries || []).map((entry) => ({
    ...entry,
    readTime: estimateReadTime(entry.body),
  }));

  const featuredEntry = journalEntries[0];
  const otherEntries = journalEntries.slice(1);

  const copy = {
    pageLabel: siteSettings?.journalPage?.pageLabel || "Journal",
    pageIntro:
      siteSettings?.journalPage?.pageIntro ||
      "Notes, essays, visual logs, and process writing.",
    title:
      siteSettings?.journalPage?.title ||
      "A living layer beside the portfolio.",
    description:
      siteSettings?.journalPage?.description ||
      "This section is the foundation for a creator-managed journal.",
    featuredEntryLabel:
      siteSettings?.journalPage?.featuredEntryLabel || "Featured Entry",
    allEntriesLabel:
      siteSettings?.journalPage?.allEntriesLabel || "All Entries",
  };

  return (
    <main className="min-h-screen bg-black text-white">
      <section className="border-b border-white/10 px-5 pb-8 pt-6 sm:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="flex items-center justify-between gap-4 text-[11px] uppercase tracking-[0.28em] text-zinc-400">
            <Link
              href="/"
              className="rounded-full border border-white/10 px-3 py-2 transition hover:border-white/30 hover:text-white"
            >
              Back to Home
            </Link>

            <span>{copy.pageLabel} / 01</span>
          </div>
        </div>
      </section>

      <section className="px-5 py-12 sm:px-8">
        <div className="mx-auto max-w-6xl space-y-14">
          <div className="grid gap-8 lg:grid-cols-[0.5fr_1.5fr] lg:items-end">
            <div className="space-y-3">
              <p className="text-[11px] uppercase tracking-[0.32em] text-zinc-500">
                {copy.pageLabel}
              </p>
              <div className="h-px w-20 bg-white/15" />
              <p className="text-sm leading-7 text-zinc-500">
                {copy.pageIntro}
              </p>
            </div>

            <div className="space-y-4">
              <h1 className="max-w-[12ch] text-5xl font-semibold leading-[0.92] sm:text-6xl">
                {copy.title}
              </h1>
              <p className="max-w-2xl text-sm leading-8 text-zinc-300 sm:text-base">
                {copy.description}
              </p>
            </div>
          </div>

          {featuredEntry && (
            <section className="space-y-6">
              <p className="text-[11px] uppercase tracking-[0.32em] text-zinc-500">
                {copy.featuredEntryLabel}
              </p>

              <Link
                href={`/journal/${featuredEntry.slug}`}
                className="group block overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.03] transition hover:border-white/20"
              >
                <div className="grid gap-0 lg:grid-cols-[1.1fr_0.9fr]">
                  <div className="relative aspect-[4/5] sm:aspect-[16/10] lg:aspect-auto lg:min-h-[36rem]">
                    {featuredEntry.coverImageUrl ? (
                      <img
                        src={featuredEntry.coverImageUrl}
                        alt={featuredEntry.title}
                        className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-zinc-900" />
                    )}

                    <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/25 to-black/80" />
                  </div>

                  <div className="flex flex-col justify-between gap-8 p-6 sm:p-8">
                    <div className="space-y-5">
                      <div className="flex flex-wrap items-center gap-3 text-[11px] uppercase tracking-[0.24em] text-zinc-500">
                        <span>{formatDate(featuredEntry.publishedAt)}</span>
                        <span>{featuredEntry.readTime}</span>
                      </div>

                      <h2 className="max-w-[12ch] text-4xl font-semibold leading-[0.95] sm:text-5xl">
                        {featuredEntry.title}
                      </h2>

                      <p className="max-w-xl text-sm leading-8 text-zinc-300 sm:text-base">
                        {featuredEntry.excerpt}
                      </p>
                    </div>

                    <div className="space-y-4">
                      <div className="flex flex-wrap gap-3">
                        {(featuredEntry.tags || []).map((tag) => (
                          <span
                            key={tag}
                            className="rounded-full border border-white/10 px-4 py-2 text-sm text-zinc-200"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      <div className="h-px w-full bg-white/10" />
                    </div>
                  </div>
                </div>
              </Link>
            </section>
          )}

          <section className="space-y-6">
            <p className="text-[11px] uppercase tracking-[0.32em] text-zinc-500">
              {copy.allEntriesLabel}
            </p>

            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {otherEntries.map((entry) => (
                <Link
                  key={entry._id}
                  href={`/journal/${entry.slug}`}
                  className="group overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.03] transition hover:border-white/20"
                >
                  <div className="relative aspect-[4/5] overflow-hidden bg-zinc-900">
                    {entry.coverImageUrl ? (
                      <img
                        src={entry.coverImageUrl}
                        alt={entry.title}
                        className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-zinc-900" />
                    )}

                    <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/20 to-black/80" />
                  </div>

                  <div className="space-y-4 p-6">
                    <h3 className="max-w-[12ch] text-3xl font-semibold leading-tight text-zinc-100">
                      {entry.title}
                    </h3>

                    <p className="text-sm leading-7 text-zinc-300">
                      {entry.excerpt}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}