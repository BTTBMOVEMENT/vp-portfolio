import type { Metadata } from "next";
import VisionCosmos from "../../components/vision/VisionCosmos";
import { sanityFetch } from "../../sanity/lib/client";
import { ALBUM_ITEMS_QUERY } from "../../sanity/lib/queries";

export const metadata: Metadata = {
  title: "My Album",
  description: "A cinematic photo album of drifting frames.",
};

export const revalidate = 0;

export default async function MyAlbumPage() {
  const rawEntries =
    (await sanityFetch({
      query: ALBUM_ITEMS_QUERY,
      revalidate: 0,
    })) || [];

  const entries = rawEntries.map((item: any) => ({
    id: item._id,
    title: item.title,
    imageUrl: item.imageUrl,
    videoUrl: item.videoUrl,
    capturedAt: item.capturedAt,
    note: item.note,
  }));

  return (
    <main className="min-h-screen bg-black text-white">
      <section className="px-5 pb-12 pt-28 sm:px-8 md:pt-32">
        <div className="mx-auto max-w-[1500px]">
          <VisionCosmos entries={entries} />
        </div>
      </section>
    </main>
  );
}