"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { TouchEvent } from "react";
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

type MotionState = {
  left: string;
  top: string;
  opacity: number;
  rotateY: number;
  rotateX: number;
  rotateZ: number;
  zIndex: number;
};

type FrameMetrics = {
  frameWidth: number;
  frameHeight: number;
};

function wrapIndex(index: number, total: number) {
  return (index + total) % total;
}

function clampNumber(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function getWrappedOffset(index: number, activeIndex: number, total: number) {
  let offset = index - activeIndex;

  if (offset > total / 2) offset -= total;
  if (offset < -total / 2) offset += total;

  return offset;
}

function getImageRatio(intrinsic?: Size) {
  if (!intrinsic || intrinsic.width <= 0 || intrinsic.height <= 0) {
    return 0.78;
  }

  return intrinsic.width / intrinsic.height;
}

function getPhotoFrameMetrics({
  intrinsic,
  viewport,
  isMobile,
  mode,
}: {
  intrinsic?: Size;
  viewport: Size;
  isMobile: boolean;
  mode: "active" | "thumb" | "atlas";
}): FrameMetrics {
  const ratio = getImageRatio(intrinsic);

  const chromeX = mode === "active" ? 24 : 22;
  const chromeY = mode === "active" ? 58 : 52;

  const maxContentWidth =
    mode === "active"
      ? viewport.width * (isMobile ? 0.78 : 0.5)
      : mode === "atlas"
      ? viewport.width * (isMobile ? 0.32 : 0.14)
      : viewport.width * (isMobile ? 0.26 : 0.16);

  const maxContentHeight =
    mode === "active"
      ? viewport.height * (isMobile ? 0.52 : 0.62)
      : mode === "atlas"
      ? viewport.height * (isMobile ? 0.2 : 0.18)
      : viewport.height * (isMobile ? 0.18 : 0.2);

  const minContentWidth = mode === "active" ? (isMobile ? 190 : 260) : 110;
  const minContentHeight = mode === "active" ? (isMobile ? 220 : 220) : 130;

  let contentWidth = maxContentWidth;
  let contentHeight = contentWidth / ratio;

  if (contentHeight > maxContentHeight) {
    contentHeight = maxContentHeight;
    contentWidth = contentHeight * ratio;
  }

  contentWidth = clampNumber(contentWidth, minContentWidth, maxContentWidth);
  contentHeight = clampNumber(contentHeight, minContentHeight, maxContentHeight);

  return {
    frameWidth: contentWidth + chromeX,
    frameHeight: contentHeight + chromeY,
  };
}

function getOrbitState(
  offset: number,
  total: number,
  isMobile: boolean
): MotionState {
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

function getAtlasState(
  index: number,
  total: number,
  isMobile: boolean
): MotionState {
  if (total <= 1) {
    return {
      left: "50%",
      top: "50%",
      opacity: 1,
      rotateY: 0,
      rotateX: 0,
      rotateZ: 0,
      zIndex: 40,
    };
  }

  if (isMobile) {
    const columns = Math.min(2, total);
    const rows = Math.ceil(total / columns);

    const columnIndex = index % columns;
    const rowIndex = Math.floor(index / columns);

    const left = columns === 1 ? 50 : columnIndex === 0 ? 32 : 68;
    const top =
      rows === 1 ? 50 : 24 + (rowIndex * 52) / Math.max(1, rows - 1);

    return {
      left: `${left}%`,
      top: `${top}%`,
      opacity: 1,
      rotateY: 0,
      rotateX: 0,
      rotateZ: 0,
      zIndex: 40 - rowIndex,
    };
  }

  if (total === 2) {
    return {
      left: index === 0 ? "38%" : "62%",
      top: "50%",
      opacity: 1,
      rotateY: 0,
      rotateX: 0,
      rotateZ: 0,
      zIndex: 40,
    };
  }

  if (total === 3) {
    const positions = [
      { left: "30%", top: "52%" },
      { left: "50%", top: "44%" },
      { left: "70%", top: "52%" },
    ];

    return {
      left: positions[index]?.left ?? "50%",
      top: positions[index]?.top ?? "50%",
      opacity: 1,
      rotateY: 0,
      rotateX: 0,
      rotateZ: 0,
      zIndex: 40,
    };
  }

  if (total === 4) {
    const positions = [
      { left: "36%", top: "38%" },
      { left: "64%", top: "38%" },
      { left: "36%", top: "64%" },
      { left: "64%", top: "64%" },
    ];

    return {
      left: positions[index]?.left ?? "50%",
      top: positions[index]?.top ?? "50%",
      opacity: 1,
      rotateY: 0,
      rotateX: 0,
      rotateZ: 0,
      zIndex: 40,
    };
  }

  const columns = total <= 6 ? 3 : 4;
  const rows = Math.ceil(total / columns);

  const columnIndex = index % columns;
  const rowIndex = Math.floor(index / columns);

  const left = 22 + (columnIndex * 56) / Math.max(1, columns - 1);
  const top = rows === 1 ? 50 : 24 + (rowIndex * 52) / Math.max(1, rows - 1);

  return {
    left: `${left}%`,
    top: `${top}%`,
    opacity: 1,
    rotateY: 0,
    rotateX: 0,
    rotateZ: 0,
    zIndex: 40 - rowIndex,
  };
}

function formatCounter(index: number, total: number) {
  return `${String(index + 1).padStart(2, "0")} / ${String(total).padStart(
    2,
    "0"
  )}`;
}

function formatPageCounter(page: number, pageCount: number) {
  return `PAGE ${String(page + 1).padStart(2, "0")} / ${String(
    pageCount
  ).padStart(2, "0")}`;
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

function getPageButtons(currentPage: number, pageCount: number) {
  if (pageCount <= 7) {
    return Array.from({ length: pageCount }, (_, index) => index);
  }

  const pages = new Set<number>();

  pages.add(0);
  pages.add(pageCount - 1);
  pages.add(currentPage);
  pages.add(currentPage - 1);
  pages.add(currentPage + 1);

  if (currentPage <= 2) {
    pages.add(1);
    pages.add(2);
    pages.add(3);
  }

  if (currentPage >= pageCount - 3) {
    pages.add(pageCount - 2);
    pages.add(pageCount - 3);
    pages.add(pageCount - 4);
  }

  const sorted = [...pages]
    .filter((page) => page >= 0 && page < pageCount)
    .sort((a, b) => a - b);

  const result: Array<number | "ellipsis"> = [];

  sorted.forEach((page, index) => {
    const previous = sorted[index - 1];

    if (previous !== undefined && page - previous > 1) {
      result.push("ellipsis");
    }

    result.push(page);
  });

  return result;
}

export default function VisionCosmos({ entries, copy }: VisionCosmosProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [showAtlas, setShowAtlas] = useState(false);
  const [atlasPage, setAtlasPage] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [viewport, setViewport] = useState<Size>({
    width: 1440,
    height: 900,
  });
  const [imageSizes, setImageSizes] = useState<Record<string, Size>>({});

  const wheelLockRef = useRef(false);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 767px)");

    const update = () => {
      setIsMobile(mediaQuery.matches);
    };

    update();

    mediaQuery.addEventListener("change", update);

    return () => {
      mediaQuery.removeEventListener("change", update);
    };
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

    return () => {
      window.removeEventListener("resize", updateViewport);
    };
  }, []);

  const orderedEntries = useMemo(() => {
    return [...entries];
  }, [entries]);

  const total = orderedEntries.length;
  const pageSize = isMobile ? 6 : 12;
  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  const safeAtlasPage = clampNumber(atlasPage, 0, pageCount - 1);
  const pageStart = safeAtlasPage * pageSize;
  const pageEnd = pageStart + pageSize;

  useEffect(() => {
    if (atlasPage !== safeAtlasPage) {
      setAtlasPage(safeAtlasPage);
    }
  }, [atlasPage, safeAtlasPage]);

  const visibleEntries = useMemo(() => {
    if (showAtlas) {
      return orderedEntries.slice(pageStart, pageEnd);
    }

    return orderedEntries.filter((_, index) => {
      const offset = Math.abs(getWrappedOffset(index, activeIndex, total));
      return isMobile ? offset <= 1 : offset <= 2;
    });
  }, [
    orderedEntries,
    showAtlas,
    pageStart,
    pageEnd,
    activeIndex,
    total,
    isMobile,
  ]);

  useEffect(() => {
    const stage = stageRef.current;

    if (!stage) return;
    if (isMobile || showAtlas) return;

    function onWheel(event: WheelEvent) {
      if (wheelLockRef.current) return;

      const dominantDelta =
        Math.abs(event.deltaY) >= Math.abs(event.deltaX)
          ? event.deltaY
          : event.deltaX;

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
            {copy?.emptyStateDescription ||
              "Add album items in Studio and they will appear here automatically."}
          </p>
        </div>
      </section>
    );
  }

  function goToIndex(index: number) {
    setActiveIndex(wrapIndex(index, total));
  }

  function goToPage(page: number) {
    const nextPage = clampNumber(page, 0, pageCount - 1);

    setAtlasPage(nextPage);
    setActiveIndex(Math.min(nextPage * pageSize, total - 1));
  }

  function goToPrevious() {
    if (showAtlas) {
      goToPage(wrapIndex(safeAtlasPage - 1, pageCount));
      return;
    }

    setActiveIndex((prev) => wrapIndex(prev - 1, total));
  }

  function goToNext() {
    if (showAtlas) {
      goToPage(wrapIndex(safeAtlasPage + 1, pageCount));
      return;
    }

    setActiveIndex((prev) => wrapIndex(prev + 1, total));
  }

  function toggleAtlas() {
    if (!showAtlas) {
      const currentPage = Math.floor(activeIndex / pageSize);
      setAtlasPage(clampNumber(currentPage, 0, pageCount - 1));
      setShowAtlas(true);
      return;
    }

    setShowAtlas(false);
  }

  function handleTouchStart(event: TouchEvent<HTMLDivElement>) {
    if (showAtlas) return;

    touchStartRef.current = {
      x: event.touches[0]?.clientX ?? 0,
      y: event.touches[0]?.clientY ?? 0,
    };
  }

  function handleTouchEnd(event: TouchEvent<HTMLDivElement>) {
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

  const activeEntry = orderedEntries[activeIndex]!;
  const pageButtons = getPageButtons(safeAtlasPage, pageCount);

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
            {copy?.description ||
              "Scroll or swipe to pull a photograph into focus."}
          </p>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <button
            type="button"
            onClick={toggleAtlas}
            className="rounded-full border border-white/10 px-4 py-3 text-sm text-zinc-200 transition hover:border-white/30 hover:text-white"
          >
            {showAtlas
              ? copy?.returnToOrbitLabel || "Return to Orbit"
              : copy?.alignFramesLabel || "Align Frames"}
          </button>

          <div className="rounded-full border border-white/10 px-4 py-3 text-sm text-zinc-200">
            {showAtlas
              ? formatPageCounter(safeAtlasPage, pageCount)
              : formatCounter(activeIndex, total)}
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
              {showAtlas
                ? "Frames are organized by page. Choose a page number below."
                : copy?.orbitalDescription ||
                  "One frame dominates the view while the rest stay in orbit."}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <motion.button
              type="button"
              whileTap={{ scale: 0.95 }}
              onClick={goToPrevious}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 text-zinc-200 transition hover:border-white/30 hover:text-white"
              aria-label={showAtlas ? "Previous page" : "Previous image"}
            >
              ←
            </motion.button>

            <motion.button
              type="button"
              whileTap={{ scale: 0.95 }}
              onClick={goToNext}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 text-zinc-200 transition hover:border-white/30 hover:text-white"
              aria-label={showAtlas ? "Next page" : "Next image"}
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
          className="relative h-[40rem] overflow-hidden outline-none sm:h-[48rem] lg:h-[58rem]"
          style={{
            perspective: isMobile ? "1100px" : "1800px",
            touchAction: showAtlas ? "auto" : "pan-y pinch-zoom",
          }}
        >
          <div className="pointer-events-none absolute left-1/2 top-1/2 h-[76%] w-[132%] -translate-x-1/2 -translate-y-1/2 rounded-[100%] border border-white/[0.06]" />
          <div className="pointer-events-none absolute left-1/2 top-1/2 h-[54%] w-[116%] -translate-x-1/2 -translate-y-1/2 rounded-[100%] border border-white/[0.04]" />

          {visibleEntries.map((entry, localIndex) => {
            const globalIndex = showAtlas
              ? pageStart + localIndex
              : orderedEntries.findIndex((item) => item.id === entry.id);

            const isActive = globalIndex === activeIndex;
            const intrinsic = imageSizes[entry.id];

            const frameMetrics = getPhotoFrameMetrics({
              intrinsic,
              viewport,
              isMobile,
              mode: showAtlas ? "atlas" : isActive ? "active" : "thumb",
            });

            const state = showAtlas
              ? getAtlasState(localIndex, visibleEntries.length, isMobile)
              : getOrbitState(
                  getWrappedOffset(globalIndex, activeIndex, total),
                  total,
                  isMobile
                );

            return (
              <motion.button
                key={entry.id}
                type="button"
                onClick={() => {
                  goToIndex(globalIndex);
                  setShowAtlas(false);
                }}
                aria-label={`Select image ${
                  entry.title ?? defaultTitle(globalIndex)
                }`}
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
                  duration: isMobile ? 0.68 : 0.56,
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
                    <div className="relative min-h-0 flex-1 overflow-hidden rounded-[1.2rem] border border-black/5 bg-[#f6f1e8]">
                      {entry.imageUrl ? (
                        <img
                          src={entry.imageUrl}
                          alt={entry.title || defaultTitle(globalIndex)}
                          loading={isActive ? "eager" : "lazy"}
                          onLoad={(event) => {
                            const img = event.currentTarget;
                            const width = img.naturalWidth;
                            const height = img.naturalHeight;

                            setImageSizes((prev) => {
                              const current = prev[entry.id];

                              if (
                                current &&
                                current.width === width &&
                                current.height === height
                              ) {
                                return prev;
                              }

                              return {
                                ...prev,
                                [entry.id]: { width, height },
                              };
                            });
                          }}
                          className="absolute inset-0 h-full w-full object-contain"
                        />
                      ) : entry.videoUrl ? (
                        <video
                          src={entry.videoUrl}
                          muted
                          loop
                          autoPlay
                          playsInline
                          className="absolute inset-0 h-full w-full object-contain"
                        />
                      ) : null}
                    </div>

                    <div className="mt-3 flex items-center justify-between gap-4 px-1 text-[11px] uppercase tracking-[0.24em] text-zinc-600">
                      <span>{formatYear(entry.capturedAt)}</span>
                      <span>{String(globalIndex + 1).padStart(3, "0")}</span>
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
                    "Titles and notes are now coming from CMS."}
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
                  onClick={toggleAtlas}
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
                {showAtlas
                  ? formatPageCounter(safeAtlasPage, pageCount)
                  : formatCounter(activeIndex, total)}
              </div>

              {showAtlas && pageCount > 1 && (
                <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
                  {pageButtons.map((page, index) => {
                    if (page === "ellipsis") {
                      return (
                        <span
                          key={`ellipsis-${index}`}
                          className="px-2 text-[11px] uppercase tracking-[0.24em] text-zinc-600"
                        >
                          ...
                        </span>
                      );
                    }

                    const active = page === safeAtlasPage;

                    return (
                      <button
                        key={page}
                        type="button"
                        onClick={() => goToPage(page)}
                        className={`h-9 min-w-9 rounded-full border px-3 text-[11px] uppercase tracking-[0.18em] transition ${
                          active
                            ? "border-white bg-white text-black"
                            : "border-white/10 text-zinc-300 hover:border-white/30 hover:text-white"
                        }`}
                      >
                        {String(page + 1).padStart(2, "0")}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}