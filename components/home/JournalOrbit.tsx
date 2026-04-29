"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { formatJournalDate, journalEntries } from "../../lib/journal";

const kindLabelMap = {
  essay: "Essay",
  note: "Note",
  photo: "Photo",
  video: "Video",
} as const;

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
    return {
      left: "50%",
      top: "50%",
      scale: 1,
      opacity: 1,
      rotate: 0,
      zIndex: 40,
    };
  }

  if (offset === -1) {
    return {
      left: "18%",
      top: "59%",
      scale: 0.84,
      opacity: 0.42,
      rotate: -8,
      zIndex: 30,
    };
  }

  if (offset === 1) {
    return {
      left: "82%",
      top: "59%",
      scale: 0.84,
      opacity: 0.42,
      rotate: 8,
      zIndex: 30,
    };
  }

  if (offset <= -2) {
    return {
      left: "-4%",
      top: "70%",
      scale: 0.68,
      opacity: 0.12,
      rotate: -12,
      zIndex: 20,
    };
  }

  return {
    left: "104%",
    top: "70%",
    scale: 0.68,
    opacity: 0.12,
    rotate: 12,
    zIndex: 20,
  };
}

function formatCounter(index: number, total: number) {
  return `${String(index + 1).padStart(2, "0")} / ${String(total).padStart(2, "0")}`;
}

export default function JournalOrbit() {
  const [activeIndex, setActiveIndex] = useState(0);
  const wheelLockRef = useRef(false);
  const touchStartXRef = useRef<number | null>(null);

  const activeEntry = journalEntries[activeIndex]!;

  function goToIndex(index: number) {
    setActiveIndex(wrapIndex(index, journalEntries.length));
  }

  function goToPrevious() {
    setActiveIndex((prev) => wrapIndex(prev - 1, journalEntries.length));
  }

  function goToNext() {
    setActiveIndex((prev) => wrapIndex(prev + 1, journalEntries.length));
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

  function handleKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      goToPrevious();
    }

    if (event.key === "ArrowRight") {
      event.preventDefault();
      goToNext();
    }
  }

  return (
    <section id="journal" className="border-t border-white/10 px-5 py-20 sm:px-8">
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
              Journal
            </p>

            <h2 className="max-w-[13ch] text-3xl font-semibold leading-tight sm:text-4xl md:text-5xl">
              A living layer that moves differently from the portfolio.
            </h2>

            <p className="max-w-2xl text-sm leading-8 text-zinc-300 sm:text-base">
              Instead of showing many posts at once, this section now focuses on one
              entry at the center and treats the rest as orbiting fragments around it.
            </p>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="text-[11px] uppercase tracking-[0.24em] text-zinc-500">
              Swipe on mobile · arrows or two-finger horizontal scroll on desktop
            </div>

            <Link
              href="/journal"
              className="inline-flex rounded-full border border-white/10 px-4 py-3 text-sm text-zinc-200 transition hover:border-white/30 hover:text-white"
            >
              Open Journal
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 80 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ amount: 0.15 }}
          transition={{ duration: 0.95, ease: "easeOut" }}
          className="relative overflow-hidden rounded-[2.75rem] border border-white/10 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.06),transparent_28%),linear-gradient(180deg,rgba(255,255,255,0.03),rgba(255,255,255,0.01))] px-4 py-5 sm:px-6 sm:py-6 lg:px-10 lg:py-8"
        >
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-2">
              <p className="text-[11px] uppercase tracking-[0.32em] text-zinc-500">
                Orbit Rail
              </p>
              <p className="text-sm leading-7 text-zinc-300">
                One journal entry stays centered. The others rotate around it.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <motion.button
                type="button"
                whileTap={{ scale: 0.95 }}
                onClick={goToPrevious}
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 text-zinc-200 transition hover:border-white/30 hover:text-white"
                aria-label="Previous journal entry"
              >
                ←
              </motion.button>

              <div className="min-w-[5.5rem] text-center text-[11px] uppercase tracking-[0.28em] text-zinc-500">
                {formatCounter(activeIndex, journalEntries.length)}
              </div>

              <motion.button
                type="button"
                whileTap={{ scale: 0.95 }}
                onClick={goToNext}
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 text-zinc-200 transition hover:border-white/30 hover:text-white"
                aria-label="Next journal entry"
              >
                →
              </motion.button>
            </div>
          </div>

          <div
            tabIndex={0}
            onWheel={handleWheel}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            onKeyDown={handleKeyDown}
            className="relative h-[32rem] overflow-hidden outline-none sm:h-[36rem] lg:h-[42rem]"
          >
            <div className="pointer-events-none absolute left-1/2 top-1/2 h-[72%] w-[130%] -translate-x-1/2 -translate-y-1/2 rounded-[100%] border border-white/[0.06]" />
            <div className="pointer-events-none absolute left-1/2 top-1/2 h-[52%] w-[112%] -translate-x-1/2 -translate-y-1/2 rounded-[100%] border border-white/[0.04]" />
            <div className="pointer-events-none absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-black via-black/85 to-transparent sm:w-28 lg:w-40" />
            <div className="pointer-events-none absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-black via-black/85 to-transparent sm:w-28 lg:w-40" />

            {journalEntries.map((entry, index) => {
              const wrappedOffset = getWrappedOffset(
                index,
                activeIndex,
                journalEntries.length
              );
              const state = getOrbitState(wrappedOffset);
              const isActive = wrappedOffset === 0;

              return (
                <motion.article
                  key={entry.slug}
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
                    <div className="overflow-hidden rounded-[2.25rem] border border-white/10 bg-white/[0.03] shadow-[0_30px_80px_rgba(0,0,0,0.45)]">
                      <div className="grid gap-0 lg:grid-cols-[1.05fr_0.95fr]">
                        <div className="relative aspect-[4/5] sm:aspect-[16/10] lg:min-h-[34rem]">
                          <Image
                            src={entry.coverImage}
                            alt={entry.coverAlt}
                            fill
                            sizes="(max-width: 1280px) 100vw, 55vw"
                            className="object-cover"
                          />

                          <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/25 to-black/80" />

                          <div className="absolute left-6 top-6 space-y-1">
                            <p className="text-[11px] uppercase tracking-[0.28em] text-zinc-200">
                              {kindLabelMap[entry.kind]}
                            </p>
                            <p className="text-[11px] uppercase tracking-[0.22em] text-zinc-500">
                              Featured Entry
                            </p>
                          </div>

                          <div className="absolute bottom-6 left-6 right-6">
                            <div className="space-y-3">
                              <p className="text-[11px] uppercase tracking-[0.24em] text-zinc-200">
                                {formatJournalDate(entry.publishedAt)}
                              </p>
                              <div className="h-px w-full bg-white/20" />
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col justify-between gap-8 p-6 sm:p-8">
                          <div className="space-y-5">
                            <div className="flex flex-wrap items-center gap-3 text-[11px] uppercase tracking-[0.24em] text-zinc-500">
                              <span>{entry.readTime}</span>
                              <span>{kindLabelMap[entry.kind]}</span>
                            </div>

                            <h3 className="max-w-[12ch] text-4xl font-semibold leading-[0.95] sm:text-5xl">
                              {entry.title}
                            </h3>

                            <p className="max-w-xl text-sm leading-8 text-zinc-300 sm:text-base">
                              {entry.excerpt}
                            </p>
                          </div>

                          <div className="space-y-4">
                            <div className="flex flex-wrap gap-3">
                              {entry.tags.map((tag) => (
                                <span
                                  key={tag}
                                  className="rounded-full border border-white/10 px-4 py-2 text-sm text-zinc-200"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>

                            <div className="flex items-center justify-between gap-4 text-[11px] uppercase tracking-[0.24em] text-zinc-500">
                              <Link
                                href={`/journal/${entry.slug}`}
                                className="rounded-full border border-white/10 px-4 py-3 text-sm text-zinc-200 transition hover:border-white/30 hover:text-white"
                              >
                                Open Entry
                              </Link>

                              <span>{formatCounter(activeIndex, journalEntries.length)}</span>
                            </div>

                            <div className="h-px w-full bg-white/10" />
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => goToIndex(index)}
                      className="block w-full text-left"
                      aria-label={`Select journal entry ${entry.title}`}
                    >
                      <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-zinc-900">
                        <div className="relative min-h-[18rem] aspect-[4/5]">
                          <Image
                            src={entry.coverImage}
                            alt={entry.coverAlt}
                            fill
                            sizes="(max-width: 1024px) 50vw, 35vw"
                            className="object-cover"
                          />

                          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/45 to-black/85" />

                          <div className="absolute left-5 top-5 space-y-1">
                            <p className="text-[10px] uppercase tracking-[0.28em] text-zinc-200">
                              {wrappedOffset < 0 ? "Previous" : "Next"}
                            </p>
                            <p className="text-[10px] uppercase tracking-[0.22em] text-zinc-500">
                              {kindLabelMap[entry.kind]}
                            </p>
                          </div>

                          <div className="absolute bottom-5 left-5 right-5 space-y-3">
                            <h3 className="max-w-[10ch] text-2xl font-semibold leading-tight text-zinc-100">
                              {entry.title}
                            </h3>

                            <p className="text-[11px] uppercase tracking-[0.22em] text-zinc-400">
                              {formatJournalDate(entry.publishedAt)}
                            </p>

                            <div className="h-px w-full bg-white/15" />
                          </div>
                        </div>
                      </div>
                    </button>
                  )}
                </motion.article>
              );
            })}
          </div>

          <div className="mt-6 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-3">
              <p className="text-[11px] uppercase tracking-[0.32em] text-zinc-500">
                Selected Entry
              </p>

              <div className="flex flex-wrap gap-3">
                {activeEntry.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-white/10 px-4 py-2 text-sm text-zinc-200"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2">
              {journalEntries.map((entry, index) => (
                <button
                  key={entry.slug}
                  type="button"
                  onClick={() => goToIndex(index)}
                  aria-label={`Go to journal entry ${index + 1}`}
                  className={`h-2.5 rounded-full transition ${
                    index === activeIndex
                      ? "w-10 bg-white"
                      : "w-2.5 bg-white/25 hover:bg-white/40"
                  }`}
                />
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}