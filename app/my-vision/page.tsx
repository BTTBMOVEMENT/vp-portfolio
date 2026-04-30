import type { Metadata } from "next";
import Link from "next/link";
import VisionCosmos from "../../components/vision/VisionCosmos";
import { getVisionEntries } from "../../lib/vision";

export const metadata: Metadata = {
  title: "My Vision",
  description: "A cinematic photo atlas of floating frames.",
};

export default async function MyVisionPage() {
  const entries = await getVisionEntries();

  return (
    <main className="min-h-screen bg-black text-white">
      <section className="border-b border-white/10 px-5 pb-8 pt-6 sm:px-8">
        <div className="mx-auto max-w-[1500px]">
          <div className="flex items-center justify-between gap-4 text-[11px] uppercase tracking-[0.28em] text-zinc-400">
            <Link
              href="/"
              className="rounded-full border border-white/10 px-3 py-2 transition hover:border-white/30 hover:text-white"
            >
              Back to Home
            </Link>

            <span>My Vision / Orbital Album</span>
          </div>
        </div>
      </section>

      <section className="px-5 py-12 sm:px-8">
        <div className="mx-auto max-w-[1500px] space-y-14">
          <div className="grid gap-8 xl:grid-cols-[0.5fr_1.5fr] xl:items-end">
            <div className="space-y-4">
              <p className="text-[11px] uppercase tracking-[0.32em] text-zinc-500">
                My Vision
              </p>
              <div className="h-px w-20 bg-white/15" />
              <p className="max-w-sm text-sm leading-7 text-zinc-500">
                A field of personal frames that can later be fully managed through CMS.
              </p>
            </div>

            <div className="space-y-5">
              <h1 className="max-w-[13ch] text-5xl font-semibold leading-[0.92] sm:text-6xl">
                A photo album that behaves like a drifting constellation.
              </h1>

              <p className="max-w-3xl text-sm leading-8 text-zinc-300 sm:text-base">
                Every image inside the vision folder is discovered automatically and
                sorted by file time. Titles and notes are intentionally neutral for now,
                so later they can be replaced cleanly by CMS-managed content instead of
                being tied to file names.
              </p>
            </div>
          </div>

          <VisionCosmos entries={entries} />
        </div>
      </section>
    </main>
  );
}