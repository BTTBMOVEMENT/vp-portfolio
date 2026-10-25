"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";

const groups = [
  {
    "title": "The Gospels",
    "books": [
      {
        "greek": "Κατὰ Ματθαῖον",
        "english": "Matthew"
      },
      {
        "greek": "Κατὰ Μᾶρκον",
        "english": "Mark"
      },
      {
        "greek": "Κατὰ Λουκᾶν",
        "english": "Luke"
      },
      {
        "greek": "Κατὰ Ἰωάννην",
        "english": "John"
      }
    ]
  },
  {
    "title": "History",
    "books": [
      {
        "greek": "Πράξεις Ἀποστόλων",
        "english": "Acts"
      }
    ]
  },
  {
    "title": "Pauline Letters",
    "books": [
      {
        "greek": "Πρὸς Ῥωμαίους",
        "english": "Romans"
      },
      {
        "greek": "Πρὸς Κορινθίους Αʹ",
        "english": "1 Corinthians"
      },
      {
        "greek": "Πρὸς Κορινθίους Βʹ",
        "english": "2 Corinthians"
      },
      {
        "greek": "Πρὸς Γαλάτας",
        "english": "Galatians"
      },
      {
        "greek": "Πρὸς Ἐφεσίους",
        "english": "Ephesians"
      },
      {
        "greek": "Πρὸς Φιλιππησίους",
        "english": "Philippians"
      },
      {
        "greek": "Πρὸς Κολοσσαεῖς",
        "english": "Colossians"
      },
      {
        "greek": "Πρὸς Θεσσαλονικεῖς Αʹ",
        "english": "1 Thessalonians"
      },
      {
        "greek": "Πρὸς Θεσσαλονικεῖς Βʹ",
        "english": "2 Thessalonians"
      },
      {
        "greek": "Πρὸς Τιμόθεον Αʹ",
        "english": "1 Timothy"
      },
      {
        "greek": "Πρὸς Τιμόθεον Βʹ",
        "english": "2 Timothy"
      },
      {
        "greek": "Πρὸς Τίτον",
        "english": "Titus"
      },
      {
        "greek": "Πρὸς Φιλήμονα",
        "english": "Philemon"
      }
    ]
  },
  {
    "title": "General Letters",
    "books": [
      {
        "greek": "Πρὸς Ἑβραίους",
        "english": "Hebrews"
      },
      {
        "greek": "Ἰακώβου",
        "english": "James"
      },
      {
        "greek": "Πέτρου Αʹ",
        "english": "1 Peter"
      },
      {
        "greek": "Πέτρου Βʹ",
        "english": "2 Peter"
      },
      {
        "greek": "Ἰωάννου Αʹ",
        "english": "1 John"
      },
      {
        "greek": "Ἰωάννου Βʹ",
        "english": "2 John"
      },
      {
        "greek": "Ἰωάννου Γʹ",
        "english": "3 John"
      },
      {
        "greek": "Ἰούδα",
        "english": "Jude"
      }
    ]
  },
  {
    "title": "Apocalypse",
    "books": [
      {
        "greek": "Ἀποκάλυψις Ἰωάννου",
        "english": "Revelation"
      }
    ]
  }
];

export default function BibleLibrary() {
  const reduceMotion = useReducedMotion();
  const reveal = (delay = 0) => ({
    initial: reduceMotion ? false : { opacity: 0, y: 48 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.15 },
    transition: { duration: reduceMotion ? 0 : 0.85, delay: reduceMotion ? 0 : delay, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  });

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#0b0b0b] text-[#f0ede6]">
      <div className="mx-auto max-w-[1500px] px-5 pb-28 pt-28 sm:px-10 md:pt-32">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/15 pb-6 text-[10px] uppercase tracking-[0.28em] text-zinc-500">
          <Link href="/" className="transition hover:text-white">← Back to Home</Link>
          <span>BTTB / Scripture Library</span>
        </div>

        <header className="grid gap-10 border-b border-white/15 py-16 md:grid-cols-[1.2fr_0.8fr] md:items-end md:py-24">
          <motion.div {...reveal()}>
            <p className="mb-6 text-[11px] uppercase tracking-[0.4em] text-[#b9a98a]">The Bible / New Testament</p>
            <h1 className="font-serif text-[clamp(4.5rem,12vw,11rem)] font-normal leading-[0.83] tracking-[-0.065em]">The<br /><span className="italic">Bible.</span></h1>
          </motion.div>
          <motion.div {...reveal(0.15)} className="max-w-md space-y-6 md:pb-2">
            <p className="font-serif text-2xl leading-snug text-zinc-200 sm:text-3xl">Read the text. Examine the words. Follow the evidence.</p>
            <p className="text-sm leading-7 text-zinc-400">An evolving reading and research space dedicated to the Greek New Testament, with attention to the Majority Text tradition, language, and historical context.</p>
            <p className="border-l border-[#b9a98a]/70 pl-4 text-xs leading-6 text-[#b9a98a]">Reader foundation · Scripture text and scholarly tools are being prepared.</p>
          </motion.div>
        </header>

        <section className="py-12 md:py-16" aria-labelledby="library-heading">
          <motion.div {...reveal()} className="mb-14 flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="mb-3 text-[10px] uppercase tracking-[0.35em] text-[#b9a98a]">01 / Library</p>
              <h2 id="library-heading" className="font-serif text-4xl tracking-tight sm:text-5xl">New Testament</h2>
            </div>
            <span className="text-[10px] uppercase tracking-[0.24em] text-zinc-500">27 Books · Reading interface in development</span>
          </motion.div>

          <div className="space-y-14 md:space-y-20">
            {groups.map((group, index) => (
              <motion.section key={group.title} {...reveal()} className="grid gap-6 border-t border-white/20 pt-6 md:grid-cols-[210px_minmax(0,1fr)] md:gap-10">
                <div className="flex items-start justify-between gap-4 md:flex-col">
                  <h3 className="text-[11px] uppercase tracking-[0.24em] text-[#b9a98a]">{group.title}</h3>
                  <span className="font-mono text-xs text-zinc-600">{String(index + 1).padStart(2, "0")}</span>
                </div>
                <ul className="flex flex-wrap gap-3 sm:gap-4">
                  {group.books.map((book, bookIndex) => (
                    <motion.li key={book.english} {...reveal(Math.min(bookIndex * 0.035, 0.28))} className="group">
                      <div className="flex min-h-24 min-w-[135px] flex-col justify-between border border-white/10 bg-white/[0.025] px-5 py-4 transition-colors duration-300 hover:border-[#b9a98a]/50 hover:bg-white/[0.055] sm:min-w-[160px]">
                        <div className="space-y-2"><span lang="grc" className="block text-xl leading-[1.5] tracking-normal text-zinc-200 sm:text-2xl" style={{ fontFamily: "var(--font-greek-serif), serif", fontKerning: "normal", fontVariantLigatures: "normal" }}>{book.greek}</span><span className="block text-xs tracking-[0.03em] text-zinc-400">({book.english})</span></div>
                        {book.english === "Matthew" ? <Link href="/bible/matthew/1" className="mt-5 text-[9px] uppercase tracking-[0.18em] text-[#b9a98a] hover:text-white">Open reader →</Link> : <span className="mt-5 text-[9px] uppercase tracking-[0.18em] text-zinc-600">Soon</span>}
                      </div>
                    </motion.li>
                  ))}
                </ul>
              </motion.section>
            ))}
          </div>
        </section>

        <motion.footer {...reveal()} className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-white/15 pt-6 text-[10px] uppercase tracking-[0.25em] text-zinc-600">
          <span>BTTB Movement · The Bible</span>
          <span>Text, provenance, and audio modules to follow</span>
        </motion.footer>
      </div>
    </main>
  );
}
