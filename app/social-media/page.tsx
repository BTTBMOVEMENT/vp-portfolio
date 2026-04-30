import type { Metadata } from "next";
import Link from "next/link";
import XTimeline from "../../components/social/XTimeline";

export const metadata: Metadata = {
  title: "Social Media",
  description: "An embedded X timeline inside the site.",
};

export default function SocialMediaPage() {
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

            <span>Social Media / X Feed</span>
          </div>
        </div>
      </section>

      <section className="px-5 py-12 sm:px-8">
        <div className="mx-auto max-w-[1500px] space-y-14">
          <div className="grid gap-8 xl:grid-cols-[0.5fr_1.5fr] xl:items-end">
            <div className="space-y-4">
              <p className="text-[11px] uppercase tracking-[0.32em] text-zinc-500">
                Social Media
              </p>
              <div className="h-px w-20 bg-white/15" />
              <p className="max-w-sm text-sm leading-7 text-zinc-500">
                A direct stream from your X account, embedded into the site.
              </p>
            </div>

            <div className="space-y-5">
              <h1 className="max-w-[13ch] text-5xl font-semibold leading-[0.92] sm:text-6xl">
                A live X timeline inside the site.
              </h1>

              <p className="max-w-3xl text-sm leading-8 text-zinc-300 sm:text-base">
                This page uses the official embedded timeline route, but mounts it
                programmatically so the site has more control over how the feed loads.
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div className="space-y-2">
                <p className="text-[11px] uppercase tracking-[0.32em] text-zinc-500">
                  X Feed
                </p>
                <h2 className="text-4xl font-semibold leading-tight text-zinc-100 sm:text-5xl">
                  @BTTBMovement
                </h2>
              </div>

              <a
                href="https://twitter.com/BTTBMovement"
                target="_blank"
                rel="noreferrer"
                className="inline-flex rounded-full border border-white/10 px-4 py-3 text-sm text-zinc-200 transition hover:border-white/30 hover:text-white"
              >
                Open X Profile
              </a>
            </div>

            <XTimeline username="BTTBMovement" height={980} />
          </div>
        </div>
      </section>
    </main>
  );
}