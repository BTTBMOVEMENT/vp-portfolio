import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-black px-5 py-24 text-white sm:px-8">
      <div className="mx-auto max-w-3xl space-y-8">
        <p className="text-[11px] uppercase tracking-[0.32em] text-zinc-500">
          Project Not Found
        </p>

        <h1 className="max-w-[10ch] text-5xl font-semibold leading-[0.92] sm:text-6xl">
          This chapter does not exist.
        </h1>

        <p className="max-w-xl text-sm leading-8 text-zinc-300 sm:text-base">
          The project URL is invalid or the slug is missing from your data file.
        </p>

        <Link
          href="/#works"
          className="inline-flex rounded-full border border-white/10 px-4 py-3 text-sm text-zinc-200 transition hover:border-white/30 hover:text-white"
        >
          Return to Works
        </Link>
      </div>
    </main>
  );
}