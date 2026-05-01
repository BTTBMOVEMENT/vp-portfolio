"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "motion/react";
import PortableTextContent from "../cms/PortableTextContent";

type AlbumEntry = {
  id: string;
  title?: string;
  imageUrl?: string;
  videoUrl?: string;
  capturedAt?: string;
  note?: any[];
};

type VisionCosmosCopy = {
  pageLabel?: string;
  title?: string;
  description?: string;
  emptyStateLabel?: string;
  emptyStateTitle?: string;
  emptyStateDescription?: string;
  orbitalLabel?: string;
  orbitalDescription?: string;
  alignFramesLabel?: string;
  returnToOrbitLabel?: string;
  selectedFrameLabel?: string;
  selectedFrameFallback?: string;
  navigationLabel?: string;
  previousLabel?: string;
  nextLabel?: string;
};

type VisionCosmosProps = {
  entries: AlbumEntry[];
  copy?: VisionCosmosCopy;
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
  const maxWidth = viewport.width * (isMobile ? 0.82 : 0.7);
  const maxHeight = viewport.height * (isMobile ? 0.48 : 0.66);

  if (!intrinsic || intrinsic.width === 0 || intrinsic.height === 0) {
    return {
      imageWidth: maxWidth,
      imageHeight: maxHeight,
      frameWidth: maxWidth + 18,
      frameHeight: maxHeight + 42,
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
    frameWidth: imageWidth + 18,
    frameHeight: imageHeight + 42,
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
    : viewport.width * (isMobile ? 0.28 : 0.2);

  const maxHeight = atlas
    ? viewport.height * (isMobile ? 0.18 : 0.16)
    : viewport.height * (isMobile ? 0.18 : 0.22);

  if (!intrinsic || intrinsic.width === 0 || intrinsic.height === 0) {
    return {
      imageWidth: maxWidth,
      imageHeight: maxHeight,
      frameWidth: maxWidth + 16,
      frameHeight: maxHeight + 34,
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
    frameWidth: imageWidth + 16,
    frameHeight: imageHeight + 34,
  };
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
      rotateY: isMobile ? 0 : 34,
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
      rotateY: isMobile ? 0 : -34,
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
    rotateY: isMobile ? 0 : direction * (40 + distance * 6),
    rotateX: 0,
    rotateZ: direction * (6 + distance * 1.5),
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

function formatYear(value?: string) {
  if (!value) return "";
  try {
    return String(new Date(value).getFullYear());
  } catch {
    return value;
  }
}

function defaultTitle(index: number) {
  return `Album Frame ${String(index + 1).padStart(3, "0")}`;
}

export default function VisionCosmos({ entries, copy }: VisionCosmosProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [showAtlas, setShowAtlas] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [viewport, setViewport] = useState<Size>({ width: 1440, height: 900 });
  const [sizes, setSizes] = useState<Record<string, Size>>({});
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
  const activeEntry = entries[activeIndex]!;

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
            {copy?.emptyStateLabel || "My Album"}
          </p>
          <h3 className="text-3xl font-semibold leading-tight text-zinc-100">
            {copy?.emptyStateTitle || "No album items published yet."}
          </h3>
          <p className="max-w-2xl text-sm leading-8 text-zinc-300 sm:text-base">
            {copy?.emptyStateDescription || "Add album items in Studio and they will appear here automatically."}
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
            {copy?.pageLabel || "My Album"}
          </p>

          <h2 className="max-w-[12ch] text-4xl font-semibold leading-[0.95] sm:text-5xl md:text-6xl">
            {copy?.title || "A drifting field of frames and memories."}
          </h2>

          <p className="max-w-2xl text-sm leading-8 text-zinc-300 sm:text-base">
            {copy?.description || "Scroll or swipe to pull a photograph into focus."}
          </p>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <button
            type="button"
            onClick={() => setShowAtlas((prev) => !prev)}
            className="rounded-full border border-white/10 px-4 py-3 text-sm text-zinc-200 transition hover:border-white/30 hover:text-white"
          >
            {showAtlas
              ? copy?.returnToOrbitLabel || "Return to Orbit"
              : copy?.alignFramesLabel || "Align Frames"}
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
              {copy?.orbitalLabel || "Orbital Album"}
            </p>
            <p className="text-sm leading-7 text-zinc-300">
              {copy?.orbitalDescription ||
                (showAtlas
                  ? "All frames are aligned. Choose one to return it to the center."
                  : "One frame dominates the view while the rest stay in orbit.")}
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
          ref={stageRef}
          tabIndex={0}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          onKeyDown={handleKeyDown}
          className="relative h-[40rem] overflow-hidden outline-none sm:h-[48rem] lg:h-[58rem]"
          style={{
            perspective: isMobile ? "1100px" : "1800px",
            touchAction: showAtlas ? "auto" : "pan-y pinch-zoom",
          }}
        >
          <div className="pointer-events-none absolute left-1/2 top-1/2 h-[76%] w-[132%] -translate-x-1/2 -translate-y-1/2 rounded-[100%] border border-white/[0.06]" />
          <div className="pointer-events-none absolute left-1/2 top-1/2 h-[54%] w-[116%] -translate-x-1/2 -translate-y-1/2 rounded-[100%] border border-white/[0.04]" />

          {visibleEntries.map((entry) => {
            const index = entries.findIndex((item) => item.id === entry.id);
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
                className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer"
                style={{
                  zIndex: state.zIndex,
                  willChange: "transform, opacity, width, height",
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
                  duration: isMobile ? 0.68 : 0.56,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                <div className="relative h-full w-full">
                  <div className="relative flex h-full w-full flex-col overflow-hidden rounded-[1.6rem] bg-[#f6f1e8] p-3 shadow-[0_30px_80px_rgba(0,0,0,0.45)]">
                    <div className="flex min-h-0 flex-1 items-center justify-center overflow-hidden rounded-[1.2rem] border border-black/5 bg-white/40">
                      {entry.imageUrl ? (
                        <img
                          src={entry.imageUrl}
                          alt={entry.title || defaultTitle(index)}
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
                        />
                      ) : entry.videoUrl ? (
                        <video
                          src={entry.videoUrl}
                          muted
                          loop
                          autoPlay
                          playsInline
                          className="block max-h-full max-w-full object-contain"
                        />
                      ) : null}
                    </div>

                    <div className="mt-3 flex items-center justify-between gap-4 px-1 text-[11px] uppercase tracking-[0.24em] text-zinc-600">
                      <span>{formatYear(entry.capturedAt)}</span>
                      <span>{String(index + 1).padStart(3, "0")}</span>
                    </div>

                    <div className="mt-2 h-px w-full bg-black/10" />
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>

        <div className="mt-6 grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
          <div className="space-y-4">
            <p className="text-[11px] uppercase tracking-[0.32em] text-zinc-500">
              {copy?.selectedFrameLabel || "Selected Frame"}
            </p>

            <div className="space-y-3">
              <h3 className="max-w-[12ch] text-4xl font-semibold leading-[0.95] text-zinc-100 sm:text-5xl">
                {activeEntry.title ?? defaultTitle(activeIndex)}
              </h3>

              {activeEntry.note ? (
                <PortableTextContent value={activeEntry.note} compact />
              ) : (
                <p className="max-w-2xl text-sm leading-8 text-zinc-500 sm:text-base">
                  {copy?.selectedFrameFallback ||
                    "Titles and notes are now coming from CMS. Add them in Studio whenever you want this frame to carry its own text."}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-5">
            <div className="rounded-[2rem] border border-white/10 bg-black/30 p-5">
              <p className="text-[11px] uppercase tracking-[0.32em] text-zinc-500">
                {copy?.navigationLabel || "Navigation"}
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
                    ? copy?.returnToOrbitLabel || "Return to Orbit"
                    : copy?.alignFramesLabel || "Align Frames"}
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
      </div>
    </section>
  );
}