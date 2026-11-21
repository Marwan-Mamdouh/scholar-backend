import { safeExternalUrl } from "@/src/components/catalog/CatalogDetails";
import { BookOpen, ExternalLink } from "lucide-react";
import CatalogCard from "@/src/components/catalog/CatalogCard";
import Badge from "@/src/components/ui/Badge/Badge";
import {
  ACCESS_TYPE_LABELS,
  LICENSE_LABELS,
  PUBLISHER_LABELS,
} from "./publication.constants";
import type { Publication } from "./publication.type";
import {
  daysToWeeks,
  editorialStat,
  formatCost,
  formatNumber,
  latestMetric,
  primaryPricing,
  toNumber,
} from "./publication.utils";

export default function PublicationCard({
  publication,
}: {
  publication: Publication;
}) {
  const website = safeExternalUrl(publication.URL);
  const metric = latestMetric(publication);
  const editorial = editorialStat(publication);
  const metrics = [
    ["Impact factor", formatNumber(toNumber(metric?.impactFactor))],
    ["CiteScore", formatNumber(toNumber(metric?.citescore))],
    ["Article fee", formatCost(primaryPricing(publication))],
    [
      "License",
      publication.licenseType ? LICENSE_LABELS[publication.licenseType] : "—",
    ],
    [
      "First decision",
      formatNumber(
        daysToWeeks(editorial?.submissionToFirstDecision ?? null),
        " wks",
      ),
    ],
    ["Acceptance rate", formatNumber(toNumber(editorial?.acceptanceRate), "%")],
  ];
  return (
    <CatalogCard
      title={publication.title}
      eyebrow={[
        publication.acronym,
        PUBLISHER_LABELS[publication.publisher] ?? publication.publisher,
        publication.yearLunched,
      ]
        .filter(Boolean)
        .join(" · ")}
      href={`/research/publications/${publication.id}`}
      icon={<BookOpen aria-hidden="true" className="size-8 text-accent-300" />}
      badge={
        metric?.quartile ? (
          <Badge size="md" variant="solid" intent="accent">
            {metric.quartile}
          </Badge>
        ) : undefined
      }
    >
      <p className="line-clamp-2 text-neutral-200">
        {[publication.subCategory?.domain?.name, publication.subCategory?.name]
          .filter(Boolean)
          .join(" · ") || "Category not specified"}
      </p>
      <div className="flex flex-wrap gap-2">
        <Badge size="md" variant="outlined" intent="accent">
          {publication.publicationType}
        </Badge>
        <Badge size="md" variant="outlined" intent="accent">
          {ACCESS_TYPE_LABELS[publication.openAccessType] ??
            publication.openAccessType}
        </Badge>
      </div>
      <dl className="grid grid-cols-2 gap-x-3 gap-y-3 pt-1">
        {metrics.map(([label, value]) => (
          <div key={label}>
            <dt className="text-neutral-200">{label}</dt>
            <dd className="font-medium text-neutral-50">{value}</dd>
          </div>
        ))}
      </dl>
      {website && (
        <a
          className="inline-flex items-center gap-1 self-start text-accent-300 hover:underline"
          href={website}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Visit ${publication.title} publisher website (opens in a new tab)`}
        >
          Publisher website{" "}
          <ExternalLink aria-hidden="true" className="size-4" />
        </a>
      )}
    </CatalogCard>
  );
}
