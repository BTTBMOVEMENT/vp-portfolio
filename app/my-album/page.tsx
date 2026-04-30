import type { Metadata } from "next";
import VisionCosmos from "../../components/vision/VisionCosmos";
import { getVisionEntries } from "../../lib/vision";

export const metadata: Metadata = {
  title: "My Album",
  description: "A cinematic photo album of drifting frames.",
};

export default async function MyAlbumPage() {
  const entries = await getVisionEntries();

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