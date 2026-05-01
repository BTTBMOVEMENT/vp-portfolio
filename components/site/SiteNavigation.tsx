"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";

const showAdminButton = process.env.NEXT_PUBLIC_SHOW_ADMIN_BUTTON === "true";

const navItems = [
  { label: "Home", href: "/" },
  { label: "Works", href: "/works" },
  { label: "Journal", href: "/journal" },
  { label: "My Album", href: "/my-album" },
  { label: "Contact", href: "/#contact" },
] as const;

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  if (href === "/works") return pathname === "/works" || pathname.startsWith("/projects/");
  if (href === "/journal") return pathname === "/journal" || pathname.startsWith("/journal/");
  if (href === "/my-album") return pathname === "/my-album" || pathname === "/my-vision";
  return false;
}

export default function SiteNavigation() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  if (pathname.startsWith("/studio")) {
    return null;
  }

  return (
    <div className="pointer-events-none fixed left-4 top-4 z-[90]">
      <div className="pointer-events-auto flex flex-col items-start gap-3">
        <motion.button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          whileTap={{ scale: 0.96 }}
          className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-black/70 px-4 py-3 text-[11px] uppercase tracking-[0.28em] text-zinc-100 shadow-[0_20px_50px_rgba(0,0,0,0.35)] backdrop-blur-xl"
        >
          <span className="h-2 w-2 rounded-full bg-white/80" />
          <span>BTTB</span>
          <span className={`transition-transform duration-300 ${open ? "rotate-45" : "rotate-0"}`}>
            +
          </span>
        </motion.button>

        <AnimatePresence>
          {open && (
            <>
              <motion.div
                initial={{ opacity: 0, x: -12, scaleX: 0.96 }}
                animate={{ opacity: 1, x: 0, scaleX: 1 }}
                exit={{ opacity: 0, x: -12, scaleX: 0.96 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="hidden origin-left md:block"
              >
                <nav className="flex items-center gap-2 rounded-full border border-white/10 bg-black/70 px-3 py-3 shadow-[0_20px_50px_rgba(0,0,0,0.35)] backdrop-blur-xl">
                  {navItems.map((item) => {
                    const active = isActive(pathname, item.href);

                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`rounded-full px-4 py-2 text-[11px] uppercase tracking-[0.24em] transition ${
                          active
                            ? "bg-white text-black"
                            : "text-zinc-300 hover:bg-white/[0.06] hover:text-white"
                        }`}
                      >
                        {item.label}
                      </Link>
                    );
                  })}

                  {showAdminButton && (
                    <Link
                      href="/studio"
                      className="rounded-full border border-white/10 px-4 py-2 text-[11px] uppercase tracking-[0.24em] text-zinc-200 transition hover:border-white/30 hover:text-white"
                    >
                      Admin
                    </Link>
                  )}
                </nav>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: -10, scaleY: 0.96 }}
                animate={{ opacity: 1, y: 0, scaleY: 1 }}
                exit={{ opacity: 0, y: -10, scaleY: 0.96 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="origin-top md:hidden"
              >
                <nav className="flex min-w-[15rem] flex-col gap-2 rounded-[1.5rem] border border-white/10 bg-black/80 p-3 shadow-[0_20px_50px_rgba(0,0,0,0.35)] backdrop-blur-xl">
                  {navItems.map((item) => {
                    const active = isActive(pathname, item.href);

                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`rounded-full px-4 py-3 text-[11px] uppercase tracking-[0.24em] transition ${
                          active
                            ? "bg-white text-black"
                            : "text-zinc-300 hover:bg-white/[0.06] hover:text-white"
                        }`}
                      >
                        {item.label}
                      </Link>
                    );
                  })}

                  {showAdminButton && (
                    <Link
                      href="/studio"
                      className="rounded-full border border-white/10 px-4 py-3 text-[11px] uppercase tracking-[0.24em] text-zinc-200 transition hover:border-white/30 hover:text-white"
                    >
                      Admin
                    </Link>
                  )}
                </nav>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}