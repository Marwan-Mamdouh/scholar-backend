import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowLeft, Loader2 } from "lucide-react";
import Button from "@/src/components/ui/Button/Button";

export function CatalogDetailsLayout({
  backHref,
  backLabel,
  children,
}: {
  backHref: string;
  backLabel: string;
  children: ReactNode;
}) {
  return (
    <main className="mx-auto w-full max-w-5xl flex-1 break-words px-4 pt-36 pb-24 font-main text-sm leading-relaxed md:px-8">
      <Link
        href={backHref}
        className="mb-6 inline-flex items-center gap-2 text-accent-300 hover:text-accent-200 focus-visible:outline-2 focus-visible:outline-accent-200"
      >
        <ArrowLeft aria-hidden="true" className="size-4" />
        {backLabel}
      </Link>
      {children}
    </main>
  );
}

export function CatalogDetailState({
  label,
  loading,
  notFound,
  error,
  onRetry,
}: {
  label: string;
  loading: boolean;
  notFound: boolean;
  error?: string;
  onRetry: () => void;
}) {
  if (loading)
    return (
      <div
        role="status"
        className="flex items-center justify-center gap-3 py-24 text-accent-200"
      >
        <Loader2
          aria-hidden="true"
          className="size-5 motion-safe:animate-spin"
        />
        Loading {label.toLowerCase()} details…
      </div>
    );
  if (notFound || error)
    return (
      <div
        role="alert"
        className="flex flex-col items-center gap-4 py-24 text-center"
      >
        <h1 className="text-3xl font-semibold text-primary-200">
          {notFound
            ? `${label} not found`
            : `Could not load this ${label.toLowerCase()}`}
        </h1>
        <p className="text-neutral-100">
          {notFound
            ? "This record is no longer available. Return to the catalog to explore more."
            : error}
        </p>
        {!notFound && (
          <Button variant="outlined" intent="accent" onClick={onRetry}>
            Try again
          </Button>
        )}
      </div>
    );
  return null;
}

export function DetailSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-3xl bg-overlay/[0.04] p-5 md:p-6">
      <h2 className="mb-4 text-lg font-medium text-primary-200">{title}</h2>
      {children}
    </section>
  );
}

export function DetailFields({
  fields,
}: {
  fields: { label: string; value: ReactNode }[];
}) {
  return (
    <dl className="grid gap-x-6 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">
      {fields.map(({ label, value }) => (
        <div key={label} className="min-w-0">
          <dt className="mb-1 text-xs text-neutral-200">{label}</dt>
          <dd className="text-neutral-50">{value ?? "Not provided"}</dd>
        </div>
      ))}
    </dl>
  );
}

export function safeExternalUrl(
  value: string | null | undefined,
): string | null {
  if (!value) return null;
  try {
    const url = new URL(value);
    return ["https:", "http:"].includes(url.protocol) ? url.href : null;
  } catch {
    return null;
  }
}
