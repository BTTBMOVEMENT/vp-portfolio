"use client";

import { useRef } from "react";
import { MotionConfig, motion, useScroll, useTransform } from "motion/react";

const profile = {
  name: "BTTB Movement",
  role: "Virtual Production · Cinematography",
  headline: "Reformed Cinematic Portfolio.",
  intro:
    "A scrolling portfolio designed for phones first, then expanded for tablet and desktop. This first build is static on purpose so we can lock the layout before adding motion.",
  email: "bttbmovement@gmail.com",
  instagramPrimary: "@24minus0.024",
  instagramSecondary: "@bttbmovement",
};

const projects = [
  {
    title: "Jesus is Christ",
    year: "2026",
    role: "Virtual Production, Fake Documentary / DP",
    description: "Greenscreen Virtual Production with In-Camera VFX test project",
  },
  {
    title: "the King of kings",
    year: "2027",
    role: "Virtual Production, Cinematography / DP",
    description: "the First Virtual Production with Unreal Engine",
  },
  {
    title: "Trinity",
    year: "2027",
    role: "Documentary / DP",
    description: "Previs-to-final visual development with a clean case-study structure.",
  },
];

const skills = [
  "Virtual Production",
  "Cinematography",
  "Unreal Engine",
  "Camera Blocking",
  "Lighting Design",
  "Shot Planning",
];

export default function Page() {
  const { scrollYProgress } = useScroll();

  const heroRef = useRef<HTMLElement | null>(null);
  const { scrollYProgress: heroProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const heroTextY = useTransform(heroProgress, [0, 1], [0, -120]);
  const heroMetaY = useTransform(heroProgress, [0, 1], [0, -60]);
  const heroTextOpacity = useTransform(heroProgress, [0, 0.7, 1], [1, 0.65, 0.2]);

  const heroVisualY = useTransform(heroProgress, [0, 1], [0, 110]);
  const heroVisualScale = useTransform(heroProgress, [0, 1], [1, 1.12]);

  const heroOverlayOpacity = useTransform(heroProgress, [0, 1], [0.18, 0.55]);
  const heroGhostY = useTransform(heroProgress, [0, 1], [0, -80]);

  const heroNavY = useTransform(heroProgress, [0, 1], [0, -40]);
  const heroNavOpacity = useTransform(heroProgress, [0, 1], [1, 0.3]);

  return (
    <MotionConfig reducedMotion="user">
      <main className="bg-black text-white">
        <motion.div
          className="pointer-events-none fixed inset-x-0 top-0 z-50 h-1 origin-left bg-white/90"
          style={{ scaleX: scrollYProgress }}
        />

        <section ref={heroRef} id="hero" className="px-5 pb-10 pt-6 sm:px-8">
          <div className="mx-auto flex min-h-screen max-w-6xl flex-col justify-between">
            <motion.div
              className="flex items-center justify-between text-[11px] uppercase tracking-[0.28em] text-zinc-500"
              initial={{ opacity: 0, y: -24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <span>{profile.name}</span>
              <span>Portfolio / 01</span>
            </motion.div>

            <div className="space-y-6 py-10">
              <motion.p
                style={{ y: heroMetaY, opacity: heroTextOpacity }}
                className="text-[11px] uppercase tracking-[0.35em] text-zinc-400"
              >
                {profile.role}
              </motion.p>

              <motion.h1
                style={{ y: heroTextY, opacity: heroTextOpacity }}
                className="max-w-[10ch] text-5xl font-semibold leading-[0.92] sm:text-6xl md:max-w-[12ch] md:text-7xl lg:text-8xl"
              >
                {profile.headline}
              </motion.h1>

              <motion.p
                style={{ y: heroMetaY, opacity: heroTextOpacity }}
                className="max-w-md text-sm leading-7 text-zinc-300 sm:text-base"
              >
                {profile.intro}
              </motion.p>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 72, scale: 0.94 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 1.05, ease: "easeOut" }}
              className="overflow-hidden rounded-3xl border border-white/10 bg-zinc-900"
            >
              <motion.div
                style={{ y: heroVisualY, scale: heroVisualScale }}
                className="relative aspect-[4/5] sm:aspect-[16/10]"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-zinc-700 via-zinc-900 to-black" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.16),transparent_32%)]" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.08),transparent_28%)]" />
                <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.07),transparent_30%,transparent_65%,rgba(255,255,255,0.04))]" />

                <motion.div
                  style={{ y: heroGhostY }}
                  className="absolute -right-2 bottom-0 select-none text-[28vw] font-semibold leading-none tracking-[-0.09em] text-white/[0.06]"
                >
                  BTTB
                </motion.div>

                <motion.div
                  style={{ opacity: heroOverlayOpacity }}
                  className="absolute inset-0 bg-black"
                />

                <div className="relative flex h-full flex-col justify-between p-6 sm:p-8">
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-2">
                      <p className="text-[11px] uppercase tracking-[0.3em] text-zinc-300">
                        Hero Frame
                      </p>
                      <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">
                        Mobile-first cinematic direction
                      </p>
                    </div>

                    <div className="text-right text-[11px] uppercase tracking-[0.22em] text-zinc-500">
                      <div>Frame 001</div>
                      <div>2026</div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="max-w-[16rem] space-y-2">
                      <p className="text-xs uppercase tracking-[0.25em] text-zinc-300">
                        Placeholder visual designed to simulate depth before final key art is chosen
                      </p>
                    </div>

                    <div className="flex items-center justify-between gap-4 text-[11px] uppercase tracking-[0.22em] text-zinc-400">
                      <span>Virtual Production</span>
                      <span>Cinematography</span>
                    </div>

                    <div className="h-px w-full bg-white/20" />
                  </div>
                </div>
              </motion.div>
            </motion.div>

            <motion.div
              style={{ y: heroNavY, opacity: heroNavOpacity }}
              className="pt-6"
            >
              <nav className="flex flex-wrap gap-3 text-[11px] uppercase tracking-[0.25em] text-zinc-500">
                <motion.a
                  href="#works"
                  whileTap={{ scale: 0.95 }}
                  whileHover={{ y: -2 }}
                  className="rounded-full border border-white/10 px-3 py-2 transition hover:border-white/30 hover:text-white"
                >
                  Works
                </motion.a>
                <motion.a
                  href="#about"
                  whileTap={{ scale: 0.95 }}
                  whileHover={{ y: -2 }}
                  className="rounded-full border border-white/10 px-3 py-2 transition hover:border-white/30 hover:text-white"
                >
                  About
                </motion.a>
                <motion.a
                  href="#contact"
                  whileTap={{ scale: 0.95 }}
                  whileHover={{ y: -2 }}
                  className="rounded-full border border-white/10 px-3 py-2 transition hover:border-white/30 hover:text-white"
                >
                  Contact
                </motion.a>
              </nav>
            </motion.div>
          </div>
        </section>

        <section id="works" className="border-t border-white/10 px-5 py-20 sm:px-8">
          <div className="mx-auto max-w-6xl">
            <motion.div
              className="mb-10 space-y-4"
              initial={{ opacity: 0, y: 70 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ amount: 0.2 }}
              transition={{ duration: 0.9, ease: "easeOut" }}
            >
              <p className="text-[11px] uppercase tracking-[0.32em] text-zinc-400">
                Selected Works
              </p>

              <h2 className="max-w-[12ch] text-3xl font-semibold leading-tight sm:text-4xl md:text-5xl">
                Three featured projects.
              </h2>

              <p className="max-w-xl text-sm leading-7 text-zinc-300 sm:text-base">
                The hero is now scroll-linked, while the rest of the page keeps the current
                reveal behavior.
              </p>
            </motion.div>

            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {projects.map((project, index) => (
                <motion.article
                  key={project.title}
                  className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03]"
                  initial={{ opacity: 0, y: 90, scale: 0.94 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ amount: 0.18 }}
                  transition={{
                    duration: 0.9,
                    ease: "easeOut",
                    delay: index * 0.08,
                  }}
                >
                  <div className="relative aspect-[4/5] overflow-hidden border-b border-white/10 bg-zinc-900">
                    <div className="absolute inset-0 bg-gradient-to-b from-zinc-800 via-zinc-900 to-black" />
                    <div className="absolute left-6 top-6 text-[11px] uppercase tracking-[0.28em] text-zinc-400">
                      Visual Placeholder
                    </div>
                    <div className="absolute bottom-6 left-6 right-6">
                      <div className="h-px w-full bg-white/10" />
                    </div>
                  </div>

                  <div className="space-y-4 p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-2xl font-medium">{project.title}</h3>
                        <p className="mt-1 text-sm text-zinc-400">{project.role}</p>
                      </div>
                      <span className="text-sm text-zinc-500">{project.year}</span>
                    </div>

                    <p className="text-sm leading-7 text-zinc-300">{project.description}</p>

                    <div className="pt-2 text-[11px] uppercase tracking-[0.25em] text-zinc-500">
                      Detail page later
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        <section id="about" className="border-t border-white/10 px-5 py-20 sm:px-8">
          <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1.1fr_0.9fr]">
            <motion.div
              className="space-y-5"
              initial={{ opacity: 0, y: 72 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ amount: 0.2 }}
              transition={{ duration: 0.9, ease: "easeOut" }}
            >
              <p className="text-[11px] uppercase tracking-[0.32em] text-zinc-400">About</p>

              <h2 className="max-w-[12ch] text-3xl font-semibold leading-tight sm:text-4xl md:text-5xl">
                Visual storytelling with technical structure.
              </h2>

              <p className="max-w-2xl text-sm leading-7 text-zinc-300 sm:text-base">
                This portfolio is being built as a mobile-first experience for Virtual
                Production and Cinematography. The goal is not just to show finished images,
                but to present process, workflow, and visual intent in a clear sequence.
              </p>

              <p className="max-w-2xl text-sm leading-7 text-zinc-300 sm:text-base">
                Right now this page is intentionally simple. We are locking the visual rhythm
                first: large type, strong spacing, stacked project cards, and a vertical scroll
                flow that feels good on phones.
              </p>
            </motion.div>

            <motion.div
              className="space-y-5"
              initial={{ opacity: 0, y: 72 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ amount: 0.2 }}
              transition={{ duration: 0.9, ease: "easeOut", delay: 0.08 }}
            >
              <p className="text-[11px] uppercase tracking-[0.32em] text-zinc-400">Focus</p>

              <div className="flex flex-wrap gap-3">
                {skills.map((skill, index) => (
                  <motion.span
                    key={skill}
                    className="rounded-full border border-white/10 px-4 py-2 text-sm text-zinc-200"
                    initial={{ opacity: 0, y: 36, scale: 0.95 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    viewport={{ amount: 0.15 }}
                    transition={{
                      duration: 0.65,
                      ease: "easeOut",
                      delay: index * 0.05,
                    }}
                  >
                    {skill}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        <section id="contact" className="border-t border-white/10 px-5 py-20 sm:px-8">
          <div className="mx-auto max-w-6xl">
            <div className="grid gap-10 lg:grid-cols-[1fr_0.9fr]">
              <motion.div
                className="space-y-4"
                initial={{ opacity: 0, y: 72 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ amount: 0.2 }}
                transition={{ duration: 0.9, ease: "easeOut" }}
              >
                <p className="text-[11px] uppercase tracking-[0.32em] text-zinc-400">
                  Contact
                </p>

                <h2 className="max-w-[10ch] text-3xl font-semibold leading-tight sm:text-4xl md:text-5xl">
                  Ready for the next build.
                </h2>

                <p className="max-w-xl text-sm leading-7 text-zinc-300 sm:text-base">
                  The structure stays stable while the hero gets a stronger cinematic identity.
                </p>
              </motion.div>

              <motion.div
                className="space-y-4 rounded-3xl border border-white/10 bg-white/[0.03] p-6"
                initial={{ opacity: 0, y: 82, scale: 0.96 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ amount: 0.2 }}
                transition={{ duration: 0.95, ease: "easeOut", delay: 0.05 }}
              >
                <div className="space-y-2">
                  <p className="text-[11px] uppercase tracking-[0.28em] text-zinc-500">
                    Email
                  </p>
                  <a
                    href={`mailto:${profile.email}`}
                    className="text-lg text-white underline decoration-white/20 underline-offset-4"
                  >
                    {profile.email}
                  </a>
                </div>

                <div className="h-px w-full bg-white/10" />

                <div className="space-y-3 text-sm text-zinc-300">
                  <div className="flex items-start justify-between gap-4">
                    <span className="text-zinc-500">Instagram</span>
                    <div className="text-right">
                      <div>{profile.instagramPrimary}</div>
                      <div>{profile.instagramSecondary}</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            <motion.footer
              className="pt-16 text-[11px] uppercase tracking-[0.28em] text-zinc-600"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ amount: 0.4 }}
              transition={{ duration: 0.75, ease: "easeOut" }}
            >
              {profile.name} / Hero cinematic polish
            </motion.footer>
          </div>
        </section>
      </main>
    </MotionConfig>
  );
}