import JournalCosmos from "../../components/journal/JournalCosmos";
import { sanityFetch } from "../../sanity/lib/client";
import { JOURNAL_ENTRIES_QUERY, SITE_SETTINGS_QUERY } from "../../sanity/lib/queries";
import { estimateReadTime } from "../../sanity/lib/text";
import type { JournalListItem, SiteSettings } from "../../sanity/lib/types";
import type { Metadata } from "next";

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

  const entries = (rawEntries || []).map((entry) => ({
    ...entry,
    readTime: estimateReadTime(entry.body),
  }));

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
      "One entry stays dominant while the rest move in orbit.",

    // 핵심 수정:
    // 기존 Studio의 allEntriesLabel을 실제 펼쳐보기 버튼으로 연결
    spreadLabel:
      siteSettings?.journalPage?.allEntriesLabel ||
      siteSettings?.journalPage?.spreadLabel ||
      "Spread Entries",

    mixLabel:
      siteSettings?.journalPage?.mixLabel || "Mix Again",

    selectedEntryLabel:
      siteSettings?.journalPage?.selectedEntryLabel || "Selected Entry",
    selectedEntryFallback:
      siteSettings?.journalPage?.selectedEntryFallback ||
      "Open the selected entry to continue reading.",
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