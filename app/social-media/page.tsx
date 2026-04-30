import type { Metadata } from "next";
import Link from "next/link";
import {
  formatSocialDate,
  getInstagramPosts,
  getInstagramProfileUrl,
  getXPosts,
  getXProfileUrl,
  type SocialFeedResult,
} from "../../lib/social";

export const metadata: Metadata = {
  title: "Social Media",
  description: "A unified view of X and Instagram posts.",
};

function PlatformSection({
  title,
  platform,
  profileUrl,
  result,
}: {
  title: string;
  platform: "x" | "instagram";
  profileUrl: string;
  result: SocialFeedResult;
}) {
  const accent =
    platform === "x"
      ? "from-white/10 via-white/5 to-transparent"
      : "from-white/10 via-white/5 to-transparent";

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-2">
          <p className="text-[11px] uppercase tracking-[0.32em] text-zinc-500">
            {platform === "x" ? "X Feed" : "Instagram Feed"}
          </p>

          <h2 className="text-4xl font-semibold leading-tight text-zinc-100 sm:text-5xl">
            {title}
          </h2>
        </div>

        <a
          href={profileUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex rounded-full border border-white/10 px-4 py-3 text-sm text-zinc-200 transition hover:border-white/30 hover:text-white"
        >
          Open Profile
        </a>
      </div>

      {result.mode !== "live" ? (
        <div className={`rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.03),rgba(255,255,255,0.01))] p-6`}>
          <div className="space-y-4">
            <p className="text-[11px] uppercase tracking-[0.28em] text-zinc-500">
              {result.mode === "setup-required" ? "Connection Required" : "Feed Error"}
            </p>

            <p className="max-w-2xl text-sm leading-8 text-zinc-300 sm:text-base">
              {result.message}
            </p>

            <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
              <p className="text-[11px] uppercase tracking-[0.28em] text-zinc-500">
                Current State
              </p>
              <p className="mt-3 text-base text-zinc-200">
                {platform === "x"
                  ? "Server adapter is ready. Add X_BEARER_TOKEN to enable live sync."
                  : "Server adapter is ready. Add Instagram Graph API credentials to enable live sync."}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid gap-6 xl:grid-cols-2">
          {result.posts.map((post) => (
            <a
              key={post.id}
              href={post.permalink}
              target="_blank"
              rel="noreferrer"
              className="group overflow-hidden rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.03),rgba(255,255,255,0.01))] transition hover:border-white/20"
            >
              <div className="grid gap-0 sm:grid-cols-[0.9fr_1.1fr]">
                <div className={`relative min-h-[18rem] bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_28%)]`}>
                  {post.mediaUrl ? (
                    <img
                      src={post.mediaUrl}
                      alt=""
                      className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-[11px] uppercase tracking-[0.32em] text-zinc-500">
                      No media attached
                    </div>
                  )}

                  <div className="absolute inset-0 bg-gradient-to-b from-black/5 via-black/20 to-black/80" />

                  <div className="absolute left-5 top-5 space-y-1">
                    <p className="text-[11px] uppercase tracking-[0.28em] text-zinc-200">
                      {platform === "x" ? "X" : "Instagram"}
                    </p>
                    <p className="text-[11px] uppercase tracking-[0.22em] text-zinc-500">
                      {post.mediaType || "Text"}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col justify-between gap-6 p-5">
                  <div className="space-y-4">
                    <p className="text-[11px] uppercase tracking-[0.24em] text-zinc-500">
                      {formatSocialDate(post.createdAt)}
                    </p>

                    <p className="text-sm leading-8 text-zinc-200 sm:text-base">
                      {post.text?.trim() ? post.text : "No caption."}
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-4 text-[11px] uppercase tracking-[0.22em] text-zinc-500">
                      <span>Open Original Post</span>
                      <span>{platform === "x" ? "X" : "Instagram"}</span>
                    </div>
                    <div className="h-px w-full bg-white/10" />
                  </div>
                </div>
              </div>
            </a>
          ))}
        </div>
      )}
    </section>
  );
}

export default async function SocialMediaPage() {
  const [xResult, instagramResult] = await Promise.all([
    getXPosts(),
    getInstagramPosts(),
  ]);

  return (
    <main className="min-h-screen bg-black text-white">
      <section className="border-b border-white/10 px-5 pb-8 pt-6 sm:px-8">
        <div className="mx-auto max-w-[1500px]">
          <div className="flex items-center justify-between gap-4 text-[11px] uppercase tracking-[0.28em] text-zinc-400">
            <Link
              href="/"
              className="rounded-full border border-white/10 px-3 py-2 transition hover:border-white/30 hover:text-white"
            >
              Back to Home
            </Link>

            <span>Social Media / Unified Feed</span>
          </div>
        </div>
      </section>

      <section className="px-5 py-12 sm:px-8">
        <div className="mx-auto max-w-[1500px] space-y-14">
          <div className="grid gap-8 xl:grid-cols-[0.5fr_1.5fr] xl:items-end">
            <div className="space-y-4">
              <p className="text-[11px] uppercase tracking-[0.32em] text-zinc-500">
                Social Media
              </p>
              <div className="h-px w-20 bg-white/15" />
              <p className="max-w-sm text-sm leading-7 text-zinc-500">
                A route for owned posts and live social publishing.
              </p>
            </div>

            <div className="space-y-5">
              <h1 className="max-w-[13ch] text-5xl font-semibold leading-[0.92] sm:text-6xl">
                A direct layer for X and Instagram.
              </h1>

              <p className="max-w-3xl text-sm leading-8 text-zinc-300 sm:text-base">
                This page is built as a server-side social hub. If valid credentials are
                present, it can pull your own posts automatically. If not, it stays in a
                graceful setup state instead of breaking the site.
              </p>
            </div>
          </div>

          <div className="space-y-16">
            <PlatformSection
              title="X"
              platform="x"
              profileUrl={getXProfileUrl()}
              result={xResult}
            />

            <PlatformSection
              title="Instagram"
              platform="instagram"
              profileUrl={getInstagramProfileUrl()}
              result={instagramResult}
            />
          </div>
        </div>
      </section>
    </main>
  );
}