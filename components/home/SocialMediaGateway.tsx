"use client";

import Link from "next/link";
import { motion } from "motion/react";

export default function SocialMediaGateway() {
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
              A direct stream from X inside the site.
            </h2>

            <p className="max-w-2xl text-sm leading-8 text-zinc-300 sm:text-base">
              Instead of depending on API entitlements, this section now points into an
              embedded X timeline that updates directly from your account.
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
                A token-free embed route for your live X posts.
              </p>
            </div>

            <div className="space-y-6">
              <h3 className="max-w-[12ch] text-5xl font-semibold leading-[0.96] text-zinc-100 sm:text-6xl">
                BTTBMovement on X.
              </h3>

              <p className="max-w-2xl text-sm leading-8 text-zinc-300 sm:text-base">
                Your latest posts can live here as a parallel publishing layer, without
                needing to keep a separate custom API renderer alive.
              </p>

              <div className="flex flex-wrap items-center gap-4">
                <Link
                  href="/social-media"
                  className="inline-flex rounded-full bg-white px-6 py-4 text-sm text-black transition hover:bg-zinc-200"
                >
                  Enter X Feed
                </Link>

                <a
                  href="https://x.com/BTTBMovement"
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