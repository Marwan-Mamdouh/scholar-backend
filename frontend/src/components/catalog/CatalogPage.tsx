import type { ReactNode } from "react";
import LightingGlow from "@/src/components/ui/LightingGlow/LightingGlow";

interface CatalogPageProps {
  title: string;
  description: string;
  children: ReactNode;
}

export default function CatalogPage({
  title,
  description,
  children,
}: CatalogPageProps) {
  return (
    <main className="relative isolate flex w-full flex-1 flex-col overflow-clip pt-36 font-main">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-48 right-0 -z-10 hidden h-54 w-73.5 lg:block"
      >
        <LightingGlow variant="accent" className="blur-[150px]" />
      </div>
      <header className="flex flex-col items-center gap-3 px-4 text-center">
        <h1 className="text-4xl font-bold tracking-eyebrow text-neutral-50 md:text-h1-sm">
          {title}
        </h1>
        <p className="max-w-2xl text-lg text-neutral-50">{description}</p>
      </header>
      <div className="mx-auto w-full max-w-400 px-4 pt-10 pb-24 md:px-8">
        {children}
      </div>
    </main>
  );
}
