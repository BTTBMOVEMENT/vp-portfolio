"use client";

import Link from "next/link";
import { MotionConfig, motion, useScroll } from "motion/react";
import HeroVideoScrub from "../components/home/HeroVideoScrub";
import WorksStoryboardTeaser from "../components/home/WorksStoryboardTeaser";
import JournalOrbit from "../components/home/JournalOrbit";
import MyAlbumGateway from "../components/home/MyAlbumGateway";

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

const heroMedia = {
  sequenceLabel: "03.8s sequence",
};

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

  return (
    <MotionConfig reducedMotion="user">
      <main className="bg-black text-white">
        <motion.div
          className="pointer-events-none fixed inset-x-0 top-0 z-50 h-1 origin-left bg-white/90"
          style={{ scaleX: scrollYProgress }}
        />

        <HeroVideoScrub
          name={profile.name}
          role={profile.role}
          headline={profile.headline}
          intro={profile.intro}
          sequenceLabel={heroMedia.sequenceLabel}
        />

        <WorksStoryboardTeaser />

        <JournalOrbit />

        <MyAlbumGateway />

        <section id="about" className="border-t border-white/10 px-5 py-20 sm:px-8">
          <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1.1fr_0.9fr]">
            <motion.div
              className="space-y-5"
              initial={{ opacity: 0, y: 72 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ amount: 0.2 }}
              transition={{ duration: 0.9, ease: "easeOut" }}
            >
              <p className="text-[11px] uppercase tracking-[0.32em] text-zinc-400">
                About
              </p>

              <h2 className="max-w-[12ch] text-3xl font-semibold leading-tight sm:text-4xl md:text-5xl">
                Visual storytelling with technical structure.
              </h2>

              <p className="max-w-2xl text-sm leading-7 text-zinc-300 sm:text-base">
                This portfolio is being built as a mobile-first experience for Virtual
                Production and Cinematography. The goal is not just to show finished images,
                but to present process, workflow, and visual intent in a clear sequence.
              </p>

              <p className="max-w-2xl text-sm leading-7 text-zinc-300 sm:text-base">
                The current build is already structured like a system: a motion-led hero,
                storyboard-style works archive, orbit-based journal rail, a personal album,
                and long-form project case studies that can keep expanding over time.
              </p>
            </motion.div>

            <motion.div
              className="space-y-5"
              initial={{ opacity: 0, y: 72 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ amount: 0.2 }}
              transition={{ duration: 0.9, ease: "easeOut", delay: 0.08 }}
            >
              <p className="text-[11px] uppercase tracking-[0.32em] text-zinc-400">
                Focus
              </p>

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
                  The home page now ties together the hero sequence, works archive,
                  journal orbit, and personal album into one continuous visual system.
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

                  <div className="flex items-start justify-between gap-4">
                    <span className="text-zinc-500">Works</span>
                    <Link
                      href="/works"
                      className="underline decoration-white/20 underline-offset-4"
                    >
                      /works
                    </Link>
                  </div>

                  <div className="flex items-start justify-between gap-4">
                    <span className="text-zinc-500">Journal</span>
                    <Link
                      href="/journal"
                      className="underline decoration-white/20 underline-offset-4"
                    >
                      /journal
                    </Link>
                  </div>

                  <div className="flex items-start justify-between gap-4">
                    <span className="text-zinc-500">My Album</span>
                    <Link
                      href="/my-album"
                      className="underline decoration-white/20 underline-offset-4"
                    >
                      /my-album
                    </Link>
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
              {profile.name} / My Album gateway step
            </motion.footer>
          </div>
        </section>
      </main>
    </MotionConfig>
  );
}