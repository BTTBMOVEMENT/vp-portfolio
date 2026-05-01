"use client";

import Link from "next/link";
import { MotionConfig, motion, useScroll } from "motion/react";
import HeroVideoScrub from "./HeroVideoScrub";
import RouteGatewaySection from "../common/RouteGatewaySection";

type SiteSettingsData = {
  siteTitle?: string | null;
  email?: string | null;
  instagramPrimary?: string | null;
  instagramSecondary?: string | null;
  hero?: {
    roleLine?: string | null;
    headline?: string | null;
    intro?: string | null;
    sequenceLabel?: string | null;
    topSubLabel?: string | null;
    railLeftTitle?: string | null;
    railLeftSubtitle?: string | null;
    railRightTitle?: string | null;
    ctaPrimaryLabel?: string | null;
    ctaSecondaryLabel?: string | null;
    ctaTertiaryLabel?: string | null;
  } | null;
  about?: {
    sectionLabel?: string | null;
    title?: string | null;
    body?: string | null;
    secondaryBody?: string | null;
    focusLabel?: string | null;
    focusTags?: string[] | null;
  } | null;
  works?: {
    sectionLabel?: string | null;
    title?: string | null;
    description?: string | null;
    metaLabel?: string | null;
    metaBody?: string | null;
    archiveButtonLabel?: string | null;
  } | null;
  journal?: {
    sectionLabel?: string | null;
    title?: string | null;
    description?: string | null;
    ctaLabel?: string | null;
    helperText?: string | null;
  } | null;
  albumGateway?: {
    sectionLabel?: string | null;
    title?: string | null;
    description?: string | null;
    buttonLabel?: string | null;
    noteLabel?: string | null;
  } | null;
  contact?: {
    sectionLabel?: string | null;
    title?: string | null;
    body?: string | null;
    emailLabel?: string | null;
    instagramLabel?: string | null;
    worksLabel?: string | null;
    journalLabel?: string | null;
    albumLabel?: string | null;
  } | null;
} | null;

type HomePageClientProps = {
  siteSettings: SiteSettingsData;
};

const fallbackFocusTags = [
  "Virtual Production",
  "Cinematography",
  "Unreal Engine",
  "Camera Blocking",
  "Lighting Design",
  "Shot Planning",
];

export default function HomePageClient({ siteSettings }: HomePageClientProps) {
  const { scrollYProgress } = useScroll();

  const profile = {
    name: siteSettings?.siteTitle || "BTTB Movement",
    role:
      siteSettings?.hero?.roleLine || "Virtual Production · Cinematography",
    headline:
      siteSettings?.hero?.headline || "Reformed Cinematic Portfolio.",
    intro:
      siteSettings?.hero?.intro ||
      "A scrolling portfolio designed for phones first, then expanded for tablet and desktop. This first build is static on purpose so we can lock the layout before adding motion.",
    sequenceLabel: siteSettings?.hero?.sequenceLabel || "03.8s sequence",
    topSubLabel: siteSettings?.hero?.topSubLabel || "Hero Image Sequence",
    railLeftTitle: siteSettings?.hero?.railLeftTitle || "Sequence 001",
    railLeftSubtitle:
      siteSettings?.hero?.railLeftSubtitle || "Frames beneath, type above",
    railRightTitle:
      siteSettings?.hero?.railRightTitle || "Scroll Down / Reverse Up",
    ctaPrimaryLabel:
      siteSettings?.hero?.ctaPrimaryLabel || "Open Works Archive",
    ctaSecondaryLabel:
      siteSettings?.hero?.ctaSecondaryLabel || "Open Journal",
    ctaTertiaryLabel:
      siteSettings?.hero?.ctaTertiaryLabel || "About Practice",
    email: siteSettings?.email || "bttbmovement@gmail.com",
    instagramPrimary:
      siteSettings?.instagramPrimary || "@24minus0.024",
    instagramSecondary:
      siteSettings?.instagramSecondary || "@bttbmovement",
  };

  const about = {
    sectionLabel: siteSettings?.about?.sectionLabel || "About",
    title:
      siteSettings?.about?.title || "Visual storytelling with technical structure.",
    body:
      siteSettings?.about?.body ||
      "This portfolio is being built as a mobile-first experience for Virtual Production and Cinematography. The goal is not just to show finished images, but to present process, workflow, and visual intent in a clear sequence.",
    secondaryBody:
      siteSettings?.about?.secondaryBody ||
      "The current build is already structured like a system: a motion-led hero, dedicated archive routes, and long-form project case studies that can keep expanding over time.",
    focusLabel: siteSettings?.about?.focusLabel || "Focus",
    focusTags:
      siteSettings?.about?.focusTags && siteSettings.about.focusTags.length > 0
        ? siteSettings.about.focusTags
        : fallbackFocusTags,
  };

  const works = {
    sectionLabel: siteSettings?.works?.sectionLabel || "Works",
    title:
      siteSettings?.works?.title ||
      "Enter the storyboard archive as a separate chapter.",
    description:
      siteSettings?.works?.description ||
      "Instead of previewing all project frames on the home page, this route now opens the dedicated Works archive directly.",
    archiveButtonLabel:
      siteSettings?.works?.archiveButtonLabel || "Works",
  };

  const journal = {
    sectionLabel: siteSettings?.journal?.sectionLabel || "Journal",
    title:
      siteSettings?.journal?.title ||
      "Open the journal as its own publishing layer.",
    description:
      siteSettings?.journal?.description ||
      "The journal now lives as a separate destination so the home page can stay cleaner and more focused.",
    ctaLabel: siteSettings?.journal?.ctaLabel || "Journal",
  };

  const albumGateway = {
    sectionLabel: siteSettings?.albumGateway?.sectionLabel || "My Album",
    title:
      siteSettings?.albumGateway?.title ||
      "Enter the album as if stepping into another atmosphere.",
    description:
      siteSettings?.albumGateway?.description ||
      "This route opens a more intimate image field: no grid, no archive wall, just drifting frames, optional notes, and a slower visual rhythm.",
    buttonLabel: siteSettings?.albumGateway?.buttonLabel || "My Album",
  };

  const contact = {
    sectionLabel: siteSettings?.contact?.sectionLabel || "Contact",
    title: siteSettings?.contact?.title || "Ready for the next build.",
    body:
      siteSettings?.contact?.body ||
      "The home page now introduces the practice more clearly, while each archive route opens as its own destination.",
    emailLabel: siteSettings?.contact?.emailLabel || "Email",
    instagramLabel: siteSettings?.contact?.instagramLabel || "Instagram",
    worksLabel: siteSettings?.contact?.worksLabel || "Works",
    journalLabel: siteSettings?.contact?.journalLabel || "Journal",
    albumLabel: siteSettings?.contact?.albumLabel || "My Album",
  };

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
          sequenceLabel={profile.sequenceLabel}
          topSubLabel={profile.topSubLabel}
          railLeftTitle={profile.railLeftTitle}
          railLeftSubtitle={profile.railLeftSubtitle}
          railRightTitle={profile.railRightTitle}
          ctaPrimaryLabel={profile.ctaPrimaryLabel}
          ctaSecondaryLabel={profile.ctaSecondaryLabel}
          ctaTertiaryLabel={profile.ctaTertiaryLabel}
        />

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
                {about.sectionLabel}
              </p>

              <h2 className="max-w-[12ch] text-3xl font-semibold leading-tight sm:text-4xl md:text-5xl">
                {about.title}
              </h2>

              <p className="max-w-2xl text-sm leading-7 text-zinc-300 sm:text-base">
                {about.body}
              </p>

              <p className="max-w-2xl text-sm leading-7 text-zinc-300 sm:text-base">
                {about.secondaryBody}
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
                {about.focusLabel}
              </p>

              <div className="flex flex-wrap gap-3">
                {about.focusTags.map((tag, index) => (
                  <motion.span
                    key={`${tag}-${index}`}
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
                    {tag}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        <RouteGatewaySection
          sectionLabel={works.sectionLabel}
          title={works.title}
          description={works.description}
          buttonLabel={works.archiveButtonLabel}
          href="/works"
          overlayTitle="Works"
          overlaySubtitle="Opening storyboard archive"
          ghostText="WORKS"
        />

        <RouteGatewaySection
          sectionLabel={journal.sectionLabel}
          title={journal.title}
          description={journal.description}
          buttonLabel={journal.ctaLabel}
          href="/journal"
          overlayTitle="Journal"
          overlaySubtitle="Opening publishing layer"
          ghostText="JOURNAL"
        />

        <RouteGatewaySection
          sectionLabel={albumGateway.sectionLabel}
          title={albumGateway.title}
          description={albumGateway.description}
          buttonLabel={albumGateway.buttonLabel}
          href="/my-album"
          overlayTitle="My Album"
          overlaySubtitle="Entering the orbital collection"
          ghostText="ALBUM"
        />

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
                  {contact.sectionLabel}
                </p>

                <h2 className="max-w-[10ch] text-3xl font-semibold leading-tight sm:text-4xl md:text-5xl">
                  {contact.title}
                </h2>

                <p className="max-w-xl text-sm leading-7 text-zinc-300 sm:text-base">
                  {contact.body}
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
                    {contact.emailLabel}
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
                    <span className="text-zinc-500">{contact.instagramLabel}</span>
                    <div className="text-right">
                      <div>{profile.instagramPrimary}</div>
                      <div>{profile.instagramSecondary}</div>
                    </div>
                  </div>

                  <div className="flex items-start justify-between gap-4">
                    <span className="text-zinc-500">{contact.worksLabel}</span>
                    <Link href="/works" className="underline decoration-white/20 underline-offset-4">
                      /works
                    </Link>
                  </div>

                  <div className="flex items-start justify-between gap-4">
                    <span className="text-zinc-500">{contact.journalLabel}</span>
                    <Link href="/journal" className="underline decoration-white/20 underline-offset-4">
                      /journal
                    </Link>
                  </div>

                  <div className="flex items-start justify-between gap-4">
                    <span className="text-zinc-500">{contact.albumLabel}</span>
                    <Link href="/my-album" className="underline decoration-white/20 underline-offset-4">
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
              {profile.name} / gateway-based home
            </motion.footer>
          </div>
        </section>
      </main>
    </MotionConfig>
  );
}