"use client";

import { useEffect, useRef, useState } from "react";

type Blob = {
  id: number;
  x: number;
  y: number;
  width: number;
  height: number;
  angle: number;
  tailOffsetX: number;
  tailOffsetY: number;
  skew: number;
};

type InkSplash = {
  id: number;
  x: number;
  y: number;
  size: number;
  rotation: number;
};

type Point = {
  x: number;
  y: number;
};

const BLOB_LIFETIME = 1650;
const SPLASH_LIFETIME = 1850;
const STROKE_IDLE_BREAK = 90;
const STAMP_STEP = 8;
const SMOOTHING = 0.11;

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export default function CursorEcho() {
  const [enabled, setEnabled] = useState(false);
  const [blobs, setBlobs] = useState<Blob[]>([]);
  const [splashes, setSplashes] = useState<InkSplash[]>([]);

  const targetRef = useRef<Point>({ x: 0, y: 0 });
  const smoothRef = useRef<Point>({ x: 0, y: 0 });
  const lastStampRef = useRef<{ x: number; y: number; t: number } | null>(null);
  const initializedRef = useRef(false);

  const rafRef = useRef<number | null>(null);
  const blobIdRef = useRef(0);
  const splashIdRef = useRef(0);
  const timeoutIdsRef = useRef<number[]>([]);

  useEffect(() => {
    const media = window.matchMedia("(pointer: fine)");
    const handleMedia = () => setEnabled(media.matches);

    handleMedia();
    media.addEventListener("change", handleMedia);

    return () => {
      media.removeEventListener("change", handleMedia);
    };
  }, []);

  useEffect(() => {
    if (!enabled) return;

    const handlePointerMove = (event: PointerEvent) => {
      targetRef.current = {
        x: event.clientX,
        y: event.clientY,
      };

      if (!initializedRef.current) {
        smoothRef.current = {
          x: event.clientX,
          y: event.clientY,
        };
        lastStampRef.current = {
          x: event.clientX,
          y: event.clientY,
          t: performance.now(),
        };
        initializedRef.current = true;
      }
    };

    const handleClick = (event: MouseEvent) => {
      const id = splashIdRef.current++;
      const splash: InkSplash = {
        id,
        x: event.clientX,
        y: event.clientY,
        size: 168,
        rotation: Math.random() * 360,
      };

      setSplashes((prev) => [...prev, splash]);

      const timeoutId = window.setTimeout(() => {
        setSplashes((prev) => prev.filter((item) => item.id !== id));
      }, SPLASH_LIFETIME);

      timeoutIdsRef.current.push(timeoutId);
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("click", handleClick);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("click", handleClick);
    };
  }, [enabled]);

  useEffect(() => {
    if (!enabled) return;

    const tick = () => {
      if (initializedRef.current && lastStampRef.current) {
        const target = targetRef.current;
        const smooth = smoothRef.current;

        smooth.x += (target.x - smooth.x) * SMOOTHING;
        smooth.y += (target.y - smooth.y) * SMOOTHING;

        const dx = smooth.x - lastStampRef.current.x;
        const dy = smooth.y - lastStampRef.current.y;
        const distance = Math.hypot(dx, dy);
        const now = performance.now();

        if (now - lastStampRef.current.t > STROKE_IDLE_BREAK) {
          lastStampRef.current = {
            x: smooth.x,
            y: smooth.y,
            t: now,
          };
        }

        if (distance >= STAMP_STEP) {
          const steps = Math.floor(distance / STAMP_STEP);

          for (let i = 1; i <= steps; i += 1) {
            const progress = (i * STAMP_STEP) / distance;

            const x = lastStampRef.current.x + dx * progress;
            const y = lastStampRef.current.y + dy * progress;

            const speed = clamp(distance, 0, 90);
            const angle = Math.atan2(dy, dx) * (180 / Math.PI);

            const width = clamp(42 + speed * 0.62, 40, 120);
            const height = clamp(22 + speed * 0.22, 24, 54);

            const tailOffsetX =
              -Math.cos((angle * Math.PI) / 180) * clamp(speed * 0.16, 3, 16);
            const tailOffsetY =
              -Math.sin((angle * Math.PI) / 180) * clamp(speed * 0.16, 3, 16);

            const id = blobIdRef.current++;

            const blob: Blob = {
              id,
              x,
              y,
              width,
              height,
              angle,
              tailOffsetX,
              tailOffsetY,
              skew: (Math.random() - 0.5) * 12,
            };

            setBlobs((prev) => [...prev, blob]);

            const timeoutId = window.setTimeout(() => {
              setBlobs((prev) => prev.filter((item) => item.id !== id));
            }, BLOB_LIFETIME);

            timeoutIdsRef.current.push(timeoutId);
          }

          lastStampRef.current = {
            x: smooth.x,
            y: smooth.y,
            t: now,
          };
        }
      }

      rafRef.current = window.requestAnimationFrame(tick);
    };

    rafRef.current = window.requestAnimationFrame(tick);

    return () => {
      if (rafRef.current !== null) {
        window.cancelAnimationFrame(rafRef.current);
      }

      timeoutIdsRef.current.forEach((id) => window.clearTimeout(id));
      timeoutIdsRef.current = [];
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <>
      <div className="pointer-events-none fixed inset-0 z-[95] overflow-hidden">
        {blobs.map((blob) => (
          <div
            key={blob.id}
            className="absolute"
            style={{
              left: blob.x,
              top: blob.y,
              width: blob.width,
              height: blob.height,
              transform: `translate(-50%, -50%) rotate(${blob.angle}deg) skewX(${blob.skew}deg)`,
            }}
          >
            <div
              className="cinematic-ink-soak absolute inset-0 rounded-[999px]"
              style={{
                background:
                  "radial-gradient(circle at 50% 50%, rgba(255,255,255,0.22) 0%, rgba(230,236,255,0.14) 28%, rgba(210,220,255,0.08) 52%, rgba(255,255,255,0.02) 72%, rgba(255,255,255,0) 86%)",
              }}
            />
            <div
              className="cinematic-ink-bleed absolute rounded-[999px]"
              style={{
                left: `calc(50% + ${blob.tailOffsetX}px)`,
                top: `calc(50% + ${blob.tailOffsetY}px)`,
                width: blob.width * 0.92,
                height: blob.height * 0.88,
                transform: "translate(-50%, -50%)",
                background:
                  "radial-gradient(circle at 50% 50%, rgba(255,255,255,0.18) 0%, rgba(220,230,255,0.10) 34%, rgba(255,255,255,0.03) 66%, rgba(255,255,255,0) 86%)",
              }}
            />
            <div
              className="cinematic-ink-fracture absolute inset-0 rounded-[999px]"
              style={{
                background:
                  "conic-gradient(from 0deg, rgba(255,255,255,0) 0deg 20deg, rgba(255,255,255,0.14) 20deg 34deg, rgba(255,255,255,0) 34deg 72deg, rgba(255,255,255,0.12) 72deg 92deg, rgba(255,255,255,0) 92deg 140deg, rgba(255,255,255,0.11) 140deg 156deg, rgba(255,255,255,0) 156deg 210deg, rgba(255,255,255,0.13) 210deg 228deg, rgba(255,255,255,0) 228deg 286deg, rgba(255,255,255,0.11) 286deg 306deg, rgba(255,255,255,0) 306deg 360deg)",
                maskImage:
                  "radial-gradient(circle at 50% 50%, transparent 0 47%, rgba(0,0,0,0.95) 58%, transparent 82%)",
                WebkitMaskImage:
                  "radial-gradient(circle at 50% 50%, transparent 0 47%, rgba(0,0,0,0.95) 58%, transparent 82%)",
              }}
            />
            <div
              className="cinematic-ink-core absolute rounded-[999px]"
              style={{
                left: "50%",
                top: "50%",
                width: blob.width * 0.34,
                height: blob.height * 0.54,
                transform: "translate(-50%, -50%)",
                background:
                  "radial-gradient(circle at 50% 50%, rgba(255,255,255,0.24) 0%, rgba(255,255,255,0.08) 56%, rgba(255,255,255,0) 84%)",
              }}
            />
          </div>
        ))}

        {splashes.map((splash) => (
          <div
            key={splash.id}
            className="absolute"
            style={{
              left: splash.x,
              top: splash.y,
              width: splash.size,
              height: splash.size,
              transform: `translate(-50%, -50%) rotate(${splash.rotation}deg)`,
            }}
          >
            <div
              className="cinematic-click-soak absolute inset-0 rounded-full"
              style={{
                background:
                  "radial-gradient(circle at 50% 50%, rgba(255,255,255,0.24) 0%, rgba(230,236,255,0.15) 30%, rgba(220,228,255,0.08) 52%, rgba(255,255,255,0.03) 72%, rgba(255,255,255,0) 88%)",
              }}
            />
            <div
              className="cinematic-click-bleed absolute inset-[8%] rounded-full"
              style={{
                background:
                  "radial-gradient(circle at 50% 50%, rgba(255,255,255,0.20) 0%, rgba(220,230,255,0.11) 34%, rgba(255,255,255,0.04) 68%, rgba(255,255,255,0) 88%)",
              }}
            />
            <div
              className="cinematic-click-fracture absolute inset-0 rounded-full"
              style={{
                background:
                  "conic-gradient(from 0deg, rgba(255,255,255,0) 0deg 18deg, rgba(255,255,255,0.16) 18deg 34deg, rgba(255,255,255,0) 34deg 68deg, rgba(255,255,255,0.15) 68deg 86deg, rgba(255,255,255,0) 86deg 128deg, rgba(255,255,255,0.13) 128deg 146deg, rgba(255,255,255,0) 146deg 196deg, rgba(255,255,255,0.16) 196deg 214deg, rgba(255,255,255,0) 214deg 268deg, rgba(255,255,255,0.14) 268deg 286deg, rgba(255,255,255,0) 286deg 360deg)",
                maskImage:
                  "radial-gradient(circle at 50% 50%, transparent 0 42%, rgba(0,0,0,0.95) 56%, transparent 84%)",
                WebkitMaskImage:
                  "radial-gradient(circle at 50% 50%, transparent 0 42%, rgba(0,0,0,0.95) 56%, transparent 84%)",
              }}
            />
            <div
              className="cinematic-click-core absolute rounded-full"
              style={{
                left: "50%",
                top: "50%",
                width: "24%",
                height: "24%",
                transform: "translate(-50%, -50%)",
                background:
                  "radial-gradient(circle at 50% 50%, rgba(255,255,255,0.28) 0%, rgba(255,255,255,0.10) 58%, rgba(255,255,255,0) 88%)",
              }}
            />
          </div>
        ))}
      </div>

      <style jsx global>{`
        .cinematic-ink-soak {
          filter: blur(10px);
          animation: inkSoakBloom ${BLOB_LIFETIME}ms ease-out forwards;
          mix-blend-mode: screen;
        }

        .cinematic-ink-bleed {
          filter: blur(18px);
          animation: inkBleedSpread ${BLOB_LIFETIME}ms ease-out forwards;
          mix-blend-mode: screen;
        }

        .cinematic-ink-fracture {
          filter: blur(1px);
          animation: inkFractureFade ${BLOB_LIFETIME}ms ease-out forwards;
          mix-blend-mode: screen;
        }

        .cinematic-ink-core {
          filter: blur(4px);
          animation: inkCorePulse ${BLOB_LIFETIME}ms ease-out forwards;
          mix-blend-mode: screen;
        }

        .cinematic-click-soak {
          filter: blur(18px);
          animation: clickInkSoak ${SPLASH_LIFETIME}ms ease-out forwards;
          mix-blend-mode: screen;
        }

        .cinematic-click-bleed {
          filter: blur(26px);
          animation: clickInkBleed ${SPLASH_LIFETIME}ms ease-out forwards;
          mix-blend-mode: screen;
        }

        .cinematic-click-fracture {
          filter: blur(1.5px);
          animation: clickInkFracture ${SPLASH_LIFETIME}ms ease-out forwards;
          mix-blend-mode: screen;
        }

        .cinematic-click-core {
          filter: blur(5px);
          animation: clickInkCore ${SPLASH_LIFETIME}ms ease-out forwards;
          mix-blend-mode: screen;
        }

        @keyframes inkSoakBloom {
          0% {
            opacity: 0;
            transform: scale(0.38);
            filter: blur(4px);
          }
          16% {
            opacity: 1;
            transform: scale(1);
            filter: blur(8px);
          }
          58% {
            opacity: 0.86;
            transform: scale(1.14);
            filter: blur(12px);
          }
          100% {
            opacity: 0;
            transform: scale(1.82);
            filter: blur(26px);
          }
        }

        @keyframes inkBleedSpread {
          0% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.28);
            filter: blur(10px);
          }
          18% {
            opacity: 0.9;
            transform: translate(-50%, -50%) scale(1);
            filter: blur(16px);
          }
          62% {
            opacity: 0.72;
            transform: translate(-50%, -50%) scale(1.22);
            filter: blur(22px);
          }
          100% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(1.95);
            filter: blur(36px);
          }
        }

        @keyframes inkFractureFade {
          0% {
            opacity: 0;
            transform: scale(0.52) rotate(-4deg);
          }
          20% {
            opacity: 0.42;
            transform: scale(1) rotate(0deg);
          }
          56% {
            opacity: 0.28;
            transform: scale(1.14) rotate(2deg);
          }
          100% {
            opacity: 0;
            transform: scale(1.42) rotate(5deg);
          }
        }

        @keyframes inkCorePulse {
          0% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.2);
          }
          14% {
            opacity: 0.62;
            transform: translate(-50%, -50%) scale(1);
          }
          48% {
            opacity: 0.38;
            transform: translate(-50%, -50%) scale(1.18);
          }
          100% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(1.74);
          }
        }

        @keyframes clickInkSoak {
          0% {
            opacity: 0;
            transform: scale(0.1);
            filter: blur(8px);
          }
          12% {
            opacity: 1;
            transform: scale(0.72);
            filter: blur(14px);
          }
          42% {
            opacity: 0.9;
            transform: scale(1.12);
            filter: blur(18px);
          }
          100% {
            opacity: 0;
            transform: scale(2.15);
            filter: blur(36px);
          }
        }

        @keyframes clickInkBleed {
          0% {
            opacity: 0;
            transform: scale(0.14);
            filter: blur(14px);
          }
          16% {
            opacity: 0.95;
            transform: scale(0.86);
            filter: blur(20px);
          }
          48% {
            opacity: 0.78;
            transform: scale(1.3);
            filter: blur(28px);
          }
          100% {
            opacity: 0;
            transform: scale(2.45);
            filter: blur(48px);
          }
        }

        @keyframes clickInkFracture {
          0% {
            opacity: 0;
            transform: scale(0.2) rotate(-8deg);
          }
          18% {
            opacity: 0.48;
            transform: scale(0.92) rotate(0deg);
          }
          56% {
            opacity: 0.34;
            transform: scale(1.28) rotate(4deg);
          }
          100% {
            opacity: 0;
            transform: scale(1.86) rotate(8deg);
          }
        }

        @keyframes clickInkCore {
          0% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.1);
          }
          10% {
            opacity: 0.78;
            transform: translate(-50%, -50%) scale(1);
          }
          44% {
            opacity: 0.44;
            transform: translate(-50%, -50%) scale(1.3);
          }
          100% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(1.95);
          }
        }
      `}</style>
    </>
  );
}