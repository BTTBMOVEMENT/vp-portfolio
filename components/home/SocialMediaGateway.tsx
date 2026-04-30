"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";

type SocialPlatformSummary = {
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

type SocialSummaryResponse = {
  x: SocialPlatformSummary;
  instagram: SocialPlatformSummary;
};

function truncateText(value: string, length: number) {
  if (value.length <= length) return value;
  return `${value.slice(0, length).trim()}…`;
}

function formatDate(value?: string) {
  if (!value) return "";
  try {
    return new Intl.DateTimeFormat("en-US", {
      dateStyle: "medium",
    }).format(new Date(value));
  } catch {
    return value;
  }
}

function SocialCard({
  label,
  summary,
}: {
  label: "X" | "Instagram";
  summary: SocialPlatformSummary | null;
}) {
  const isLoading = summary === null;

  return (
    <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.03]">
      <div className="grid gap-0 sm:grid-cols-[0.9fr_1.1fr]">
        <div className="relative min-h-[18rem] bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_28%)]">
          {summary?.latest?.mediaUrl ? (
            <img
              src={summary.latest.mediaUrl}
              alt=""
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.06),transparent_28%),linear-gradient(180deg,rgba(255,255,255,0.03),rgba(255,255,255,0.01))]" />
          )}

          <div className="absolute inset-0 bg-gradient-to-b from-black/5 via-black/25 to-black/80" />

          <div className="absolute left-5 top-5 space-y-1">
            <p className="text-[11px] uppercase tracking-[0.28em] text-zinc-200">
              {label}
            </p>
            <p className="text-[11px] uppercase tracking-[0.22em] text-zinc-500">
              {isLoading
                ? "Loading"
                : summary?.mode === "live"
                ? "Latest Post"
                : summary?.mode === "setup-required"
                ? "Setup Needed"
                : "Connection Error"}
            </p>
          </div>
        </div>

        <div className="flex flex-col justify-between gap-6 p-5">
          <div className="space-y-4">
            {isLoading ? (
              <>
                <div className="h-3 w-24 rounded-full bg-white/10" />
                <div className="space-y-2">
                  <div className="h-3 w-full rounded-full bg-white/10" />
                  <div className="h-3 w-[92%] rounded-full bg-white/10" />
                  <div className="h-3 w-[70%] rounded-full bg-white/10" />
                </div>
              </>
            ) : summary?.mode === "live" && summary.latest ? (
              <>
                <p className="text-[11px] uppercase tracking-[0.24em] text-zinc-500">
                  {formatDate(summary.latest.createdAt)}
                </p>

                <p className="text-sm leading-8 text-zinc-200 sm:text-base">
                  {summary.latest.text?.trim()
                    ? truncateText(summary.latest.text, 220)
                    : "No caption."}
                </p>
              </>
            ) : (
              <>
                <p className="text-[11px] uppercase tracking-[0.24em] text-zinc-500">
                  Awaiting Live Feed
                </p>

                <p className="text-sm leading-8 text-zinc-300 sm:text-base">
                  {summary?.message ||
                    "This platform is ready for live sync once credentials are connected."}
                </p>
              </>
            )}
          </div>

          <div className="space-y-3">
            <div className="flex flex-wrap gap-3">
              <a
                href={summary?.profileUrl || "#"}
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-white/10 px-4 py-3 text-sm text-zinc-200 transition hover:border-white/30 hover:text-white"
              >
                Open {label}
              </a>

              {summary?.latest?.permalink && (
                <a
                  href={summary.latest.permalink}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full border border-white/10 px-4 py-3 text-sm text-zinc-200 transition hover:border-white/30 hover:text-white"
                >
                  Open Post
                </a>
              )}
            </div>

            <div className="h-px w-full bg-white/10" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SocialMediaGateway() {
  const [data, setData] = useState<SocialSummaryResponse | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function load() {
      try {
        const response = await fetch("/api/social-summary", {
          signal: controller.signal,
          cache: "no-store",
        });

        if (!response.ok) return;

        const json = (await response.json()) as SocialSummaryResponse;
        setData(json);
      } catch {
        // ignore teaser fetch errors; page still works
      }
    }

    void load();

    return () => controller.abort();
  }, []);

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
              A live publishing layer beside the archive.
            </h2>

            <p className="max-w-2xl text-sm leading-8 text-zinc-300 sm:text-base">
              X and Instagram can be surfaced here as a parallel stream: not a feed
              cloned from another platform, but a curated layer inside the site.
            </p>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <Link
              href="/social-media"
              className="inline-flex rounded-full border border-white/10 px-4 py-3 text-sm text-zinc-200 transition hover:border-white/30 hover:text-white"
            >
              Open Social Media Hub
            </Link>
          </div>
        </motion.div>

        <div className="grid gap-6 xl:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 80 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ amount: 0.15 }}
            transition={{ duration: 0.9, ease: "easeOut" }}
          >
            <SocialCard label="X" summary={data?.x ?? null} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 80 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ amount: 0.15 }}
            transition={{ duration: 0.9, ease: "easeOut", delay: 0.06 }}
          >
            <SocialCard label="Instagram" summary={data?.instagram ?? null} />
          </motion.div>
        </div>
      </div>
    </section>
  );
}