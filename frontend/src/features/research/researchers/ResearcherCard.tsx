"use client";

import { useState } from "react";
import { Bookmark } from "lucide-react";
import CatalogCard, {
  catalogActionClasses,
} from "@/src/components/catalog/CatalogCard";
import Badge from "@/src/components/ui/Badge/Badge";
import ResearcherAvatar from "./ResearcherAvatar";
import { formatCompact } from "./researcher.utils";
import type { ResearcherSummary } from "./researcher.type";

interface ResearcherCardProps {
  researcher: ResearcherSummary;
  onViewProfile: (id: number) => void;
}

const MAX_TAGS = 3;

const ResearcherCard = ({ researcher, onViewProfile }: ResearcherCardProps) => {
  const {
    id,
    name,
    initials,
    position,
    university,
    universityAbbr,
    bio,
    stats,
    tags,
  } = researcher;
  const [bookmarked, setBookmarked] = useState(researcher.bookmarked ?? false);

  return (
    <CatalogCard
      title={name}
      eyebrow={university}
      description={bio}
      icon={<ResearcherAvatar id={id} initials={initials} />}
      badge={
        <button
          type="button"
          aria-pressed={bookmarked}
          aria-label={bookmarked ? `Remove ${name} from saved` : `Save ${name}`}
          onClick={() => setBookmarked((value) => !value)}
          className="ml-auto shrink-0 rounded-lg p-1 text-neutral-200 transition-colors duration-200 hover:text-accent-200 cursor-pointer"
        >
          <Bookmark
            className="size-5"
            fill={bookmarked ? "currentColor" : "none"}
            aria-hidden="true"
          />
        </button>
      }
      action={
        <button
          type="button"
          className={catalogActionClasses}
          onClick={() => onViewProfile(id)}
        >
          View Profile
        </button>
      }
    >
      {position && <p className="line-clamp-2 text-neutral-200">{position}</p>}
      {universityAbbr && (
        <div>
          <Badge variant="solid" intent="accent" size="md">
            {universityAbbr}
          </Badge>
        </div>
      )}
      {stats && (
        <ul aria-label="Research metrics" className="flex flex-wrap gap-2">
          {[
            { label: "Pubs", value: formatCompact(stats.publications) },
            { label: "Citations", value: formatCompact(stats.citations) },
            { label: "h-index", value: String(stats.hIndex) },
          ].map((stat) => (
            <li
              key={stat.label}
              className="rounded-full bg-neutral-700 px-2.5 py-0.5 text-xs font-medium text-neutral-50"
            >
              {stat.label}: {stat.value}
            </li>
          ))}
        </ul>
      )}

      {tags.length > 0 && (
        <ul aria-label="Research topics" className="flex flex-wrap gap-2">
          {tags.slice(0, MAX_TAGS).map((tag) => (
            <li key={tag} className="min-w-0">
              <Badge
                variant="outlined"
                intent="accent"
                size="md"
                className="max-w-full break-words"
              >
                {tag}
              </Badge>
            </li>
          ))}
        </ul>
      )}
    </CatalogCard>
  );
};

export default ResearcherCard;
