"use client";

import { useState } from "react";
import { Bookmark, Building2, GraduationCap } from "lucide-react";
import Button from "@/src/components/ui/Button/Button";
import ResearcherAvatar from "./ResearcherAvatar";
import { formatCompact } from "./researcher.utils";
import type { ResearcherSummary } from "./researcher.type";

interface ResearcherCardProps {
  researcher: ResearcherSummary;
  onViewProfile: (id: number) => void;
}

const MAX_TAGS = 3;

const ResearcherCard = ({ researcher, onViewProfile }: ResearcherCardProps) => {
  const { id, name, initials, position, university, universityAbbr, bio, stats, tags } =
    researcher;
  const [bookmarked, setBookmarked] = useState(researcher.bookmarked ?? false);

  return (
    <article
      aria-label={name}
      className="flex flex-col gap-3 rounded-2xl border border-neutral-500 bg-white/5 p-5 transition-[border-color,box-shadow,translate] duration-200 ease-out hover:-translate-y-0.5 hover:border-accent-400 hover:shadow-[0_0_15px_#37b5aa33]"
    >
      <div className="flex items-center gap-2.5">
        <ResearcherAvatar id={id} initials={initials} />
        {universityAbbr && (
          <span
            title={university}
            className="inline-flex min-w-0 items-center gap-1 rounded-full border border-accent-300 px-2 py-0.5 text-xs text-accent-200"
          >
            <GraduationCap className="size-3.5 shrink-0" aria-label="Institution" />
            <span className="truncate">{universityAbbr}</span>
          </span>
        )}
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
      </div>

      <div className="flex flex-col gap-1">
        <h3 className="text-lg font-bold leading-snug text-neutral-50">{name}</h3>
        {position && <p className="text-sm text-neutral-200">{position}</p>}
        {university && (
          <p className="flex items-center gap-1.5 text-xs text-neutral-300">
            <Building2 className="size-3.5 shrink-0" aria-label="University" />
            {university}
          </p>
        )}
      </div>

      {bio && <p className="line-clamp-2 text-sm text-neutral-200">{bio}</p>}

      {stats && (
        <ul aria-label="Research metrics" className="flex flex-wrap gap-1.5">
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
        <ul aria-label="Research topics" className="flex flex-wrap gap-1.5">
          {tags.slice(0, MAX_TAGS).map((tag) => (
            <li
              key={tag}
              className="rounded-full border border-accent-300 px-2.5 py-0.5 text-xs text-accent-200"
            >
              {tag}
            </li>
          ))}
        </ul>
      )}

      <Button
        type="button"
        variant="solid"
        intent="primary"
        size="md"
        className="mt-auto w-full"
        onClick={() => onViewProfile(id)}
      >
        View Profile
      </Button>
    </article>
  );
};

export default ResearcherCard;
