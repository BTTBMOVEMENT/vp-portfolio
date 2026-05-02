"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";

type JournalEntry = {
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

type JournalCosmosCopy = {
  pageLabel?: string;
  title?: string;
  description?: string;
  orbitLabel?: string;
  orbitDescription?: string;
  spreadLabel?: string;
  mixLabel?: string;
  previousLabel?: string;
  nextLabel?: string;
  enterEntryLabel?: string;
};

type JournalCosmosProps = {
  entries: JournalEntry[];
  copy?: JournalCosmosCopy;
};

type Viewport = {
  width: number;
  height: number;
};

function wrapIndex(index: number, total: number) {
  return (index + total) % total;
}

function getWrappedOffset(index: number, activeIndex: number, total: number) {
  let offset = index - activeIndex;

  if (offset > total / 2) offset -= total;
  if (offset < -total / 2) offset += total;

  return offset;
}

function getOrbitState(offset: number, total: number, isMobile: boolean) {
  if (offset === 0) {
    return {
      left: "50%",
      top: isMobile ? "52%" : "50%",
      opacity: 1,
      rotateY: 0,
      rotateX: 0,
      rotateZ: 0,
      zIndex: 50,
    };
  }

  if (offset === -1) {
    return {
      left: total === 2 ? "24%" : isMobile ? "18%" : "22%",
      top: isMobile ? "68%" : "60%",
      opacity: 0.55,
      rotateY: isMobile ? 0 : 28,
      rotateX: 0,
      rotateZ: -4,
      zIndex: 40,
    };
  }

  if (offset === 1) {
    return {
      left: total === 2 ? "76%" : isMobile ? "82%" : "78%",
      top: isMobile ? "68%" : "60%",
      opacity: 0.55,
      rotateY: isMobile ? 0 : -28,
      rotateX: 0,
      rotateZ: 4,
      zIndex: 40,
    };
  }

  const distance = Math.abs(offset);
  const direction = offset < 0 ? -1 : 1;
  const spread = Math.min(44, 26 + distance * 8);
  const top = 44 + distance * 5;

  return {
    left: `${50 + direction * spread}%`,
    top: `${top}%`,
    opacity: Math.max(0.1, 0.24 - distance * 0.06),
    rotateY: isMobile ? 0 : direction * (34 + distance * 6),
    rotateX: 0,
    rotateZ: direction * (5 + distance * 1.4),
    zIndex: 20,
  };
}

function getAtlasState(index: number, total: number, isMobile: boolean) {
  const columns = isMobile ? Math.min(2, total) : total <= 4 ? total : 4;
  const rows = Math.ceil(total / columns);

  const columnIndex = index % columns;
  const rowIndex = Math.floor(index / columns);

  const left =
    columns === 1 ? 50 : 18 + (columnIndex * 64) / (columns - 1);

  const top =
    rows === 1 ? 50 : 30 + (rowIndex * 40) / Math.max(1, rows - 1);

  return {
    left: `${left}%`,
    top: `${top}%`,
    opacity: 1,
    rotateY: 0,
    rotateX: 0,
    rotateZ: 0,
    zIndex: 30 + rowIndex,
  };
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

export default function JournalCosmos({ entries, copy }: JournalCosmosProps) {
  const router = useRouter();

  const [activeIndex, setActiveIndex] = useState(0);
  const [showAtlas, setShowAtlas] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [viewport, setViewport] = useState<Viewport>({ width: 1440, height: 900 });

  const wheelLockRef = useRef(false);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 767px)");
    const update = () => setIsMobile(mediaQuery.matches);
    update();

    mediaQuery.addEventListener("change", update);
    return () => mediaQuery.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const updateViewport = () => {
      setViewport({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    updateViewport();
    window.addEventListener("resize", updateViewport);

    return () => window.removeEventListener("resize", updateViewport);
  }, []);

  const total = entries.length;

  const visibleEntries = useMemo(() => {
    if (showAtlas) return entries;

    return entries.filter((_, index) => {
      const offset = Math.abs(getWrappedOffset(index, activeIndex, total));
      return isMobile ? offset <= 1 : offset <= 2;
    });
  }, [entries, showAtlas, activeIndex, total, isMobile]);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    if (isMobile || showAtlas) return;

    function onWheel(event: WheelEvent) {
      if (wheelLockRef.current) return;

      const dominantDelta =
        Math.abs(event.deltaY) >= Math.abs(event.deltaX) ? event.deltaY : event.deltaX;

      if (Math.abs(dominantDelta) < 18) return;

      event.preventDefault();

      if (dominantDelta > 0) {
        setActiveIndex((prev) => wrapIndex(prev + 1, total));
      } else {
        setActiveIndex((prev) => wrapIndex(prev - 1, total));
      }

      wheelLockRef.current = true;
      window.setTimeout(() => {
        wheelLockRef.current = false;
      }, 460);
    }

    stage.addEventListener("wheel", onWheel, { passive: false });

    return () => {
      stage.removeEventListener("wheel", onWheel);
    };
  }, [isMobile, showAtlas, total]);

  if (total === 0) {
    return (
      <section className="rounded-[2.75rem] border border-white/10 bg-white/[0.03] px-6 py-10">
        <div className="space-y-4">
          <p className="text-[11px] uppercase tracking-[0.32em] text-zinc-500">
            {copy?.pageLabel || "Journal"}
          </p>
          <h3 className="text-3xl font-semibold leading-tight text-zinc-100">
            No journal entries published yet.
          </h3>
        </div>
      </section>
    );
  }

  function goToIndex(index: number) {
    setActiveIndex(wrapIndex(index, total));
  }

  function goToPrevious() {
    setActiveIndex((prev) => wrapIndex(prev - 1, total));
  }

  function goToNext() {
    setActiveIndex((prev) => wrapIndex(prev + 1, total));
  }

  function handleTouchStart(event: React.TouchEvent<HTMLDivElement>) {
    if (showAtlas) return;

    touchStartRef.current = {
      x: event.touches[0]?.clientX ?? 0,
      y: event.touches[0]?.clientY ?? 0,
    };
  }

  function handleTouchEnd(event: React.TouchEvent<HTMLDivElement>) {
    if (showAtlas) return;
    if (!touchStartRef.current) return;

    const endX = event.changedTouches[0]?.clientX ?? touchStartRef.current.x;
    const endY = event.changedTouches[0]?.clientY ?? touchStartRef.current.y;

    const dx = endX - touchStartRef.current.x;
    const dy = endY - touchStartRef.current.y;

    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 50) {
      if (dx > 0) {
        goToPrevious();
      } else {
        goToNext();
      }
    }

    touchStartRef.current = null;
  }

  const activeWidth = isMobile ? viewport.width * 0.82 : Math.min(860, viewport.width * 0.68);
  const activeHeight = isMobile ? viewport.height * 0.56 : Math.min(540, viewport.height * 0.62);

  const thumbWidth = isMobile ? viewport.width * 0.36 : 240;
  const thumbHeight = isMobile ? viewport.width * 0.5 : 320;

  const atlasWidth = isMobile ? viewport.width * 0.38 : 260;
  const atlasHeight = isMobile ? viewport.width * 0.52 : 340;

  return (
    <section className="space-y-8">
      <div className="flex flex-col gap-8 xl:flex-row xl:items-end xl:justify-between">
        <div className="max-w-3xl space-y-4">
          <p className="text-[11px] uppercase tracking-[0.32em] text-zinc-500">
            {copy?.pageLabel || "Journal"}
          </p>

          <h2 className="max-w-[12ch] text-4xl font-semibold leading-[0.95] sm:text-5xl md:text-6xl">
            {copy?.title || "A drifting field of notes and experiments."}
          </h2>

          <p className="max-w-2xl text-sm leading-8 text-zinc-300 sm:text-base">
            {copy?.description || "Browse the journal in orbit, then enter the selected note directly."}
          </p>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <button
            type="button"
            onClick={() => setShowAtlas((prev) => !prev)}
            className="rounded-full border border-white/10 px-4 py-3 text-sm text-zinc-200 transition hover:border-white/30 hover:text-white"
          >
            {showAtlas
              ? copy?.mixLabel || "Mix Again"
              : copy?.spreadLabel || "Spread Entries"}
          </button>

          <div className="rounded-full border border-white/10 px-4 py-3 text-sm text-zinc-200">
            {formatCounter(activeIndex, total)}
          </div>
        </div>
      </div>

      <div className="relative overflow-hidden rounded-[2.75rem] border border-white/10 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.06),transparent_28%),linear-gradient(180deg,rgba(255,255,255,0.03),rgba(255,255,255,0.01))] px-4 py-5 sm:px-6 sm:py-6 lg:px-10 lg:py-8">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2">
            <p className="text-[11px] uppercase tracking-[0.32em] text-zinc-500">
              {copy?.orbitLabel || "Journal Orbit"}
            </p>
            <p className="text-sm leading-7 text-zinc-300">
              {copy?.orbitDescription ||
                (showAtlas
                  ? "All entries are aligned. Click one to open it."
                  : "One entry stays dominant while the rest move in orbit.")}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <motion.button
              type="button"
              whileTap={{ scale: 0.95 }}
              onClick={goToPrevious}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 text-zinc-200 transition hover:border-white/30 hover:text-white"
              aria-label="Previous entry"
            >
              ←
            </motion.button>

            <motion.button
              type="button"
              whileTap={{ scale: 0.95 }}
              onClick={goToNext}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 text-zinc-200 transition hover:border-white/30 hover:text-white"
              aria-label="Next entry"
            >
              →
            </motion.button>
          </div>
        </div>

        <div
          ref={stageRef}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          className="relative h-[40rem] overflow-hidden outline-none sm:h-[48rem] lg:h-[58rem]"
          style={{
            perspective: isMobile ? "1100px" : "1800px",
            touchAction: showAtlas ? "auto" : "pan-y pinch-zoom",
          }}
        >
          <div className="pointer-events-none absolute left-1/2 top-1/2 h-[76%] w-[132%] -translate-x-1/2 -translate-y-1/2 rounded-[100%] border border-white/[0.06]" />
          <div className="pointer-events-none absolute left-1/2 top-1/2 h-[54%] w-[116%] -translate-x-1/2 -translate-y-1/2 rounded-[100%] border border-white/[0.04]" />

          {visibleEntries.map((entry) => {
            const index = entries.findIndex((item) => item._id === entry._id);
            const isActive = index === activeIndex;

            const frameWidth = showAtlas ? atlasWidth : isActive ? activeWidth : thumbWidth;
            const frameHeight = showAtlas ? atlasHeight : isActive ? activeHeight : thumbHeight;

            const state = showAtlas
              ? getAtlasState(index, total, isMobile)
              : getOrbitState(getWrappedOffset(index, activeIndex, total), total, isMobile);

            return (
              <motion.button
                key={entry._id}
                type="button"
                onClick={() => router.push(`/journal/${entry.slug}`)}
                className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer"
                style={{ zIndex: state.zIndex }}
                animate={{
                  left: state.left,
                  top: state.top,
                  width: frameWidth,
                  height: frameHeight,
                  opacity: state.opacity,
                  rotateY: state.rotateY,
                  rotateX: state.rotateX,
                  rotateZ: state.rotateZ,
                }}
                transition={{
                  duration: isMobile ? 0.68 : 0.56,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                <div className="relative h-full w-full overflow-hidden rounded-[1.7rem] border border-white/10 bg-zinc-950/95 shadow-[0_30px_80px_rgba(0,0,0,0.45)]">
                  {entry.coverImageUrl ? (
                    <img
                      src={entry.coverImageUrl}
                      alt={entry.title}
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-zinc-900" />
                  )}

                  <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/45 to-black/90" />

                  <div className="absolute left-5 top-5 right-5 flex items-start justify-between gap-3">
                    <div className="space-y-1 text-left">
                      <p className="text-[10px] uppercase tracking-[0.28em] text-zinc-200">
                        {entry.kind}
                      </p>
                      <p className="text-[10px] uppercase tracking-[0.22em] text-zinc-500">
                        {entry.readTime}
                      </p>
                    </div>

                    <p className="text-[10px] uppercase tracking-[0.22em] text-zinc-400">
                      {formatDate(entry.publishedAt)}
                    </p>
                  </div>

                  <div className="absolute bottom-5 left-5 right-5 text-left">
                    <div className="space-y-3">
                      <h3 className={`font-semibold leading-tight text-zinc-100 ${isActive ? "text-3xl sm:text-4xl" : "text-xl"}`}>
                        {entry.title}
                      </h3>

                      {isActive && (
                        <>
                          <p className="max-w-xl text-sm leading-7 text-zinc-300">
                            {entry.excerpt}
                          </p>

                          {(entry.tags || []).length > 0 && (
                            <div className="flex flex-wrap gap-2">
                              {(entry.tags || []).slice(0, 4).map((tag) => (
                                <span
                                  key={tag}
                                  className="rounded-full border border-white/10 px-3 py-1.5 text-[11px] text-zinc-200"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}

                          <div className="inline-flex rounded-full border border-white/10 px-4 py-2 text-[11px] uppercase tracking-[0.24em] text-zinc-200">
                            {copy?.enterEntryLabel || "Open Entry"}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>

        <div className="mt-6">
          <div className="mx-auto max-w-xl rounded-[2rem] border border-white/10 bg-black/30 p-5">
            <p className="text-[11px] uppercase tracking-[0.32em] text-zinc-500">
              Navigation
            </p>

            <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <button
                type="button"
                onClick={goToPrevious}
                className="rounded-full border border-white/10 px-4 py-3 transition hover:border-white/30 hover:text-white"
              >
                {copy?.previousLabel || "Previous"}
              </button>

              <button
                type="button"
                onClick={() => setShowAtlas((prev) => !prev)}
                className="rounded-full border border-white/10 px-4 py-3 transition hover:border-white/30 hover:text-white"
              >
                {showAtlas
                  ? copy?.mixLabel || "Mix Again"
                  : copy?.spreadLabel || "Spread Entries"}
              </button>

              <button
                type="button"
                onClick={goToNext}
                className="rounded-full border border-white/10 px-4 py-3 transition hover:border-white/30 hover:text-white"
              >
                {copy?.nextLabel || "Next"}
              </button>
            </div>

            <div className="mt-4 text-center text-[11px] uppercase tracking-[0.28em] text-zinc-500">
              {formatCounter(activeIndex, total)}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}