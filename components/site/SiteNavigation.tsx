"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";

const navItems = [
  { label: "Home", href: "/" },
  { label: "Works", href: "/works" },
  { label: "My Vision", href: "/my-vision" },
  { label: "Journal", href: "/journal" },
  { label: "Contact", href: "/#contact" },
] as const;

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  if (href === "/works") {
    return pathname === "/works" || pathname.startsWith("/projects/");
  }
  if (href === "/my-vision") {
    return pathname === "/my-vision";
  }
  if (href === "/journal") {
    return pathname === "/journal" || pathname.startsWith("/journal/");
  }
  return false;
}

function getRouteLabel(pathname: string) {
  if (pathname === "/") return "Home";
  if (pathname === "/works") return "Works Archive";
  if (pathname.startsWith("/projects/")) return "Project Case Study";
  if (pathname === "/my-vision") return "My Vision";
  if (pathname === "/journal") return "Journal";
  if (pathname.startsWith("/journal/")) return "Journal Entry";
  return "Archive";
}

export default function SiteNavigation() {
  const pathname = usePathname();
  const routeLabel = getRouteLabel(pathname);

  return (
    <>
      <motion.header
        initial={{ opacity: 0, y: -18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: "easeOut" }}
        className="pointer-events-none fixed inset-x-0 top-4 z-[80] hidden justify-center px-4 md:flex"
      >
        <div className="pointer-events-auto">
          <div className="flex items-center gap-4 rounded-full border border-white/10 bg-black/60 px-4 py-3 shadow-[0_20px_50px_rgba(0,0,0,0.35)] backdrop-blur-xl">
            <Link
              href="/"
              className="flex items-center gap-2 rounded-full px-3 py-2 text-[11px] uppercase tracking-[0.28em] text-zinc-200 transition hover:text-white"
            >
              <span className="h-2 w-2 rounded-full bg-white/80" />
              <span>BTTB</span>
            </Link>

            <div className="h-6 w-px bg-white/10" />

            <nav className="flex items-center gap-2">
              {navItems.map((item) => {
                const active = isActive(pathname, item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={`rounded-full px-4 py-2 text-[11px] uppercase tracking-[0.28em] transition ${
                      active
                        ? "border border-white/20 bg-white text-black"
                        : "border border-transparent text-zinc-300 hover:border-white/10 hover:bg-white/[0.06] hover:text-white"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            <div className="h-6 w-px bg-white/10" />

            <div className="rounded-full border border-white/10 px-4 py-2 text-[11px] uppercase tracking-[0.28em] text-zinc-400">
              {routeLabel}
            </div>
          </div>
        </div>
      </motion.header>

      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: "easeOut" }}
        className="pointer-events-none fixed inset-x-0 bottom-4 z-[80] flex justify-center px-4 md:hidden"
      >
        <nav className="pointer-events-auto flex w-full max-w-[34rem] items-center justify-between rounded-full border border-white/10 bg-black/70 px-3 py-3 shadow-[0_20px_50px_rgba(0,0,0,0.35)] backdrop-blur-xl">
          {navItems.map((item) => {
            const active = isActive(pathname, item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
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
        </nav>
      </motion.div>
    </>
  );
}