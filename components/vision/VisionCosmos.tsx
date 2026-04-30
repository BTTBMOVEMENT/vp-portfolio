"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "motion/react";
import type { VisionEntry } from "../../lib/vision";

type VisionCosmosProps = {
  entries: VisionEntry[];
};

type Size = {
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

function getDisplaySize(
  intrinsic: Size | undefined,
  viewport: Size,
  isMobile: boolean
) {
  const maxWidth = viewport.width * (isMobile ? 0.9 : 0.72);
  const maxHeight = viewport.height * (isMobile ? 0.62 : 0.72);

  if (!intrinsic || intrinsic.width === 0 || intrinsic.height === 0) {
    return {
      imageWidth: maxWidth,
      imageHeight: maxHeight,
      frameWidth: maxWidth + 24,
      frameHeight: maxHeight + 56,
    };
  }

  const imageRatio = intrinsic.width / intrinsic.height;
  const viewportRatio = maxWidth / maxHeight;

  let imageWidth = maxWidth;
  let imageHeight = maxHeight;

  if (imageRatio > viewportRatio) {
    imageWidth = maxWidth;
    imageHeight = maxWidth / imageRatio;
  } else {
    imageHeight = maxHeight;
    imageWidth = maxHeight * imageRatio;
  }

  return {
    imageWidth,
    imageHeight,
    frameWidth: imageWidth + 24,
    frameHeight: imageHeight + 56,
  };
}

function getThumbSize(
  intrinsic: Size | undefined,
  viewport: Size,
  isMobile: boolean,
  atlas: boolean
) {
  const maxWidth = atlas
    ? viewport.width * (isMobile ? 0.28 : 0.14)
    : viewport.width * (isMobile ? 0.36 : 0.22);

  const maxHeight = atlas
    ? viewport.height * (isMobile ? 0.2 : 0.18)
    : viewport.height * (isMobile ? 0.28 : 0.24);

  if (!intrinsic || intrinsic.width === 0 || intrinsic.height === 0) {
    return {
      imageWidth: maxWidth,
      imageHeight: maxHeight,
      frameWidth: maxWidth + 22,
      frameHeight: maxHeight + 50,
    };
  }

  const imageRatio = intrinsic.width / intrinsic.height;
  const viewportRatio = maxWidth / maxHeight;

  let imageWidth = maxWidth;
  let imageHeight = maxHeight;

  if (imageRatio > viewportRatio) {
    imageWidth = maxWidth;
    imageHeight = maxWidth / imageRatio;
  } else {
    imageHeight = maxHeight;
    imageWidth = maxHeight * imageRatio;
  }

  return {
    imageWidth,
    imageHeight,
    frameWidth: imageWidth + 22,
    frameHeight: imageHeight + 50,
  };
}

function getOrbitState(offset: number, total: number, isMobile: boolean) {
  if (offset === 0) {
    return {
      left: "50%",
      top: isMobile ? "51%" : "50%",
      opacity: 1,
      rotateY: 0,
      rotateX: 0,
      rotateZ: 0,
      zIndex: 50,
    };
  }

  if (offset === -1) {
    return {
      left: total === 2 ? "26%" : isMobile ? "18%" : "23%",
      top: isMobile ? "64%" : "60%",
      opacity: 0.62,
      rotateY: isMobile ? 0 : 42,
      rotateX: 0,
      rotateZ: -6,
      zIndex: 40,
    };
  }

  if (offset === 1) {
    return {
      left: total === 2 ? "74%" : isMobile ? "82%" : "77%",
      top: isMobile ? "64%" : "60%",
      opacity: 0.62,
      rotateY: isMobile ? 0 : -42,
      rotateX: 0,
      rotateZ: 6,
      zIndex: 40,
    };
  }

  const distance = Math.abs(offset);
  const direction = offset < 0 ? -1 : 1;
  const spread = Math.min(46, 26 + distance * 8);
  const top = 44 + distance * 5;

  return {
    left: `${50 + direction * spread}%`,
    top: `${top}%`,
    opacity: Math.max(0.12, 0.32 - distance * 0.06),
    rotateY: isMobile ? 0 : direction * (56 + distance * 8),
    rotateX: 0,
    rotateZ: direction * (8 + distance * 2),
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
    rows === 1 ? 50 : 28 + (rowIndex * 44) / Math.max(1, rows - 1);

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

function defaultTitle(index: number) {
  return `Album Frame ${String(index + 1).padStart(3, "0")}`;
}

export default function VisionCosmos({ entries }: VisionCosmosProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [showAtlas, setShowAtlas] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [viewport, setViewport] = useState<Size>({ width: 1440, height: 900 });
  const [sizes, setSizes] = useState<Record<string, Size>>({});
  const wheelLockRef = useRef(false);
  const touchStartXRef = useRef<number | null>(null);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 767px)");

    const updateMobile = () => setIsMobile(mediaQuery.matches);
    updateMobile();

    mediaQuery.addEventListener("change", updateMobile);
    return () => mediaQuery.removeEventListener("change", updateMobile);
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

  const activeEntry = entries[activeIndex]!;

  const visibleEntries = useMemo(() => entries, [entries]);

  if (total === 0) {
    return (
      <section className="rounded-[2.75rem] border border-white/10 bg-white/[0.03] px-6 py-10">
        <div className="space-y-4">
          <p className="text-[11px] uppercase tracking-[0.32em] text-zinc-500">
            My Album
          </p>
          <h3 className="text-3xl font-semibold leading-tight text-zinc-100">
            No album images found yet.
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
    }, 460);
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
  }

  return (
    <section className="space-y-8">
      <div className="flex flex-col gap-8 xl:flex-row xl:items-end xl:justify-between">
        <div className="max-w-3xl space-y-4">
          <p className="text-[11px] uppercase tracking-[0.32em] text-zinc-500">
            My Album
          </p>

          <h2 className="max-w-[12ch] text-4xl font-semibold leading-[0.95] sm:text-5xl md:text-6xl">
            A drifting field of frames and memories.
          </h2>

          <p className="max-w-2xl text-sm leading-8 text-zinc-300 sm:text-base">
            Scroll or swipe to pull a photograph into focus. Align every frame when
            you want to see the whole album at once, then choose one to send it back
            into orbit.
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
                ? "All frames are aligned. Choose one to return it to the center."
                : "One frame dominates the view while the rest stay in orbit."}
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
          onWheelCapture={handleWheel}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          onKeyDown={handleKeyDown}
          className="relative h-[40rem] overflow-hidden outline-none overscroll-contain sm:h-[48rem] lg:h-[58rem]"
          style={{
            perspective: isMobile ? "1200px" : "1800px",
            touchAction: showAtlas ? "auto" : "pan-y",
          }}
        >
          <div className="pointer-events-none absolute left-1/2 top-1/2 h-[76%] w-[132%] -translate-x-1/2 -translate-y-1/2 rounded-[100%] border border-white/[0.06]" />
          <div className="pointer-events-none absolute left-1/2 top-1/2 h-[54%] w-[116%] -translate-x-1/2 -translate-y-1/2 rounded-[100%] border border-white/[0.04]" />
          <div className="pointer-events-none absolute left-[8%] top-[18%] h-24 w-24 rounded-full bg-white/[0.05] blur-3xl" />
          <div className="pointer-events-none absolute right-[10%] top-[24%] h-32 w-32 rounded-full bg-white/[0.04] blur-3xl" />
          <div className="pointer-events-none absolute bottom-[14%] left-[22%] h-28 w-28 rounded-full bg-white/[0.03] blur-3xl" />
          <div className="pointer-events-none absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-black via-black/85 to-transparent sm:w-28 lg:w-40" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-black via-black/85 to-transparent sm:w-28 lg:w-40" />

          {visibleEntries.map((entry, index) => {
            const intrinsic = sizes[entry.id];
            const displaySize = getDisplaySize(intrinsic, viewport, isMobile);
            const thumbSize = getThumbSize(intrinsic, viewport, isMobile, showAtlas);

            const isActive = index === activeIndex;

            const frameMetrics = showAtlas
              ? thumbSize
              : isActive
              ? displaySize
              : thumbSize;

            const state = showAtlas
              ? getAtlasState(index, total, isMobile)
              : getOrbitState(getWrappedOffset(index, activeIndex, total), total, isMobile);

            return (
              <motion.button
                key={entry.id}
                type="button"
                onClick={() => {
                  setActiveIndex(index);
                  setShowAtlas(false);
                }}
                aria-label={`Select image ${entry.title ?? defaultTitle(index)}`}
                className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer"
                style={{
                  zIndex: state.zIndex,
                  willChange: "transform, opacity, width, height",
                  WebkitTapHighlightColor: "transparent",
                  backfaceVisibility: "hidden",
                  WebkitBackfaceVisibility: "hidden",
                }}
                animate={{
                  left: state.left,
                  top: state.top,
                  width: frameMetrics.frameWidth,
                  height: frameMetrics.frameHeight,
                  opacity: state.opacity,
                  rotateY: state.rotateY,
                  rotateX: state.rotateX,
                  rotateZ: state.rotateZ,
                }}
                transition={{
                  duration: isMobile ? 0.58 : 0.52,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                <div
                  className="relative h-full w-full"
                  style={{
                    transformStyle: isMobile ? "flat" : "preserve-3d",
                    willChange: "transform",
                  }}
                >
                  {!isMobile && (
                    <div
                      className="absolute inset-0 rounded-[1.6rem] bg-gradient-to-b from-zinc-100 to-zinc-200 shadow-[0_30px_80px_rgba(0,0,0,0.45)]"
                      style={{
                        transform: "rotateY(180deg)",
                        backfaceVisibility: "hidden",
                        WebkitBackfaceVisibility: "hidden",
                      }}
                    >
                      <div className="flex h-full flex-col justify-between rounded-[1.6rem] p-5 text-left">
                        <p className="text-[11px] uppercase tracking-[0.28em] text-zinc-500">
                          My Album
                        </p>

                        <div className="space-y-2">
                          <div className="h-px w-full bg-zinc-300" />
                          <p className="text-[11px] uppercase tracking-[0.24em] text-zinc-500">
                            Reverse side / matte card
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div
                    className="relative flex h-full w-full flex-col overflow-hidden rounded-[1.6rem] bg-[#f6f1e8] p-3 shadow-[0_30px_80px_rgba(0,0,0,0.45)]"
                    style={{
                      backfaceVisibility: "hidden",
                      WebkitBackfaceVisibility: "hidden",
                      transform: "translateZ(0)",
                    }}
                  >
                    <div className="flex min-h-0 flex-1 items-center justify-center overflow-hidden rounded-[1.2rem] border border-black/5 bg-white/40">
                      <img
                        src={entry.image}
                        alt={entry.alt}
                        loading={isActive ? "eager" : "lazy"}
                        onLoad={(event) => {
                          const img = event.currentTarget;
                          const width = img.naturalWidth;
                          const height = img.naturalHeight;

                          setSizes((prev) => {
                            const current = prev[entry.id];
                            if (current && current.width === width && current.height === height) {
                              return prev;
                            }

                            return {
                              ...prev,
                              [entry.id]: { width, height },
                            };
                          });
                        }}
                        className="block max-h-full max-w-full object-contain"
                        style={{
                          width: "auto",
                          height: "auto",
                        }}
                      />
                    </div>

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
                {activeEntry.title ?? defaultTitle(activeIndex)}
              </h3>

              {activeEntry.note ? (
                <p className="max-w-2xl text-sm leading-8 text-zinc-300 sm:text-base">
                  {activeEntry.note}
                </p>
              ) : (
                <p className="max-w-2xl text-sm leading-8 text-zinc-500 sm:text-base">
                  Titles and notes are intentionally neutral for now so they can be fully
                  managed later through CMS.
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