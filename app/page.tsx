import HomePageClient from "../components/home/HomePageClient";
import { sanityFetch } from "../sanity/lib/client";
import { SITE_SETTINGS_QUERY } from "../sanity/lib/queries";
import type { SiteSettings } from "../sanity/lib/types";

export const dynamic = "force-dynamic";
export const revalidate = 0;

async function getHomeData() {
  const siteSettings = await sanityFetch<SiteSettings>({
    query: SITE_SETTINGS_QUERY,
    revalidate: 0,
  });

  return {
    siteSettings: siteSettings || null,
  };
}

export default async function Page() {
  const { siteSettings } = await getHomeData();

  return <HomePageClient siteSettings={siteSettings} />;
}