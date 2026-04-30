import HomePageClient from "../components/home/HomePageClient";
import { SITE_SETTINGS_QUERY } from "../sanity/lib/queries";
import { sanityFetch } from "../sanity/lib/client";

export const revalidate = 0;

async function getSiteSettings() {
  try {
    return await sanityFetch({
      query: SITE_SETTINGS_QUERY,
      revalidate: 0,
    });
  } catch {
    return null;
  }
}

export default async function Page() {
  const siteSettings = await getSiteSettings();

  return <HomePageClient siteSettings={siteSettings} />;
}