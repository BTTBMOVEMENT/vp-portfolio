"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";

type SpotlightOrigin = {
  x: number;
  y: number;
};

export default function MyAlbumGateway() {
  const router = useRouter();
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const [transitioning, setTransitioning] = useState(false);
  const [origin, setOrigin] = useState<SpotlightOrigin>({ x: 0, y: 0 });

  useEffect(() => {
    router.prefetch("/my-album");
  }, [router]);

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
      router.push("/my-album");
    }, 520);
  }

  return (
    <>
      <section className="border-t border-white/10 px-5 py-20 sm:px-8">
        <div className="mx-auto max-w-[1500px]">
          <div className="relative overflow-hidden rounded-[2.75rem] border border-white/10 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.06),transparent_28%),linear-gradient(180deg,rgba(255,255,255,0.03),rgba(255,255,255,0.01))] px-6 py-10 sm:px-8 sm:py-12 lg:px-12 lg:py-14">
            <div className="pointer-events-none absolute -right-4 bottom-0 select-none text-[18vw] font-semibold leading-none tracking-[-0.08em] text-white/[0.04]">
              ALBUM
            </div>

            <div className="relative z-10 grid gap-10 xl:grid-cols-[0.7fr_1.3fr] xl:items-end">
              <div className="space-y-4">
                <p className="text-[11px] uppercase tracking-[0.32em] text-zinc-500">
                  My Album
                </p>
                <div className="h-px w-20 bg-white/15" />
                <p className="max-w-sm text-sm leading-8 text-zinc-400">
                  A quieter archive for personal photographs, visual memory, and
                  frames that do not belong to the case-study structure.
                </p>
              </div>

              <div className="space-y-6">
                <h2 className="max-w-[12ch] font-serif text-5xl italic leading-[0.96] text-zinc-100 sm:text-6xl">
                  Enter the album as if stepping into another atmosphere.
                </h2>

                <p className="max-w-2xl text-sm leading-8 text-zinc-300 sm:text-base">
                  This route opens a more intimate image field: no grid, no archive wall,
                  just drifting frames, optional notes, and a slower visual rhythm.
                </p>

                <div className="flex flex-wrap items-center gap-4">
                  <button
                    ref={buttonRef}
                    type="button"
                    onClick={handleEnter}
                    className="group inline-flex items-center gap-4 rounded-full border border-white/15 bg-white/[0.04] px-6 py-4 text-sm text-zinc-100 transition hover:border-white/30 hover:bg-white/[0.08]"
                  >
                    <span className="font-serif text-2xl italic leading-none">My Album</span>
                    <span className="text-[11px] uppercase tracking-[0.28em] text-zinc-400 transition group-hover:text-zinc-200">
                      Enter
                    </span>
                  </button>

                  <p className="text-[11px] uppercase tracking-[0.24em] text-zinc-500">
                    Spotlight transition / soft iris reveal
                  </p>
                </div>
              </div>
            </div>
          </div>
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
                  My Album
                </div>
                <div className="text-[11px] uppercase tracking-[0.32em] text-zinc-400">
                  Entering the orbital collection
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}