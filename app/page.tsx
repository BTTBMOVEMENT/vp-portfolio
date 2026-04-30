import HomePageClient from "../components/home/HomePageClient";
import { sanityFetch } from "../sanity/lib/client";
import {
  JOURNAL_ENTRIES_QUERY,
  PROJECTS_QUERY,
  SITE_SETTINGS_QUERY,
} from "../sanity/lib/queries";
import { estimateReadTime } from "../sanity/lib/text";

export const revalidate = 0;

async function getHomeData() {
  try {
    const [siteSettings, projects, journalEntries] = await Promise.all([
      sanityFetch({
        query: SITE_SETTINGS_QUERY,
        revalidate: 0,
      }),
      sanityFetch({
        query: PROJECTS_QUERY,
        revalidate: 0,
      }),
      sanityFetch({
        query: JOURNAL_ENTRIES_QUERY,
        revalidate: 0,
      }),
    ]);

    const normalizedJournalEntries = (journalEntries || []).map((entry: any) => ({
      ...entry,
      readTime: estimateReadTime(entry.body),
    }));

    return {
      siteSettings: siteSettings || null,
      projects: projects || [],
      journalEntries: normalizedJournalEntries,
    };
  } catch {
    return {
      siteSettings: null,
      projects: [],
      journalEntries: [],
    };
  }
}

export default async function Page() {
  const { siteSettings, projects, journalEntries } = await getHomeData();

  return (
    <HomePageClient
      siteSettings={siteSettings}
      projects={projects}
      journalEntries={journalEntries}
    />
  );
}