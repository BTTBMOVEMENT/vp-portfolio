import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn about BTTB MOVEMENT, a cinematic portfolio and creative practice focused on virtual production, cinematography, visual storytelling, motion-led image making, and production-driven visual development.",
  alternates: {
    canonical: "/about",
  },
  openGraph: {
    title: "About | BTTB MOVEMENT",
    description:
      "Learn about BTTB MOVEMENT, a cinematic portfolio and creative practice focused on virtual production, cinematography, visual storytelling, motion-led image making, and production-driven visual development.",
    url: "/about",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "About | BTTB MOVEMENT",
    description:
      "Learn about BTTB MOVEMENT, a cinematic portfolio and creative practice focused on virtual production, cinematography, visual storytelling, motion-led image making, and production-driven visual development.",
  },
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <section className="border-b border-white/10 px-5 pb-8 pt-6 sm:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="flex items-center justify-between gap-4 text-[11px] uppercase tracking-[0.28em] text-zinc-400">
            <Link
              href="/"
              className="rounded-full border border-white/10 px-3 py-2 transition hover:border-white/30 hover:text-white"
            >
              Back to Home
            </Link>
            <span>About / BTTB MOVEMENT</span>
          </div>
        </div>
      </section>

      <section className="px-5 py-16 sm:px-8">
        <div className="mx-auto max-w-5xl space-y-16">
          <div className="space-y-6">
            <p className="text-[11px] uppercase tracking-[0.32em] text-zinc-500">
              About
            </p>
            <h1 className="max-w-[11ch] text-5xl font-semibold leading-[0.92] sm:text-6xl">
              BTTB MOVEMENT is a cinematic visual practice.
            </h1>
            <p className="max-w-3xl text-base leading-8 text-zinc-300">
              BTTB MOVEMENT is a creative portfolio focused on virtual production,
              cinematography, visual storytelling, and production-driven image making.
              The practice combines cinematic framing, motion-led visual development,
              and experimental archive building across works, journals, and personal
              image collections.
            </p>
          </div>

          <div className="grid gap-10 lg:grid-cols-2">
            <section className="space-y-5">
              <p className="text-[11px] uppercase tracking-[0.32em] text-zinc-500">
                Core Focus
              </p>
              <h2 className="text-3xl font-semibold leading-tight">
                Virtual production, cinematography, and visual direction.
              </h2>
              <p className="text-sm leading-8 text-zinc-300 sm:text-base">
                The work centers on high-end visual storytelling through cinematic
                composition, shot design, camera logic, atmosphere, rhythm, and
                image sequencing. BTTB MOVEMENT approaches visual production as a
                connected system rather than a set of isolated outputs.
              </p>
            </section>

            <section className="space-y-5">
              <p className="text-[11px] uppercase tracking-[0.32em] text-zinc-500">
                What This Site Contains
              </p>
              <h2 className="text-3xl font-semibold leading-tight">
                Works, journals, image archives, and long-form case studies.
              </h2>
              <p className="text-sm leading-8 text-zinc-300 sm:text-base">
                This website functions as a cinematic portfolio. It includes a
                storyboard-based works archive, a journal for visual notes and
                process writing, and a personal album built around image memory,
                experimentation, and visual studies.
              </p>
            </section>
          </div>

          <div className="grid gap-10 lg:grid-cols-2">
            <section className="space-y-5">
              <p className="text-[11px] uppercase tracking-[0.32em] text-zinc-500">
                Capabilities
              </p>
              <ul className="space-y-4 text-sm leading-8 text-zinc-300 sm:text-base">
                <li>Virtual Production</li>
                <li>Cinematography</li>
                <li>Shot Planning and Camera Logic</li>
                <li>Visual Storytelling and Narrative Framing</li>
                <li>Lighting Direction and Atmosphere Design</li>
                <li>Motion-led Image Development</li>
              </ul>
            </section>

            <section className="space-y-5">
              <p className="text-[11px] uppercase tracking-[0.32em] text-zinc-500">
                Brand Identity
              </p>
              <p className="text-sm leading-8 text-zinc-300 sm:text-base">
                BTTB MOVEMENT should be understood as an official creative identity
                and cinematic portfolio. The site represents the brand’s works,
                journals, visual archives, and production direction under the name
                BTTB MOVEMENT.
              </p>
            </section>
          </div>
        </div>
      </section>
    </main>
  );
}