"use client";

import { useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    twttr?: {
      widgets?: {
        createTimeline?: (
          source: {
            sourceType: "profile";
            screenName: string;
          },
          target: HTMLElement,
          options?: Record<string, string | number | boolean>
        ) => Promise<HTMLElement | undefined>;
      };
      ready?: (cb: (twttr: Window["twttr"]) => void) => void;
    };
  }
}

type XTimelineProps = {
  username: string;
  height?: number;
};

function ensureXWidgetScript() {
  return new Promise<void>((resolve, reject) => {
    if (window.twttr?.widgets?.createTimeline) {
      resolve();
      return;
    }

    const existing = document.getElementById("twitter-wjs") as HTMLScriptElement | null;

    if (existing) {
      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener("error", () => reject(new Error("X widget script failed")), {
        once: true,
      });
      return;
    }

    const script = document.createElement("script");
    script.id = "twitter-wjs";
    script.src = "https://platform.twitter.com/widgets.js";
    script.async = true;
    script.charset = "utf-8";

    script.onload = () => resolve();
    script.onerror = () => reject(new Error("X widget script failed"));

    document.body.appendChild(script);
  });
}

export default function XTimeline({
  username,
  height = 980,
}: XTimelineProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [mode, setMode] = useState<"loading" | "live" | "fallback">("loading");

  useEffect(() => {
    let cancelled = false;

    async function mountTimeline() {
      const container = containerRef.current;
      if (!container) return;

      container.innerHTML = "";

      try {
        await ensureXWidgetScript();

        if (cancelled) return;

        if (!window.twttr?.widgets?.createTimeline) {
          setMode("fallback");
          return;
        }

        const widget = await window.twttr.widgets.createTimeline(
          {
            sourceType: "profile",
            screenName: username,
          },
          container,
          {
            theme: "dark",
            dnt: true,
            chrome: "noheader nofooter noborders transparent",
            height,
          }
        );

        if (cancelled) return;

        if (widget) {
          setMode("live");
        } else {
          setMode("fallback");
        }
      } catch {
        if (!cancelled) {
          setMode("fallback");
        }
      }
    }

    void mountTimeline();

    return () => {
      cancelled = true;
      if (containerRef.current) {
        containerRef.current.innerHTML = "";
      }
    };
  }, [username, height]);

  return (
    <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.03]">
      {mode === "loading" && (
        <div className="flex min-h-[16rem] items-center justify-center text-[11px] uppercase tracking-[0.28em] text-zinc-500">
          Loading X timeline...
        </div>
      )}

      <div
        ref={containerRef}
        className={mode === "loading" ? "hidden" : "block"}
      />

      {mode === "fallback" && (
        <div className="flex min-h-[16rem] flex-col items-center justify-center gap-4 p-8 text-center">
          <p className="max-w-xl text-sm leading-8 text-zinc-300">
            The official X widget could not render in this browser session.
            This can happen because of script blocking, privacy settings, or the
            widget script failing to initialize.
          </p>

          <a
            href={`https://twitter.com/${username}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex rounded-full border border-white/10 px-4 py-3 text-sm text-zinc-200 transition hover:border-white/30 hover:text-white"
          >
            Open @{username} on X
          </a>
        </div>
      )}
    </div>
  );
}