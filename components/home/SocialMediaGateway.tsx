"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";

type SummaryResponse = {
  x: {
    mode: "live" | "setup-required" | "error";
    message?: string;
    profileUrl: string;
    latest: null | {
      id: string;
      text: string;
      createdAt?: string;
      mediaUrl?: string;
      mediaType?: string;
      permalink: string;
    };
  };
};

function truncate(value: string, limit: number) {
  if (value.length <= limit) return value;
  return `${value.slice(0, limit).trim()}…`;
}

export default function SocialMediaGateway() {
  const [data, setData] = useState<SummaryResponse | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function load() {
      try {
        const response = await fetch("/api/social-summary", {
          signal: controller.signal,
          cache: "no-store",
        });

        if (!response.ok) return;

        const json = (await response.json()) as SummaryResponse;
        setData(json);
      } catch {
        // ignore teaser fetch errors
      }
    }

    void load();

    return () => controller.abort();
  }, []);

  const latest = data?.x?.latest ?? null;
  const live = data?.x?.mode === "live";

  return (
    <section className="border-t border-white/10 px-5 py-20 sm:px-8">
      <div className="mx-auto max-w-[1500px]">
        <motion.div
          className="mb-14 flex flex-col gap-8 xl:flex-row xl:items-end xl:justify-between"
          initial={{ opacity: 0, y: 70 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ amount: 0.2 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
        >
          <div className="max-w-3xl space-y-4">
            <p className="text-[11px] uppercase tracking-[0.32em] text-zinc-400">
              Social Media
            </p>

            <h2 className="max-w-[13ch] text-3xl font-semibold leading-tight sm:text-4xl md:text-5xl">
              A direct X stream rendered inside the site.
            </h2>

            <p className="max-w-2xl text-sm leading-8 text-zinc-300 sm:text-base">
              This section now previews your recent X presence as site-native cards
              instead of relying on the browser widget alone.
            </p>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <Link
              href="/social-media"
              className="inline-flex rounded-full border border-white/10 px-4 py-3 text-sm text-zinc-200 transition hover:border-white/30 hover:text-white"
            >
              Open X Feed
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 80 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ amount: 0.15 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
          className="relative overflow-hidden rounded-[2.75rem] border border-white/10 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.06),transparent_28%),linear-gradient(180deg,rgba(255,255,255,0.03),rgba(255,255,255,0.01))] px-6 py-10 sm:px-8 sm:py-12 lg:px-12 lg:py-14"
        >
          <div className="pointer-events-none absolute -right-4 bottom-0 select-none text-[18vw] font-semibold leading-none tracking-[-0.08em] text-white/[0.04]">
            X
          </div>

          <div className="relative z-10 grid gap-10 xl:grid-cols-[0.7fr_1.3fr] xl:items-end">
            <div className="space-y-4">
              <p className="text-[11px] uppercase tracking-[0.32em] text-zinc-500">
                X Integration
              </p>
              <div className="h-px w-20 bg-white/15" />
              <p className="max-w-sm text-sm leading-8 text-zinc-400">
                A site-native preview of your latest X writing.
              </p>
            </div>

            <div className="space-y-6">
              <h3 className="max-w-[12ch] text-5xl font-semibold leading-[0.96] text-zinc-100 sm:text-6xl">
                BTTBMovement on X.
              </h3>

              <p className="max-w-2xl text-sm leading-8 text-zinc-300 sm:text-base">
                {live && latest?.text
                  ? truncate(latest.text, 220)
                  : "The latest X post will preview here once the feed resolves."}
              </p>

              <div className="flex flex-wrap items-center gap-4">
                <Link
                  href="/social-media"
                  className="inline-flex rounded-full bg-white px-6 py-4 text-sm text-black transition hover:bg-zinc-200"
                >
                  Enter X Feed
                </Link>

                <a
                  href="https://twitter.com/BTTBMovement"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex rounded-full border border-white/15 px-6 py-4 text-sm text-zinc-200 transition hover:border-white/30 hover:text-white"
                >
                  Open Profile
                </a>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}