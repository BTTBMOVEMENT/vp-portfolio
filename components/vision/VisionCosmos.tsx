"use client";

import { useMemo, useRef, useState } from "react";
import { motion } from "motion/react";
import type { VisionEntry } from "../../lib/vision";

type VisionCosmosProps = {
  entries: VisionEntry[];
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

function getOrbitState(offset: number, total: number) {
  if (offset === 0) {
    return {
      left: "50%",
      top: "49%",
      scale: 1,
      opacity: 1,
      rotateY: 0,
      rotateX: 0,
      rotateZ: 0,
      zIndex: 50,
    };
  }

  if (offset === -1) {
    return {
      left: total === 2 ? "30%" : "25%",
      top: "60%",
      scale: 0.82,
      opacity: 0.58,
      rotateY: 56,
      rotateX: 5,
      rotateZ: -8,
      zIndex: 40,
    };
  }

  if (offset === 1) {
    return {
      left: total === 2 ? "70%" : "75%",
      top: "60%",
      scale: 0.82,
      opacity: 0.58,
      rotateY: -56,
      rotateX: 5,
      rotateZ: 8,
      zIndex: 40,
    };
  }

  const distance = Math.abs(offset);
  const direction = offset < 0 ? -1 : 1;
  const spread = Math.min(44, 22 + distance * 8);
  const arcLift = Math.min(22, 8 + distance * 3);
  const left = 50 + direction * spread;
  const top = 48 - arcLift + distance * 4;
  const scale = Math.max(0.34, 0.72 - distance * 0.1);
  const opacity = Math.max(0.1, 0.34 - distance * 0.05);
  const rotateY = direction * (74 + distance * 8);
  const rotateX = distance % 2 === 0 ? -6 : 6;
  const rotateZ = direction * (10 + distance * 2);

  return {
    left: `${left}%`,
    top: `${top}%`,
    scale,
    opacity,
    rotateY,
    rotateX,
    rotateZ,
    zIndex: 20,
  };
}

function getAtlasState(index: number, total: number) {
  const columns = total <= 3 ? total : total <= 8 ? 4 : 5;
  const rows = Math.ceil(total / columns);

  const columnIndex = index % columns;
  const rowIndex = Math.floor(index / columns);

  const left =
    columns === 1
      ? 50
      : 18 + (columnIndex * 64) / (columns - 1);

  const top =
    rows === 1
      ? 50
      : 24 + (rowIndex * 52) / (rows - 1);

  const scale =
    total <= 3 ? 0.62 : total <= 8 ? 0.5 : 0.42;

  return {
    left: `${left}%`,
    top: `${top}%`,
    scale,
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

export default function VisionCosmos({ entries }: VisionCosmosProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [showAtlas, setShowAtlas] = useState(false);
  const wheelLockRef = useRef(false);
  const touchStartXRef = useRef<number | null>(null);

  const total = entries.length;

  const activeEntry = entries[activeIndex];

  const visibleEntries = useMemo(() => entries, [entries]);

  if (total === 0) {
    return (
      <section className="rounded-[2.75rem] border border-white/10 bg-white/[0.03] px-6 py-10">
        <div className="space-y-4">
          <p className="text-[11px] uppercase tracking-[0.32em] text-zinc-500">
            My Vision
          </p>
          <h3 className="text-3xl font-semibold leading-tight text-zinc-100">
            No vision images found yet.
          </h3>
          <p className="max-w-2xl text-sm leading-8 text-zinc-300 sm:text-base">
            Put images inside <code>/public/images/vision</code>. They will be picked
            up automatically and sorted by file time.
          </p>
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

  function handleWheel(event: React.WheelEvent<HTMLDivElement>) {
    if (showAtlas) return;
    if (wheelLockRef.current) return;

    const dominantDelta =
      Math.abs(event.deltaY) >= Math.abs(event.deltaX) ? event.deltaY : event.deltaX;

    if (Math.abs(dominantDelta) < 18) return;

    event.preventDefault();

    if (dominantDelta > 0) {
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
    if (showAtlas) return;
    touchStartXRef.current = event.touches[0]?.clientX ?? null;
  }

  function handleTouchEnd(event: React.TouchEvent<HTMLDivElement>) {
    if (showAtlas) return;
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

    if (event.key.toLowerCase() === "i") {
      event.preventDefault();
      setShowAtlas((prev) => !prev);
    }
  }

  return (
    <section className="space-y-8">
      <div className="flex flex-col gap-8 xl:flex-row xl:items-end xl:justify-between">
        <div className="max-w-3xl space-y-4">
          <p className="text-[11px] uppercase tracking-[0.32em] text-zinc-500">
            My Vision
          </p>

          <h2 className="max-w-[12ch] text-4xl font-semibold leading-[0.95] sm:text-5xl md:text-6xl">
            A photo field drifting through cinematic space.
          </h2>

          <p className="max-w-2xl text-sm leading-8 text-zinc-300 sm:text-base">
            Scroll or swipe to pull a photograph out of the distance. Open the
            index to align every frame, then choose one to bring it back to center.
          </p>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <button
            type="button"
            onClick={() => setShowAtlas((prev) => !prev)}
            className="rounded-full border border-white/10 px-4 py-3 text-sm text-zinc-200 transition hover:border-white/30 hover:text-white"
          >
            {showAtlas ? "Return to Orbit" : "Align Frames"}
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
              Orbital Album
            </p>
            <p className="text-sm leading-7 text-zinc-300">
              {showAtlas
                ? "All frames are aligned. Choose one to send it back into orbit."
                : "Exactly one floating card per image in your folder."}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <motion.button
              type="button"
              whileTap={{ scale: 0.95 }}
              onClick={goToPrevious}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 text-zinc-200 transition hover:border-white/30 hover:text-white"
              aria-label="Previous image"
            >
              ←
            </motion.button>

            <motion.button
              type="button"
              whileTap={{ scale: 0.95 }}
              onClick={goToNext}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 text-zinc-200 transition hover:border-white/30 hover:text-white"
              aria-label="Next image"
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
          className="relative h-[34rem] overflow-hidden outline-none sm:h-[40rem] lg:h-[48rem]"
          style={{ perspective: "1800px" }}
        >
          <motion.div
            animate={{ opacity: showAtlas ? 0.65 : 1 }}
            className="pointer-events-none absolute left-1/2 top-1/2 h-[76%] w-[132%] -translate-x-1/2 -translate-y-1/2 rounded-[100%] border border-white/[0.06]"
          />
          <motion.div
            animate={{ opacity: showAtlas ? 0.3 : 1 }}
            className="pointer-events-none absolute left-1/2 top-1/2 h-[54%] w-[116%] -translate-x-1/2 -translate-y-1/2 rounded-[100%] border border-white/[0.04]"
          />
          <div className="pointer-events-none absolute left-[8%] top-[18%] h-24 w-24 rounded-full bg-white/[0.05] blur-3xl" />
          <div className="pointer-events-none absolute right-[10%] top-[24%] h-32 w-32 rounded-full bg-white/[0.04] blur-3xl" />
          <div className="pointer-events-none absolute bottom-[14%] left-[22%] h-28 w-28 rounded-full bg-white/[0.03] blur-3xl" />
          <div className="pointer-events-none absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-black via-black/85 to-transparent sm:w-28 lg:w-40" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-black via-black/85 to-transparent sm:w-28 lg:w-40" />

          {visibleEntries.map((entry, index) => {
            const orbitOffset = getWrappedOffset(index, activeIndex, total);
            const state = showAtlas
              ? getAtlasState(index, total)
              : getOrbitState(orbitOffset, total);
            const isActive = index === activeIndex;

            return (
              <motion.button
                key={entry.id}
                type="button"
                onClick={() => {
                  setActiveIndex(index);
                  setShowAtlas(false);
                }}
                aria-label={`Select image ${entry.title ?? `Vision Frame ${index + 1}`}`}
                className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer"
                style={{ zIndex: state.zIndex }}
                animate={{
                  left: state.left,
                  top: state.top,
                  scale: state.scale,
                  opacity: state.opacity,
                  rotateY: state.rotateY,
                  rotateX: state.rotateX,
                  rotateZ: state.rotateZ,
                }}
                transition={{
                  type: "spring",
                  stiffness: 140,
                  damping: 22,
                  mass: 0.9,
                }}
              >
                <div
                  className="relative"
                  style={{ transformStyle: "preserve-3d" }}
                >
                  <div
                    className="absolute inset-0 rounded-[1.6rem] bg-gradient-to-b from-zinc-100 to-zinc-200 shadow-[0_30px_80px_rgba(0,0,0,0.45)]"
                    style={{
                      transform: "rotateY(180deg)",
                      backfaceVisibility: "hidden",
                    }}
                  >
                    <div className="flex h-full min-h-[18rem] flex-col justify-between rounded-[1.6rem] p-5 text-left">
                      <p className="text-[11px] uppercase tracking-[0.28em] text-zinc-500">
                        My Vision
                      </p>

                      <div className="space-y-2">
                        <div className="h-px w-full bg-zinc-300" />
                        <p className="text-[11px] uppercase tracking-[0.24em] text-zinc-500">
                          Reverse side / matte card
                        </p>
                      </div>
                    </div>
                  </div>

                  <div
                    className="relative overflow-hidden rounded-[1.6rem] bg-[#f6f1e8] p-3 shadow-[0_30px_80px_rgba(0,0,0,0.45)]"
                    style={{ backfaceVisibility: "hidden" }}
                  >
                    <img
                      src={entry.image}
                      alt={entry.alt}
                      loading={isActive ? "eager" : "lazy"}
                      className={`block h-auto max-h-[60vh] rounded-[1.2rem] border border-black/5 object-contain ${
                        showAtlas
                          ? "w-[min(22vw,11rem)] sm:w-[min(18vw,12rem)] lg:w-[min(14vw,12rem)]"
                          : "w-[min(76vw,22rem)] sm:w-[min(52vw,24rem)] lg:w-[min(34vw,26rem)]"
                      }`}
                    />

                    <div className="mt-3 flex items-center justify-between gap-4 px-1 text-[11px] uppercase tracking-[0.24em] text-zinc-600">
                      <span>{entry.year}</span>
                      <span>{String(index + 1).padStart(3, "0")}</span>
                    </div>

                    <div className="mt-2 h-px w-full bg-black/10" />
                  </div>

                  {!showAtlas && isActive && (
                    <div className="pointer-events-none absolute -bottom-4 left-1/2 h-10 w-[72%] -translate-x-1/2 rounded-full bg-black/40 blur-2xl" />
                  )}
                </div>
              </motion.button>
            );
          })}
        </div>

        <div className="mt-6 grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
          <div className="space-y-4">
            <p className="text-[11px] uppercase tracking-[0.32em] text-zinc-500">
              Selected Frame
            </p>

            <div className="space-y-3">
              <h3 className="max-w-[12ch] text-4xl font-semibold leading-[0.95] text-zinc-100 sm:text-5xl">
                {activeEntry.title ?? `Vision Frame ${String(activeIndex + 1).padStart(3, "0")}`}
              </h3>

              {activeEntry.note ? (
                <p className="max-w-2xl text-sm leading-8 text-zinc-300 sm:text-base">
                  {activeEntry.note}
                </p>
              ) : (
                <p className="max-w-2xl text-sm leading-8 text-zinc-500 sm:text-base">
                  Caption and notes can be attached later through CMS.
                </p>
              )}
            </div>
          </div>

          <div className="space-y-5">
            <div className="rounded-[2rem] border border-white/10 bg-black/30 p-5">
              <p className="text-[11px] uppercase tracking-[0.32em] text-zinc-500">
                Navigation
              </p>

              <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <button
                  type="button"
                  onClick={goToPrevious}
                  className="rounded-full border border-white/10 px-4 py-3 transition hover:border-white/30 hover:text-white"
                >
                  Previous
                </button>

                <button
                  type="button"
                  onClick={() => setShowAtlas((prev) => !prev)}
                  className="rounded-full border border-white/10 px-4 py-3 transition hover:border-white/30 hover:text-white"
                >
                  {showAtlas ? "Return to Orbit" : "Align Frames"}
                </button>

                <button
                  type="button"
                  onClick={goToNext}
                  className="rounded-full border border-white/10 px-4 py-3 transition hover:border-white/30 hover:text-white"
                >
                  Next
                </button>
              </div>

              <div className="mt-4 text-center text-[11px] uppercase tracking-[0.28em] text-zinc-500">
                {formatCounter(activeIndex, total)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}