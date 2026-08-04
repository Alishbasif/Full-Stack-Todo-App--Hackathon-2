"use client";

import { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "#home", label: "Home" },
  { href: "#features", label: "Features" },
  { href: "#about", label: "About" },
  { href: "#contact", label: "Contact" },
];

const primaryLinkClasses =
  "inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-medium text-primary-foreground shadow-lg shadow-primary/20 transition-all duration-200 hover:bg-primary/90 hover:shadow-glow-primary active:scale-[0.97] btn-focus";

const ghostLinkClasses =
  "inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 text-sm font-medium text-slate-100 transition-all duration-200 hover:bg-white/10 hover:border-white/20 active:scale-[0.97] btn-focus";

/** Public landing-page navbar (FR-004, FR-005, FR-013) — distinct from the authenticated app's Header. */
export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-white/5 bg-background/70 backdrop-blur-xl">
      <div className="mx-auto flex h-16 w-full max-w-5xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          href="#home"
          className="flex items-center gap-2 rounded-lg text-lg font-semibold tracking-tight text-slate-50 btn-focus"
        >
          <span
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-secondary text-sm font-bold shadow-glow-primary"
            aria-hidden="true"
          >
            T
          </span>
          <span>
            Task<span className="text-gradient">Flow</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex" aria-label="Primary">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-muted transition-colors hover:text-slate-50 btn-focus"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Link href="/sign-in" className={ghostLinkClasses}>
            Login
          </Link>
          <Link href="/sign-up" className={primaryLinkClasses}>
            Get Started
          </Link>
        </div>

        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-slate-100 btn-focus md:hidden"
          aria-expanded={isMobileMenuOpen}
          aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
          onClick={() => setIsMobileMenuOpen((open) => !open)}
        >
          <span aria-hidden="true">{isMobileMenuOpen ? "✕" : "☰"}</span>
        </button>
      </div>

      <div
        className={cn(
          "overflow-hidden border-t border-white/5 transition-[max-height] duration-200 md:hidden",
          isMobileMenuOpen ? "max-h-96" : "max-h-0 border-t-0"
        )}
      >
        <nav
          className="flex flex-col gap-1 px-4 py-4 sm:px-6"
          aria-label="Primary"
        >
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="rounded-lg px-2 py-2 text-sm font-medium text-muted transition-colors hover:bg-white/5 hover:text-slate-50 btn-focus"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {link.label}
            </a>
          ))}
          <div className="mt-2 flex flex-col gap-2">
            <Link href="/sign-in" className={ghostLinkClasses}>
              Login
            </Link>
            <Link href="/sign-up" className={primaryLinkClasses}>
              Get Started
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}
