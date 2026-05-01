"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import SpotlightRouteButton from "../common/SpotlightRouteButton";

function wrapIndex(index: number, total: number) {
  return (index + total) % total;
}

function getWrappedOffset(index: number, activeIndex: number, total: number) {
  let offset = index - activeIndex;

  if (offset > total / 2) offset -= total;
  if (offset < -total / 2) offset += total;

  return offset;
}

function getOrbitState(offset: number) {
  if (offset === 0) {
    return { left: "50%", top: "50%", scale: 1, opacity: 1, rotate: 0, zIndex: 40 };
  }
  if (offset === -1) {
    return { left: "18%", top: "59%", scale: 0.84, opacity: 0.42, rotate: -8, zIndex: 30 };
  }
  if (offset === 1) {
    return { left: "82%", top: "59%", scale: 0.84, opacity: 0.42, rotate: 8, zIndex: 30 };
  }
  if (offset <= -2) {
    return { left: "-4%", top: "70%", scale: 0.68, opacity: 0.12, rotate: -12, zIndex: 20 };
  }
  return { left: "104%", top: "70%", scale: 0.68, opacity: 0.12, rotate: 12, zIndex: 20 };
}

function formatCounter(index: number, total: number) {
  return `${String(index + 1).padStart(2, "0")} / ${String(total).padStart(2, "0")}`;
}

function formatDate(value?: string) {
  if (!value) return "";
  try {
    return new Intl.DateTimeFormat("en-US", { dateStyle: "medium" }).format(new Date(value));
  } catch {
    return value;
  }
}

type JournalPreviewEntry = {
  _id: string;
  title: string;
  slug: string;
  kind: "essay" | "note" | "photo" | "video";
  excerpt?: string;
  coverImageUrl?: string;
  tags?: string[];
  publishedAt?: string;
  readTime: string;
};

type JournalOrbitProps = {
  entries: JournalPreviewEntry[];
  sectionLabel?: string;
  title?: string;
  description?: string;
  ctaLabel?: string;
  helperText?: string;
};

export default function JournalOrbit({
  entries,
  sectionLabel = "Journal",
  title = "A living layer that moves differently from the portfolio.",
  description = "Instead of showing many posts at once, this section now focuses on one entry at the center and treats the rest as orbiting fragments around it.",
  ctaLabel = "Open Journal",
  helperText = "Swipe on mobile · arrows or two-finger horizontal scroll on desktop",
}: JournalOrbitProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const wheelLockRef = useRef(false);
  const touchStartXRef = useRef<number | null>(null);

  if (!entries || entries.length === 0) {
    return (
      <section id="journal" className="border-t border-white/10 px-5 py-20 sm:px-8">
        <div className="mx-auto max-w-[1500px]">
          <p className="text-[11px] uppercase tracking-[0.32em] text-zinc-400">
            {sectionLabel}
          </p>
          <h2 className="mt-4 text-3xl font-semibold text-zinc-100">
            No journal entries published yet.
          </h2>
        </div>
      </section>
    );
  }

  const activeEntry = entries[activeIndex]!;

  function goToIndex(index: number) {
    setActiveIndex(wrapIndex(index, entries.length));
  }

  function goToPrevious() {
    setActiveIndex((prev) => wrapIndex(prev - 1, entries.length));
  }

  function goToNext() {
    setActiveIndex((prev) => wrapIndex(prev + 1, entries.length));
  }

  function handleWheel(event: React.WheelEvent<HTMLDivElement>) {
    const horizontalDelta =
      Math.abs(event.deltaX) > Math.abs(event.deltaY)
        ? event.deltaX
        : event.shiftKey
        ? event.deltaY
        : 0;

    if (Math.abs(horizontalDelta) < 18) return;
    if (wheelLockRef.current) return;

    event.preventDefault();

    if (horizontalDelta > 0) {
      goToNext();
    } else {
      goToPrevious();
    }

    wheelLockRef.current = true;
    window.setTimeout(() => {
      wheelLockRef.current = false;
    }, 420);
  }

  function handleTouchStart(event: React.TouchEvent<HTMLDivElement>) {
    touchStartXRef.current = event.touches[0]?.clientX ?? null;
  }

  function handleTouchEnd(event: React.TouchEvent<HTMLDivElement>) {
    if (touchStartXRef.current === null) return;

    const endX = event.changedTouches[0]?.clientX ?? touchStartXRef.current;
    const delta = endX - touchStartXRef.current;

    if (delta > 50) {
      goToPrevious();
    } else if (delta < -50) {
      goToNext();
    }

    touchStartXRef.current = null;
  }

  return (
    <section id="journal" className="border-t border-white/10 px-5 py-20 sm:px-8">
      <div className="mx-auto max-w-[1500px]">
        <div className="mb-14 flex flex-col gap-8 xl:flex-row xl:items-end xl:justify-between">
          <div className="max-w-3xl space-y-4">
            <p className="text-[11px] uppercase tracking-[0.32em] text-zinc-400">
              {sectionLabel}
            </p>

            <h2 className="max-w-[13ch] text-3xl font-semibold leading-tight sm:text-4xl md:text-5xl">
              {title}
            </h2>

            <p className="max-w-2xl text-sm leading-8 text-zinc-300 sm:text-base">
              {description}
            </p>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="text-[11px] uppercase tracking-[0.24em] text-zinc-500">
              {helperText}
            </div>

            <SpotlightRouteButton
              href="/journal"
              label={ctaLabel}
              overlayTitle="Journal"
              overlaySubtitle="Opening live archive"
              className="inline-flex rounded-full border border-white/10 px-4 py-3 text-sm text-zinc-200 transition hover:border-white/30 hover:text-white"
            />
          </div>
        </div>

        <div className="relative overflow-hidden rounded-[2.75rem] border border-white/10 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.06),transparent_28%),linear-gradient(180deg,rgba(255,255,255,0.03),rgba(255,255,255,0.01))] px-4 py-5 sm:px-6 sm:py-6 lg:px-10 lg:py-8">
          <div className="mb-6 flex items-center justify-between">
            <div className="text-[11px] uppercase tracking-[0.32em] text-zinc-500">
              Orbit Rail
            </div>

            <div className="min-w-[5.5rem] text-center text-[11px] uppercase tracking-[0.28em] text-zinc-500">
              {formatCounter(activeIndex, entries.length)}
            </div>
          </div>

          <div
            onWheel={handleWheel}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            className="relative h-[32rem] overflow-hidden outline-none sm:h-[36rem] lg:h-[42rem]"
          >
            {entries.map((entry, index) => {
              const wrappedOffset = getWrappedOffset(index, activeIndex, entries.length);
              const state = getOrbitState(wrappedOffset);
              const isActive = wrappedOffset === 0;

              return (
                <motion.article
                  key={entry._id}
                  className="absolute w-[84%] -translate-x-1/2 -translate-y-1/2 sm:w-[78%] lg:w-[72%]"
                  style={{ zIndex: state.zIndex }}
                  animate={{
                    left: state.left,
                    top: state.top,
                    scale: state.scale,
                    opacity: state.opacity,
                    rotateZ: state.rotate,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 150,
                    damping: 22,
                    mass: 0.9,
                  }}
                >
                  {isActive ? (
                    <div className="overflow-hidden rounded-[2.25rem] border border-white/10 bg-white/[0.03]">
                      <div className="grid gap-0 lg:grid-cols-[1.05fr_0.95fr]">
                        <div className="relative aspect-[4/5] sm:aspect-[16/10] lg:min-h-[34rem]">
                          {entry.coverImageUrl ? (
                            <img
                              src={entry.coverImageUrl}
                              alt={entry.title}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="absolute inset-0 bg-zinc-900" />
                          )}

                          <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/25 to-black/80" />
                        </div>

                        <div className="flex flex-col justify-between gap-8 p-6 sm:p-8">
                          <div className="space-y-5">
                            <div className="flex flex-wrap items-center gap-3 text-[11px] uppercase tracking-[0.24em] text-zinc-500">
                              <span>{entry.readTime}</span>
                              <span>{entry.kind}</span>
                            </div>

                            <h3 className="max-w-[12ch] text-4xl font-semibold leading-[0.95] sm:text-5xl">
                              {entry.title}
                            </h3>

                            <p className="max-w-xl text-sm leading-8 text-zinc-300 sm:text-base">
                              {entry.excerpt}
                            </p>

                            <p className="text-[11px] uppercase tracking-[0.22em] text-zinc-400">
                              {formatDate(entry.publishedAt)}
                            </p>
                          </div>

                          <div className="space-y-4">
                            <div className="flex flex-wrap gap-3">
                              {(entry.tags || []).map((tag) => (
                                <span
                                  key={tag}
                                  className="rounded-full border border-white/10 px-4 py-2 text-sm text-zinc-200"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>

                            <Link
                              href={`/journal/${entry.slug}`}
                              className="inline-flex rounded-full border border-white/10 px-4 py-3 text-sm text-zinc-200 transition hover:border-white/30 hover:text-white"
                            >
                              Open Entry
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => goToIndex(index)}
                      className="block w-full text-left"
                    >
                      <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-zinc-900">
                        <div className="relative min-h-[18rem] aspect-[4/5]">
                          {entry.coverImageUrl ? (
                            <img
                              src={entry.coverImageUrl}
                              alt={entry.title}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="absolute inset-0 bg-zinc-900" />
                          )}

                          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/45 to-black/85" />

                          <div className="absolute bottom-5 left-5 right-5 space-y-3">
                            <h3 className="max-w-[10ch] text-2xl font-semibold leading-tight text-zinc-100">
                              {entry.title}
                            </h3>

                            <p className="text-[11px] uppercase tracking-[0.22em] text-zinc-400">
                              {formatDate(entry.publishedAt)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </button>
                  )}
                </motion.article>
              );
            })}
          </div>

          <div className="mt-6 flex items-center gap-2">
            {entries.map((entry, index) => (
              <button
                key={entry._id}
                type="button"
                onClick={() => goToIndex(index)}
                className={`h-2.5 rounded-full transition ${
                  index === activeIndex ? "w-10 bg-white" : "w-2.5 bg-white/25 hover:bg-white/40"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}