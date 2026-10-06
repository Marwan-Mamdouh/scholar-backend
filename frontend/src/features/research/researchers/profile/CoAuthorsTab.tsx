import { ExternalLink } from "lucide-react";
import ProfileEmptyState from "./ProfileEmptyState";
import type { CoAuthor } from "../researcher.type";

const CHIP =
  "inline-flex items-center gap-1.5 rounded-full border border-neutral-400 bg-neutral-900/60 px-2.5 py-1 sm:px-3 sm:py-1.5 text-xs sm:text-sm tracking-normal text-neutral-50 transition-colors duration-200";

const CoAuthorsTab = ({ coAuthors }: { coAuthors: CoAuthor[] }) => {
  if (coAuthors.length === 0) {
    return (
      <ProfileEmptyState title="No co-authors found">
        None of this researcher&apos;s listed papers have other authors.
      </ProfileEmptyState>
    );
  }

  const sorted = [...coAuthors].sort((a, b) => b.count - a.count);

  return (
    <ul aria-label="Co-authors" className="flex flex-wrap gap-2 sm:gap-3">
      {sorted.map((coAuthor) => {
        const content = (
          <>
            <ExternalLink className="size-3.5 shrink-0" aria-hidden="true" />
            <span className="font-medium">{coAuthor.name}</span>
            <span className="text-xs text-neutral-200">({coAuthor.count})</span>
          </>
        );
        return (
          <li key={coAuthor.id}>
            {coAuthor.url ? (
              <a
                href={coAuthor.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${coAuthor.name}, ${coAuthor.count} shared papers (opens Semantic Scholar)`}
                className={`${CHIP} hover:border-accent-300 hover:text-accent-200`}
              >
                {content}
              </a>
            ) : (
              <span className={CHIP}>{content}</span>
            )}
          </li>
        );
      })}
    </ul>
  );
};

export default CoAuthorsTab;
