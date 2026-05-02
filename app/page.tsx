import HomePageClient from "../components/home/HomePageClient";
import OrganizationJsonLd from "../components/seo/OrganizationJsonLd";
import WebSiteJsonLd from "../components/seo/WebSiteJsonLd";
import { sanityFetch } from "../sanity/lib/client";
import { SITE_SETTINGS_QUERY } from "../sanity/lib/queries";
import type { SiteSettings } from "../sanity/lib/types";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function Page() {
  const siteSettings =
    (await sanityFetch<SiteSettings>({
      query: SITE_SETTINGS_QUERY,
      revalidate: 0,
    })) ?? null;

  return (
    <>
      <OrganizationJsonLd />
      <WebSiteJsonLd />
      <HomePageClient siteSettings={siteSettings} />
    </>
  );
}