import type { MetadataRoute } from "next";
import { sanityFetch } from "../sanity/lib/client";
import { JOURNAL_ENTRIES_QUERY, PROJECTS_QUERY } from "../sanity/lib/queries";
import type { JournalListItem, ProjectListItem } from "../sanity/lib/types";

const siteUrl = "https://bttbmovement.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [projects, journalEntries] = await Promise.all([
    sanityFetch<ProjectListItem[]>({
      query: PROJECTS_QUERY,
      revalidate: 0,
    }),
    sanityFetch<JournalListItem[]>({
      query: JOURNAL_ENTRIES_QUERY,
      revalidate: 0,
    }),
  ]);

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${siteUrl}/`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${siteUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/works`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/journal`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.85,
    },
    {
      url: `${siteUrl}/my-album`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
  ];

  const projectRoutes: MetadataRoute.Sitemap = (projects || []).map((project) => ({
    url: `${siteUrl}/projects/${project.slug}`,
    lastModified: project.publishedAt ? new Date(project.publishedAt) : new Date(),
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const journalRoutes: MetadataRoute.Sitemap = (journalEntries || []).map((entry) => ({
    url: `${siteUrl}/journal/${entry.slug}`,
    lastModified: entry.publishedAt ? new Date(entry.publishedAt) : new Date(),
    changeFrequency: "monthly",
    priority: 0.75,
  }));

  return [...staticRoutes, ...projectRoutes, ...journalRoutes];
}