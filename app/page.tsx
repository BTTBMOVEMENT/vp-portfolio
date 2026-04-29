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
  return (
    <main className="bg-black text-white">
      <section id="hero" className="px-5 pb-10 pt-6 sm:px-8">
        <div className="mx-auto flex min-h-screen max-w-6xl flex-col justify-between">
          <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.28em] text-zinc-500">
            <span>{profile.name}</span>
            <span>Portfolio / 01</span>
          </div>

          <div className="space-y-6 py-10">
            <p className="text-[11px] uppercase tracking-[0.35em] text-zinc-400">
              {profile.role}
            </p>

            <h1 className="max-w-[10ch] text-5xl font-semibold leading-[0.92] sm:text-6xl md:max-w-[12ch] md:text-7xl lg:text-8xl">
              {profile.headline}
            </h1>

            <p className="max-w-md text-sm leading-7 text-zinc-300 sm:text-base">
              {profile.intro}
            </p>
          </div>

          <div className="overflow-hidden rounded-3xl border border-white/10 bg-zinc-900">
            <div className="relative aspect-[4/5] sm:aspect-[16/10]">
              <div className="absolute inset-0 bg-gradient-to-b from-zinc-800 via-zinc-900 to-black" />
              <div className="absolute -left-10 top-10 h-40 w-40 rounded-full bg-white/10 blur-3xl" />
              <div className="absolute -right-10 bottom-8 h-48 w-48 rounded-full bg-white/10 blur-3xl" />

              <div className="relative flex h-full flex-col justify-between p-6 sm:p-8">
                <span className="text-[11px] uppercase tracking-[0.3em] text-zinc-400">
                  Hero Visual Placeholder
                </span>

                <div className="space-y-3">
                  <p className="text-xs uppercase tracking-[0.25em] text-zinc-500">
                    Later replace this block with a still frame or showreel poster
                  </p>
                  <div className="h-px w-full bg-white/10" />
                </div>
              </div>
            </div>
          </div>

          <div className="pt-6">
            <nav className="flex flex-wrap gap-3 text-[11px] uppercase tracking-[0.25em] text-zinc-500">
              <a
                href="#works"
                className="rounded-full border border-white/10 px-3 py-2 transition hover:border-white/30 hover:text-white"
              >
                Works
              </a>
              <a
                href="#about"
                className="rounded-full border border-white/10 px-3 py-2 transition hover:border-white/30 hover:text-white"
              >
                About
              </a>
              <a
                href="#contact"
                className="rounded-full border border-white/10 px-3 py-2 transition hover:border-white/30 hover:text-white"
              >
                Contact
              </a>
            </nav>
          </div>
        </div>
      </section>

      <section id="works" className="border-t border-white/10 px-5 py-20 sm:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 space-y-4">
            <p className="text-[11px] uppercase tracking-[0.32em] text-zinc-400">
              Selected Works
            </p>

            <h2 className="max-w-[12ch] text-3xl font-semibold leading-tight sm:text-4xl md:text-5xl">
              Three featured projects.
            </h2>

            <p className="max-w-xl text-sm leading-7 text-zinc-300 sm:text-base">
              This section is static on purpose. We are fixing layout, spacing, and mobile
              hierarchy first. Animation comes in step 17.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {projects.map((project) => (
              <article
                key={project.title}
                className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03]"
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
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="about" className="border-t border-white/10 px-5 py-20 sm:px-8">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-5">
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
          </div>

          <div className="space-y-5">
            <p className="text-[11px] uppercase tracking-[0.32em] text-zinc-400">Focus</p>

            <div className="flex flex-wrap gap-3">
              {skills.map((skill) => (
                <span
                  key={skill}
                  className="rounded-full border border-white/10 px-4 py-2 text-sm text-zinc-200"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="contact" className="border-t border-white/10 px-5 py-20 sm:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-10 lg:grid-cols-[1fr_0.9fr]">
            <div className="space-y-4">
              <p className="text-[11px] uppercase tracking-[0.32em] text-zinc-400">
                Contact
              </p>

              <h2 className="max-w-[10ch] text-3xl font-semibold leading-tight sm:text-4xl md:text-5xl">
                Ready for the next build.
              </h2>

              <p className="max-w-xl text-sm leading-7 text-zinc-300 sm:text-base">
                In the next step, we will keep this exact structure and add scroll-based
                motion carefully, starting with simple reveal effects.
              </p>
            </div>

            <div className="space-y-4 rounded-3xl border border-white/10 bg-white/[0.03] p-6">
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
            </div>
          </div>

          <footer className="pt-16 text-[11px] uppercase tracking-[0.28em] text-zinc-600">
            {profile.name} / Static mobile-first version
          </footer>
        </div>
      </section>
    </main>
  );
}