"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  AnimatePresence,
  motion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";

type SpotlightOrigin = {
  x: number;
  y: number;
};

type RouteGatewaySectionProps = {
  sectionLabel: string;
  title: string;
  description: string;
  buttonLabel: string;
  href: string;
  overlayTitle?: string;
  overlaySubtitle?: string;
  ghostText?: string;
};

export default function RouteGatewaySection({
  sectionLabel,
  title,
  description,
  buttonLabel,
  href,
  overlayTitle,
  overlaySubtitle = "Opening section",
  ghostText = "ARCHIVE",
}: RouteGatewaySectionProps) {
  const router = useRouter();
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const sectionRef = useRef<HTMLElement | null>(null);

  const [transitioning, setTransitioning] = useState(false);
  const [origin, setOrigin] = useState<SpotlightOrigin>({ x: 0, y: 0 });

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const progress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 28,
    mass: 0.4,
  });

  const panelY = useTransform(progress, [0, 0.2, 0.8, 1], [90, 0, 0, -80]);
  const panelOpacity = useTransform(progress, [0, 0.16, 0.82, 1], [0, 1, 1, 0.26]);
  const panelScale = useTransform(progress, [0, 0.22, 1], [0.96, 1, 0.985]);
  const panelRotateX = useTransform(progress, [0, 0.5, 1], [5, 0, -2]);

  const leftColY = useTransform(progress, [0, 0.3, 1], [36, 0, -24]);
  const rightColY = useTransform(progress, [0, 0.3, 1], [56, 0, -36]);

  const leftColOpacity = useTransform(progress, [0, 0.18, 1], [0, 1, 0.5]);
  const rightColOpacity = useTransform(progress, [0, 0.18, 1], [0, 1, 0.45]);

  const titleY = useTransform(progress, [0, 0.45, 1], [28, 0, -18]);
  const titleOpacity = useTransform(progress, [0, 0.18, 0.9, 1], [0, 1, 1, 0.55]);

  const descriptionY = useTransform(progress, [0, 0.35, 1], [24, 0, -14]);
  const descriptionOpacity = useTransform(progress, [0, 0.18, 0.92, 1], [0, 1, 1, 0.5]);

  const ghostY = useTransform(progress, [0, 1], [80, -40]);
  const ghostOpacity = useTransform(progress, [0, 0.2, 0.7, 1], [0, 0.08, 0.05, 0.015]);

  const lineScaleX = useTransform(progress, [0.08, 0.7], [0.18, 1]);
  const glowOpacity = useTransform(progress, [0, 0.24, 0.78, 1], [0.18, 0.55, 0.4, 0.1]);
  const glowY = useTransform(progress, [0, 1], [40, -30]);

  useEffect(() => {
    router.prefetch(href);
  }, [router, href]);

  function handleEnter() {
    const rect = buttonRef.current?.getBoundingClientRect();

    if (rect) {
      setOrigin({
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
      });
    } else {
      setOrigin({
        x: window.innerWidth / 2,
        y: window.innerHeight / 2,
      });
    }

    setTransitioning(true);

    window.setTimeout(() => {
      router.push(href);
    }, 540);
  }

  return (
    <>
      <section ref={sectionRef} className="border-t border-white/10 px-5 py-20 sm:px-8">
        <div className="mx-auto max-w-[1500px] [perspective:1600px]">
          <motion.div
            style={{
              y: panelY,
              opacity: panelOpacity,
              scale: panelScale,
              rotateX: panelRotateX,
            }}
            className="relative overflow-hidden rounded-[2.75rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.03),rgba(255,255,255,0.01))] px-6 py-10 shadow-[0_30px_90px_rgba(0,0,0,0.28)] sm:px-8 sm:py-12 lg:px-12 lg:py-14"
          >
            <motion.div
              style={{ opacity: glowOpacity, y: glowY }}
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.09),transparent_28%)]"
            />
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.04),transparent_26%)]" />

            <motion.div
              style={{ y: ghostY, opacity: ghostOpacity }}
              className="pointer-events-none absolute -right-4 bottom-0 select-none text-[18vw] font-semibold leading-none tracking-[-0.08em] text-white"
            >
              {ghostText}
            </motion.div>

            <div className="relative z-10 grid gap-10 xl:grid-cols-[0.7fr_1.3fr] xl:items-end">
              <motion.div
                style={{ y: leftColY, opacity: leftColOpacity }}
                className="space-y-4"
              >
                <p className="text-[11px] uppercase tracking-[0.32em] text-zinc-500">
                  {sectionLabel}
                </p>
                <div className="h-px w-20 bg-white/15" />
              </motion.div>

              <motion.div
                style={{ y: rightColY, opacity: rightColOpacity }}
                className="space-y-6"
              >
                <motion.h2
                  style={{ y: titleY, opacity: titleOpacity }}
                  className="max-w-[12ch] font-serif text-5xl italic leading-[0.96] text-zinc-100 sm:text-6xl"
                >
                  {title}
                </motion.h2>

                <motion.p
                  style={{ y: descriptionY, opacity: descriptionOpacity }}
                  className="max-w-2xl text-sm leading-8 text-zinc-300 sm:text-base"
                >
                  {description}
                </motion.p>

                <div className="flex flex-wrap items-center gap-4">
                  <button
                    ref={buttonRef}
                    type="button"
                    onClick={handleEnter}
                    className="group inline-flex items-center gap-4 rounded-full border border-white/15 bg-white/[0.04] px-6 py-4 text-sm text-zinc-100 transition hover:border-white/30 hover:bg-white/[0.08]"
                  >
                    <span className="font-serif text-2xl italic leading-none">
                      {buttonLabel}
                    </span>
                    <span className="text-[11px] uppercase tracking-[0.28em] text-zinc-400 transition group-hover:text-zinc-200">
                      Enter
                    </span>
                  </button>
                </div>
              </motion.div>
            </div>

            <div className="relative z-10 mt-8 overflow-hidden rounded-full bg-white/10">
              <motion.div
                style={{ scaleX: lineScaleX }}
                className="h-[2px] origin-left bg-white/80"
              />
            </div>
          </motion.div>
        </div>
      </section>

      <AnimatePresence>
        {transitioning && (
          <motion.div
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="pointer-events-none fixed inset-0 z-[120]"
          >
            <motion.div
              initial={{
                clipPath: `circle(0px at ${origin.x}px ${origin.y}px)`,
                opacity: 0.9,
              }}
              animate={{
                clipPath: `circle(160vmax at ${origin.x}px ${origin.y}px)`,
                opacity: 1,
              }}
              transition={{ duration: 0.62, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.05),transparent_18%),linear-gradient(180deg,rgba(0,0,0,0.84),rgba(0,0,0,0.97))]"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 14 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.45, ease: "easeOut" }}
              className="absolute inset-0 flex items-center justify-center px-6"
            >
              <div className="rounded-[2rem] border border-white/10 bg-black/55 px-10 py-8 shadow-[0_30px_90px_rgba(0,0,0,0.45)] backdrop-blur-md">
                <div className="space-y-4 text-center">
                  <div className="font-serif text-6xl italic text-zinc-100 sm:text-7xl">
                    {overlayTitle || buttonLabel}
                  </div>
                  <div className="text-[11px] uppercase tracking-[0.32em] text-zinc-300">
                    {overlaySubtitle}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}