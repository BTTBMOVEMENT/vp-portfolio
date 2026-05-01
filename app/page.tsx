import HomePageClient from "../components/home/HomePageClient";
import { sanityFetch } from "../sanity/lib/client";
import {
  JOURNAL_ENTRIES_QUERY,
  PROJECTS_QUERY,
  SITE_SETTINGS_QUERY,
} from "../sanity/lib/queries";
import { estimateReadTime } from "../sanity/lib/text";
import type { JournalListItem, ProjectListItem, SiteSettings } from "../sanity/lib/types";

export const dynamic = "force-dynamic";
export const revalidate = 0;

async function getHomeData() {
  const [siteSettings, projects, journalEntries] = await Promise.all([
    sanityFetch<SiteSettings>({
      query: SITE_SETTINGS_QUERY,
      revalidate: 0,
    }),
    sanityFetch<ProjectListItem[]>({
      query: PROJECTS_QUERY,
      revalidate: 0,
    }),
    sanityFetch<JournalListItem[]>({
      query: JOURNAL_ENTRIES_QUERY,
      revalidate: 0,
    }),
  ]);

  const normalizedJournalEntries = (journalEntries || []).map((entry) => ({
    ...entry,
    readTime: estimateReadTime(entry.body),
  }));

  return {
    siteSettings: siteSettings || null,
    projects: projects || [],
    journalEntries: normalizedJournalEntries,
  };
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