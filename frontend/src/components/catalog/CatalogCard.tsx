import type { ReactNode } from "react";
import Link from "next/link";
import Card from "@/src/components/ui/Card/Card";
import getButtonClasses from "@/src/components/ui/Button/button.style";

export const CATALOG_GRID =
  "grid items-stretch gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4";

export const catalogActionClasses = `${getButtonClasses({ variant: "outlined", intent: "accent", size: "md" })} mt-auto min-h-11 w-full text-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent-200`;

interface CatalogCardProps {
  title: string;
  eyebrow?: string;
  description?: string;
  icon?: ReactNode;
  badge?: ReactNode;
  href?: string;
  action?: ReactNode;
  children: ReactNode;
}

export default function CatalogCard({
  title,
  eyebrow,
  description,
  icon,
  badge,
  href,
  action,
  children,
}: CatalogCardProps) {
  return (
    <article aria-label={title} className="min-w-0">
      <Card
        size="compact"
        variant="outlined"
        intent="primary"
        title={title}
        eyebrow={eyebrow}
        description={description}
        icon={icon}
        badge={badge}
        className="h-full min-w-0 border-primary-300/80 bg-brand-gradient"
      >
        <div className="flex w-full min-w-0 flex-1 flex-col gap-3 text-sm leading-5 text-neutral-100">
          {children}
        </div>
        {href ? (
          <Link
            href={href}
            aria-label={`Show more about ${title}`}
            className={catalogActionClasses}
          >
            Show more
          </Link>
        ) : (
          action
        )}
      </Card>
    </article>
  );
}

export function CatalogCardsSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className={CATALOG_GRID} aria-hidden="true">
      {Array.from({ length: count }, (_, index) => (
        <Card
          key={index}
          title=""
          size="compact"
          variant="outlined"
          intent="primary"
          className="min-h-80 border-primary-300/40 motion-safe:animate-pulse"
        >
          <div className="mb-3 size-8 rounded-xl bg-neutral-700" />
          <div className="h-5 w-5/6 rounded bg-neutral-700" />
          <div className="h-5 w-2/3 rounded bg-neutral-700" />
          <div className="mt-4 h-4 w-1/2 rounded bg-neutral-800" />
          <div className="h-4 w-3/4 rounded bg-neutral-800" />
          <div className="mt-auto h-11 w-full rounded-xl bg-neutral-700" />
        </Card>
      ))}
    </div>
  );
}
