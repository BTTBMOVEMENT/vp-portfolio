import type { Metadata } from "next";
import JournalCosmos from "../../components/journal/JournalCosmos";
import { sanityFetch } from "../../sanity/lib/client";
import { JOURNAL_ENTRIES_QUERY, SITE_SETTINGS_QUERY } from "../../sanity/lib/queries";
import { estimateReadTime } from "../../sanity/lib/text";
import type { JournalListItem, SiteSettings } from "../../sanity/lib/types";

export const metadata: Metadata = {
  title: "Journal",
  description:
    "Read visual essays, cinematic notes, process writing, and experimental journal entries from BTTB MOVEMENT.",
  alternates: {
    canonical: "/journal",
  },
  openGraph: {
    title: "Journal | BTTB MOVEMENT",
    description:
      "Read visual essays, cinematic notes, process writing, and experimental journal entries from BTTB MOVEMENT.",
    url: "/journal",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Journal | BTTB MOVEMENT",
    description:
      "Read visual essays, cinematic notes, process writing, and experimental journal entries from BTTB MOVEMENT.",
  },
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

function getDateValue(value?: string) {
  if (!value) return 0;
  const time = new Date(value).getTime();
  return Number.isNaN(time) ? 0 : time;
}

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

  const entries = (rawEntries || [])
    .map((entry) => ({
      ...entry,
      readTime: estimateReadTime(entry.body),
    }))
    .sort((a, b) => getDateValue(b.publishedAt) - getDateValue(a.publishedAt));

  const copy = {
    pageLabel: siteSettings?.journalPage?.pageLabel || "Journal",
    title:
      siteSettings?.journalPage?.title ||
      "A drifting field of notes and experiments.",
    description:
      siteSettings?.journalPage?.description ||
      "Browse the journal in orbit, then enter the selected note directly.",
    orbitLabel: siteSettings?.journalPage?.orbitLabel || "Journal Orbit",
    orbitDescription:
      siteSettings?.journalPage?.orbitDescription ||
      "The newest entry appears first while the rest move in orbit.",
    spreadLabel:
      siteSettings?.journalPage?.allEntriesLabel ||
      siteSettings?.journalPage?.spreadLabel ||
      "Spread Entries",
    mixLabel:
      siteSettings?.journalPage?.mixLabel || "Mix Again",
    previousLabel:
      siteSettings?.journalPage?.previousLabel || "Previous",
    nextLabel:
      siteSettings?.journalPage?.nextLabel || "Next",
    enterEntryLabel:
      siteSettings?.journalPage?.enterEntryLabel || "Open Entry",
  };

  return (
    <main className="min-h-screen bg-black text-white">
      <section className="px-5 pb-12 pt-28 sm:px-8 md:pt-32">
        <div className="mx-auto max-w-[1500px]">
          <JournalCosmos entries={entries} copy={copy} />
        </div>
      </section>
    </main>
  );
}