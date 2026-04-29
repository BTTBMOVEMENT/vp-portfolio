"use client";

import { useRef } from "react";
import Image from "next/image";
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

  const heroSceneRef = useRef<HTMLElement | null>(null);

  const { scrollYProgress: heroProgress } = useScroll({
    target: heroSceneRef,
    offset: ["start start", "end end"],
  });

  const heroImageScale = useTransform(heroProgress, [0, 1], [1, 1.18]);
  const heroImageY = useTransform(heroProgress, [0, 1], [0, 90]);

  const heroTitleY = useTransform(heroProgress, [0, 1], [0, -140]);
  const heroMetaY = useTransform(heroProgress, [0, 1], [0, -70]);
  const heroCopyOpacity = useTransform(heroProgress, [0, 0.75, 1], [1, 0.65, 0.18]);

  const heroOverlayOpacity = useTransform(heroProgress, [0, 1], [0.22, 0.62]);

  const ghostTextY = useTransform(heroProgress, [0, 1], [0, -90]);
  const ghostTextOpacity = useTransform(heroProgress, [0, 0.7, 1], [0.14, 0.1, 0.03]);

  const heroBottomY = useTransform(heroProgress, [0, 1], [0, -36]);
  const heroBottomOpacity = useTransform(heroProgress, [0, 1], [1, 0.35]);

  return (
    <MotionConfig reducedMotion="user">
      <main className="bg-black text-white">
        <motion.div
          className="pointer-events-none fixed inset-x-0 top-0 z-50 h-1 origin-left bg-white/90"
          style={{ scaleX: scrollYProgress }}
        />

        <section ref={heroSceneRef} id="hero" className="relative h-[180vh]">
          <div className="sticky top-0 h-screen overflow-hidden border-b border-white/10 bg-black">
            <motion.div
              style={{ scale: heroImageScale, y: heroImageY }}
              className="absolute inset-0"
            >
              <Image
                src="/images/hero/hero-main.jpg"
                alt="Hero still for BTTB Movement portfolio"
                fill
                sizes="100vw"
                className="object-cover"
              />
            </motion.div>

            <div className="absolute inset-0 bg-gradient-to-b from-black/15 via-black/25 to-black/80" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.14),transparent_28%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.10),transparent_22%)]" />

            <motion.div
              style={{ opacity: heroOverlayOpacity }}
              className="absolute inset-0 bg-black"
            />

            <div className="relative z-10 mx-auto flex h-full max-w-6xl flex-col justify-between px-5 pb-8 pt-6 sm:px-8">
              <motion.div
                initial={{ opacity: 0, y: -18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: "easeOut" }}
                className="flex items-center justify-between text-[11px] uppercase tracking-[0.28em] text-zinc-300"
              >
                <span>{profile.name}</span>
                <span>Portfolio / 01</span>
              </motion.div>

              <div className="relative flex flex-1 items-center">
                <motion.div
                  style={{ y: ghostTextY, opacity: ghostTextOpacity }}
                  className="pointer-events-none absolute -bottom-4 right-0 select-none text-[26vw] font-semibold leading-none tracking-[-0.08em] text-white"
                >
                  BTTB
                </motion.div>

                <div className="relative z-10 max-w-3xl space-y-6">
                  <motion.p
                    style={{ y: heroMetaY, opacity: heroCopyOpacity }}
                    className="text-[11px] uppercase tracking-[0.35em] text-zinc-300"
                  >
                    {profile.role}
                  </motion.p>

                  <motion.h1
                    style={{ y: heroTitleY, opacity: heroCopyOpacity }}
                    className="max-w-[10ch] text-5xl font-semibold leading-[0.92] sm:text-6xl md:max-w-[12ch] md:text-7xl lg:text-8xl"
                  >
                    {profile.headline}
                  </motion.h1>

                  <motion.p
                    style={{ y: heroMetaY, opacity: heroCopyOpacity }}
                    className="max-w-md text-sm leading-7 text-zinc-200 sm:text-base"
                  >
                    {profile.intro}
                  </motion.p>
                </div>
              </div>

              <motion.div
                style={{ y: heroBottomY, opacity: heroBottomOpacity }}
                className="space-y-5"
              >
                <div className="flex items-center justify-between gap-4 text-[11px] uppercase tracking-[0.24em] text-zinc-300">
                  <div className="space-y-1">
                    <div>Frame 001</div>
                    <div className="text-zinc-500">Featured Hero Still</div>
                  </div>

                  <div className="text-right">
                    <div>Virtual Production</div>
                    <div className="text-zinc-500">Cinematography</div>
                  </div>
                </div>

                <div className="h-px w-full bg-white/20" />

                <nav className="flex flex-wrap gap-3 text-[11px] uppercase tracking-[0.25em] text-zinc-300">
                  <motion.a
                    href="#works"
                    whileTap={{ scale: 0.95 }}
                    whileHover={{ y: -2 }}
                    className="rounded-full border border-white/15 px-3 py-2 transition hover:border-white/40 hover:text-white"
                  >
                    Works
                  </motion.a>
                  <motion.a
                    href="#about"
                    whileTap={{ scale: 0.95 }}
                    whileHover={{ y: -2 }}
                    className="rounded-full border border-white/15 px-3 py-2 transition hover:border-white/40 hover:text-white"
                  >
                    About
                  </motion.a>
                  <motion.a
                    href="#contact"
                    whileTap={{ scale: 0.95 }}
                    whileHover={{ y: -2 }}
                    className="rounded-full border border-white/15 px-3 py-2 transition hover:border-white/40 hover:text-white"
                  >
                    Contact
                  </motion.a>
                </nav>
              </motion.div>
            </div>
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
                The hero is now pinned visually for a longer scroll so the typography and image
                can finish their motion before the page continues.
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
              {profile.name} / Sticky hero step 20
            </motion.footer>
          </div>
        </section>
      </main>
    </MotionConfig>
  );
}