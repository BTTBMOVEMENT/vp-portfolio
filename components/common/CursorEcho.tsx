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
};

type Ripple = {
  id: number;
  x: number;
  y: number;
  size: number;
};

type Point = {
  x: number;
  y: number;
};

const BLOB_LIFETIME = 1400;
const RIPPLE_LIFETIME = 1100;
const STAMP_STEP = 10;
const SMOOTHING = 0.16;

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export default function CursorEcho() {
  const [enabled, setEnabled] = useState(false);
  const [blobs, setBlobs] = useState<Blob[]>([]);
  const [ripples, setRipples] = useState<Ripple[]>([]);

  const targetRef = useRef<Point>({ x: 0, y: 0 });
  const smoothRef = useRef<Point>({ x: 0, y: 0 });
  const lastStampRef = useRef<Point | null>(null);
  const initializedRef = useRef(false);

  const rafRef = useRef<number | null>(null);
  const blobIdRef = useRef(0);
  const rippleIdRef = useRef(0);
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
        };
        initializedRef.current = true;
      }
    };

    const handleClick = (event: MouseEvent) => {
      const id = rippleIdRef.current++;
      const size = 24;

      setRipples((prev) => [
        ...prev,
        {
          id,
          x: event.clientX,
          y: event.clientY,
          size,
        },
      ]);

      const timeoutId = window.setTimeout(() => {
        setRipples((prev) => prev.filter((item) => item.id !== id));
      }, RIPPLE_LIFETIME);

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

        if (distance >= STAMP_STEP) {
          const steps = Math.floor(distance / STAMP_STEP);

          for (let i = 1; i <= steps; i += 1) {
            const progress = (i * STAMP_STEP) / distance;

            const x = lastStampRef.current.x + dx * progress;
            const y = lastStampRef.current.y + dy * progress;

            const speed = clamp(distance, 0, 80);
            const stretch = 1 + speed / 70;
            const angle = Math.atan2(dy, dx) * (180 / Math.PI);

            const width = clamp(26 + speed * 0.55, 28, 86);
            const height = clamp(18 + speed * 0.18, 20, 40);

            const tailOffsetX = -Math.cos((angle * Math.PI) / 180) * clamp(speed * 0.12, 2, 10);
            const tailOffsetY = -Math.sin((angle * Math.PI) / 180) * clamp(speed * 0.12, 2, 10);

            const id = blobIdRef.current++;

            const blob: Blob = {
              id,
              x,
              y,
              width: width * stretch,
              height,
              angle,
              tailOffsetX,
              tailOffsetY,
            };

            setBlobs((prev) => [...prev, blob]);

            const timeoutId = window.setTimeout(() => {
              setBlobs((prev) => prev.filter((item) => item.id !== id));
            }, BLOB_LIFETIME);

            timeoutIdsRef.current.push(timeoutId);
          }

          lastStampRef.current = { x: smooth.x, y: smooth.y };
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
              transform: `translate(-50%, -50%) rotate(${blob.angle}deg)`,
            }}
          >
            <div
              className="cinematic-ink-main absolute inset-0 rounded-full"
              style={{
                background:
                  "radial-gradient(circle at 50% 50%, rgba(255,255,255,0.26) 0%, rgba(230,238,255,0.16) 26%, rgba(205,220,255,0.09) 48%, rgba(255,255,255,0.03) 68%, rgba(255,255,255,0) 82%)",
              }}
            />
            <div
              className="cinematic-ink-tail absolute rounded-full"
              style={{
                left: `calc(50% + ${blob.tailOffsetX}px)`,
                top: `calc(50% + ${blob.tailOffsetY}px)`,
                width: blob.width * 0.72,
                height: blob.height * 0.78,
                transform: "translate(-50%, -50%)",
                background:
                  "radial-gradient(circle at 50% 50%, rgba(255,255,255,0.16) 0%, rgba(220,232,255,0.09) 36%, rgba(255,255,255,0.02) 70%, rgba(255,255,255,0) 84%)",
              }}
            />
            <div
              className="cinematic-ink-core absolute rounded-full"
              style={{
                left: "50%",
                top: "50%",
                width: blob.width * 0.26,
                height: blob.height * 0.42,
                transform: "translate(-50%, -50%)",
                background:
                  "radial-gradient(circle at 50% 50%, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0.06) 60%, rgba(255,255,255,0) 84%)",
              }}
            />
          </div>
        ))}

        {ripples.map((ripple) => (
          <div
            key={ripple.id}
            className="absolute"
            style={{
              left: ripple.x,
              top: ripple.y,
              width: ripple.size,
              height: ripple.size,
              transform: "translate(-50%, -50%)",
            }}
          >
            <div className="cinematic-ripple absolute inset-0 rounded-full border border-white/25" />
            <div className="cinematic-ripple-glow absolute inset-0 rounded-full" />
          </div>
        ))}
      </div>

      <style jsx global>{`
        .cinematic-ink-main {
          filter: blur(8px);
          animation: cinematicInkBloom ${BLOB_LIFETIME}ms ease-out forwards;
          mix-blend-mode: screen;
        }

        .cinematic-ink-tail {
          filter: blur(14px);
          animation: cinematicInkTail ${BLOB_LIFETIME}ms ease-out forwards;
          mix-blend-mode: screen;
        }

        .cinematic-ink-core {
          filter: blur(3px);
          animation: cinematicInkCore ${BLOB_LIFETIME}ms ease-out forwards;
          mix-blend-mode: screen;
        }

        .cinematic-ripple {
          animation: cinematicRipple ${RIPPLE_LIFETIME}ms ease-out forwards;
          mix-blend-mode: screen;
        }

        .cinematic-ripple-glow {
          background: radial-gradient(
            circle,
            rgba(255, 255, 255, 0.18) 0%,
            rgba(220, 232, 255, 0.08) 42%,
            rgba(255, 255, 255, 0) 75%
          );
          filter: blur(10px);
          animation: cinematicRippleGlow ${RIPPLE_LIFETIME}ms ease-out forwards;
          mix-blend-mode: screen;
        }

        @keyframes cinematicInkBloom {
          0% {
            opacity: 0;
            transform: scale(0.45);
            filter: blur(4px);
          }
          16% {
            opacity: 1;
            transform: scale(1);
            filter: blur(7px);
          }
          58% {
            opacity: 0.9;
            transform: scale(1.08);
            filter: blur(10px);
          }
          100% {
            opacity: 0;
            transform: scale(1.6);
            filter: blur(22px);
          }
        }

        @keyframes cinematicInkTail {
          0% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.3);
            filter: blur(8px);
          }
          18% {
            opacity: 0.9;
            transform: translate(-50%, -50%) scale(1);
            filter: blur(14px);
          }
          60% {
            opacity: 0.65;
            transform: translate(-50%, -50%) scale(1.18);
            filter: blur(18px);
          }
          100% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(1.8);
            filter: blur(30px);
          }
        }

        @keyframes cinematicInkCore {
          0% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.35);
          }
          14% {
            opacity: 0.55;
            transform: translate(-50%, -50%) scale(1);
          }
          48% {
            opacity: 0.36;
            transform: translate(-50%, -50%) scale(1.1);
          }
          100% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(1.55);
          }
        }

        @keyframes cinematicRipple {
          0% {
            opacity: 0.32;
            transform: scale(0.2);
            border-color: rgba(255, 255, 255, 0.32);
          }
          100% {
            opacity: 0;
            transform: scale(8.2);
            border-color: rgba(255, 255, 255, 0.02);
          }
        }

        @keyframes cinematicRippleGlow {
          0% {
            opacity: 0.3;
            transform: scale(0.4);
            filter: blur(8px);
          }
          100% {
            opacity: 0;
            transform: scale(7.8);
            filter: blur(22px);
          }
        }
      `}</style>
    </>
  );
}