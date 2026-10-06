"use client";

import { useState } from "react";
import { ChevronsUpDown, FileText, Quote } from "lucide-react";
import { Input } from "@/src/components/ui/InputField/Input";
import Button from "@/src/components/ui/Button/Button";
import ProfileEmptyState from "./ProfileEmptyState";
import { filterAndSortPapers } from "../researcher.utils";
import type { PaperSort, ResearchPaper } from "../researcher.type";

export const PAPERS_PAGE_SIZE = 5;

const SORT_OPTIONS: { value: PaperSort; label: string }[] = [
  { value: "newest", label: "Year: newest" },
  { value: "oldest", label: "Year: oldest" },
  { value: "cited", label: "Most cited" },
];

const PapersTab = ({ papers }: { papers: ResearchPaper[] }) => {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<PaperSort>("newest");
  const [visible, setVisible] = useState(PAPERS_PAGE_SIZE);

  if (papers.length === 0) {
    return (
      <ProfileEmptyState title="No papers yet">
        Semantic Scholar has no papers listed for this researcher.
      </ProfileEmptyState>
    );
  }

  const results = filterAndSortPapers(papers, query, sort);
  const shown = results.slice(0, visible);

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="flex-1">
          <Input
            size="sm"
            type="search"
            placeholder="Search title..."
            aria-label="Search papers by title"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setVisible(PAPERS_PAGE_SIZE);
            }}
          />
        </div>
        <div className="relative sm:w-44">
          <select
            aria-label="Sort papers"
            value={sort}
            onChange={(event) => {
              setSort(event.target.value as PaperSort);
              setVisible(PAPERS_PAGE_SIZE);
            }}
            className="w-full appearance-none rounded-2xl border-2 border-primary-400 bg-neutral-900 px-4 py-2 pr-10 text-sm text-neutral-50 outline-none cursor-pointer focus:border-primary-300"
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <ChevronsUpDown
            className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-primary-300"
            aria-hidden="true"
          />
        </div>
      </div>

      {results.length === 0 ? (
        <ProfileEmptyState title="No matching papers">
          No paper titles match &ldquo;{query.trim()}&rdquo;.
        </ProfileEmptyState>
      ) : (
        <ul aria-label="Papers" className="flex flex-col divide-y divide-neutral-500/60">
          {shown.map((paper) => (
            <li
              key={paper.id}
              className="grid grid-cols-[3.25rem_1fr] md:grid-cols-[5rem_1fr] gap-3 md:gap-5 rounded-lg px-2 md:px-4 py-4 transition-colors duration-200 hover:bg-white/5"
            >
              <span className="text-lg md:text-xl font-bold text-primary-300">
                {paper.year ?? ""}
              </span>
              <div className="flex min-w-0 flex-col gap-2">
                {paper.url ? (
                  <a
                    href={paper.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-neutral-50 transition-colors duration-200 hover:text-primary-200"
                  >
                    {paper.title}
                  </a>
                ) : (
                  <span className="font-semibold text-neutral-50">{paper.title}</span>
                )}
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  {paper.venue && (
                    <span className="inline-flex max-w-full items-center gap-1.5 rounded-md bg-white/10 px-2 py-0.5 text-neutral-200">
                      <FileText className="size-3.5 shrink-0" aria-hidden="true" />
                      <span className="truncate">{paper.venue}</span>
                    </span>
                  )}
                  <span
                    aria-label={`${paper.citations} citations`}
                    className="inline-flex items-center gap-1 rounded-md border border-accent-400/60 px-2 py-0.5 font-medium text-accent-300"
                  >
                    <Quote className="size-3" aria-hidden="true" />
                    {paper.citations}
                  </span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      {results.length > visible && (
        <Button
          type="button"
          variant="outlined"
          intent="secondary"
          size="md"
          className="self-center"
          onClick={() => setVisible((count) => count + PAPERS_PAGE_SIZE)}
        >
          Load More
        </Button>
      )}
    </div>
  );
};

export default PapersTab;
