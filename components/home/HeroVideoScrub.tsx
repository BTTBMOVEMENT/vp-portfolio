"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "motion/react";

type HeroVideoScrubProps = {
  name: string;
  role: string;
  headline: string;
  intro: string;
  videoSrc: string;
  posterSrc: string;
  sequenceLabel?: string;
};

export default function HeroVideoScrub({
  name,
  role,
  headline,
  intro,
  videoSrc,
  posterSrc,
  sequenceLabel = "03.8s sequence",
}: HeroVideoScrubProps) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const targetTimeRef = useRef(0);

  const [duration, setDuration] = useState(0);
  const [videoReady, setVideoReady] = useState(false);
  const [videoError, setVideoError] = useState(false);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  const mediaScale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);
  const mediaY = useTransform(scrollYProgress, [0, 1], [0, 36]);

  const heroTitleY = useTransform(scrollYProgress, [0, 1], [0, -150]);
  const heroMetaY = useTransform(scrollYProgress, [0, 1], [0, -80]);
  const heroCopyOpacity = useTransform(
    scrollYProgress,
    [0, 0.72, 1],
    [1, 0.68, 0.16]
  );

  const overlayOpacity = useTransform(scrollYProgress, [0, 1], [0.18, 0.62]);

  const ghostTextY = useTransform(scrollYProgress, [0, 1], [0, -90]);
  const ghostTextOpacity = useTransform(
    scrollYProgress,
    [0, 0.7, 1],
    [0.12, 0.08, 0.02]
  );

  const railY = useTransform(scrollYProgress, [0, 1], [0, -28]);
  const railOpacity = useTransform(scrollYProgress, [0, 1], [1, 0.38]);

  function stopRaf() {
    if (rafRef.current !== null) {
      window.cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  }

  function scrubTowardTarget() {
    const video = videoRef.current;

    if (!video || !duration) {
      rafRef.current = null;
      return;
    }

    const current = video.currentTime || 0;
    const delta = targetTimeRef.current - current;

    if (Math.abs(delta) < 0.016) {
      try {
        video.currentTime = targetTimeRef.current;
      } catch {
        // ignore seek edge cases
      }
      rafRef.current = null;
      return;
    }

    try {
      video.currentTime = current + delta * 0.22;
    } catch {
      rafRef.current = null;
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
      // Some browsers may reject programmatic play during preload;
      // that's okay, we still reveal the video if frames are available.
    }

    setVideoReady(true);
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
    void primeVideoElement();
  }

  function handleCanPlay() {
    if (!videoReady) {
      void primeVideoElement();
    }
  }

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.load();
  }, [videoSrc]);

  useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (latest) => {
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
  }, [scrollYProgress, duration, videoReady]);

  const durationLabel =
    duration > 0 ? `${duration.toFixed(1)}s scrub` : sequenceLabel;

  return (
    <section ref={sectionRef} id="hero" className="relative h-[230vh]">
      <div className="sticky top-0 h-screen overflow-hidden border-b border-white/10 bg-black">
        <motion.div style={{ scale: mediaScale, y: mediaY }} className="absolute inset-0">
          <motion.div
            animate={{ opacity: videoReady && !videoError ? 0 : 1 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="absolute inset-0"
          >
            <Image
              src={posterSrc}
              alt="Hero poster"
              fill
              sizes="100vw"
              priority
              className="object-cover"
            />
          </motion.div>

          <motion.video
            ref={videoRef}
            src={videoSrc}
            poster={posterSrc}
            preload="auto"
            muted
            playsInline
            onLoadedMetadata={handleLoadedMetadata}
            onLoadedData={handleLoadedData}
            onCanPlay={handleCanPlay}
            onError={() => {
              setVideoError(true);
              setVideoReady(false);
            }}
            animate={{ opacity: videoReady && !videoError ? 1 : 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="absolute inset-0 h-full w-full object-cover"
          />
        </motion.div>

        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/25 to-black/85" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.12),transparent_28%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.09),transparent_22%)]" />

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
                {videoReady && !videoError ? "Video live" : "Poster fallback"}
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
                style={{ scaleX: scrollYProgress }}
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