"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";

type StrokePoint = {
  x: number;
  y: number;
  t: number;
};

type Stroke = {
  id: number;
  points: StrokePoint[];
  createdAt: number;
};

type Ripple = {
  id: number;
  x: number;
  y: number;
};

type Viewport = {
  width: number;
  height: number;
};

const STROKE_LIFETIME = 1300;
const STROKE_IDLE_BREAK = 90;
const MAX_POINTS_PER_STROKE = 32;
const MIN_DISTANCE = 4;

function distance(a: StrokePoint, b: StrokePoint) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function simplifyPoints(points: StrokePoint[]) {
  if (points.length <= 2) return points;

  const next: StrokePoint[] = [points[0]];

  for (let i = 1; i < points.length; i += 1) {
    const prev = next[next.length - 1];
    const current = points[i];

    if (distance(prev, current) >= MIN_DISTANCE || i === points.length - 1) {
      next.push(current);
    }
  }

  return next;
}

function smoothPath(points: StrokePoint[]) {
  const clean = simplifyPoints(points);

  if (clean.length === 0) return "";
  if (clean.length === 1) return `M ${clean[0].x} ${clean[0].y}`;
  if (clean.length === 2) {
    return `M ${clean[0].x} ${clean[0].y} L ${clean[1].x} ${clean[1].y}`;
  }

  let d = `M ${clean[0].x} ${clean[0].y}`;

  for (let i = 1; i < clean.length - 1; i += 1) {
    const current = clean[i];
    const next = clean[i + 1];
    const midX = (current.x + next.x) / 2;
    const midY = (current.y + next.y) / 2;
    d += ` Q ${current.x} ${current.y} ${midX} ${midY}`;
  }

  const last = clean[clean.length - 1];
  d += ` L ${last.x} ${last.y}`;

  return d;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export default function CursorEcho() {
  const [enabled, setEnabled] = useState(false);
  const [viewport, setViewport] = useState<Viewport>({ width: 0, height: 0 });
  const [strokes, setStrokes] = useState<Stroke[]>([]);
  const [ripples, setRipples] = useState<Ripple[]>([]);

  const currentStrokeRef = useRef<Stroke | null>(null);
  const lastPointRef = useRef<StrokePoint | null>(null);
  const strokeIdRef = useRef(0);
  const rippleIdRef = useRef(0);
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    const media = window.matchMedia("(pointer: fine)");
    const handleMedia = () => setEnabled(media.matches);

    handleMedia();
    media.addEventListener("change", handleMedia);

    const updateViewport = () => {
      setViewport({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    updateViewport();
    window.addEventListener("resize", updateViewport);

    return () => {
      media.removeEventListener("change", handleMedia);
      window.removeEventListener("resize", updateViewport);
    };
  }, []);

  useEffect(() => {
    if (!enabled) return;

    const pushPoint = (x: number, y: number, now: number) => {
      const nextPoint: StrokePoint = { x, y, t: now };
      const lastPoint = lastPointRef.current;

      const shouldStartNewStroke =
        !currentStrokeRef.current ||
        !lastPoint ||
        now - lastPoint.t > STROKE_IDLE_BREAK;

      if (shouldStartNewStroke) {
        const newStroke: Stroke = {
          id: strokeIdRef.current++,
          points: [nextPoint],
          createdAt: now,
        };
        currentStrokeRef.current = newStroke;
        setStrokes((prev) => [...prev, newStroke]);
        lastPointRef.current = nextPoint;
        return;
      }

      if (lastPoint && distance(lastPoint, nextPoint) < 1.5) {
        return;
      }

      currentStrokeRef.current = {
        ...currentStrokeRef.current,
        points: [...currentStrokeRef.current.points, nextPoint].slice(-MAX_POINTS_PER_STROKE),
      };

      const updated = currentStrokeRef.current;

      setStrokes((prev) =>
        prev.map((stroke) => (stroke.id === updated.id ? updated : stroke))
      );

      lastPointRef.current = nextPoint;
    };

    const handlePointerMove = (event: PointerEvent) => {
      const now = performance.now();
      pushPoint(event.clientX, event.clientY, now);
    };

    const handleClick = (event: MouseEvent) => {
      const id = rippleIdRef.current++;
      const ripple = { id, x: event.clientX, y: event.clientY };

      setRipples((prev) => [...prev, ripple]);

      window.setTimeout(() => {
        setRipples((prev) => prev.filter((item) => item.id !== id));
      }, 1000);
    };

    const prune = () => {
      const now = performance.now();

      setStrokes((prev) => {
        const next = prev.filter((stroke) => now - stroke.createdAt < STROKE_LIFETIME);

        if (
          currentStrokeRef.current &&
          !next.some((stroke) => stroke.id === currentStrokeRef.current?.id)
        ) {
          currentStrokeRef.current = null;
        }

        return next;
      });

      frameRef.current = window.requestAnimationFrame(prune);
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("click", handleClick);
    frameRef.current = window.requestAnimationFrame(prune);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("click", handleClick);

      if (frameRef.current !== null) {
        window.cancelAnimationFrame(frameRef.current);
      }
    };
  }, [enabled]);

  const renderedStrokes = useMemo(() => {
    const now = performance.now();

    return strokes
      .map((stroke) => {
        const age = now - stroke.createdAt;
        const life = clamp(1 - age / STROKE_LIFETIME, 0, 1);

        return {
          ...stroke,
          d: smoothPath(stroke.points),
          opacity: life,
          blurOpacity: life * 0.75,
          coreOpacity: life * 0.42,
          glowOpacity: life * 0.22,
          blurAmount: 6 + (1 - life) * 16,
        };
      })
      .filter((stroke) => stroke.d.length > 0);
  }, [strokes]);

  if (!enabled || viewport.width === 0 || viewport.height === 0) {
    return null;
  }

  return (
    <>
      <svg
        className="pointer-events-none fixed inset-0 z-[95]"
        width="100%"
        height="100%"
        viewBox={`0 0 ${viewport.width} ${viewport.height}`}
        fill="none"
        style={{ mixBlendMode: "screen" }}
      >
        <defs>
          <filter id="cinematic-trail-blur-xl" x="-200%" y="-200%" width="400%" height="400%">
            <feGaussianBlur stdDeviation="18" />
          </filter>
          <filter id="cinematic-trail-blur-lg" x="-200%" y="-200%" width="400%" height="400%">
            <feGaussianBlur stdDeviation="10" />
          </filter>
          <filter id="cinematic-trail-blur-md" x="-200%" y="-200%" width="400%" height="400%">
            <feGaussianBlur stdDeviation="5" />
          </filter>
        </defs>

        {renderedStrokes.map((stroke) => (
          <g key={stroke.id}>
            <path
              d={stroke.d}
              stroke="rgba(255,255,255,0.07)"
              strokeWidth="42"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity={stroke.glowOpacity}
              filter="url(#cinematic-trail-blur-xl)"
            />
            <path
              d={stroke.d}
              stroke="rgba(210,230,255,0.13)"
              strokeWidth="22"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity={stroke.blurOpacity}
              filter="url(#cinematic-trail-blur-lg)"
            />
            <path
              d={stroke.d}
              stroke="rgba(248,250,255,0.22)"
              strokeWidth="10"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity={stroke.coreOpacity}
              filter="url(#cinematic-trail-blur-md)"
            />
            <path
              d={stroke.d}
              stroke="rgba(255,255,255,0.22)"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity={stroke.opacity * 0.6}
            />
          </g>
        ))}
      </svg>

      <AnimatePresence>
        {ripples.map((ripple) => (
          <motion.div
            key={ripple.id}
            initial={{ opacity: 0.34, scale: 0 }}
            animate={{ opacity: 0, scale: 9 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.95, ease: "easeOut" }}
            className="pointer-events-none fixed z-[96] rounded-full border border-white/26"
            style={{
              left: ripple.x - 8,
              top: ripple.y - 8,
              width: 16,
              height: 16,
              boxShadow:
                "0 0 24px rgba(255,255,255,0.08), 0 0 60px rgba(210,230,255,0.06)",
              mixBlendMode: "screen",
            }}
          />
        ))}
      </AnimatePresence>
    </>
  );
}