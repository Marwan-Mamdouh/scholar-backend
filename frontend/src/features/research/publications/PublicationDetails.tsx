"use client";

import { ExternalLink } from "lucide-react";
import {
  CatalogDetailsLayout,
  CatalogDetailState,
  DetailFields,
  DetailSection,
  safeExternalUrl,
} from "@/src/components/catalog/CatalogDetails";
import Badge from "@/src/components/ui/Badge/Badge";
import getButtonClasses from "@/src/components/ui/Button/button.style";
import { useCatalogDetail } from "@/src/hooks/useCatalogDetail";
import {
  ACCESS_TYPE_LABELS,
  LICENSE_LABELS,
  PUBLISHER_LABELS,
} from "./publication.constants";
import type { Publication } from "./publication.type";
import {
  daysToWeeks,
  formatCost,
  formatNumber,
  toNumber,
} from "./publication.utils";

export default function PublicationDetails({ id }: { id: string }) {
  const state = useCatalogDetail<Publication>(id, "/publications");
  const publication = state.data;
  const website = safeExternalUrl(publication?.URL);
  const editorialStats = publication?.editorialStats ?? [];

  return (
    <CatalogDetailsLayout
      backHref="/research?tab=publications"
      backLabel="Back to publications"
    >
      <CatalogDetailState
        label="Publication"
        loading={state.loading}
        notFound={state.notFound}
        error={state.error}
        onRetry={state.reload}
      />
      {publication && (
        <article className="flex flex-col gap-6">
          <header className="rounded-3xl border border-primary-300/60 bg-brand-gradient p-5 md:p-7">
            <p className="mb-3 text-sm text-accent-300">
              {PUBLISHER_LABELS[publication.publisher] ?? publication.publisher}
              {publication.acronym ? ` · ${publication.acronym}` : ""}
            </p>
            <h1 className="text-2xl font-semibold text-primary-200 md:text-3xl">
              {publication.title}
            </h1>
            <p className="mt-3 text-neutral-200">
              {[
                publication.subCategory?.domain?.name,
                publication.subCategory?.name,
              ]
                .filter(Boolean)
                .join(" · ")}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Badge variant="solid" intent="accent">
                {publication.publicationType}
              </Badge>
              <Badge variant="outlined" intent="accent">
                {ACCESS_TYPE_LABELS[publication.openAccessType] ??
                  publication.openAccessType}
              </Badge>
              {publication.licenseType && (
                <Badge variant="outlined" intent="primary">
                  {LICENSE_LABELS[publication.licenseType] ??
                    publication.licenseType}
                </Badge>
              )}
            </div>
            {website && (
              <a
                href={website}
                target="_blank"
                rel="noopener noreferrer"
                className={`${getButtonClasses({ variant: "outlined", intent: "accent", size: "md" })} mt-5 min-h-11 w-fit gap-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-200`}
              >
                Visit publication website
                <ExternalLink aria-hidden="true" className="size-4" />
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            )}
          </header>
          <DetailSection title="Scope and focus">
            <p className="whitespace-pre-wrap text-neutral-100">
              {publication.journalScope ||
                "A detailed scope has not been provided."}
            </p>
            {publication.specificFocusScope && (
              <p className="mt-4 text-neutral-200">
                Specific focus: {publication.specificFocusScope}
              </p>
            )}
          </DetailSection>
          <DetailSection title="Publication information">
            <DetailFields
              fields={[
                {
                  label: "Publisher",
                  value:
                    PUBLISHER_LABELS[publication.publisher] ??
                    publication.publisher,
                },
                { label: "Type", value: publication.publicationType },
                { label: "Launched", value: publication.yearLunched },
                { label: "ISSN", value: publication.issn },
                { label: "eISSN", value: publication.eissn },
                { label: "CD-ROM ISSN", value: publication.issnCdrom },
                {
                  label: "License",
                  value: publication.licenseType
                    ? LICENSE_LABELS[publication.licenseType]
                    : null,
                },
                {
                  label: "Access model",
                  value: ACCESS_TYPE_LABELS[publication.openAccessType],
                },
                {
                  label: "Workflow",
                  value:
                    publication.workflow === "standard"
                      ? "Standard"
                      : "Non-standard",
                },
                { label: "Imprint", value: publication.imprint },
                {
                  label: "Publishing collection",
                  value: publication.subBucket?.replace(/_/g, " "),
                },
              ]}
            />
          </DetailSection>
          <DetailSection title="Metrics by year">
            {publication.yearlyMetrics?.length ? (
              <div className="flex flex-col gap-6">
                {publication.yearlyMetrics.map((metric) => (
                  <section
                    key={metric.id}
                    className="border-t border-neutral-600/60 pt-4 first:border-0 first:pt-0"
                  >
                    <h3 className="mb-4 font-medium text-accent-200">
                      {metric.metricYear}
                      {metric.indexingService
                        ? ` · ${metric.indexingService}`
                        : ""}
                    </h3>
                    <DetailFields
                      fields={[
                        {
                          label: "Impact factor",
                          value: formatNumber(toNumber(metric.impactFactor)),
                        },
                        {
                          label: "5-year impact factor",
                          value: formatNumber(toNumber(metric.impactFactor5yr)),
                        },
                        { label: "Quartile", value: metric.quartile },
                        {
                          label: "CiteScore",
                          value: formatNumber(toNumber(metric.citescore)),
                        },
                        {
                          label: "SJR",
                          value: formatNumber(toNumber(metric.sjr)),
                        },
                        {
                          label: "JCI",
                          value: formatNumber(toNumber(metric.jci)),
                        },
                        {
                          label: "H5 index",
                          value: formatNumber(toNumber(metric.h5Index)),
                        },
                        {
                          label: "Eigenfactor",
                          value: formatNumber(toNumber(metric.eigenfactor)),
                        },
                        {
                          label: "Article influence score",
                          value: formatNumber(
                            toNumber(metric.articleInfluenceScore),
                          ),
                        },
                        {
                          label: "Total citations",
                          value: metric.totalCitations.toLocaleString("en"),
                        },
                        {
                          label: "Article downloads",
                          value: metric.articleDownloads.toLocaleString("en"),
                        },
                      ]}
                    />
                  </section>
                ))}
              </div>
            ) : (
              <p className="text-neutral-200">
                Metrics have not been provided.
              </p>
            )}
          </DetailSection>
          <DetailSection title="Fees and pricing">
            {publication.pricings?.length ? (
              <DetailFields
                fields={publication.pricings.map((price) => ({
                  label: `${price.currency} · ${price.pricingYear}${price.isSubscription ? " · Subscription" : " · Article fee"}`,
                  value: formatCost(price),
                }))}
              />
            ) : (
              <p className="text-neutral-200">Pricing has not been provided.</p>
            )}
          </DetailSection>
          <DetailSection title="Editorial process">
            {editorialStats.length ? (
              <div className="flex flex-col gap-6">
                {editorialStats.map((stat, index) => (
                  <section key={stat.id}>
                    {editorialStats.length > 1 && (
                      <h3 className="mb-3 text-accent-200">
                        Editorial statistics {index + 1}
                      </h3>
                    )}
                    <DetailFields
                      fields={[
                        {
                          label: "First decision",
                          value: formatNumber(
                            daysToWeeks(stat.submissionToFirstDecision),
                            " weeks",
                          ),
                        },
                        {
                          label: "Review decision",
                          value: formatNumber(
                            daysToWeeks(stat.submissionToReviewDecision),
                            " weeks",
                          ),
                        },
                        {
                          label: "Submission to acceptance",
                          value: formatNumber(
                            daysToWeeks(stat.submissionToAcceptance),
                            " weeks",
                          ),
                        },
                        {
                          label: "Acceptance to publication",
                          value: formatNumber(
                            daysToWeeks(stat.acceptanceToPublication),
                            " weeks",
                          ),
                        },
                        {
                          label: "Acceptance rate",
                          value: formatNumber(
                            toNumber(stat.acceptanceRate),
                            "%",
                          ),
                        },
                      ]}
                    />
                  </section>
                ))}
              </div>
            ) : (
              <p className="text-neutral-200">
                Editorial statistics have not been provided.
              </p>
            )}
          </DetailSection>
        </article>
      )}
    </CatalogDetailsLayout>
  );
}
