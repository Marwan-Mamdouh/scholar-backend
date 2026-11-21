import Link from "next/link";
import type { ReactNode } from "react";
import LogoIcon from "../Icons/Logo";
import ThemeToggle from "../ui/ThemeToggle/ThemeToggle";

export default function AuthShell({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background text-neutral-50">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-brand-gradient" />

      <div className="relative z-10 flex min-h-screen flex-col">
        <header className="flex items-center justify-between px-6 py-4 sm:px-10 lg:px-12">
          <Link
            href="/"
            aria-label="NEXUS home"
            className="inline-flex items-center"
          >
            <LogoIcon />
          </Link>

          <ThemeToggle className="flex h-11 w-11" />
        </header>

        <main className="flex flex-1 items-center justify-center px-4 pb-10 pt-4 sm:px-6 lg:px-8">
          {children}
        </main>
      </div>
    </div>
  );
}
