import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "The Bible",
  description: "A developing reading and research space for the Greek New Testament.",
  alternates: { canonical: "/bible" },
};

const books = [
  ["Matthew", "Mark", "Luke", "John"],
  ["Acts"],
  ["Romans", "1 Corinthians", "2 Corinthians", "Galatians", "Ephesians", "Philippians", "Colossians", "1 Thessalonians", "2 Thessalonians", "1 Timothy", "2 Timothy", "Titus", "Philemon"],
  ["Hebrews", "James", "1 Peter", "2 Peter", "1 John", "2 John", "3 John", "Jude"],
  ["Revelation"],
];

const sections = ["The Gospels", "History", "Pauline Letters", "General Letters", "Apocalypse"];

export default function BiblePage() {
  return (
    <main className="min-h-screen bg-[#0b0b0b] text-[#f0ede6]">
      <div className="mx-auto max-w-[1400px] px-5 pb-28 pt-28 sm:px-10 md:pt-32">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/15 pb-6 text-[10px] uppercase tracking-[0.28em] text-zinc-500">
          <Link href="/" className="transition hover:text-white">← Back to Home</Link>
          <span>BTTB / Scripture Library</span>
        </div>

        <header className="grid gap-10 border-b border-white/15 py-16 md:grid-cols-[1.2fr_0.8fr] md:items-end md:py-24">
          <div>
            <p className="mb-6 text-[11px] uppercase tracking-[0.4em] text-[#b9a98a]">The Bible / New Testament</p>
            <h1 className="font-serif text-[clamp(4.5rem,12vw,11rem)] font-normal leading-[0.83] tracking-[-0.065em]">The<br /><span className="italic">Bible.</span></h1>
          </div>
          <div className="max-w-md space-y-6 md:pb-2">
            <p className="font-serif text-2xl leading-snug text-zinc-200 sm:text-3xl">Read the text. Examine the words. Follow the evidence.</p>
            <p className="text-sm leading-7 text-zinc-400">An evolving reading and research space dedicated to the Greek New Testament, with attention to the Majority Text tradition, language, and historical context.</p>
            <p className="border-l border-[#b9a98a]/70 pl-4 text-xs leading-6 text-[#b9a98a]">Reader foundation · Scripture text and scholarly tools are being prepared.</p>
          </div>
        </header>

        <section className="py-12 md:py-16" aria-labelledby="library-heading">
          <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="mb-3 text-[10px] uppercase tracking-[0.35em] text-[#b9a98a]">01 / Library</p>
              <h2 id="library-heading" className="font-serif text-4xl tracking-tight sm:text-5xl">New Testament</h2>
            </div>
            <span className="text-[10px] uppercase tracking-[0.24em] text-zinc-500">27 Books · Reading interface in development</span>
          </div>

          <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
            {books.map((group, index) => (
              <div key={sections[index]} className="border-t border-white/20 pt-5">
                <div className="mb-7 flex items-center justify-between gap-4">
                  <h3 className="text-[11px] uppercase tracking-[0.24em] text-[#b9a98a]">{sections[index]}</h3>
                  <span className="font-mono text-xs text-zinc-600">{String(index + 1).padStart(2, "0")}</span>
                </div>
                <ul className="space-y-0">
                  {group.map((book) => (
                    <li key={book} className="flex items-center justify-between gap-3 border-b border-white/[0.07] py-3">
                      <span className="font-serif text-xl text-zinc-200">{book}</span>
                      <span className="text-[10px] uppercase tracking-[0.16em] text-zinc-600">Soon</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <footer className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-white/15 pt-6 text-[10px] uppercase tracking-[0.25em] text-zinc-600">
          <span>BTTB Movement · The Bible</span>
          <span>Text, provenance, and audio modules to follow</span>
        </footer>
      </div>
    </main>
  );
}
