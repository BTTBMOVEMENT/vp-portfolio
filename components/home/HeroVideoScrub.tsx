"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, useScroll, useSpring, useTransform } from "motion/react";

type HeroVideoScrubProps = {
  name: string;
  role: string;
  headline: string;
  intro: string;
  sequenceLabel?: string;
  topSubLabel?: string;
  railLeftTitle?: string;
  railLeftSubtitle?: string;
  railRightTitle?: string;
  ctaPrimaryLabel?: string;
  ctaSecondaryLabel?: string;
  ctaTertiaryLabel?: string;
};

function drawCoverImage(
  canvas: HTMLCanvasElement,
  image: HTMLImageElement,
  viewportWidth: number,
  viewportHeight: number
) {
  const context = canvas.getContext("2d");
  if (!context) return;

  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const width = Math.max(1, Math.floor(viewportWidth));
  const height = Math.max(1, Math.floor(viewportHeight));

  if (canvas.width !== Math.floor(width * dpr) || canvas.height !== Math.floor(height * dpr)) {
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
  }

  context.setTransform(dpr, 0, 0, dpr, 0, 0);
  context.clearRect(0, 0, width, height);

  const imageRatio = image.width / image.height;
  const viewportRatio = width / height;

  let drawWidth = width;
  let drawHeight = height;
  let offsetX = 0;
  let offsetY = 0;

  if (imageRatio > viewportRatio) {
    drawHeight = height;
    drawWidth = height * imageRatio;
    offsetX = (width - drawWidth) / 2;
  } else {
    drawWidth = width;
    drawHeight = width / imageRatio;
    offsetY = (height - drawHeight) / 2;
  }

  context.drawImage(image, offsetX, offsetY, drawWidth, drawHeight);
}

function findNearestLoadedFrame(
  images: Array<HTMLImageElement | null>,
  targetIndex: number
) {
  if (images[targetIndex]) return images[targetIndex];

  for (let radius = 1; radius < images.length; radius += 1) {
    const backward = targetIndex - radius;
    const forward = targetIndex + radius;

    if (backward >= 0 && images[backward]) return images[backward];
    if (forward < images.length && images[forward]) return images[forward];
  }

  return null;
}

export default function HeroVideoScrub({
  name,
  role,
  headline,
  intro,
  sequenceLabel = "03.8s sequence",
  topSubLabel = "Hero Image Sequence",
  railLeftTitle = "Sequence 001",
  railLeftSubtitle = "Frames beneath, type above",
  railRightTitle = "Scroll Down / Reverse Up",
  ctaPrimaryLabel = "Open Works Archive",
  ctaSecondaryLabel = "Open Journal",
  ctaTertiaryLabel = "About Practice",
}: HeroVideoScrubProps) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const imagesRef = useRef<Array<HTMLImageElement | null>>([]);
  const loadingRef = useRef<Set<number>>(new Set());
  const currentFrameRef = useRef(0);

  const [frameUrls, setFrameUrls] = useState<string[]>([]);
  const [framesReady, setFramesReady] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 28,
    mass: 0.3,
  });

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 767px)");

    const update = () => setIsMobile(mediaQuery.matches);
    update();

    mediaQuery.addEventListener("change", update);
    return () => mediaQuery.removeEventListener("change", update);
  }, []);

  const mediaScale = useTransform(
    smoothProgress,
    [0, 1],
    isMobile ? [1, 1.01] : [1, 1.04]
  );
  const mediaY = useTransform(
    smoothProgress,
    [0, 1],
    isMobile ? [0, 0] : [0, 14]
  );

  const heroTitleY = useTransform(
    smoothProgress,
    [0, 1],
    isMobile ? [0, -80] : [0, -150]
  );
  const heroMetaY = useTransform(
    smoothProgress,
    [0, 1],
    isMobile ? [0, -38] : [0, -80]
  );
  const heroCopyOpacity = useTransform(
    smoothProgress,
    [0, 0.72, 1],
    [1, 0.7, 0.16]
  );

  const overlayOpacity = useTransform(smoothProgress, [0, 1], [0.16, 0.58]);

  const ghostTextY = useTransform(
    smoothProgress,
    [0, 1],
    isMobile ? [0, -50] : [0, -90]
  );
  const ghostTextOpacity = useTransform(
    smoothProgress,
    [0, 0.7, 1],
    [0.12, 0.08, 0.02]
  );

  const railY = useTransform(
    smoothProgress,
    [0, 1],
    isMobile ? [0, -12] : [0, -28]
  );
  const railOpacity = useTransform(smoothProgress, [0, 1], [1, 0.38]);

  function redrawFrame(index: number) {
    const canvas = canvasRef.current;
    const stage = stageRef.current;

    if (!canvas || !stage || frameUrls.length === 0) return;

    const image = findNearestLoadedFrame(imagesRef.current, index);
    if (!image) return;

    const rect = stage.getBoundingClientRect();
    drawCoverImage(canvas, image, rect.width, rect.height);
  }

  function loadFrame(index: number) {
    if (index < 0 || index >= frameUrls.length) return;
    if (imagesRef.current[index]) return;
    if (loadingRef.current.has(index)) return;

    loadingRef.current.add(index);

    const image = new window.Image();
    image.decoding = "async";
    image.src = frameUrls[index]!;

    image.onload = () => {
      loadingRef.current.delete(index);
      imagesRef.current[index] = image;

      if (!framesReady) {
        setFramesReady(true);
      }

      redrawFrame(currentFrameRef.current);
    };

    image.onerror = () => {
      loadingRef.current.delete(index);
    };
  }

  function warmUpAround(index: number) {
    const range = isMobile ? 3 : 6;

    loadFrame(index);

    for (let step = 1; step <= range; step += 1) {
      loadFrame(index + step);
      loadFrame(index - step);
    }
  }

  useEffect(() => {
    let cancelled = false;

    async function fetchFrames() {
      try {
        const response = await fetch("/api/hero-sequence", { cache: "no-store" });
        const data = (await response.json()) as { frames?: string[] };

        if (cancelled) return;

        const actualFrames = Array.isArray(data.frames) ? data.frames : [];

        setFrameUrls(actualFrames);
        imagesRef.current = new Array(actualFrames.length).fill(null);
        loadingRef.current.clear();
        setFramesReady(false);
      } catch {
        if (cancelled) return;

        setFrameUrls([]);
        imagesRef.current = [];
        loadingRef.current.clear();
        setFramesReady(false);
      }
    }

    void fetchFrames();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (frameUrls.length === 0) return;

    warmUpAround(0);

    const backgroundQueue = frameUrls.map((_, index) => index).slice(1);
    let cursor = 0;

    function pump() {
      for (let i = 0; i < 6 && cursor < backgroundQueue.length; i += 1) {
        loadFrame(backgroundQueue[cursor]!);
        cursor += 1;
      }

      if (cursor < backgroundQueue.length) {
        window.setTimeout(pump, 60);
      }
    }

    window.setTimeout(pump, 100);
  }, [frameUrls]);

  useEffect(() => {
    if (!framesReady) return;
    redrawFrame(currentFrameRef.current);
  }, [framesReady]);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    const observer = new ResizeObserver(() => {
      redrawFrame(currentFrameRef.current);
    });

    observer.observe(stage);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const unsubscribe = smoothProgress.on("change", (latest) => {
      if (frameUrls.length === 0) return;

      const nextIndex = Math.round(latest * Math.max(0, frameUrls.length - 1));

      warmUpAround(nextIndex);

      if (nextIndex !== currentFrameRef.current) {
        currentFrameRef.current = nextIndex;
        redrawFrame(nextIndex);
      }
    });

    return () => unsubscribe();
  }, [smoothProgress, frameUrls.length, isMobile]);

  return (
    <section ref={sectionRef} id="hero" className="relative h-[230vh]">
      <div className="sticky top-0 h-screen overflow-hidden border-b border-white/10 bg-black">
        <motion.div
          style={{ scale: mediaScale, y: mediaY }}
          className="absolute inset-0"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-zinc-950 via-black to-black" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.06),transparent_28%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.04),transparent_22%)]" />

          <div ref={stageRef} className="absolute inset-0">
            <canvas
              ref={canvasRef}
              className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-300 ${
                framesReady ? "opacity-100" : "opacity-0"
              }`}
            />
          </div>
        </motion.div>

        <div className="absolute inset-0 bg-gradient-to-b from-black/8 via-black/20 to-black/82" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.10),transparent_28%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.08),transparent_22%)]" />

        <motion.div
          style={{ opacity: overlayOpacity }}
          className="absolute inset-0 bg-black"
        />

        <div className="relative z-10 mx-auto flex h-full max-w-6xl flex-col justify-between px-5 pb-8 pt-24 sm:px-8 md:pt-28">
          <motion.div
            initial={{ opacity: 0, y: -18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="flex items-center justify-between gap-4 text-[11px] uppercase tracking-[0.28em] text-zinc-300"
          >
            <div className="space-y-1">
              <div>{name}</div>
              <div className="text-zinc-500">{topSubLabel}</div>
            </div>

            <div className="text-right">
              <div>{sequenceLabel}</div>
              <div className="text-zinc-500">&nbsp;</div>
            </div>
          </motion.div>

          <div className="relative flex flex-1 items-center">
            <motion.div
              style={{ y: ghostTextY, opacity: ghostTextOpacity }}
              className="pointer-events-none absolute -bottom-4 right-0 select-none text-[26vw] font-semibold leading-none tracking-[-0.08em] text-white"
            >
              BTTB
            </motion.div>

            <div className="relative z-10 max-w-3xl space-y-6">
              <motion.p
                style={{ y: heroMetaY, opacity: heroCopyOpacity }}
                className="text-[11px] uppercase tracking-[0.35em] text-zinc-300"
              >
                {role}
              </motion.p>

              <motion.h1
                style={{ y: heroTitleY, opacity: heroCopyOpacity }}
                className="max-w-[10ch] text-5xl font-semibold leading-[0.92] sm:text-6xl md:max-w-[12ch] md:text-7xl lg:text-8xl"
              >
                {headline}
              </motion.h1>

              <motion.p
                style={{ y: heroMetaY, opacity: heroCopyOpacity }}
                className="max-w-md text-sm leading-8 text-zinc-200 sm:text-base"
              >
                {intro}
              </motion.p>
            </div>
          </div>

          <motion.div
            style={{ y: railY, opacity: railOpacity }}
            className="space-y-5"
          >
            <div className="flex items-center justify-between gap-4 text-[11px] uppercase tracking-[0.24em] text-zinc-300">
              <div className="space-y-1">
                <div>{railLeftTitle}</div>
                <div className="text-zinc-500">{railLeftSubtitle}</div>
              </div>

              <div className="text-right">
                <div>{railRightTitle}</div>
                <div className="text-zinc-500">&nbsp;</div>
              </div>
            </div>

            <div className="h-px w-full bg-white/20" />

            <div className="overflow-hidden rounded-full bg-white/10">
              <motion.div
                style={{ scaleX: smoothProgress }}
                className="h-[3px] origin-left bg-white/90"
              />
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/works"
                className="inline-flex rounded-full bg-white px-5 py-3 text-sm text-black transition hover:bg-zinc-200"
              >
                {ctaPrimaryLabel}
              </Link>

              <Link
                href="/journal"
                className="inline-flex rounded-full border border-white/15 px-5 py-3 text-sm text-zinc-200 transition hover:border-white/30 hover:text-white"
              >
                {ctaSecondaryLabel}
              </Link>

              <a
                href="#about"
                className="inline-flex rounded-full border border-white/15 px-5 py-3 text-sm text-zinc-300 transition hover:border-white/30 hover:text-white"
              >
                {ctaTertiaryLabel}
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}