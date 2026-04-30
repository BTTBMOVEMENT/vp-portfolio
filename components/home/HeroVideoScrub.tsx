"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, useScroll, useSpring, useTransform } from "motion/react";

type HeroVideoScrubProps = {
  name: string;
  role: string;
  headline: string;
  intro: string;
  videoSrc: string;
  posterSrc?: string;
  sequenceLabel?: string;
};

export default function HeroVideoScrub({
  name,
  role,
  headline,
  intro,
  videoSrc,
  sequenceLabel = "03.8s sequence",
}: HeroVideoScrubProps) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const targetTimeRef = useRef(0);

  const [duration, setDuration] = useState(0);
  const [videoReady, setVideoReady] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 26,
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
    isMobile ? [1, 1.01] : [1, 1.06]
  );
  const mediaY = useTransform(
    smoothProgress,
    [0, 1],
    isMobile ? [0, 0] : [0, 18]
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

  function stopRaf() {
    if (rafRef.current !== null) {
      window.cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  }

  function scrubTowardTarget() {
    const video = videoRef.current;

    if (!video || !duration || !videoReady) {
      stopRaf();
      return;
    }

    const current = video.currentTime || 0;
    const delta = targetTimeRef.current - current;

    if (Math.abs(delta) < 1 / 90) {
      try {
        video.currentTime = targetTimeRef.current;
      } catch {
        // ignore edge seek issues
      }
      stopRaf();
      return;
    }

    try {
      video.currentTime = current + delta * (isMobile ? 0.22 : 0.28);
    } catch {
      stopRaf();
      return;
    }

    rafRef.current = window.requestAnimationFrame(scrubTowardTarget);
  }

  async function primeVideoElement() {
    const video = videoRef.current;
    if (!video) return;

    try {
      video.muted = true;
      video.playsInline = true;

      const playPromise = video.play();

      if (playPromise && typeof playPromise.then === "function") {
        await playPromise;
        video.pause();
      } else {
        video.pause();
      }
    } catch {
      // ignore autoplay/priming rejection
    }
  }

  function handleLoadedMetadata() {
    const video = videoRef.current;
    if (!video) return;

    const nextDuration = Number.isFinite(video.duration) ? video.duration : 0;
    setDuration(nextDuration);

    try {
      video.pause();
      video.currentTime = 0;
    } catch {
      // ignore initial seek issues
    }
  }

  function handleLoadedData() {
    setVideoReady(true);
    void primeVideoElement();
  }

  function handleCanPlay() {
    if (!videoReady) {
      setVideoReady(true);
      void primeVideoElement();
    }
  }

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.load();
  }, [videoSrc]);

  useEffect(() => {
    const unsubscribe = smoothProgress.on("change", (latest) => {
      const video = videoRef.current;
      if (!video || !duration || !videoReady) return;

      targetTimeRef.current = Math.min(duration, Math.max(0, latest * duration));

      if (rafRef.current === null) {
        rafRef.current = window.requestAnimationFrame(scrubTowardTarget);
      }
    });

    return () => {
      unsubscribe();
      stopRaf();
    };
  }, [smoothProgress, duration, videoReady, isMobile]);

  const durationLabel =
    duration > 0 ? `${duration.toFixed(1)}s scrub` : sequenceLabel;

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

          <motion.video
            ref={videoRef}
            src={videoSrc}
            preload="auto"
            muted
            playsInline
            disableRemotePlayback
            onLoadedMetadata={handleLoadedMetadata}
            onLoadedData={handleLoadedData}
            onCanPlay={handleCanPlay}
            onError={() => {
              setVideoError(true);
              setVideoReady(false);
            }}
            animate={{ opacity: videoReady && !videoError ? 1 : 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute inset-0 h-full w-full object-cover"
          />
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
              <div className="text-zinc-500">Hero Scrub Sequence</div>
            </div>

            <div className="text-right">
              <div>{durationLabel}</div>
              <div className="text-zinc-500">
                {videoReady && !videoError ? "Video live" : "Loading sequence"}
              </div>
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
                <div className="text-zinc-500">Typography and motion are decoupled</div>
              </div>

              <div className="text-right">
                <div>Scroll Down / Reverse Up</div>
                <div className="text-zinc-500">Video beneath, type above</div>
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