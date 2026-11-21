"use client";

import { ExternalLink } from "lucide-react";
import {
  CatalogDetailsLayout,
  CatalogDetailState,
  DetailFields,
  DetailSection,
  safeExternalUrl,
} from "@/src/components/catalog/CatalogDetails";
import getButtonClasses from "@/src/components/ui/Button/button.style";
import { useCatalogDetail } from "@/src/hooks/useCatalogDetail";
import type { ResearchPaper } from "./paper.api";

export default function PaperDetails({ id }: { id: string }) {
  const { data: paper, loading, notFound, error, reload } =
    useCatalogDetail<ResearchPaper>(id, "/papers");
  const sourceUrl = safeExternalUrl(paper?.url);

  return (
    <CatalogDetailsLayout backHref="/research?tab=papers" backLabel="Back to papers">
      <CatalogDetailState
        label="Paper"
        loading={loading}
        notFound={notFound}
        error={error}
        onRetry={reload}
      />
      {paper && (
        <article className="flex flex-col gap-6">
          <header className="rounded-3xl border border-neutral-700 bg-brand-gradient p-6 md:p-8">
            {paper.journalTitle && <p className="mb-3 text-lg text-accent-300">{paper.journalTitle}</p>}
            <h1 className="text-h2-sm text-neutral-50 md:text-h2">{paper.title}</h1>
            {sourceUrl && (
              <a
                href={sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`${getButtonClasses({ intent: "accent", variant: "outlined", size: "md" })} mt-5 min-h-11 w-fit focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-200`}
              >
                Read paper on source website
                <ExternalLink aria-hidden="true" className="size-4" />
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            )}
          </header>
          {paper.subtitle && (
            <DetailSection title="Summary">
              <p className="whitespace-pre-wrap text-neutral-100">{paper.subtitle}</p>
            </DetailSection>
          )}
          <DetailSection title="Paper information">
            <DetailFields
              fields={[
                { label: "Author", value: paper.staff?.name },
                { label: "Journal", value: paper.journalTitle },
                { label: "Source", value: paper.sourceName },
                { label: "Publication year", value: paper.publicationYear },
                { label: "Publication month", value: paper.publicationMonth },
                { label: "Publication day", value: paper.publicationDay },
                { label: "Type", value: paper.type },
                { label: "DOI", value: paper.doi },
                { label: "ORCID path", value: paper.orcidPath },
                { label: "ORCID work identifier", value: paper.putCode },
              ]}
            />
          </DetailSection>
        </article>
      )}
    </CatalogDetailsLayout>
  );
}
