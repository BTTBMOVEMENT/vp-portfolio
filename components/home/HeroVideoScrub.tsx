"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, useScroll, useSpring, useTransform } from "motion/react";

type HeroVideoScrubProps = {
  name: string;
  role: string;
  headline: string;
  intro: string;
  videoSrc?: string;
  posterSrc?: string;
  sequenceLabel?: string;
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
  sequenceLabel = "180 frame image sequence",
}: HeroVideoScrubProps) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const imagesRef = useRef<Array<HTMLImageElement | null>>([]);
  const currentFrameRef = useRef(0);

  const [frameUrls, setFrameUrls] = useState<string[]>([]);
  const [loadedCount, setLoadedCount] = useState(0);
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

  useEffect(() => {
    let cancelled = false;

    async function loadFrames() {
      try {
        const response = await fetch("/api/hero-sequence", { cache: "no-store" });
        const data = (await response.json()) as { frames?: string[] };
        const frames = Array.isArray(data.frames) ? data.frames : [];

        if (cancelled) return;

        setFrameUrls(frames);
        setLoadedCount(0);
        setFramesReady(false);
        imagesRef.current = new Array(frames.length).fill(null);

        frames.forEach((src, index) => {
          const image = new window.Image();
          image.decoding = "async";
          image.src = src;

          image.onload = () => {
            if (cancelled) return;

            imagesRef.current[index] = image;
            setLoadedCount((count) => count + 1);

            if (index === 0) {
              setFramesReady(true);
              redrawFrame(currentFrameRef.current);
            } else {
              redrawFrame(currentFrameRef.current);
            }
          };
        });
      } catch {
        if (!cancelled) {
          setFrameUrls([]);
          setLoadedCount(0);
          setFramesReady(false);
        }
      }
    }

    void loadFrames();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    const observer = new ResizeObserver(() => {
      redrawFrame(currentFrameRef.current);
    });

    observer.observe(stage);

    return () => observer.disconnect();
  }, [frameUrls.length]);

  useEffect(() => {
    const unsubscribe = smoothProgress.on("change", (latest) => {
      if (frameUrls.length === 0) return;

      const nextIndex = Math.round(latest * Math.max(0, frameUrls.length - 1));

      if (nextIndex !== currentFrameRef.current) {
        currentFrameRef.current = nextIndex;
        redrawFrame(nextIndex);
      }
    });

    return () => unsubscribe();
  }, [smoothProgress, frameUrls.length]);

  const loadedLabel =
    frameUrls.length > 0 ? `${loadedCount} / ${frameUrls.length} loaded` : sequenceLabel;

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

        {!framesReady && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <div className="rounded-full border border-white/10 bg-black/40 px-5 py-3 text-[11px] uppercase tracking-[0.28em] text-zinc-400 backdrop-blur-xl">
              Loading hero sequence...
            </div>
          </div>
        )}

        <div className="relative z-10 mx-auto flex h-full max-w-6xl flex-col justify-between px-5 pb-8 pt-24 sm:px-8 md:pt-28">
          <motion.div
            initial={{ opacity: 0, y: -18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="flex items-center justify-between gap-4 text-[11px] uppercase tracking-[0.28em] text-zinc-300"
          >
            <div className="space-y-1">
              <div>{name}</div>
              <div className="text-zinc-500">Hero Image Sequence</div>
            </div>

            <div className="text-right">
              <div>{sequenceLabel}</div>
              <div className="text-zinc-500">{loadedLabel}</div>
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
                <div>Sequence 001</div>
                <div className="text-zinc-500">Frames beneath, type above</div>
              </div>

              <div className="text-right">
                <div>Scroll Down / Reverse Up</div>
                <div className="text-zinc-500">180-frame image sequence</div>
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
                Open Works Archive
              </Link>

              <Link
                href="/journal"
                className="inline-flex rounded-full border border-white/15 px-5 py-3 text-sm text-zinc-200 transition hover:border-white/30 hover:text-white"
              >
                Open Journal
              </Link>

              <a
                href="#about"
                className="inline-flex rounded-full border border-white/15 px-5 py-3 text-sm text-zinc-300 transition hover:border-white/30 hover:text-white"
              >
                About Practice
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}