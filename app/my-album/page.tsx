import type { Metadata } from "next";
import VisionCosmos from "../../components/vision/VisionCosmos";
import { sanityFetch } from "../../sanity/lib/client";
import { ALBUM_ITEMS_QUERY, SITE_SETTINGS_QUERY } from "../../sanity/lib/queries";
import type { AlbumItem, SiteSettings } from "../../sanity/lib/types";

export const metadata: Metadata = {
  title: "My Album",
  description: "A cinematic photo album of drifting frames.",
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function MyAlbumPage() {
  const [rawEntries, siteSettings] = await Promise.all([
    sanityFetch<AlbumItem[]>({
      query: ALBUM_ITEMS_QUERY,
      revalidate: 0,
    }),
    sanityFetch<SiteSettings>({
      query: SITE_SETTINGS_QUERY,
      revalidate: 0,
    }),
  ]);

  const entries = (rawEntries || []).map((item) => ({
    id: item._id,
    title: item.title,
    imageUrl: item.imageUrl,
    videoUrl: item.videoUrl,
    capturedAt: item.capturedAt,
    note: item.note,
  }));

  const copy = {
    pageLabel: siteSettings?.albumPage?.pageLabel || "My Album",
    title:
      siteSettings?.albumPage?.title || "A drifting field of frames and memories.",
    description:
      siteSettings?.albumPage?.description ||
      "Scroll or swipe to pull a photograph into focus.",
    emptyStateLabel: siteSettings?.albumPage?.emptyStateLabel || "My Album",
    emptyStateTitle:
      siteSettings?.albumPage?.emptyStateTitle || "No album items published yet.",
    emptyStateDescription:
      siteSettings?.albumPage?.emptyStateDescription ||
      "Add album items in Studio and they will appear here automatically.",
    orbitalLabel: siteSettings?.albumPage?.orbitalLabel || "Orbital Album",
    orbitalDescription:
      siteSettings?.albumPage?.orbitalDescription ||
      "One frame dominates the view while the rest stay in orbit.",
    alignFramesLabel:
      siteSettings?.albumPage?.alignFramesLabel || "Align Frames",
    returnToOrbitLabel:
      siteSettings?.albumPage?.returnToOrbitLabel || "Return to Orbit",
    selectedFrameLabel:
      siteSettings?.albumPage?.selectedFrameLabel || "Selected Frame",
    selectedFrameFallback:
      siteSettings?.albumPage?.selectedFrameFallback ||
      "Titles and notes are now coming from CMS.",
    navigationLabel:
      siteSettings?.albumPage?.navigationLabel || "Navigation",
    previousLabel:
      siteSettings?.albumPage?.previousLabel || "Previous",
    nextLabel:
      siteSettings?.albumPage?.nextLabel || "Next",
  };

  return (
    <main className="min-h-screen bg-black text-white">
      <section className="px-5 pb-12 pt-28 sm:px-8 md:pt-32">
        <div className="mx-auto max-w-[1500px]">
          <VisionCosmos entries={entries} copy={copy} />
        </div>
      </section>
    </main>
  );
}