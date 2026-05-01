"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";

type SpotlightOrigin = {
  x: number;
  y: number;
};

type SpotlightRouteButtonProps = {
  href: string;
  label: string;
  overlayTitle?: string;
  overlaySubtitle?: string;
  className?: string;
};

export default function SpotlightRouteButton({
  href,
  label,
  overlayTitle,
  overlaySubtitle = "Opening section",
  className,
}: SpotlightRouteButtonProps) {
  const router = useRouter();
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  const [transitioning, setTransitioning] = useState(false);
  const [origin, setOrigin] = useState<SpotlightOrigin>({ x: 0, y: 0 });

  useEffect(() => {
    router.prefetch(href);
  }, [router, href]);

  function handleClick() {
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
    }, 520);
  }

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        onClick={handleClick}
        className={
          className ||
          "inline-flex rounded-full border border-white/10 px-4 py-3 text-sm text-zinc-200 transition hover:border-white/30 hover:text-white"
        }
      >
        {label}
      </button>

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
                opacity: 0.8,
              }}
              animate={{
                clipPath: `circle(160vmax at ${origin.x}px ${origin.y}px)`,
                opacity: 1,
              }}
              transition={{ duration: 0.62, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.08),transparent_24%),linear-gradient(180deg,rgba(255,255,255,0.08),rgba(0,0,0,0.95))]"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.45, ease: "easeOut" }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <div className="space-y-4 text-center">
                <div className="font-serif text-6xl italic text-zinc-100 sm:text-7xl">
                  {overlayTitle || label}
                </div>
                <div className="text-[11px] uppercase tracking-[0.32em] text-zinc-400">
                  {overlaySubtitle}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}