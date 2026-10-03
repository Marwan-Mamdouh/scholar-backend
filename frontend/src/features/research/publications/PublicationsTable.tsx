import { ExternalLink } from "lucide-react";
import {
  ACCESS_TYPE_LABELS,
  LICENSE_LABELS,
  PUBLISHER_LABELS,
} from "./publication.constants";
import type { Publication, Quartile } from "./publication.type";
import {
  daysToWeeks,
  editorialStat,
  formatCost,
  formatNumber,
  latestMetric,
  primaryPricing,
  toNumber,
} from "./publication.utils";

interface PublicationsTableProps {
  publications: Publication[];

  currency?: string;
}

const QUARTILE_STYLES: Record<Quartile, string> = {
  Q1: "bg-accent-400/20 text-accent-200 border-accent-400/40",
  Q2: "bg-primary-400/20 text-primary-200 border-primary-400/40",
  Q3: "bg-neutral-200/15 text-neutral-100 border-neutral-200/30",
  Q4: "bg-neutral-400/15 text-neutral-300 border-neutral-400/30",
};

const COLUMNS = [
  { key: "publication", label: "Journal name", align: "left" },
  { key: "category", label: "Category", align: "left" },
  { key: "type", label: "Type", align: "left" },
  { key: "access", label: "Access", align: "left" },
  { key: "license", label: "License", align: "left" },
  { key: "impact", label: "Impact", align: "right" },
  { key: "quartile", label: "Quartile", align: "center" },
  { key: "citescore", label: "CiteScore", align: "right" },
  { key: "apc", label: "Article fee", align: "right" },
  { key: "decision", label: "1st decision", align: "right" },
  { key: "acceptance", label: "Accept. rate", align: "right" },
] as const;

const alignClass = {
  left: "text-left",
  right: "text-right",
  center: "text-center",
} as const;

const PublicationsTable = ({
  publications,
  currency,
}: PublicationsTableProps) => (
  <div className="w-full overflow-x-auto rounded-2xl border border-neutral-500">
    <table className="w-full min-w-5xl border-collapse text-sm">
      <thead>
        <tr className="bg-white/5">
          {COLUMNS.map((column) => (
            <th
              key={column.key}
              scope="col"
              className={`whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wider text-neutral-300 ${alignClass[column.align]}`}
            >
              {column.label}
            </th>
          ))}
        </tr>
      </thead>

      <tbody>
        {publications.map((publication) => {
          const metric = latestMetric(publication);
          const editorial = editorialStat(publication);
          const pricing = primaryPricing(publication, currency);
          const quartile = metric?.quartile ?? null;
          const acceptanceRate = toNumber(editorial?.acceptanceRate ?? null);

          return (
            <tr
              key={publication.id}
              className="border-t border-neutral-500/60 transition-colors duration-200 hover:bg-white/5"
            >
              <td className="px-4 py-3 min-w-72">
                <div className="flex flex-col gap-0.5">
                  {publication.URL ? (
                    <a
                      href={publication.URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-neutral-50 hover:text-accent-200 inline-flex items-start gap-1.5 group"
                    >
                      <span>{publication.title}</span>
                      <ExternalLink className="size-3.5 mt-1 shrink-0 opacity-0 transition-opacity group-hover:opacity-100" />
                    </a>
                  ) : (
                    <span className="font-medium text-neutral-50">
                      {publication.title}
                    </span>
                  )}
                  <span className="text-xs text-neutral-300">
                    {[
                      publication.acronym,
                      PUBLISHER_LABELS[publication.publisher] ??
                        publication.publisher,
                      publication.yearLunched ?? undefined,
                    ]
                      .filter(Boolean)
                      .join(" · ")}
                  </span>
                </div>
              </td>

              <td className="px-4 py-3">
                <div className="flex flex-col gap-0.5">
                  <span className="text-neutral-100 whitespace-nowrap">
                    {publication.subCategory?.name ?? "—"}
                  </span>
                  <span className="text-xs text-neutral-300 whitespace-nowrap">
                    {publication.subCategory?.domain?.name ?? ""}
                  </span>
                </div>
              </td>

              <td className="px-4 py-3 text-neutral-100 whitespace-nowrap">
                {publication.publicationType}
              </td>

              <td className="px-4 py-3 text-neutral-100 whitespace-nowrap">
                {ACCESS_TYPE_LABELS[publication.openAccessType] ??
                  publication.openAccessType}
              </td>

              <td className="px-4 py-3 text-neutral-100 whitespace-nowrap">
                {publication.licenseType
                  ? (LICENSE_LABELS[publication.licenseType] ??
                    publication.licenseType)
                  : "—"}
              </td>

              <td className="px-4 py-3 text-right tabular-nums text-neutral-50">
                {formatNumber(toNumber(metric?.impactFactor ?? null))}
              </td>

              <td className="px-4 py-3 text-center">
                {quartile ? (
                  <span
                    className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-semibold ${QUARTILE_STYLES[quartile]}`}
                  >
                    {quartile}
                  </span>
                ) : (
                  <span className="text-neutral-300">—</span>
                )}
              </td>

              <td className="px-4 py-3 text-right tabular-nums text-neutral-100">
                {formatNumber(toNumber(metric?.citescore ?? null))}
              </td>

              <td className="px-4 py-3 text-right tabular-nums text-neutral-100 whitespace-nowrap">
                {formatCost(pricing)}
              </td>

              <td className="px-4 py-3 text-right tabular-nums text-neutral-100 whitespace-nowrap">
                {formatNumber(
                  daysToWeeks(editorial?.submissionToFirstDecision ?? null),
                  " wks",
                )}
              </td>

              <td className="px-4 py-3 text-right tabular-nums text-neutral-100">
                {acceptanceRate === null ? "—" : `${acceptanceRate}%`}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  </div>
);

export default PublicationsTable;
